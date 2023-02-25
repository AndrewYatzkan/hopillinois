socket = io();

const setNetID = (netID) => window.netID = netID;

socket.emit('ready', {position: [0, 0]}, setNetID);


socket.on('game state', ({players, events}) => {
	window.players = players;
	window.events = events;
});

setInterval(() => {
	stateCopy = JSON.parse(JSON.stringify(state));
	stateCopy.avatar.image = state.avatar.image.src.split('/').pop().split('.')[0];
	socket.emit('player update', stateCopy);
}, 1/30 * 1000);

function createEvent(name, location, start, end) {
	socket.emit('new event', {name, location, start, end});
}
