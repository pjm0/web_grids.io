
function remainderDivide(a, b) {
    let q = Math.floor(a / b);
    let r = a - (b * q);
    return [q, r];
}

function fractionalComponent(n) {
    return n - Math.floor(n);
}

function colorAverage(colors) {
    let result = [0, 0, 0];
    let maxValue = 0;
    if (colors.length > 0) {
        for (let component = 0; component<3; component++) {
            for (let colorIndex = 0; colorIndex<colors.length; colorIndex++) {
                result[component] += colors[colorIndex][component];
            }
            // result[component] = Math.min(1, result[component]);
            // maxValue = Math.max(maxValue, result[component]);
        }
        for (let component = 0; component<3; component++) {
            // result[component] /= maxValue;
            // result[component] /= colors.length;
        }
    }
    return result;
}



class GridState {
    // constructor(axes) {
    //     this.xDivisions = xDivisions;
    //     this.yDivisions = yDivisions;
    // }

    getAxisFn(xDivisions, yDivisions) {
        return ((x, y) => {
            return 0.00*(fractionalComponent(xDivisions*x)+fractionalComponent(yDivisions*y));
        });
    }

    grid(x, y, color) { 
        for (let axis=0; axis<this.numAxes; axis++) {
            //TODO
        }
        return colorAverage(colors);
    }
}

function getAxisFn(xDivisions, yDivisions, whichRGB) {
    return ((x, y, texMapColor) => {
        let n = 2*Math.abs(fractionalComponent(xDivisions*x+yDivisions*y)-.5);
        //return [n*colorR, n*colorG, n*colorB];
        let color = [0, 0, 0];
        if (n<texMapColor[whichRGB]) {
            color[whichRGB] = 1;
        }
        // console.log("whichRGB, texMapColor, n, color", whichRGB, texMapColor, n, color);
        return color;
    });
}