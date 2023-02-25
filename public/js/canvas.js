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
let totalResources = 67;

function loadImage(name) {
	images[name] = new Image();
	images[name].onload = () => resourcesLoaded++;
	images[name].src = `./assets/${name}.png`;
}

loadImage('sprite1');
loadImage('sprite2');
loadImage('sprite3');

loadImage('backdrop');
loadImage('grass');

loadImage('nametag');
loadImage('greendot');

for (let i = 0; i <= 59; i++) {
	loadImage(`tiles/grainger${i}`);
}

promises.push(new Promise((resolve, reject) => {
	let interval = setInterval(() => {
		if (resourcesLoaded === totalResources) {
			clearInterval(interval);
			resolve();
		}
	}, 50);
}));

function drawAvatar() {
	// ctx.drawImage(images['avatar'], 0, 64 - 80, 64, 80);
	let {image, sx, sy, sWidth, sHeight, dWidth, dHeight} = state.avatar;
	// ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, dWidth - dHeight, dWidth, dHeight);
	ctx.drawImage(image, sx, sy, sWidth, sHeight, dWidth/2, dWidth - dHeight / 2, dWidth, dHeight);

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
	ctx.font = `15px VT323, monospace`;
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
		ctx.drawImage(images[image], sx, sy, sWidth, sHeight, player.position[0] * TILE_SIZE, player.position[1] * TILE_SIZE + (dWidth - dHeight), dWidth, dHeight);
		// ctx.drawImage(images[image], player.position[0] * TILE_SIZE, TILE_SIZE * player.position[1] - (80 - 64), 64, 80);

		let name = player.netID;
		var textWidth = ctx.measureText(name).width;

		let height = 20;
		let width = textWidth + 9 + 15;
		let verticalPadding = 5;
		let x = player.position[0] * TILE_SIZE - player.avatar.dWidth / 2;
		// let y = player.position[1] * TILE_SIZE - 2 * verticalPadding;
		let y = player.position[1] * TILE_SIZE + (dWidth - dHeight) - height - verticalPadding;
		ctx.drawImage(images['nametag'], 0, 0, 55, 16, x, y, width, height)
		ctx.drawImage(images['greendot'], 0, 0, 9, 9, x + 5, y + 5, 9, 9)

		ctx.fillStyle = 'black';
		ctx.font = `15px VT323, monospace`;
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle'; // default: 'alphabetic'
		ctx.fillText(name, x + 9 + 5 + 3, y + height / 2 - 1);
	}
}

let sprites = ['sprite1', 'sprite2', 'sprite3'];

let state = {
	// position: [40.1106138, -88.229867],
	position: [0, 0],
	targetPosition: [4, 5],
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

document.body.addEventListener('keydown', e => {
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

    // TEMPORARY
    if (e.key === 'Enter') {
    	let eventName = prompt('Enter an event name');
    	if (!eventName) return;
    	let location = [2, 3];
    	let start = Date.now();
    	let end = Date.now() + 1000 * 60 * 5; // 5 mins
    	createEvent(eventName, location, start, end)
    }
    // TEMPORARY
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

// const MAP = [
// 	[0, 50, 200],
// 	[100, 50, 20],
// 	[50, 0, 80]
// ];

let MAP = [["tiles/grainger0","tiles/grainger1","tiles/grainger2","tiles/grainger3","tiles/grainger4","tiles/grainger5","tiles/grainger6","tiles/grainger7","tiles/grainger8","tiles/grainger9","tiles/grainger10","tiles/grainger11",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],["tiles/grainger12","tiles/grainger13","tiles/grainger14","tiles/grainger15","tiles/grainger16","tiles/grainger17","tiles/grainger18","tiles/grainger19","tiles/grainger20","tiles/grainger21","tiles/grainger22","tiles/grainger23",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],["tiles/grainger24","tiles/grainger25","tiles/grainger26","tiles/grainger27","tiles/grainger28","tiles/grainger29","tiles/grainger30","tiles/grainger31","tiles/grainger32","tiles/grainger33","tiles/grainger34","tiles/grainger35",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],["tiles/grainger36","tiles/grainger37","tiles/grainger38","tiles/grainger39","tiles/grainger40","tiles/grainger41","tiles/grainger42","tiles/grainger43","tiles/grainger44","tiles/grainger45","tiles/grainger46","tiles/grainger47",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],["tiles/grainger48","tiles/grainger49","tiles/grainger50","tiles/grainger51","tiles/grainger52","tiles/grainger53","tiles/grainger54","tiles/grainger55","tiles/grainger56","tiles/grainger57","tiles/grainger58","tiles/grainger59",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]];
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
	for (let i = 0; i < MAP.length; i++) {
		for (let j = 0; j < MAP[i].length; j++) {
			let x = j * TILE_SIZE;
			let y = i * TILE_SIZE;

			let image = MAP[i][j] || 'grass';
			ctx.drawImage(images[image], x, y, TILE_SIZE, TILE_SIZE);
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


function drawEvents(drawText=false) {
	for (let {location, name} of events) {
		ctx.fillStyle = 'red';
		ctx.font = `30px VT323, monospace`;
		location = location.map(x => x * TILE_SIZE);

		if (!drawText)
			ctx.fillRect(location[0], location[1], TILE_SIZE, TILE_SIZE);

		let z = state.zoom;
		ctx.scale(1/z, 1/z);
		ctx.textAlign = 'center';
		if (drawText)
			ctx.fillText(name, (location[0] + TILE_SIZE / 2) * z, (location[1] - 10) * z);
		ctx.scale(z, z);
	}
}

window.addEventListener('wheel', e => {
	let min = 0.7;
	let max = 2.3;
	state.zoom = Math.max(Math.min(state.zoom + e.deltaY * 0.01, max), min);
});

window.netID = false;
window.players = [];

function draw() {
	if (!netID) return requestAnimationFrame(draw);
	let z = state.zoom;

	// if (clientLocation) {
	// 	let {latitude, longitude} = clientLocation;
	// 	state.targetPosition = latLonToCoords(latitude, longitude);
	// }

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

	ctx.translate(-state.position[0] * TILE_SIZE, -state.position[1] * TILE_SIZE); // new 0, 0 is x, y
	drawEvents(true);
	ctx.translate(state.position[0] * TILE_SIZE, state.position[1] * TILE_SIZE);

	ctx.scale(1/z, 1/z);
	ctx.translate(-(w - TILE_SIZE * z) / 2, -(h - TILE_SIZE * z) / 2);

	requestAnimationFrame(draw);
}

draw();
