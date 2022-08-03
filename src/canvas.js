let canvas;
let context;
let img;
let buffer;
let midX;
let midY;
let numAxes;

function mod(a, b) {
	return a - (b * Math.floor(a / b));
}

function gridAxisAngles(numAxes, rotation) {
	axisAngles = [];
	for (let i=0; i<numAxes; i++) {
		axisAngles.push(rotation + i * Math.PI / numAxes);
	}
	return axisAngles;
}

function gridCoords(x, y, axisAngles, scale) {
	coords = [];
	for (let i=0; i<axisAngles.length; i++) {
		let angle = axisAngles[i];
		let component = (x * Math.cos(angle) + y * Math.sin(angle)) * scale;
		coords.push(component);
	}
	return coords;	
}

function drawPixel(x, y, color) {
	buffer[x + y * canvas.width] = color;
}

function updateCanvas() {
	context.putImageData(img, 0, 0);
}

function distort(x, y, scale) {
	let distortFactor = Math.sqrt(Math.abs(1 - (x*x + y*y)/scale));
	return distortFactor;
}

function drawGrid(rotation, lineWidth, scale, scale2, numAxes) {
	let lineSpacing = 1;
	let halfLineWidth = lineWidth / 2
	let canvasSize = Math.min(canvas.width, canvas.height);

	let colors = [0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFF00FFFF, 0xFFFF00FF, 0xFFFFFF00, 0xFF000000];
	axisAngles = gridAxisAngles(numAxes, rotation);

	for (let i=0; i<canvas.width; i++) {
		for (let j=0; j<canvas.height; j++) {
			let x = (i - midX) / canvasSize;
			let y = (j - midY) / canvasSize;
			let distortFactor = distort(x, y, scale2);
			x *= distortFactor;
			y *= distortFactor;
			let coords = gridCoords(x, y, axisAngles, scale);
			let colorIndex = -1;
			for (let axis=0; axis<numAxes; axis++) {
				let n = coords[axis];
				let remainder = mod(n, lineSpacing);
				let q = Math.floor(n / lineSpacing)
				if (remainder < halfLineWidth ||
					remainder > lineSpacing - halfLineWidth) {
					colorIndex = (colorIndex + axis + 1) % colors.length;
				}
				drawPixel(i, j, colors[colorIndex]);
			}
			if (colorIndex >=0) {
				drawPixel(i, j, colors[colorIndex]);
			} else {
				drawPixel(i, j, 0xFF000000);
			}
		}
	}
	updateCanvas();
}

function initGlobals() {
	canvas = document.querySelector("canvas");
	context = canvas.getContext("2d");
	img = context.createImageData(canvas.width, canvas.height);
	buffer = new Uint32Array(img.data.buffer);
	midX = canvas.width / 2;
	midY = canvas.height / 2;
}

function initInputs() {
	document.getElementById("inputNumAxes").addEventListener("input", function(e) {
		numAxes = e.target.value;
		document.getElementById("displayNumAxes").innerHTML = numAxes;
	});
	document.getElementById("inputCanvasSize").addEventListener("input", function(e) {
		canvas.height = canvas.width = e.target.value;
		initGlobals();
		document.getElementById("displayCanvasSize").innerHTML = e.target.value;
	});
}

function main() {
	initGlobals();
	let rotationAngle = 0;
	let rotationSpeed = 0.001;
	let scale = 10;
	let scaleIncrease = 1.01;
	let lineWidth = .3;
	let distortionScaleFactor = .2;
	numAxes = 3;
	let targetFPS = 60;
	let frameDelay = 1000/targetFPS;
	initInputs();
	setInterval(function() {
		drawGrid(rotationAngle, lineWidth, scale, distortionScaleFactor, numAxes);
		rotationAngle += 2 * Math.PI * rotationSpeed;
		scale *= scaleIncrease;
	}, frameDelay);
}

main();