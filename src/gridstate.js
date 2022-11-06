
function remainderDivide(a, b) {
    let q = Math.floor(a / b);
    let r = a - (b * q);
    return [q, r];
}

function colorAverage(colors) {
    let result = [0, 0, 0];
    let maxValue = 0;
    if (colors.length > 0) {
        for (let component = 0; component<3; component++) {
            for (let colorIndex = 0; colorIndex<colors.length; colorIndex++) {
                result[component] += colors[colorIndex][component];
            }
            result[component] = Math.min(1, result[component]);
            maxValue = Math.max(maxValue, result[component]);
        }
        for (let component = 0; component<3; component++) {
            result[component] /= maxValue;
        }
    }
    return result;
}

class GridState {
    constructor() {
        //this.gci = new GridControlInterface();
        this.numAxes = document.getElementById("inputNumAxes").valueAsNumber;
        this.updateGridAxisAngles();
        // this.lineWidth = document.getElementById("inputLineWidth").valueAsNumber;
        this.frameNumber = 0;
        this.maxFrameNumber = document.getElementById("inputMaxFrames").valueAsNumber;
        this.initialScale = document.getElementById("inputGridScale").valueAsNumber;
        this.scale = this.initialScale;
        this.scaleIncrease = document.getElementById("inputGridScaleMultiplier").valueAsNumber; 
        this.initialRotationAngle = 0;
        this.rotationAngle = this.initialRotationAngle;
        this.rotationSpeed = Math.PI/3600;
        this.distortionScaleFactor = .2;
        this.targetFPS = 60;
        this.frameDelay = 1000 / this.targetFPS;
        this.lastTimeStamp = NaN;
        this.canvasSize = Math.min(viewport.width, viewport.height);
        this.colors = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }

    incrementFrame() {
        document.getElementById("displayCurrentFrame").innerHTML = this.frameNumber.toString();
        document.getElementById("displayCurrentScale").innerHTML = this.scale.toString();
        this.rotationAngle += 2 * Math.PI * this.rotationSpeed;
        this.updateGridAxisAngles();
        //console.log(this.axisAngles);
        this.scale *= this.scaleIncrease;
        this.frameNumber++;
        if (this.frameNumber > this.maxFrameNumber) {
            this.frameNumber = 0;
            this.scale = this.initialScale;
        }
        this.currTimeStamp = Date.now();
        if (!isNaN(this.lastTimeStamp)) {
            document.getElementById("displayCurrentFPS").innerHTML = (1000/(this.currTimeStamp - this.lastTimeStamp)).toFixed(2);
        }
        this.lastTimeStamp = this.currTimeStamp;
        //console.log(this);
    }

    updateGridAxisAngles() {
        this.axisAngles = [];
        for (let i=0; i<this.numAxes; i++) {
            this.axisAngles.push(this.rotationAngle + i * Math.PI / this.numAxes);
        }
    }

    grid(x, y, color) { 

        x -= 0.5;
        y -= 0.5;
        let coords = [];
        for (let i=0; i<this.axisAngles.length; i++) {
            let angle = this.axisAngles[i];
            let component = (x * Math.cos(angle) + y * Math.sin(angle)) * this.scale;
            coords.push(component);
        }

        //console.log(coords, this.axisAngles);
        let colorIndex = -1;
        let cellIndex = 0;
        //let cellCoords = [];
        let colors = [];

        for (let axis=0; axis<this.numAxes; axis++) {
            let n = coords[axis];
            let quotient;
            let remainder;
            let divisionResults = remainderDivide(n, 1);
            quotient = divisionResults[0];
            remainder = divisionResults[1];
            //cellCoords.push(quotient);
            //console.log(divisionResults, this.lineSpacing, this.lineWidth);
            let lineWidth = 1-color[axis % this.colors.length];
            if (remainder < lineWidth / 2 ||
                remainder > 1 - lineWidth / 2) {
                //colors.push([0, 0, 0]);
                //colorIndex = (colorIndex + axis + 1) % this.colors.length;
            } else {
                colors.push(this.colors[axis % this.colors.length]);
                //cellIndex += Math.abs(quotient);
            }
        }
        //console.log(colors, colorAverage(colors));
        return colorAverage(colors);
        // if (colorIndex >=0) {
        //     return [0, 0, 0];
        // } else {
        //     return [1, 1, 1];//cellCoordsToRGB(cellCoords);
        //     //return this.colors[0];
        // }
    }
}