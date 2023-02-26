/*
For Isometric Projection we angle our camera along two axes (swing the camera 45 degrees to one side, then 30 degrees down). This creates a diamond (rhombus) shaped grid where the grid spaces are twice as wide as they are tall. This style was popularized by strategy games and action RPGs. If we look at a cube in this view, three sides are visible (top and two facing sides).
https://clintbellanger.net/articles/isometric_intro/

https://cantwell-tom.medium.com/isometric-maze-on-html-canvas-c560afb8430a
*/

const c = document.querySelector('canvas');
const ctx = c.getContext('2d');

let [w, h] = [window.innerWidth, window.innerHeight];

c.width = w;
c.height = h;

// https://stackoverflow.com/questions/10525107/pixel-art-in-html5-canvas-is-blurry-when-scaled-up
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;

let images = {};


let resourcesLoaded = 0;
let totalResources = 381;

function loadImage(name) {
	images[name] = new Image();
	images[name].onload = () => resourcesLoaded++;
	images[name].src = `./assets/${name}.png`;
}

loadImage('map');
loadImage('ellipse');
loadImage('tent');

loadImage('sprite1');
loadImage('sprite2');
loadImage('sprite3');
loadImage('sprite4');
loadImage('sprite5');

loadImage('backdrop');
loadImage('hay');
// loadImage('haybackdrop');
// loadImage('grass');
loadImage('grassbackdrop');

loadImage('nametag');
loadImage('greendot');

loadImage('pin');
loadImage('pinfilled');

// for (let i = 0; i <= 59; i++) {
// 	loadImage(`tiles/grainger${i}`);
// }

promises.push(new Promise((resolve, reject) => {
	let interval = setInterval(() => {
		if (resourcesLoaded === totalResources) {
			clearInterval(interval);
			resolve();
		}
	}, 50);
}));

function drawPin() {
	// let image = images['pin'];
	let {image, sx, sy, sWidth, sHeight, dWidth, dHeight} = state.avatar;
	// ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 9, 17);
	// ctx.drawImage(image, 0, 0);
	ctx.drawImage(images['pinfilled'], 0, 0, 9, 17, dWidth/2, dWidth - dHeight / 2, dWidth, dHeight * 1.5);
}

function drawRing() {
	let {image, sx, sy, sWidth, sHeight, dWidth, dHeight} = state.avatar;
	ctx.lineWidth = 2;
	ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
	// ctx.beginPath();
	// ctx.ellipse(dWidth, dWidth, ringRadius, ringRadius * 0.65, 0, 0, 2 * Math.PI);
	// ctx.stroke();
	// ctx.fill();

	ctx.drawImage(images['ellipse'], dWidth/2 + 16 - ringRadius / 2, dWidth + 16 - ringRadius * 0.65 / 2, ringRadius, ringRadius * 0.65);
}

function drawAvatar() {
	// ctx.drawImage(images['avatar'], 0, 64 - 80, 64, 80);
	let {image, sx, sy, sWidth, sHeight, dWidth, dHeight} = state.avatar;
	// ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, dWidth - dHeight, dWidth, dHeight);
	ctx.drawImage(image, sx, sy, sWidth, sHeight, dWidth/2, dWidth - dHeight / 2, dWidth, dHeight);

	ctx.font = `15px VT323, monospace`;
	let name = window.netID;
	var textWidth = ctx.measureText(name).width;

	let height = 20;
	let width = textWidth + 9 + 15;
	let verticalPadding = 5;
	let x = (dWidth - width) / 2 + dWidth / 2;
	let y = dWidth - dHeight/2 - height - verticalPadding;
	ctx.drawImage(images['nametag'], 0, 0, 55, 16, x, y, width, height)
	ctx.drawImage(images['greendot'], 0, 0, 9, 9, x + 5, y + 5, 9, 9)

	ctx.fillStyle = 'black';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'middle'; // default: 'alphabetic'
	ctx.fillText(name, x + 9 + 5 + 3, y + height / 2 - 1);

}

