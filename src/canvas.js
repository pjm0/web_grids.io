let viewport;
let numAxes;
let lineWidth;
let frameNumber;
let maxFrameNumber;
let initialScale;
let scale;
let scaleIncrease;

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

function distort(x, y, scale) {
	let distortFactor = Math.sqrt(Math.abs(1 - (x*x + y*y)/scale));
	return distortFactor;
}

function getGridFn(rotation, lineWidth, scale, scale2, numAxes) {
	let lineSpacing = 1;
	let halfLineWidth = lineWidth / 2
	let canvasSize = Math.min(viewport.width, viewport.height);

	let colors = [0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFF00FFFF, 0xFFFF00FF, 0xFFFFFF00, 0xFF000000];
	axisAngles = gridAxisAngles(numAxes, rotation);

	return ((x, y) => {
			x -= 0.5;
			y -= 0.5;
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
				//viewport.drawPixel(i, j, colors[colorIndex]);
			}
			if (colorIndex >=0) {
				return colors[colorIndex];
			} else {
				return 0xFF000000;
			}
	});
}

function initInputs() {
	document.getElementById("inputNumAxes").addEventListener("input", function(e) {
		numAxes = e.target.value;
		document.getElementById("displayNumAxes").innerHTML = numAxes;
	});
	document.getElementById("inputLineWidth").addEventListener("input", function(e) {
		lineWidth = e.target.value;
		document.getElementById("displayLineWidth").innerHTML = lineWidth;
	});
	document.getElementById("inputCanvasSize").addEventListener("input", function(e) {
		document.getElementById("displayCanvasSize").innerHTML = e.target.value;
		viewport.resize(e.target.value, e.target.value);
	});
	document.getElementById("inputGridScale").addEventListener("input", function(e) {
		scale = initialScale = e.target.value;
	});
	document.getElementById("inputGridScaleMultiplier").addEventListener("input", function(e) {
		scaleIncrease = e.target.value;
	});
	document.getElementById("inputMaxFrames").addEventListener("input", function(e) {
		maxFrameNumber = e.target.value;
		document.getElementById("displayMaxFrames").innerHTML = e.target.value;
	});
}

function main() {
	viewport = new Viewport(document.querySelector("canvas"));
	let initialRotationAngle = 0;
	let rotationAngle = initialRotationAngle;
	let rotationSpeed = 0.001;
	initialScale = document.getElementById("inputGridScale").value;
	scale = initialScale;
	scaleIncrease = document.getElementById("inputGridScaleMultiplier").value;
	lineWidth = document.getElementById("inputLineWidth").value;
	let distortionScaleFactor = .2;
	numAxes = document.getElementById("inputNumAxes").value;
	frameNumber = 0;
	maxFrameNumber = document.getElementById("inputMaxFrames").value;
	let targetFPS = 60;
	let frameDelay = 1000 / targetFPS;
	let lastTimeStamp = NaN;
	initInputs();
	let displayCurrentFrame = document.getElementById("displayCurrentFrame");
	let displayCurrentScale = document.getElementById("displayCurrentScale");
	let displayCurrentFPS = document.getElementById("displayCurrentFPS");
	setInterval(function() {
		let f = getGridFn(rotationAngle, lineWidth, scale, distortionScaleFactor, numAxes);
		viewport.plotFunction(f);
		//viewport.updateCanvas();
		//drawGrid(rotationAngle, lineWidth, scale, distortionScaleFactor, numAxes);
		displayCurrentFrame.innerHTML = frameNumber.toString();
		displayCurrentScale.innerHTML = scale.toString();
		rotationAngle += 2 * Math.PI * rotationSpeed;
		scale *= scaleIncrease;
		frameNumber++;
		if (frameNumber > maxFrameNumber) {
			frameNumber = 0;
			scale = initialScale;
		}
		let currTimeStamp = Date.now();
		if (!isNaN(lastTimeStamp)) {
			displayCurrentFPS.innerHTML = (1000/(currTimeStamp - lastTimeStamp)).toFixed(2);
		}
		lastTimeStamp = currTimeStamp;
	}, frameDelay);
}

main();