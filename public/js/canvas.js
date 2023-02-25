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

function loadImage(name) {
	images[name] = new Image();
	// images[name].onLoad = resourceLoaded;
	images[name].src = `./assets/${name}.png`;
}

loadImage('avatar');

// loadImage('grass1');
loadImage('backdrop');
loadImage('grass2');

// let resourcesLoaded = 0;
// let totalResources = 3;
// const resourceLoaded = () => { if (++resourcesLoaded == totalResources) draw(); }

function drawAvatar() {
	ctx.drawImage(images['avatar'], 0, 64 - 80, 64, 80);
}

function drawPlayers() {
	for (let player of window.players) {
		if (player.netID === window.netID) continue;
		if (player.position[0] < 0 || player.position[0] >= MAP_DIMS[0] ||
			player.position[1] < 0 || player.position[1] >= MAP_DIMS[1]) continue; // don't draw out of bounds players
		ctx.drawImage(images['avatar'], player.position[0] * TILE_SIZE, TILE_SIZE * player.position[1] - (80 - 64), 64, 80);
	}
}

let state = {
	// position: [40.1106138, -88.229867],
	position: [0, 0],
	targetPosition: [4, 5],
	zoom: 1
};

document.body.addEventListener('keydown', e => {
	let inc = 1.0;
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

    // TEMPORARY
    if (e.key === 'Enter') {
    	let eventName = prompt('Enter an event name');
    	if (!eventName) return;
    	let location = [52, 54];
    	let start = Date.now();
    	let end = Date.now() + 1000 * 60 * 5; // 5 mins
    	createEvent(eventName, location, start, end)
    }
    // TEMPORARY
});

// smooth walking (slowly goes to state.targetPosition from state.position)
let walkInterval = setInterval(() => {
	for (let i of [0, 1]) {
		let d = state.targetPosition[i] - state.position[i];
		let maxMove = Math.max(0.05, Math.abs(d / 20)); // d / 20 => 20 * 10ms = 0.2s to stop
		let sign = d / Math.abs(d) || 1;
		let inc = sign * Math.min(Math.abs(d), maxMove);
		state.position[i] += inc;
	}
}, 10);

function latLonToCoords(lat, lon) {
	// ...
}

function coordsToLatLon(x, y) {
	// ...
}

// const MAP = [
// 	[0, 50, 200],
// 	[100, 50, 20],
// 	[50, 0, 80]
// ];

let MAP = [];
let MAP_DIMS = [32, 32];

for (let i = 0; i < 32; i++) {
	MAP[i] = [];
	for (let j = 0; j < 32; j++) {
		MAP[i][j] = Math.random() * 255;
	}
}

const TILE_SIZE = 64;
function drawMap() {
	for (let i = 0; i < MAP.length; i++) {
		for (let j = 0; j < MAP[i].length; j++) {
			let x = j * TILE_SIZE;
			let y = i * TILE_SIZE;
			ctx.drawImage(images['grass2'], x, y, TILE_SIZE, TILE_SIZE);
			// ctx.fillStyle = `rgb(${MAP[i][j]}, ${MAP[i][j]}, ${MAP[i][j]})`;
			// ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
		}
	}
}

function drawOutOfBounds() {
	ctx.drawImage(images['backdrop'], -100 * TILE_SIZE, -100 * TILE_SIZE, TILE_SIZE * 200, TILE_SIZE * 200);
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


function drawEvents() {
	for (let {location, name} of events) {
		ctx.fillStyle = 'red';
		ctx.font = '30px Arial';
		location = location.map(x => x * TILE_SIZE);
		ctx.fillRect(location[0], location[1], TILE_SIZE, TILE_SIZE);
		ctx.fillText(name, location[0], location[1] - 10);
	}
}

window.addEventListener('wheel', e => {
	let min = 0.3;
	let max = 4;
	state.zoom = Math.max(Math.min(state.zoom + e.deltaY * 0.01, max), min);
});

window.netID = false;
window.players = [];

function draw() {
	if (!netID) return requestAnimationFrame(draw);
	let z = state.zoom;

	ctx.translate((w - TILE_SIZE * z) / 2, (h - TILE_SIZE * z) / 2);
	ctx.fillRect(0, 0, w, h);

	ctx.scale(z, z);
	ctx.translate(-state.position[0] * TILE_SIZE, -state.position[1] * TILE_SIZE); // new 0, 0 is x, y
	drawOutOfBounds();
	drawMap();
	drawEvents();
	drawPlayers();
	ctx.translate(state.position[0] * TILE_SIZE, state.position[1] * TILE_SIZE);


	drawAvatar(); // draws sprite in middle of screen
	ctx.scale(1/z, 1/z);
	ctx.translate(-(w - TILE_SIZE * z) / 2, -(h - TILE_SIZE * z) / 2);

	requestAnimationFrame(draw);
}

draw();