function drawPlayers() {
	for (let player of window.players) {
		if (player.netID === window.netID) continue;
		if (player.position[0] < 0 || player.position[0] >= MAP_DIMS[0] ||
			player.position[1] < 0 || player.position[1] >= MAP_DIMS[1]) continue; // don't draw out of bounds players
	
		if (!player.avatar) continue; // not loaded yet
		let {image, sx, sy, sWidth, sHeight, dWidth, dHeight} = player.avatar;
		// ctx.drawImage(images[image], sx, sy, sWidth, sHeight, player.position[0] * TILE_SIZE, player.position[1] * TILE_SIZE + (dWidth - dHeight), dWidth, dHeight);
		ctx.drawImage(images[image], sx, sy, sWidth, sHeight, player.position[0] * TILE_SIZE + dWidth / 2, player.position[1] * TILE_SIZE + (dWidth - dHeight / 2), dWidth, dHeight);
		// ctx.drawImage(images[image], player.position[0] * TILE_SIZE, TILE_SIZE * player.position[1] - (80 - 64), 64, 80);

		let name = player.netID;
		ctx.font = `15px VT323, monospace`;
		var textWidth = ctx.measureText(name).width;

		let height = 20;
		let width = textWidth + 9 + 15;
		let verticalPadding = 5;
		let x = player.position[0] * TILE_SIZE;
		// let y = player.position[1] * TILE_SIZE - 2 * verticalPadding;
		let y = player.position[1] * TILE_SIZE + (dWidth - dHeight / 2) - height - verticalPadding;
		ctx.drawImage(images['nametag'], 0, 0, 55, 16, x, y, width, height)
		ctx.drawImage(images['greendot'], 0, 0, 9, 9, x + 5, y + 5, 9, 9)

		ctx.fillStyle = 'black';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle'; // default: 'alphabetic'
		ctx.fillText(name, x + 9 + 5 + 3, y + height / 2 - 1);
	}
}

let sprites = ['sprite1', 'sprite2', 'sprite3', 'sprite4', 'sprite5'];

let state = {
	// position: [40.1106138, -88.229867],
	position: [0, 0],
	targetPosition: [-50, 50],
	zoom: 1.5,
	avatar: {
		frame: 0,
		dir: 2,
		image: images[sprites[Math.floor(Math.random() * sprites.length)]], // random avatar
		sx: 17 + 64 * 0,
		sy: 525 + 64 * 2,
		sWidth: 30,
		sHeight: 54,
		// dWidth: 64,
		// dHeight: 80
		dWidth: 32,
		dHeight: 40
	}
};

changeViewBtn.children[1].firstElementChild.src = state.avatar.image.src;
document.querySelector('div.avatar-preview img').src = state.avatar.image.src;

window.keyboardMode = false;
document.body.addEventListener('keydown', e => {
	if (!window.keyboardMode) return;
	let inc = 1.0;
	// let inc = 0.5;
    switch (e.key) {
    	case 'ArrowUp':
    		state.targetPosition[1]-=inc;
    		break;
    	case 'ArrowDown':
    		state.targetPosition[1]+=inc;
    		break;
    	case 'ArrowLeft':
    		state.targetPosition[0]-=inc;
    		break;
    	case 'ArrowRight':
    		state.targetPosition[0]+=inc;
    		break;
    }

    // // TEMPORARY
    // if (e.key === 'Enter') {
    // 	let eventName = prompt('Enter an event name');
    // 	if (!eventName) return;
    // 	let location = [2, 3];
    // 	let start = Date.now();
    // 	let end = Date.now() + 1000 * 60 * 5; // 5 mins
    // 	createEvent(eventName, 'desc', location, 1, start, end)
    // }
    // // TEMPORARY
});

// smooth walking (slowly goes to state.targetPosition from state.position)
let walkInterval = setInterval(() => {
	let dx, dy;
	for (let i of [0, 1]) {
		let d = state.targetPosition[i] - state.position[i];
		let maxMove = Math.max(0.05, Math.abs(d / 20)); // d / 20 => 20 * 10ms = 0.2s to stop
		let sign = d / Math.abs(d) || 1;
		let inc = sign * Math.min(Math.abs(d), maxMove);
		if (i == 0) dx = inc;
		else dy = inc;
		state.position[i] += inc;
	}

	let {frame, dir} = state.avatar;
	if (dx !== 0 || dy !== 0) {
		frame += 0.1;
		frame %= 9;
		// console.log(frame);
		if (Math.abs(dx) > Math.abs(dy)) {
			if (dx > 0) dir = 3;
			else dir = 1;
		} else {
			if (dy > 0) dir = 2;
			else dir = 0;
		}
	} else {
		frame = 0;
	}

	state.avatar = {
		...state.avatar,
		frame: frame,
		dir: dir,
		sx: 17 + 64 * Math.floor(frame),
		sy: 525 + 64 * dir,
	}

}, 10);


