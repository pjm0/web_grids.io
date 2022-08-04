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

    drawPixel(x, y, color) {
        this.buffer[x + y * this.width] = color;
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