let cos = Math.cos;
let sin = Math.sin;

function sphereNormal(x, y) {
	let z = -Math.sqrt(1 - (x * x + y * y));
	if (!isNaN(z)) {
		return math.matrix([x, z, y, 1]);
	} else {
		return null;
	}
}

function rotateAroundX(theta) {
	return math.matrix([[1, 0, 0, 1],
			[0, cos(theta), -sin(theta), 1],
			[0, sin(theta), cos(theta), 1],
			[1, 1, 1, 1]]);
}

function rotateAroundY(theta) {
	return math.matrix([[cos(theta), 0, sin(theta), 1, 1],
		     [0, 1, 0, 1],
		     [-sin(theta), 0, cos(theta), 1],
		     [1, 1, 1, 1]]);
}

function rotateAroundZ(theta) {
	return math.matrix([[cos(theta), -sin(theta), 0, 1],
			 [sin(theta), cos(theta), 0, 1],
			 [0, 0, 1, 1],
			 [1, 1, 1, 1]]);
}

function vec1x3To1x4(vectorArray) {
	return [...vectorArray, 1];
}

function vec1x4To1x3(vec1x4) {
	return math.array(vec1x4);
}

function sphereCoords(normal) {
	normal = math.matrix(normal);
	console.log(normal);
	let x, y, z;
	//[x, y, z] = normal;
	x = normal.get([0]);
	y = normal.get([1]);
	z = normal.get([2]);
	console.log("x, y, z", x, y, z);
	let latitude = Math.atan2(y, x);
	if (latitude < 0) latitude += 2 * Math.PI;
	//if (latitude > 2 * Math.PI) latitude -= 2 * Math.PI;
	let longitude = Math.acos(z);
	return [latitude, longitude];
}
function sphereTexCoords(x, y) {
	normal = sphereNormal(2*(x-.5), 2*(y-.5));
	//console.log(normal);
	if (normal) {
		let z;
		//[x, y, z] = normal;
		x = normal.get([0]);
		y = normal.get([1]);
		z = normal.get([2]);
		//console.log("x, y, z", x, y, z);
		let latitude = Math.atan2(y, x);
		if (latitude < 0) latitude += 2 * Math.PI;
		//if (latitude > 2 * Math.PI) latitude -= 2 * Math.PI;
		let longitude = Math.acos(z);
		let textureX = latitude / (2*Math.PI);
		let textureY = 1 - longitude / Math.PI;

		return [textureX, textureY];
	} else {
		return null;
	}
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

function textureMapFloat(imgData, width, height, x, y) {
	x = Math.min(x, 1);
	x = Math.max(x, 0);
	y = Math.min(y, 1);
	y = Math.max(y, 0);
	let imgX = Math.round(x * (width - 1));
	let imgY = Math.round(y * (height - 1));
	let n = (imgX + width * imgY)*4;
	let R, G, B;
	[ R, G, B] = [imgData[n+2], imgData[n+1], imgData[n]];
	let rawColor = [ R, G, B];
	let color = [];
	for (let i=0; i<3; i++) {
		color.push(rawColor[i]/255);
	}
	// console.log("rawColor, color", rawColor, color);
	return rawColor.map((d)=>d/255);
}

function normalize(v) {
    var len = math.distance([0, 0, 0], math.resize(v, [3]));
    return math.map(v, x => x / len);
}

function vectorTo(point1, point2) {
	// console.log("vectorTo(point1, point2)", point1, point2)
	result = [0, 0, 0, 1];
	for (let i=0; i<3; i++) {
		result[i] = point2.get([i]) - point1.get([i]);
		// console.log("i, point2.get([i]) - point1.get([i]), result[i]", i, point2.get([i]), point1.get([i]), result[i]);
	}
	// console.log("result, math.matrix(result)", result, math.matrix(result));
	return result;
}

class Camera {
	constructor(eye, gaze_pt, origin_2d, f){
	    let w = [];
	    this.eye = math.matrix(eye);
	    // this.eye.set([3], 1);
	    // console.log(eye_spherecoords, eye);
	    this.gaze_pt = gaze_pt;
	    // this.gaze_pt.set([3], 1);
	    this.f = f;
	    eye.forEach(function(value, i) {
	        w.push(gaze_pt[i] - value);
	    });
	    w = normalize(w);
	    console.log(w);
	    let u = normalize(math.cross(w, [0, 1, 0]));
	    let v = normalize(math.cross(u, w));
	    let w2c = [u, v, w];
	    let c2w = [];
	    u.forEach(function (item, index) {
	        c2w.push([item, v[index], w[index], eye[index]]);
	    });
	    c2w.push([0, 0, 0, 1]);
	    w2c.forEach(function (item, index) {
	        w2c[index].push(-math.dot([u, v, w][index], eye));
	    });
	    w2c.push([0, 0, 0, 1]);
	    this.w2c = math.matrix(w2c);
	    this.c2w = math.matrix(c2w);
	}

    imgCoords(point3d, origin3d) {
        point3d = point3d.map(x => [x]);
        if (point3d.length == 3) {
            point3d.push([1]);
        }

        let result = math.multiply(this.w2c, point3d);
        if (result[2] < this.f) {
            //throw "Behind view plane";
        }
        result = result.map(x => (x * this.f / result[2]));
        if (isNaN(result[0]) || isNaN(result[1])
                || !isFinite(result[0]) || !isFinite(result[1])) {
            throw "Bad img coords";
        }
        result =  (result[0] +origin3d[0], result[1] +origin3d[1]);
        //console.log(result);
        return result;
    };

    worldCoords(x, y) {
    	let point3d = math.matrix([x, y, this.f, 1]);
    	// console.log(point3d);
    	// console.log(x, y, this.c2w, point3d);
    	return math.multiply(this.c2w, point3d);
    }
    cameraCoords(point3d) {
    	point3d = math.matrix(point3d);
    	point3d.set([3], 1);
    	// console.log(point3d);
    	// console.log(x, y, this.c2w, point3d);
    	return math.multiply(this.w2c, point3d);
    }

    ray(x, y) {
    	let rayOrigin = this.worldCoords(x, y);
    	let rayDirection = vectorTo(rayOrigin, this.eye);
    	// let rayDirection = vectorTo(rayOrigin, this.eye);
    	// console.log("this.eye, rayOrigin, vectorTo(this.eye, rayOrigin)", this.eye, rayOrigin, vectorTo(this.eye, rayOrigin));
    	return new Ray(rayOrigin, rayDirection);
    }
}