let MAP_DIMS = [32, 32];

// 31 -> 0
let MAP_LAT = [40.11037078334671,40.110449068278385,40.110527353119934,40.11060563787141,40.110683922532765,40.110758803428865,40.11083028057097,40.11091537230886,40.110993656613715,40.11107194082847,40.111153628608676,40.111218298031744,40.11129998563613,40.11138167314245,40.11144974598941,40.11152802967919,40.1116097169116,40.11168800041727,40.11175947658287,40.11184456715828,40.11191263954194,40.11199772992573,40.112076012984765,40.11214748874259,40.11222236802738,40.1122938436314,40.11236872275504,40.11244360179625,40.112525287929,40.11260697396363,40.112671642004834,40.112763538589135];

// 0 -> 31
let MAP_LON = [-88.22878141253977,-88.22867015230528,-88.22856779288952,-88.22848768552068,-88.2283675244674,-88.22828296668918,-88.22816280563592,-88.22806934703894,-88.22797143803257,-88.2278735290262,-88.22777562001984,-88.22768661183224,-88.22758870282587,-88.22747744259135,-88.2273750831756,-88.22727272375987,-88.22716591393474,-88.22707245533775,-88.22697454633138,-88.22686773650626,-88.22677427790927,-88.226654116856,-88.22656510866838,-88.22647165007139,-88.22636484024628,-88.226244679193,-88.22616457182416,-88.22605331158967,-88.22596430340204,-88.22585304316753,-88.22576848538932,-88.22567502679233];

// TODO: add padding for out of bounds
function latLonToCoords(lat, lon) {
	let x, y;
	let outOfBoundsCoords = [-50, -50];
	if (lon < MAP_LON[0]) return outOfBoundsCoords;
	if (lon > MAP_LON[MAP_LON.length - 1]) return outOfBoundsCoords;
	for (let i = 1; i < MAP_LON.length; i++) {
		let smaller = MAP_LON[i - 1];
		let larger = MAP_LON[i];
		if (lon >= smaller && lon <= larger) {
			x = (i - 1) + (lon - smaller) / (larger - smaller);
			break;
		}
	}

	if (lat < MAP_LAT[0]) return outOfBoundsCoords;
	if (lat > MAP_LAT[MAP_LAT.length - 1]) return outOfBoundsCoords;
	for (let i = 1; i < MAP_LAT.length; i++) {
		let smaller = MAP_LAT[i - 1];
		let larger = MAP_LAT[i];
		if (lat >= smaller && lat <= larger) {
			y = (i - 1) + (lat - smaller) / (larger - smaller);
			break;
		}
	}

	return [x, MAP_LAT.length - 1 - y];
}

const TILE_SIZE = 64;
function drawMap() {
	ctx.drawImage(images['grassbackdrop'], 0, 0, TILE_SIZE * MAP_DIMS[0], TILE_SIZE * MAP_DIMS[1]);
	ctx.drawImage(images['map'], 0, 0, TILE_SIZE * MAP_DIMS[0], TILE_SIZE * MAP_DIMS[1]);

	let z = state.zoom;
	ctx.scale(1/z, 1/z);
	ctx.font = `25px VT323, monospace`;
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'bottom';
	ctx.fillText('You appear to be outside of Bardeen Quad (or you didn\'t allow location access)', (-50 * TILE_SIZE + TILE_SIZE / 2) * z, (-50 * TILE_SIZE - 1 * TILE_SIZE) * z);
	ctx.textBaseline = 'top';
	ctx.fillText('Tap the globe icon to view it from afar!', (-50 * TILE_SIZE + TILE_SIZE / 2) * z, (-50 * TILE_SIZE - 1 * TILE_SIZE) * z);
	ctx.scale(z, z);

	// for (let i = 0; i < MAP.length; i++) {
	// 	for (let j = 0; j < MAP[i].length; j++) {
	// 		let x = j * TILE_SIZE;
	// 		let y = i * TILE_SIZE;

	// 		if (viewboxTop !== undefined) {
	// 			if (y + TILE_SIZE < viewboxTop) continue;
	// 			if (y > viewboxBottom) continue;
	// 			if (x + TILE_SIZE < viewboxLeft) continue;
	// 			if (x > viewboxRight) continue;
	// 		}

	// 		let image = MAP[i][j];
	// 		try {
	// 			if (image) ctx.drawImage(images[image], x, y, TILE_SIZE, TILE_SIZE);
	// 		} catch (e) {
	// 			console.log(e);
	// 			console.log(image);
	// 		}
	// 	}
	// }
}

