require('dotenv').config();

const fs = require('fs');
const PROD = process.env.ENV === 'PROD';

const http = require('http');
const https = require('https');

const User = require('./models/User');
const Event = require('./models/Event');

const { mongoUrl } = require('./db');

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const app = express();
const httpServer = http.createServer(app);
const httpsServer = PROD ? https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/hopillinois.com/privkey.pem', 'utf-8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/hopillinois.com/fullchain.pem', 'utf-8'),
}, app) : null;

const io = require('socket.io')(PROD ? httpsServer : httpServer);
const port = PROD ? 80 : 3000;

const BASE_URL = PROD ? 'https://hopillinois.com' : 'http://localhost:3000';

/**************************************
 ***         AUTHENTICATION         ***
 **************************************/

let sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    cookie: { secure: PROD }, // https://stackoverflow.com/a/23119369/9307157
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl })
});

app.set('trust proxy', 1); // enable for prod
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// https://github.com/jaredhanson/passport-google-oauth2
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/oauth2/redirect/google`,
    scope: ['profile', 'email'],
    passReqToCallback: true
    // state: true
},
async function(req, accessToken, refreshToken, profile, cb) {
    // console.log("9768-1")
	let emailInfo = profile._json;
	if (emailInfo.hd !== 'illinois.edu') { // not an @illinois.edu email
		return cb(null, null); // TODO: show error message rather than just not working
	}

    // console.log("9768-2")

	let netID = emailInfo.email.match(/^(.*?)@illinois.edu$/)[1];

    // console.log("9768-3")
    try {
        // create new user
        var user = await User.create({ net_id: netID });
        // console.log("9768-4")
    } catch (e) {
        // console.log("9768-4.5")
        if (e.code !== 11000) // duplicate key error (account already exists)
            throw new Error(e);
        // console.log("9768-5")
        var user = await User.findOne({ net_id: netID });
        // console.log("9768-6")
    }
    
    // console.log("9768-7")
    return cb(null, user);
})
);

passport.serializeUser(function(user, done) {
    done(null, user.net_id);
});

passport.deserializeUser(function(net_id, done) {
    User.findOne({ net_id }, (err, user) => {
        done(err, user);
    });
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect('/login');
}


app.get('/', checkAuth);

app.use(express.static('public'));

app.get('/login/google', (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    return res.send('Already signed in. You must <a href="/logout">sign out</a> first.');
}, passport.authenticate('google'));

app.get('/oauth2/redirect/google',
    passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
    (req, res) => res.redirect('/')
);

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/login', (req, res) => {
    // TODO: login page
    res.redirect('/login/google');
});

/**************************************
 ***           WEBSOCKETS           ***
 **************************************/

setInterval(() => {
    io.emit('game state', {
        players: sockets.map(x => { return { netID: x.netID, position: x.position, avatar: x.avatar} }),
        events: events.map(x => { return {
            creator: x.creator,
            location: x.location,
            name: x.name,
            start: new Date(x.start),
            end: new Date(x.end)
        } })
    });
}, 1/30 * 1000);

let events = [];

async function fetchEvents() {
    events = await Event.find({
        start: { $lt: Date.now() },
        end: { $gt: Date.now() }
    });
}

fetchEvents();
setInterval(fetchEvents, 1000 * 60); // fetch events every minute

let sockets = [];
io.on('connection', socket => {
	let netID = socket.request?.session?.passport?.user;
    console.log(netID, 'connected');
	socket.on('ready', ({position}, cb) => {
		if (!netID) return; // not authenticated
        cb(netID);

		sockets.filter(x => x.netID === netID).forEach(x => x.socket.disconnect()); // users can have one socket at a time
		// race condition with push after?

		sockets.push({netID, socket, position});

		socket.on('disconnect', () => sockets = sockets.filter(x => x.netID !== netID));
		// console.log(sockets);
	});

    socket.on('player update', ({position, avatar}) => {
        for (let i = 0; i < sockets.length; i++) {
            if (sockets[i].netID === netID) {
                sockets[i].position = position;
                sockets[i].avatar = avatar;
            }
        }
    });

    socket.on('new event', async ({name, location, start, end}) => {
        // 1. add to database
        // 2. update local variable

        // database stuff...
        await Event.create({creator: netID, name, location, start, end, radius: 2});
        fetchEvents();
    });
});

httpServer.listen(port, () => console.log(`listening on *:${port}`));
if (httpsServer) httpsServer.listen(443, () => console.log(`listening on *:${443}`));
