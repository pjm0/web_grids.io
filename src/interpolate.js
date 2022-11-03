function linearInterpolate(progress, initialValue, finalValue) {
	return initialValue + progress * (finalValue - initialValue);
}

function cosineInterpolate(progress, initialValue, finalValue) {
	progress = 0.5 - 0.5 * Math.cos(Math.PI * progress);
	return linearInterpolate(progress, initialValue, finalValue);
}

function interpolateObjects(steps, initialObj, finalObj, interpolateFns) {
	let sequence = [];
	for (let i=0; i < steps; i++) {
		intermediateObject = {};
		for (const [key, initialValue] of Object.entries(initialObj)) {
			if (key in finalObj) {
				const finalValue = finalObj[key];
				let interpolateFn;
				if (key in interpolateFns) {
					interpolateFn = interpolateFns[key];
				} else {
					interpolateFn = linearInterpolate;
				}
				let progress = i / (steps - 1);
				intermediateObject[key] = interpolateFn(progress, initialValue, finalValue);
			} else {
				intermediateObject[key] = initialValue;
			}

		};
		sequence.push(intermediateObject);
	}

	return sequence;
}

function testInterpolate() {
	const initialObj = {x: 0,
				        y: 0,
				        z: -1,
				    	radius: 20};

	const finalObj = {x: -1,
				      y: 1,
				      z: 0};

	const steps = 101;
	const interpolateFns = {x: linearInterpolate,
				        y: cosineInterpolate};
	console.log(interpolateObjects(steps, initialObj, finalObj, interpolateFns));
}

testInterpolate();