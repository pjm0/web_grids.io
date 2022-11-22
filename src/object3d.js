const TOLERANCE = 10e-9;
class Ray {
	constructor(origin, direction) {
		this.origin = math.matrix(origin);
		this.origin.set([3], 1);
		this.direction = math.matrix(direction);
		this.direction.set([3], 1);
		this.unitVector = normalize(this.direction);
	}

	InterceptPosition(lambda) {
		//console.log("InterceptPosition(lambda)", lambda);
		return math.add(this.origin, math.multiply(lambda, this.direction));
	}
}

class Object3d {
	constructor() {
		this.initTransform();
		this.initInvTransform();
	}

	initTransform() {
		this.transform = math.identity(4);
	}

	initInvTransform() {
		this.invTransform = math.inv(this.transform);
	}

	setPosition(point3d) {
		for (let i=0; i<3; i++) {
			this.transform.set([3, i], point3d[i]);
		}
		this.initInvTransform();
	}

	rayTransform(ray) {
		ray = new Ray(ray.origin, ray.direction);
		ray.origin = math.multiply(ray.origin, this.invTransform);
		ray.direction.set([3], 0);
		ray.direction = math.multiply(ray.direction, this.invTransform);
		ray.direction.set([3], 1);
		return ray;
	}
}

class Plane extends Object3d {

}

class Sphere extends Object3d {
	intercept(ray) {
		let rayTransformed = this.rayTransform(ray);
	    //struct point3D p_a, p_c,;//*d,;
	    let A, B, C, D, lambda, a, b, n;

	    lambda = Infinity;

	    A = math.dot(rayTransformed.direction, rayTransformed.direction);
	    B = math.dot(rayTransformed.origin, rayTransformed.direction);
	    C = math.dot(rayTransformed.origin, rayTransformed.origin) - 1;
	    D =  (B * B) - (A * C);
	    D = -D;
	    //console.log("A, B, C, D", A, B, C, D);
	    if (D < -TOLERANCE) {
	    	return null;
	    } else if (D > TOLERANCE) { //console.log("// Two intercepts, choose closest positive one");
	        //fprintf(stderr, "%s\n", "Two intercepts, choose closest positive one");
	        let lambda_1, lambda_2;
	        lambda_1 = (-B / A) + (Math.sqrt(D) / A);
	        lambda_2 = (-B / A) - (Math.sqrt(D) / A);
	        if (lambda_1 > TOLERANCE) {
	            if (lambda_2 > TOLERANCE) {
	                lambda = Math.min(lambda_1, lambda_2);
	            } else {
	                lambda = lambda_1;
	            }
	        } else {
	            if (lambda_2 > TOLERANCE) {
	                lambda = lambda_2;
	            }
	        }

	    } else {//console.log("// D == 0, one intercept");
	        lambda = -B / A;
	        lambda = (lambda > 0) ? lambda : Infinity;
	    }

	    // Set  intercept point (ray at lambda) in world coords

	    // To get normal we need the intercept in obj coords
	    // Vector from sphere origin to intercept
	    if (lambda == Infinity) return null;
	    let p = ray.InterceptPosition(lambda);// rayPosition(r, lambda, p);

	    let canonical_p = rayTransformed.InterceptPosition(lambda);
	    // Set normal
	    n = canonical_p;
	    //normalTransform(n, n, sphere);
	    a = Math.atan2(canonical_p.py, canonical_p.px) / (2.0 * Math.PI);
	    if (a < 0) a += 1;
	    a = 1.0 - a;
	    b = Math.atan2(Math.sqrt(canonical_p[1] * canonical_p[1] + canonical_p[0] * canonical_p[0]), canonical_p[1]) / Math.PI;
	    if (b < 0) b += 1;
	    return normalize(n);
	    //fprintf(stderr, "a:%f b:%f atan2(p->py, p->px):%f atan2(sqrt(p->py * p->py + p->px * p->px), p->pz):%f\n", *a, *b, atan2(p->py, p->px), atan2(sqrt(p->py * p->py + p->px * p->px), p->pz));
	}
}





