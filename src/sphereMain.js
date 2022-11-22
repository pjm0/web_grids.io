function main() {

	//return;
	// let testRay2 = camera.ray([0, 0, 10, 1], [0, 0, -10, 1]);
	// console.log("testRay2, sphere.intercept(testRay2)", testRay, sphere.intercept(testRay));

	viewport = new Viewport(document.querySelector("canvas"));
	gridState = new GridState(viewport);
    // let minBrightness = document.getElementById("inputMinBrightness").valueAsNumber;
	// let maxBrightness = document.getElementById("inputMaxBrightness").valueAsNumber;
	// let focalLength = document.getElementById("inputFocalLength").valueAsNumber;
	// let cameraDistance = document.getElementById("inputCameraDistance").valueAsNumber;
	// let camera = new Camera([0, 0, cameraDistance], [0, 0, 0], [0, 0], focalLength);
	// let sphere = new Sphere();
	// let testRay = camera.ray(0, 0);
	// console.log("testRay, sphere.intercept(testRay)", testRay, sphere.intercept(testRay));
	// camera2 = new Camera([0, 0, -10], [0, 0, 0], [0, 0], 5);
	// let sphere2 = new Sphere();
	// let testRay2 = camera2.ray(0, 0);
	const c = document.getElementById("texture");
	c.style.display = "none";
	console.log(c);
	const ctx = c.getContext("2d");
	ctx.willReadFrequently = true;
	const image = new Image();
	image.style.display = "none";
	// image.src = "img/jup0vss1.jpg";
	//image.src = "img/Map_of_the_full_sun.jpg";
	//image.src = "img/lroc_color_poles_1k.jpg";
	image.src = "img/2k_earth_daymap.jpg";

	document.querySelector('body').appendChild(image);
	let imageData;// = loadImage(url);
	let greyscaleEnabled = false;
	let testTexMap = false;
	let texMapEnabled = true;
	let viewAsGrid = false;
	let gridDivisionsX;
	let gridDivisionsY;

	image.onload = function () {
		gridDivisionsX = document.getElementById("inputGridDivisionsX").valueAsNumber;
		gridDivisionsY = document.getElementById("inputGridDivisionsY").valueAsNumber;

		c.height = image.height;
		c.width = image.width;
		console.log(image.height, image.width, c.height, c.width);
		ctx.drawImage(image, 0, 0);
		//var imgData = ctx.getImageData(0, 0, c.width, c.height);
		imageData = ctx.getImageData(0, 0, c.width, c.height)["data"];
		console.log(imageData);
	    console.log("imageData[0], imageData[1], imageData[2]", imageData[0], imageData[1], imageData[2]);
	    console.log("textureMap(imageData, c.width, c.height, 0, 0)", textureMapFloat (imageData, c.width, c.height, 0, 0));

	}
	// console.log(textureMap(ctx, 0.5, 0.5));
	// document.getElementById("inputNumAxes").addEventListener("input", function(e) {
    //     gridState.numAxes = e.target.valueAsNumber;
    //     document.getElementById("displayNumAxes").innerHTML = gridState.numAxes;
    // });
    document.getElementById("inputCanvasSize").addEventListener("input", (e)=>{
        document.getElementById("displayCanvasSize").innerHTML = e.target.valueAsNumber;
        viewport.resize(e.target.valueAsNumber, e.target.valueAsNumber);
    });
    document.getElementById("inputGridDivisionsX").addEventListener("onload", (e)=>{
    	gridDivisionsX = e.target.valueAsNumber;
    });
    document.getElementById("inputGridDivisionsX").addEventListener("input", (e)=>{
        gridDivisionsX = e.target.valueAsNumber;
    document.getElementById("displayGridDivisionsX").innerHTML = gridDivisionsX;
    });

    document.getElementById("inputGridDivisionsY").addEventListener("onload", (e)=>{
    	gridDivisionsY = e.target.valueAsNumber;
    });
    document.getElementById("inputGridDivisionsY").addEventListener("input", (e)=>{
        gridDivisionsY = e.target.valueAsNumber;
    document.getElementById("displayGridDivisionsY").innerHTML = gridDivisionsY;
    });

    // document.getElementById("inputGridScale").addEventListener("input", function(e) {
    //     gridState.scale = gridState.initialScale = e.target.valueAsNumber;
    // });
    // document.getElementById("inputGridScaleMultiplier").addEventListener("input", function(e) {
    //     gridState.scaleIncrease = e.target.valueAsNumber;
    // });
    // document.getElementById("inputMaxFrames").addEventListener("input", function(e) {
    //     gridState.maxFrameNumber = e.target.valueAsNumber;
    // });
    // document.getElementById("inputMinBrightness").addEventListener("input", function(e) {
    //     minBrightness = e.target.valueAsNumber;
    //     document.getElementById("displayMinBrightness").innerHTML = minBrightness;
    // });
    // document.getElementById("inputMaxBrightness").addEventListener("input", function(e) {
    //     maxBrightness = e.target.valueAsNumber;
    //     document.getElementById("displayMaxBrightness").innerHTML = maxBrightness;
    // });

    // document.getElementById("inputFocalLength").addEventListener("input", function(e) {
    //     focalLength = e.target.valueAsNumber;
    //     document.getElementById("displayFocalLength").innerHTML = focalLength;
    //     camera = new Camera([0, 0, cameraDistance], [0, 0, 0], [0, 0], focalLength);
    // });

    // document.getElementById("inputCameraDistance").addEventListener("input", function(e) {
    //     cameraDistance = e.target.valueAsNumber;
    //     document.getElementById("displayCameraDistance").innerHTML = cameraDistance;
    //     camera = new Camera([0, 0, cameraDistance], [0, 0, 0], [0, 0], focalLength);
    // });
    // document.getElementById("greyscaleActive").addEventListener("input", function(e) {
    //     greyscaleEnabled = true; 
	// 	testTexMap = false;
	// 	texMapEnabled = false;
	// 	viewAsGrid = false;
    // })
    // document.getElementById("testTexMap").addEventListener("input", function(e) {
    //     greyscaleEnabled = false; 
	// 	testTexMap = true;
	// 	texMapEnabled = false;
	// 	viewAsGrid = false;    });
        
    // document.getElementById("texMap").addEventListener("input", function(e) {
    //     greyscaleEnabled = false; 
	// 	testTexMap = false;
	// 	texMapEnabled = true;
	// 	viewAsGrid = false;
    // });
        
    // document.getElementById("grid").addEventListener("input", function(e) {
    //     greyscaleEnabled = false; 
	// 	testTexMap = false;
	// 	texMapEnabled = true;
	// 	viewAsGrid = true;
    // });
        

	let azimuth = 0;
	let inclination = Math.PI/2;
	let dAzimuth = 0.125*Math.PI//(Math.random() - 0.5) * Math.PI / 36;
	let dInclination = 0.125*Math.PI//(Math.random() - 0.5) * Math.PI / 36;

	// const texMapEnabled =  true;
	let textureXShift = .6;
	let textureYShift = 0;
	setInterval(function() {
		//azimuth += dAzimuth;
		//inclination += dInclination;
		let lightDirection = directionVector(azimuth, inclination);
		textureXShift -= .001;
		if (textureXShift>1) textureXShift -= 1;
		viewport.plotFunctionRGB((x, y)=>{
			let normal = sphereNormal(x, y);
			// normal = vec1x3To1x4(normal);
			let rotateMatrix = rotateAroundZ(2 * Math.PI*Math.random());
			// normal = math.multiply(normal, rotateMatrix);
			let texCoords = sphereTexCoords(x, y);
			if (texCoords) {
				let textureX, textureY;
				[textureX, textureY] = texCoords;

				textureX += textureXShift;
				if (textureX>1) textureX -= 1;


				textureY -= textureYShift;
				if (textureY<0) textureY += 1;

				let texMapColor = [255, 255, 255];
				// console.log(textureX, textureY);
				if (texMapEnabled && imageData) {
					try {
						texMapColor = textureMapFloat(imageData, c.width, c.height, textureX, textureY);
						// console.log("texMapColor", texMapColor);
						// return texMapColor;
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

			} else {
				return [0, 0, 0];
			}
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
	}, 1000/30);

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