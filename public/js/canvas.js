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

changeViewBtn.children[1].firstElementChild.src = state.avatar.image.src;

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

	// for (let p in players) {
	// 	let dx, dy;
	// 	for (let i of [0, 1]) {
	// 		let d = players[p].targetPosition[i] - players[p].position[i];
	// 		let maxMove = Math.max(0.05, Math.abs(d / 20)); // d / 20 => 20 * 10ms = 0.2s to stop
	// 		let sign = d / Math.abs(d) || 1;
	// 		let inc = sign * Math.min(Math.abs(d), maxMove);
	// 		if (i == 0) dx = inc;
	// 		else dy = inc;
	// 		players[p].position[i] += inc;
	// 	}

	// 	let {frame, dir} = players[p].avatar;
	// 	if (dx !== 0 || dy !== 0) {
	// 		frame += 0.1;
	// 		frame %= 9;
	// 		if (Math.abs(dx) > Math.abs(dy)) {
	// 			if (dx > 0) dir = 3;
	// 			else dir = 1;
	// 		} else {
	// 			if (dy > 0) dir = 2;
	// 			else dir = 0;
	// 		}
	// 	} else {
	// 		frame = 0;
	// 	}
	// 	console.log(frame);

	// 	players[p].avatar = {
	// 		...players[p].avatar,
	// 		frame: frame,
	// 		dir: dir,
	// 		sx: 17 + 64 * Math.floor(frame),
	// 		sy: 525 + 64 * dir,
	// 	}
	// }

}, 10);

// const MAP = [
// 	[0, 50, 200],
// 	[100, 50, 20],
// 	[50, 0, 80]
// ];