function drawOutOfBounds() {
	// ctx.drawImage(images['backdrop'], -100 * TILE_SIZE, -100 * TILE_SIZE, TILE_SIZE * 200, TILE_SIZE * 200);
	// ctx.drawImage(images['haybackdrop'], -100 * TILE_SIZE, -100 * TILE_SIZE, TILE_SIZE * 200, TILE_SIZE * 200);
	let pattern = ctx.createPattern(images['hay'], 'repeat');
	ctx.fillStyle = pattern;
	ctx.fillRect(-100 * TILE_SIZE, -100 * TILE_SIZE, TILE_SIZE * 200, TILE_SIZE * 200);
	// let range = 100;
	// for (let i = -range; i < range; i++) {
	// 	for (let j = -range; j < range; j++) {
	// 		if (i >= 0 && i < MAP.length && j >= 0 && j < MAP[0].length)
	// 			continue;
	// 		let x = j * TILE_SIZE;
	// 		let y = i * TILE_SIZE;
	// 		ctx.drawImage(images['grass1'], x, y, TILE_SIZE, TILE_SIZE);
	// 		// ctx.fillStyle = `rgb(${n}, ${n}, ${n})`;
	// 		// ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
	// 	}
	// }
}


function drawEvents(drawText=false, z) {
	for (let {location, name, radius} of events) {
		// ctx.fillStyle = 'red';
		ctx.font = `40px VT323, monospace`;
		location = location.map(x => x * TILE_SIZE);

		let r = radius * TILE_SIZE;
		let size = r * 0.5;
		if (!drawText) {
			// ctx.fillRect(location[0] - TILE_SIZE/2, location[1] - TILE_SIZE/2, TILE_SIZE, TILE_SIZE);
			ctx.drawImage(images['ellipse'], location[0] - r/2, location[1] - r*0.65/2, r, r * 0.65);
			ctx.drawImage(images['tent'], location[0] - size/2, location[1] - size/2 - size/5, size, size);
		}
			

		if (z === undefined) z = state.zoom;
		ctx.scale(1/z, 1/z);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'alphabetic';
		if (drawText) {
			// ctx.fillText(name, (location[0] + TILE_SIZE / 2) * z, (location[1] - 10) * z);
			ctx.fillText(name, (location[0] + size / 20) * z, (location[1] - size/2 - size/5 - 5) * z);
		}
		ctx.scale(z, z);
	}
}

// window.addEventListener('wheel', e => {
// 	let min = 0.7;
// 	let max = 2.3;
// 	state.zoom = Math.max(Math.min(state.zoom + e.deltaY * 0.01, max), min);
// });

window.netID = false;
window.players = [];

let touchstart = [0, 0];
document.addEventListener('touchstart', e => mouseMoveStart(e.targetTouches[0]));
document.addEventListener('touchmove', e => mouseMove(e.targetTouches[0]));
document.addEventListener('mousedown', mouseMoveStart);
document.addEventListener('mousemove', mouseMove);

function mouseMoveStart({pageX, pageY}) {
	if (window.mode === 'drop pin' || window.mode === 'select radius') {
		touchstart = [pageX, pageY];
	}
}

