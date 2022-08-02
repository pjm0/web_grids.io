let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
let img = context.createImageData(canvas.width, canvas.height);
let buffer = new Uint32Array(img.data.buffer);
function mod(a, b) {
	return a - (b * Math.floor(a / b));
}

function gridAxisAngles(numAxes, rotation) {
	axisAngles = [];
	for (let i=0; i<numAxes; i++) {
		axisAngles.push(rotation + i * Math.PI * 2 / numAxes);
	}
	return axisAngles;
}

function gridCoords(x, y, axisAngles, scale) {
	coords = [];
	for (let i=0; i<axisAngles.length; i++) {
		let angle = axisAngles[i];
		let component = (x * Math.cos(angle) + y * Math.sin(angle))/scale;
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

const midX = canvas.width / 2;
const midY = canvas.height / 2;

function drawGrid(rotation, scale, scale2) {
	let lineSpacing = 20;
	let lineWidth = 5;
	let halfLineWidth = lineWidth / 2

	//let scale = 2;
	let numAxes = 4;
	let colors = [0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFF00FFFF, 0xFFFF00FF, 0xFFFFFF00, 0xFF000000];
	axisAngles = gridAxisAngles(numAxes, rotation);

	for (let i=0; i<canvas.width; i++) {
		for (let j=0; j<canvas.height; j++) {
			let x = (i - midX) / scale;
			let y = (j - midY) / scale;
			let radiusSq = (Math.min(midX, midY) - Math.max(Number.MIN_VALUE, Math.pow(x, 2) + Math.pow(y, 2)))/scale2;
			x *= Math.sqrt(radiusSq);
			y *= Math.sqrt(radiusSq);
			let coords = gridCoords(x, y, axisAngles, scale);
			//let color = 0xFFFFFFFF;
			let colorIndex = 0;
			for (let axis=0; axis<numAxes; axis++) {
				let n = coords[axis]///Math.log(radius);
				let remainder = mod(n, lineSpacing);
				let q = Math.floor(n / lineSpacing)
				if (remainder < halfLineWidth ||
					remainder > lineSpacing - halfLineWidth) {
					colorIndex = (colorIndex + axis + 1) % colors.length;
				}
				drawPixel(i, j, colors[colorIndex]);
			}
		}
	}
	updateCanvas();
}

let r = 0;
let scale = 6;
setInterval(function() {
	drawGrid(r, 12, scale);
	r += Math.PI * 0.003;
	scale *= .97;
}, 5);