//let MAP = [["tiles/grainger0","tiles/grainger1","tiles/grainger2","tiles/grainger3","tiles/grainger4","tiles/grainger5","tiles/grainger6","tiles/grainger7","tiles/grainger8","tiles/grainger9","tiles/grainger10","tiles/grainger11",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],["tiles/grainger12","tiles/grainger13","tiles/grainger14","tiles/grainger15","tiles/grainger16","tiles/grainger17","tiles/grainger18","tiles/grainger19","tiles/grainger20","tiles/grainger21","tiles/grainger22","tiles/grainger23",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],["tiles/grainger24","tiles/grainger25","tiles/grainger26","tiles/grainger27","tiles/grainger28","tiles/grainger29","tiles/grainger30","tiles/grainger31","tiles/grainger32","tiles/grainger33","tiles/grainger34","tiles/grainger35",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],["tiles/grainger36","tiles/grainger37","tiles/grainger38","tiles/grainger39","tiles/grainger40","tiles/grainger41","tiles/grainger42","tiles/grainger43","tiles/grainger44","tiles/grainger45","tiles/grainger46","tiles/grainger47",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],["tiles/grainger48","tiles/grainger49","tiles/grainger50","tiles/grainger51","tiles/grainger52","tiles/grainger53","tiles/grainger54","tiles/grainger55","tiles/grainger56","tiles/grainger57","tiles/grainger58","tiles/grainger59",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]];
// let MAP = [["tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road"],["tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path"],["tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/grainger0","tiles/grainger1","tiles/grainger2","tiles/grainger3","tiles/grainger4","tiles/grainger5","tiles/grainger6","tiles/grainger7","tiles/grainger8","tiles/grainger9","tiles/grainger10","tiles/grainger11","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path"],["tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/grainger12","tiles/grainger13","tiles/grainger14","tiles/grainger15","tiles/grainger16","tiles/grainger17","tiles/grainger18","tiles/grainger19","tiles/grainger20","tiles/grainger21","tiles/grainger22","tiles/grainger23","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path"],["tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/grainger24","tiles/grainger25","tiles/grainger26","tiles/grainger27","tiles/grainger28","tiles/grainger29","tiles/grainger30","tiles/grainger31","tiles/grainger32","tiles/grainger33","tiles/grainger34","tiles/grainger35","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path"],["tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/grainger36","tiles/grainger37","tiles/grainger38","tiles/grainger39","tiles/grainger40","tiles/grainger41","tiles/grainger42","tiles/grainger43","tiles/grainger44","tiles/grainger45","tiles/grainger46","tiles/grainger47","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path"],["tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/grainger48","tiles/grainger49","tiles/grainger50","tiles/grainger51","tiles/grainger52","tiles/grainger53","tiles/grainger54","tiles/grainger55","tiles/grainger56","tiles/grainger57","tiles/grainger58","tiles/grainger59",null,null,"tiles/path","tiles/path",null,null],["tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path"],["tiles/path","tiles/talbot0","tiles/talbot1","tiles/talbot2","tiles/talbot3","tiles/talbot4","tiles/talbot5","tiles/talbot6","tiles/talbot7",null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/mel0","tiles/mel1","tiles/mel2","tiles/mel3","tiles/mel4","tiles/mel5","tiles/mel6","tiles/mel7","tiles/path"],["tiles/path","tiles/talbot8","tiles/talbot9","tiles/talbot10","tiles/talbot11","tiles/talbot12","tiles/talbot13","tiles/talbot14","tiles/talbot15",null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/mel8","tiles/mel9","tiles/mel10","tiles/mel11","tiles/mel12","tiles/mel13","tiles/mel14","tiles/mel15","tiles/path"],["tiles/path","tiles/talbot16","tiles/talbot17","tiles/talbot18","tiles/talbot19","tiles/talbot20","tiles/talbot21","tiles/talbot22","tiles/talbot23",null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/mel16","tiles/mel17","tiles/mel18","tiles/mel19","tiles/mel20","tiles/mel21","tiles/mel22","tiles/mel23","tiles/path"],["tiles/path","tiles/talbot24","tiles/talbot25","tiles/talbot26","tiles/talbot27","tiles/talbot28","tiles/talbot29","tiles/talbot30","tiles/talbot31",null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/mel24","tiles/mel25","tiles/mel26","tiles/mel27","tiles/mel28","tiles/mel29","tiles/mel30","tiles/mel31","tiles/path"],["tiles/path","tiles/talbot32","tiles/talbot33","tiles/talbot34","tiles/talbot35","tiles/talbot36","tiles/talbot37","tiles/talbot38","tiles/talbot39",null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/mel32","tiles/mel33","tiles/mel34","tiles/mel35","tiles/mel36","tiles/mel37","tiles/mel38","tiles/mel39","tiles/path"],["tiles/path","tiles/talbot40","tiles/talbot41","tiles/talbot42","tiles/talbot43","tiles/talbot44","tiles/talbot45","tiles/talbot46","tiles/talbot47",null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/mel40","tiles/mel41","tiles/mel42","tiles/mel43","tiles/mel44","tiles/mel45","tiles/mel46","tiles/mel47","tiles/path"],["tiles/path","tiles/talbot48","tiles/talbot49","tiles/talbot50","tiles/talbot51","tiles/talbot52","tiles/talbot53","tiles/talbot54","tiles/talbot55",null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/mel48","tiles/mel49","tiles/mel50","tiles/mel51","tiles/mel52","tiles/mel53","tiles/mel54","tiles/mel55","tiles/path"],["tiles/path","tiles/talbot56","tiles/talbot57","tiles/talbot58","tiles/talbot59","tiles/talbot60","tiles/talbot61","tiles/talbot62","tiles/talbot63",null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/mel56","tiles/mel57","tiles/mel58","tiles/mel59","tiles/mel60","tiles/mel61","tiles/mel62","tiles/mel63","tiles/path"],["tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/mel64","tiles/mel65","tiles/mel66","tiles/mel67","tiles/mel68","tiles/mel69","tiles/mel70","tiles/mel71","tiles/path"],["tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/mel72","tiles/mel73","tiles/mel74","tiles/mel75","tiles/mel76","tiles/mel77","tiles/mel78","tiles/mel79","tiles/path"],["tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/path"],["tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/path"],["tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"tiles/path","tiles/path","tiles/path"],["tiles/path","tiles/everitt0","tiles/everitt1","tiles/everitt2","tiles/everitt3","tiles/everitt4","tiles/everitt5","tiles/everitt6","tiles/everitt7","tiles/everitt8",null,null,null,null,null,null,null,null,"tiles/path",null,null,null,null,null,"tiles/mseb0","tiles/mseb1","tiles/mseb2","tiles/mseb3","tiles/mseb4","tiles/mseb5","tiles/mseb6","tiles/path"],["tiles/path","tiles/everitt9","tiles/everitt10","tiles/everitt11","tiles/everitt12","tiles/everitt13","tiles/everitt14","tiles/everitt15","tiles/everitt16","tiles/everitt17",null,null,null,null,"tiles/ehall0","tiles/ehall1","tiles/ehall2","tiles/ehall3","tiles/ehall4","tiles/ehall5","tiles/ehall6","tiles/ehall7","tiles/ehall8",null,"tiles/mseb7","tiles/mseb8","tiles/mseb9","tiles/mseb10","tiles/mseb11","tiles/mseb12","tiles/mseb13","tiles/path"],["tiles/path","tiles/everitt18","tiles/everitt19","tiles/everitt20","tiles/everitt21","tiles/everitt22","tiles/everitt23","tiles/everitt24","tiles/everitt25","tiles/everitt26",null,null,null,null,"tiles/ehall9","tiles/ehall10","tiles/ehall11","tiles/ehall12","tiles/ehall13","tiles/ehall14","tiles/ehall15","tiles/ehall16","tiles/ehall17",null,"tiles/mseb14","tiles/mseb15","tiles/mseb16","tiles/mseb17","tiles/mseb18","tiles/mseb19","tiles/mseb20","tiles/path"],["tiles/path","tiles/everitt27","tiles/everitt28","tiles/everitt29","tiles/everitt30","tiles/everitt31","tiles/everitt32","tiles/everitt33","tiles/everitt34","tiles/everitt35",null,null,null,null,"tiles/ehall18","tiles/ehall19","tiles/ehall20","tiles/ehall21","tiles/ehall22","tiles/ehall23","tiles/ehall24","tiles/ehall25","tiles/ehall26",null,"tiles/mseb21","tiles/mseb22","tiles/mseb23","tiles/mseb24","tiles/mseb25","tiles/mseb26","tiles/mseb27","tiles/path"],["tiles/path","tiles/everitt36","tiles/everitt37","tiles/everitt38","tiles/everitt39","tiles/everitt40","tiles/everitt41","tiles/everitt42","tiles/everitt43","tiles/everitt44",null,null,null,null,"tiles/ehall27","tiles/ehall28","tiles/ehall29","tiles/ehall30","tiles/ehall31","tiles/ehall32","tiles/ehall33","tiles/ehall34","tiles/ehall35",null,"tiles/mseb28","tiles/mseb29","tiles/mseb30","tiles/mseb31","tiles/mseb32","tiles/mseb33","tiles/mseb34","tiles/path"],["tiles/path","tiles/everitt45","tiles/everitt46","tiles/everitt47","tiles/everitt48","tiles/everitt49","tiles/everitt50","tiles/everitt51","tiles/everitt52","tiles/everitt53",null,null,null,null,"tiles/ehall36","tiles/ehall37","tiles/ehall38","tiles/ehall39","tiles/ehall40","tiles/ehall41","tiles/ehall42","tiles/ehall43","tiles/ehall44",null,"tiles/mseb35","tiles/mseb36","tiles/mseb37","tiles/mseb38","tiles/mseb39","tiles/mseb40","tiles/mseb41","tiles/path"],["tiles/path","tiles/everitt54","tiles/everitt55","tiles/everitt56","tiles/everitt57","tiles/everitt58","tiles/everitt59","tiles/everitt60","tiles/everitt61","tiles/everitt62",null,null,null,null,"tiles/ehall45","tiles/ehall46","tiles/ehall47","tiles/ehall48","tiles/ehall49","tiles/ehall50","tiles/ehall51","tiles/ehall52","tiles/ehall53",null,"tiles/mseb42","tiles/mseb43","tiles/mseb44","tiles/mseb45","tiles/mseb46","tiles/mseb47","tiles/mseb48","tiles/path"],["tiles/path",null,null,null,null,"tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,"tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,"tiles/path"],["tiles/path",null,null,null,null,"tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,"tiles/path",null,null,null,null,null,null,null,null,null,null,null,null,"tiles/path"],["tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path","tiles/path"],["tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road","tiles/road"]]
let MAP_DIMS = [32, 32];

// for (let img of new Set(MAP.flat())) {
// 	if (img) loadImage(img);
// }

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

	// if (clientLocation) {
	// 	let {latitude, longitude} = clientLocation;
	// 	state.targetPosition = latLonToCoords(latitude, longitude);
	// }

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
