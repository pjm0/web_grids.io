function floatColorToHex(colorRGB) {
    let colorHex = (0xFF000000 +
    Math.floor(colorRGB[0] * 255) * 0x00010000 +
    Math.floor(colorRGB[1] * 255) * 0x00000100 +
    Math.floor(colorRGB[2] * 255));
    return colorHex
}

function dotProduct(v1, v2) {
    return (v1[0] * v2[0] +
            v1[1] * v2[1] +
            v1[2] * v2[2]);
}


class Viewport {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.context = this.canvas.getContext("2d");
        this.initBuffer();
    }

    initBuffer() {
        this.img = this.context.createImageData(this.width, this.height);
        this.buffer = new Uint32Array(this.img.data.buffer);
    }

    // drawPixelRGB(x, y, colorRGB) {
    //     let colorHex = (0xFF000000 +
    //       Math.floor(colorRGB[0] * 255) * 0x00010000 +
    //       Math.floor(colorRGB[1] * 255) * 0x00000100 +
    //       Math.floor(colorRGB[2] * 255));

    //     this.buffer[x + y * this.width] = colorHex;
    // }

    drawPixel(x, y, color) {
        this.buffer[x + y * this.width] = color;
    }
    plotFunctionRGB(f) {
        for (let i=0; i<this.width; i++) {
            for (let j=0; j<this.height; j++) {
                let color = f(i/this.width, j/this.height);
                this.drawPixel(i, j, floatColorToHex(color));
            }
        }
        this.updateCanvas();
    }

    plotFunction(f) {
        for (let i=0; i<this.width; i++) {
            for (let j=0; j<this.height; j++) {
                let color = f(i/this.width, j/this.height);
                this.drawPixel(i, j, color);
            }
        }
        this.updateCanvas();
    }

    updateCanvas() {
        this.context.putImageData(this.img, 0, 0);
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.initBuffer();
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    get midX() {
        return this.canvas.width / 2;
    }

    get midY() {
        return this.canvas.height / 2;
    }
}