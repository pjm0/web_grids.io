class Viewport {
    constructor() {
        this.canvas = document.querySelector("canvas");
        // this.context = this.canvas.getContext("2d");
        this.context = this.canvas.getContext("webgl");
        this.initBuffer();
    }

    initBuffer() {
        this.buffer = this.context.createBuffer();
        this.context.drawingBufferHeight(this.height);
        this.context.drawingBufferWidth(this.width);
    }

    drawPixel(x, y, color) {
        // Look up have to use bufferData() method to set buffer.
        this.buffer[x + y * this.width] = color;
    }

    asyncPlot(f, numBands = 5) {
        const bandX = Math.ceil(this.width / numBands);

        let startX = 0;

        const plotBand = () => {
            console.log("plot band");
            const nextX = startX + bandX;
            for (let x = startX; x < this.width && x < nextX; x++) {
                for (let y = 0; y < this.height; y++) {
                    let color = f(x / this.width, y / this.height);
                    this.drawPixel(x, y, color);
                }
            }
            startX = nextX;

            const finished = nextX >= this.width;

            return finished ? true : false;
        };

        let finished = false;
        const bands = [];
        let counter = 1;
        while (finished === false || counter > 50) {
            console.log("while loop. counter: ", counter);
            const promise = new Promise((resolve, reject) => {
                finished = plotBand();
                resolve();
            });
            bands.push(promise);
            counter++;
        }

        return Promise.all(bands).then((res) => this.updateCanvas());
    }

    // plotFunction(f) {
    // for (let x = 0; x < this.width; x++) {
    //     for (let y = 0; y < this.height; y++) {
    //         let color = f(x / this.width, y / this.height);
    //         this.drawPixel(x, y, color);
    //     }
    // }
    // asyncPlot(f).then((res) => this.updateCanvas());
    // }

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