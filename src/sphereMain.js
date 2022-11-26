//const inputDB = {};

class UIElement {
	constructor(inputID, displayID=null) {
		this.inputElement = document.getElementById(inputID);
		this.inputElement.addEventListener("onload", (e) => {
			return this.get();
		});
		this.inputElement.addEventListener("input", (e) => {
			return this.get();
		});
		this.displayElement = displayID ? document.getElementById(displayID) : null;
	}

	get(e=null) {
		if (this.displayElement) {
			this.displayElement.innerHTML = this.inputElement.valueAsNumber;
		}
		return this.inputElement.valueAsNumber;
	}

	updateDisplay() {

	}
}

let viewport;
/****************************************************************************
 * UI wrapper functions and variables
 ***************************************************************************/

// let inputZoom = new UIElement("inputZoom", "displayZoom");
let zoomTargetX;// = new UIElement("inputZoomTargetX", "displayZoomTargetX");
let zoomTargetY;// = new UIElement("inputZoomTargetY", "displayZoomTargetY");
let zoomScaleFactor;
let canvasSize;
let logarithmicScale;
let expBase;
let lastTimeStamp = NaN;

function updateZoomTargetX(e=null) {
	zoomTargetX = document.getElementById("inputZoomTargetX").valueAsNumber;
    document.getElementById("displayZoomTargetX").innerHTML = zoomTargetX;
}

function updateZoomTargetY(e=null) {
	zoomTargetY = document.getElementById("inputZoomTargetY").valueAsNumber;
    document.getElementById("displayZoomTargetY").innerHTML = zoomTargetY;
}

function updateZoom(e=null) {
	zoomScaleFactor = Math.pow(2, -document.getElementById("inputZoom").valueAsNumber);
    document.getElementById("displayZoom").innerHTML = document.getElementById("inputZoom").valueAsNumber;
    updateGridDivisionsX();
	updateGridDivisionsY();
}

function updateCanvasSize(e=null) {
	canvasSize = document.getElementById("inputCanvasSize").valueAsNumber;
    document.getElementById("displayCanvasSize").innerHTML = canvasSize;
    viewport.resize(canvasSize, canvasSize);
	updateGridDivisionsX();
	updateGridDivisionsY();
}

function updateExpBase() {
	expBase = document.getElementById("inputExpBase").valueAsNumber;
	document.getElementById("displayExpBase").innerHTML = expBase;
	updateGridDivisionsX();
	updateGridDivisionsY();
}

function updateExp() {
	logarithmicScale = document.getElementById("inputExp").valueAsNumber;
	document.getElementById("displayExp").innerHTML = logarithmicScale;
	updateGridDivisionsX();
	updateGridDivisionsY();
}

function updateGridDivisionsX() {
	gridDivisionsX = Math.floor(document.getElementById("inputGridDivisionsX").valueAsNumber
								* canvasSize / 100
								* Math.pow(expBase, logarithmicScale)
								/ zoomScaleFactor);
	document.getElementById("displayGridDivisionsX").innerHTML = gridDivisionsX;
}

function updateGridDivisionsY() {
	gridDivisionsY = Math.floor(document.getElementById("inputGridDivisionsY").valueAsNumber
								* canvasSize / 100
								* Math.pow(expBase, logarithmicScale)
								/ zoomScaleFactor);
	document.getElementById("displayGridDivisionsY").innerHTML = gridDivisionsY;
}

function updateFPS() {
    let currTimeStamp = Date.now();
    if (!isNaN(lastTimeStamp)) {
        document.getElementById("displayCurrentFPS").innerHTML = (1000/(currTimeStamp - lastTimeStamp)).toFixed(2);
    }
    lastTimeStamp = currTimeStamp;
}

/****************************************************************************
 * Main function
 ***************************************************************************/

