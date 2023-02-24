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

// let resourcesLoaded = 0;
// let totalResources = 3;
// const resourceLoaded = () => { if (++resourcesLoaded == totalResources) draw(); }

// x, y are center of avatar
function drawAvatar() {
	let img = images['avatar'];
	// ctx.drawImage(images['avatar'], (w - img.width) / 2, (h - img.height) / 2);
	// ctx.fillStyle = 'red';
	// ctx.fillRect(0, 0, 64, 64);
	// ctx.fillStyle = 'purple';
	// ctx.fillRect((w - 64) / 2, (h - 64) / 2, 64, 64);

	// let x = 1/state.zoom * (w - 64 * state.zoom) / 2;
	// let y = 1/state.zoom * (h - 64 * state.zoom) / 2
	// x = x - x % TILE_SIZE;
	// y = y - y % TILE_SIZE;

	// ctx.drawImage(images['avatar'], x, y, 64, 64);
	ctx.drawImage(images['avatar'], 0, 64 - 80, 64, 80);
	// ctx.drawImage(images['avatar'], 64 * 4, 64 * 2, 64, 64);
}

let state = {
	// position: [40.1106138, -88.229867],
	position: [0, 0],
	targetPosition: [50, 50],
	zoom: 1.5//1
};

document.body.addEventListener('keydown', e => {
	let inc = 1;
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

for (let i = 0; i < 100; i++) {
	MAP[i] = [];
	for (let j = 0; j < 100; j++) {
		MAP[i][j] = Math.random() * 255;
	}
}

const TILE_SIZE = 64;
function drawMap() {
	for (let i = 0; i < MAP.length; i++) {
		for (let j = 0; j < MAP[i].length; j++) {
			let x = j * TILE_SIZE;
			let y = i * TILE_SIZE;
			ctx.fillStyle = `rgb(${MAP[i][j]}, ${MAP[i][j]}, ${MAP[i][j]})`;
			ctx.fillRect(x, y, 64, 64);
		}
	}
}

window.addEventListener('wheel', e => {
	let min = 0.3;
	let max = 4;
	state.zoom = Math.max(Math.min(state.zoom + e.deltaY * 0.01, max), min);
});

function draw() {

	let z = state.zoom;

	ctx.translate((w - TILE_SIZE * z) / 2, (h - TILE_SIZE * z) / 2);
	ctx.fillRect(0, 0, w, h);

	ctx.scale(z, z);
	ctx.translate(-state.position[0] * TILE_SIZE, -state.position[1] * TILE_SIZE); // new 0, 0 is x, y
	drawMap();
	ctx.translate(state.position[0] * TILE_SIZE, state.position[1] * TILE_SIZE);


	drawAvatar(); // draws sprite in middle of screen
	ctx.scale(1/z, 1/z);
	ctx.translate(-(w - TILE_SIZE * z) / 2, -(h - TILE_SIZE * z) / 2);

	requestAnimationFrame(draw);
}

draw();
