function sphereNormal(x, y) {
	let z = Math.sqrt(1 - (x * x + y * y));
	if (!isNaN(z)) {
		return [x, -z, y];
	} else {
		return null;
	}
}

function sphereCoords(normal) {
	let x, y, z;
	[x, y, z] = normal;
	let latitude = Math.atan2(y, x);
	if (latitude < 0) latitude += 2 * Math.PI;
	//if (latitude > 2 * Math.PI) latitude -= 2 * Math.PI;
	let longitude = Math.acos(z);
	return [latitude, longitude];
}

function directionVector(azimuth, inclination) {
	let x, y, z;
	x = Math.cos(azimuth) * Math.sin(inclination);
	y = Math.sin(azimuth) * Math.sin(inclination);
	z = Math.cos(inclination);
	return [x, y, z];
}

function loadImage(url) {
	var c = document.getElementById("texture");
	console.log(c);
	var ctx = c.getContext("2d");
	var image = new Image();
	image.src = url;
	ctx.drawImage(image, 0, 0);
	var imgData = ctx.getImageData(0, 0, c.width, c.height);
	return imgData;
}

function textureMap(context, x, y) {
	let imgX = Math.round(x * (context.canvas.width - 1));
	let imgY = Math.round(y * (context.canvas.height - 1));
	let data = context.getImageData(imgX, imgY, 1, 1).data.slice(0, 3);
	let color = [];
	for (let i=0; i<3; i++) {
		color.push(data[i]/255);
	}
	return [color[2], color[1], color[0]];
}

function main() {
	viewport = new Viewport(document.querySelector("canvas"));
	gridState = new GridState(viewport);
    let minBrightness = document.getElementById("inputMinBrightness").valueAsNumber;
	let maxBrightness = document.getElementById("inputMaxBrightness").valueAsNumber;

	var c = document.getElementById("texture");
	console.log(c);
	var ctx = c.getContext("2d");
	var image = new Image();
	image.src = "img/8k_earth_daymap.jpg";
	document.querySelector('body').appendChild(image);
	image.onload = function () {
	c.height = image.height;
	c.width = image.width;
	console.log(image.height, image.width, c.height, c.width);
	ctx.drawImage(image, 0, 0);
	//var imgData = ctx.getImageData(0, 0, c.width, c.height);
	console.log(ctx);
	}
	// console.log(textureMap(ctx, 0.5, 0.5));
	document.getElementById("inputNumAxes").addEventListener("input", function(e) {
        gridState.numAxes = e.target.valueAsNumber;
        document.getElementById("displayNumAxes").innerHTML = gridState.numAxes;
    });
    document.getElementById("inputCanvasSize").addEventListener("input", function(e) {
        document.getElementById("displayCanvasSize").innerHTML = e.target.valueAsNumber;
        viewport.resize(e.target.valueAsNumber, e.target.valueAsNumber);
    });
    document.getElementById("inputGridScale").addEventListener("input", function(e) {
        gridState.scale = gridState.initialScale = e.target.valueAsNumber;
    });
    document.getElementById("inputGridScaleMultiplier").addEventListener("input", function(e) {
        gridState.scaleIncrease = e.target.valueAsNumber;
    });
    document.getElementById("inputMaxFrames").addEventListener("input", function(e) {
        gridState.maxFrameNumber = e.target.valueAsNumber;
    });
    document.getElementById("inputMinBrightness").addEventListener("input", function(e) {
        minBrightness = e.target.valueAsNumber;
        document.getElementById("displayMinBrightness").innerHTML = minBrightness;
    });
    document.getElementById("inputMaxBrightness").addEventListener("input", function(e) {
        maxBrightness = e.target.valueAsNumber;
        document.getElementById("displayMaxBrightness").innerHTML = maxBrightness;
    });

	let azimuth = 0;
	let inclination = Math.PI/2;
	let dAzimuth = (Math.random() - 0.5) * Math.PI / 36;
	let dInclination = (Math.random() - 0.5) * Math.PI / 36;

	setInterval(function() {
		azimuth += dAzimuth;
		inclination += dInclination;
		let lightDirection = directionVector(azimuth, inclination);

		viewport.plotFunctionRGB((x, y) => {
			let normal = sphereNormal(2.5*(x-.5), 2.5*(-y+.5));
			if (normal) {
				let lat, long, coords;
				coords = sphereCoords(normal);
				[lat, long] = coords;
				let brightness = Math.max(dotProduct(normal, lightDirection), 0);
				let gridColor = textureMap(ctx, lat/Math.PI/2, long/Math.PI);
				//console.log(lat/Math.PI, long/Math.PI);
				brightness = minBrightness + (maxBrightness-minBrightness) * brightness;
				gridColor = gridColor.map(x => x*brightness);
				//return [brightness, brightness, brightness];
				
				//gridState.lineWidth = 1-gridColor[0];
				//console.log(gridColor, brightness, lat/Math.PI/2, long/Math.PI/2);
				let viewAsGrid = true;
				if (viewAsGrid) {
					return gridState.grid(lat/Math.PI/2, long/Math.PI/2, gridColor);
				} else {
					return gridColor;
				}
				
			} else {
				return [0, 0, 0]; //0xFFFF0000;
			}
			
		});
		gridState.incrementFrame();
	}, gridState.frameDelay);

}

window.onload=main;