function main() {
	viewport = new Viewport(document.querySelector("canvas"));
	gridState = new GridState(viewport);

	const c = document.getElementById("texture");
	c.style.display = "none";
	console.log(c);
	const ctx = c.getContext("2d");
	ctx.willReadFrequently = true;
	const image = new Image();
	image.style.display = "none";

	image.src = "img/2k_earth_daymap.jpg";

	document.querySelector('body').appendChild(image);
	let imageData;// = loadImage(url);
	let greyscaleEnabled = false;
	let testTexMap = false;
	let texMapEnabled = true;
	let viewAsGrid = false;
	image.onload = function () {
		c.height = image.height;
		c.width = image.width;
		console.log(image.height, image.width, c.height, c.width);
		ctx.drawImage(image, 0, 0);
		//var imgData = ctx.getImageData(0, 0, c.width, c.height);
		imageData = ctx.getImageData(0, 0, c.width, c.height)["data"];
	}

	updateZoomTargetX();
	document.getElementById("inputZoomTargetX").addEventListener("input", updateZoomTargetX);

	updateZoomTargetY();
	document.getElementById("inputZoomTargetY").addEventListener("input", updateZoomTargetY);

	updateZoom();
	document.getElementById("inputZoom").addEventListener("input", updateZoom);

	updateCanvasSize();
	document.getElementById("inputCanvasSize").addEventListener("input", updateCanvasSize);

	updateExpBase();
	document.getElementById("inputExpBase").addEventListener("input", updateExpBase);

    updateExp();
	document.getElementById("inputExp").addEventListener("input", updateExp);

    updateGridDivisionsX();
	document.getElementById("inputGridDivisionsX").addEventListener("input", updateGridDivisionsX);
   
    updateGridDivisionsY();
	document.getElementById("inputGridDivisionsY").addEventListener("input", updateGridDivisionsY);

	let azimuth = 0;
	let inclination = Math.PI/2;
	let dAzimuth = 0.125*Math.PI//(Math.random() - 0.5) * Math.PI / 36;
	let dInclination = 0.125*Math.PI//(Math.random() - 0.5) * Math.PI / 36;
	const mapToSphere = true;
	// const texMapEnabled =  true;
	let textureXShift = 0;
	let textureYShift = 0;
	setInterval(function() {
		updateFPS();
		// let lightDirection = directionVector(azimuth, inclination);
		if (mapToSphere) {
			textureXShift -= .001;
			if (textureXShift>1) textureXShift -= 1;
		}
 		viewport.plotFunctionRGB((x, y)=>{
 			// console.log("zoomTargetX, zoomTargetY, zoomScaleFactor", zoomTargetX, zoomTargetY, zoomScaleFactor);
 			x = (x - zoomTargetX - 0.5) * zoomScaleFactor + zoomTargetX + 0.5;
 			y = (y - zoomTargetY - 0.5) * zoomScaleFactor + zoomTargetY + 0.5;
			// let normal = sphereNormal(x, y);
			// normal = vec1x3To1x4(normal);
			// let rotateMatrix = rotateAroundZ(2 * Math.PI*Math.random());
			// normal = math.multiply(normal, rotateMatrix);
			let texCoords;
			if (mapToSphere) {
				texCoords = sphereTexCoords(x, y);
			} else {
				texCoords = [x, y];
			}
			// console.log(texCoords);
			if (!texCoords) {
				return [0, 0, 0];
			}
			let textureX, textureY;
			[textureX, textureY] = texCoords;
			textureX += textureXShift;

			textureX = textureX - Math.floor(textureX);
			textureY -= textureYShift;
			if (textureY<0) textureY += 1;
			let texMapColor = [255, 255, 255];
			// console.log(textureX, textureY);
			if (texCoords && texMapEnabled && imageData) {
				try {
					texMapColor = textureMapFloat(imageData, c.width, c.height, textureX, textureY);
				} catch(error) {
					console.log(error);
					texMapColor = [255, 127, 255];
				}
			} else {
				texMapColor = [255, 0, 255];
			}
			let axisFns = [getAxisFn(gridDivisionsX, gridDivisionsY, 2),
						   getAxisFn(gridDivisionsX, -gridDivisionsY, 1),
						   getAxisFn(gridDivisionsX, gridDivisionsY/2, 0)];
			let colors = axisFns.map((f)=>{
				return f(textureX, textureY, texMapColor);
			});
			return colorAverage(colors);
		});
	});
	// 	viewport.plotFunctionRGB((x, y) => {
	// 		// let normal = sphereNormal(2.5*(x-.5), 2.5*(-y+.5));
	// 		x -= .5;
	// 		y -= .5;
	// 		let ray = camera.ray(x, y);
	// 		const isometricView = true;
	// 		let normal;
	// 		if (isometricView) {
	// 			normal = sphereCoords(sphereNormal(x, y));
	// 		} else {
	// 			normal = sphere.intercept(ray);
	// 		}
	// 		// console.log("normal", math.resize(normal, [3]));
	// 		// console.log("lightDirection", math.resize(lightDirection, [3]));

	// 		if (normal) {
	// 			// normal = math.resize(camera.cameraCoords(normal), [3]);
	// 			// normal = sphereCoords(sphereNormal(x, y));
	// 			let lat, long, coords;
	// 			coords = sphereCoords(normal);
	// 			[lat, long] = coords;
	// 			//console.log(normal, lightDirection);
	// 			let brightness = Math.max(math.dot(normal, lightDirection), 0);
	// 			if (greyscaleEnabled) {
	// 				return [brightness, brightness, brightness];
	// 			}
	// 			// console.log(brightness);
	// 			//brightness = minBrightness + (maxBrightness-minBrightness) * brightness;
	// 			//console.log(brightness);
	// 			//return [brightness, brightness, brightness];
	// 			let texMapColor = [0, 0, 255];
	// 			if (testTexMap) {
	// 				let textureX = lat/Math.PI/2;
	// 				let textureY = long/Math.PI;
	// 				console.log("normal", normal);
	// 				console.log("lat, long, coords", lat, long, coords);
	// 				console.log("textureX, textureY", textureX, textureY);
	// 				return [math.round(255*textureX, 255*textureY), 0];
	// 			}
	// 			if (texMapEnabled) {
	// 				try {
	// 					texMapColor = textureMap(ctx, lat/Math.PI/2, long/Math.PI);
	// 				} catch(error) {
	// 					console.log(lat/Math.PI/2, long/Math.PI);
	// 					texMapColor = [255, 127, 255];
	// 					return [255, 255, 0];
	// 				}
	// 			}
	// 			if (viewAsGrid) {
	// 				return gridState.grid(lat/Math.PI/2, long/Math.PI/2, texMapColor);
	// 			} else {
	// 				return texMapColor;
	// 			}	
	// 		} else {
	// 			return [255, 0, 255];
	// 		}
	// 	});
		//gridState.incrementFrame();

	// console.log(camera, camera.imgCoords(0, 0));
	// let testObject = new Sphere();
	// console.log(testObject);
	// testObject.setPosition([0, 0, 0]);
	// console.log(testObject);
	// //let testRay = new Ray([0, 1, 1], [0, 0, 1]);
	// console.log(testRay);
	// console.log(testObject.rayTransform(testRay));
	// console.log(testObject.intercept(testRay));
	// console.log("ray from camera");
	// console.log("camera worldcoords 0,0", camera.worldCoords(0, 0));

	// // testRay2 = camera.ray(0, 0);
	// console.log("testRay2", testRay2);
	// console.log("testObject.rayTransform(testRay2)", testObject.rayTransform(testRay2));
	// console.log("testObject.intercept(testRay2)", testObject.intercept(testRay2));
	// console.log("vectorTo([1, 2, 3, 1], [4, 5, 6, 1])", vectorTo([1, 2, 3, 1], [4, 5, 6, 1]));
}

window.onload=main;