function sphereNormal(x, y) {
	let z = Math.sqrt(1 - (x * x + y * y));
	if (!isNaN(z)) {
		return [x, y, z];
	} else {
		return null;
	}
	
}

function sphereCoords(normal) {
	let x, y, z;
	[x, y, z] = normal;
	let latitude = Math.atan2(y, x);
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

function main() {
	viewport = new Viewport(document.querySelector("canvas"));
	gridState = new GridState(viewport);
	console.log(viewport);
	    document.getElementById("inputCanvasSize").addEventListener("input", function(e) {
        document.getElementById("displayCanvasSize").innerHTML = e.target.valueAsNumber;
        viewport.resize(e.target.valueAsNumber, e.target.valueAsNumber);
    });
	let azimuth = 0;
	let inclination = Math.PI/2;
	let dAzimuth = 0;
	let dInclination = 0;
	setInterval(function() {
		dAzimuth += (Math.random() - 0.5) * Math.PI / 36;
		dInclination += (Math.random() - 0.5) * Math.PI / 36;
		azimuth += dAzimuth;
		inclination += dInclination;
		let lightDirection = directionVector(azimuth, inclination);

		viewport.plotFunctionRGB((x, y) => {
			let normal = sphereNormal(2.5*(x-.5), 2.5*(y-.5));
			//console.log(normal);
			//let lat, long = sphereCoords(normal);
			if (normal) {
				let lat, long, coords;
				coords = sphereCoords(normal);
				[lat, long] = coords;
				//console.log(lat, long);
				let brightness = Math.max(dotProduct(normal, lightDirection), 0);
				return [brightness, brightness, brightness];
				// if (Math.round(30 * lat / Math.PI) % 2 == 0) {
				// 	return ;
				// } else {
				// 	return 0xFFFFFFFF;
				// }
				
			} else {
				return [0, 0, 0]; //0xFFFF0000;
			}
			
		});
		//gridState.incrementFrame();
	}, gridState.frameDelay);

}

main();