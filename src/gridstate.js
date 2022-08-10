
function remainderDivide(a, b) {
    let q = Math.floor(a / b);
    let r = a - (b * q);
    return [q, r];
}

function cellCoordsToRGB(cellCoords) {
    let color = 0xFF000000;
    for (let i = 0; i<3; i++) {
        color += ((cellCoords[i]*127 + 128) % 256) << (8 * (2-i));
    }
    return color;
}

class GridState {
    constructor() {
        //this.gci = new GridControlInterface();
        this.numAxes = document.getElementById("inputNumAxes").valueAsNumber;
        this.updateGridAxisAngles();
        this.lineWidth = document.getElementById("inputLineWidth").valueAsNumber;
        this.frameNumber = 0;
        this.maxFrameNumber = document.getElementById("inputMaxFrames").valueAsNumber;
        this.initialScale = document.getElementById("inputGridScale").valueAsNumber;
        this.scale = this.initialScale;
        this.scaleIncrease = document.getElementById("inputGridScaleMultiplier").valueAsNumber; 
        this.initialRotationAngle = 0;
        this.rotationAngle = this.initialRotationAngle;
        this.rotationSpeed = 0.001;
        this.distortionScaleFactor = .2;
        this.targetFPS = 60;
        this.frameDelay = 1000 / this.targetFPS;
        this.lastTimeStamp = NaN;
        this.canvasSize = Math.min(viewport.width, viewport.height);
        this.colors = [0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFF00FFFF, 0xFFFF00FF, 0xFFFFFF00, 0xFF000000];



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

    grid(x, y) { 

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
        let cellCoords = [];

        for (let axis=0; axis<this.numAxes; axis++) {
            let n = coords[axis];
            let quotient;
            let remainder;
            let divisionResults = remainderDivide(n, 1);
            quotient = divisionResults[0];
            remainder = divisionResults[1];
            cellCoords.push(quotient);
            //console.log(divisionResults, this.lineSpacing, this.lineWidth);
            if (remainder < this.lineWidth / 2 ||
                remainder > 1 - this.lineWidth / 2) {
                colorIndex = (colorIndex + axis + 1) % this.colors.length;
            } else {
                cellIndex += Math.abs(quotient);
            }
        }
        if (colorIndex >=0) {
            return this.colors[colorIndex];
        } else {
            return cellCoordsToRGB(cellCoords);
            //return this.colors[0];
        }
    }
}