function mouseMove({pageX, pageY, which}) {
	if (which !== undefined && which !== 1) return;
	if (window.mode === 'drop pin') {
		let dx = pageX - touchstart[0];
		let dy = pageY - touchstart[1];
		touchstart = [pageX, pageY];

		window.pinLoc[0] += dx * 0.03;
		window.pinLoc[1] += dy * 0.03;
	} else if (window.mode === 'select radius') {
		// let dx = pageX - touchstart[0];
		// let dy = pageY - touchstart[1];
		let dx = pageX - w/2;
		let dy = pageY - (h/2 + 45);
		let r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		ringRadius = TILE_SIZE * 2.5 + Math.min(r, (4 - 2.5) * TILE_SIZE);
	}
}

function draw() {
	if (!netID) return requestAnimationFrame(draw);
	// if (!netID) return;
	let z = state.zoom;

	if (clientLocation && !window.keyboardMode) {
		let {latitude, longitude} = clientLocation;
		state.targetPosition = latLonToCoords(latitude, longitude);
	}

	if (window.mode === 'regular' || window.mode === 'zoomed out') {
		let x = state.position[0] * TILE_SIZE;
		let y = state.position[1] * TILE_SIZE;
		if (window.mode === 'zoomed out') {
			// z = 0.3;
			z = 0.18;
			x = y = 31 / 2 * TILE_SIZE;
		}

		if (window.mode === 'regular')
			window.pinLoc = JSON.parse(JSON.stringify(state.position));
		ctx.translate((w - TILE_SIZE * z) / 2, (h - TILE_SIZE * z) / 2);
		ctx.fillRect(0, 0, w, h);

		ctx.scale(z, z);
		ctx.translate(-x, -y); // new 0, 0 is x, y
		drawOutOfBounds();

		// let viewboxLeft = x - (w/z - TILE_SIZE)/2;
		// let viewboxRight = viewboxLeft + w/z;
		// let viewboxTop = y - (h/z - TILE_SIZE)/2;
		// let viewboxBottom = viewboxTop + h/z;

		drawMap();
		drawEvents();
		drawPlayers();

		// if (window.mode === 'regular') {
			// ctx.fillStyle = 'brown';
			// console.log(z);
			// ctx.fillRect((x - (w - TILE_SIZE)/2) + 5, (y - (h - TILE_SIZE)/2) + 5, (w - 10) / z, (h - 10) / z);
			// ctx.fillRect(x - (w/z - TILE_SIZE)/2, y - (h/z - TILE_SIZE)/2, w/z, h/z);
		// }

		ctx.translate(x, y);

		if (window.mode === 'regular')
			drawAvatar(); // draws sprite in middle of screen

		ctx.translate(-x, -y); // new 0, 0 is x, y
		if (window.mode === 'zoomed out') drawEvents(true, 0.3);
		else drawEvents(true);
		ctx.translate(x, y);

		ctx.scale(1/z, 1/z);
		ctx.translate(-(w - TILE_SIZE * z) / 2, -(h - TILE_SIZE * z) / 2);
	} else if (window.mode === 'drop pin' || window.mode === 'select radius') {
		ctx.translate((w - TILE_SIZE * z) / 2, (h - TILE_SIZE * z) / 2);
		ctx.fillRect(0, 0, w, h);

		ctx.scale(z, z);
		ctx.translate(-window.pinLoc[0] * TILE_SIZE, -window.pinLoc[1] * TILE_SIZE); // new 0, 0 is x, y
		drawOutOfBounds();
		drawMap();
		// drawEvents();

		ctx.translate(window.pinLoc[0] * TILE_SIZE, window.pinLoc[1] * TILE_SIZE);
		if (window.mode === 'select radius') drawRing();
		drawPin(); // draws pin in middle of screen
		ctx.translate(-window.pinLoc[0] * TILE_SIZE, -window.pinLoc[1] * TILE_SIZE); // new 0, 0 is x, y

		// drawEvents(true);
		ctx.translate(window.pinLoc[0] * TILE_SIZE, window.pinLoc[1] * TILE_SIZE);

		ctx.scale(1/z, 1/z);
		ctx.translate(-(w - TILE_SIZE * z) / 2, -(h - TILE_SIZE * z) / 2);
	}

	requestAnimationFrame(draw);
}

draw();
// setInterval(draw, 1000 / 60);
