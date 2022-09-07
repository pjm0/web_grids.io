function main() {
	viewport = new Viewport(document.querySelector("canvas"));
	gridState = new GridState(viewport);
    document.getElementById("inputNumAxes").addEventListener("input", function(e) {
        gridState.numAxes = e.target.valueAsNumber;
        document.getElementById("displayNumAxes").innerHTML = gridState.numAxes;
    });
    document.getElementById("inputLineWidth").addEventListener("input", function(e) {
        gridState.lineWidth = e.target.valueAsNumber;
        document.getElementById("displayLineWidth").innerHTML = gridState.lineWidth;
    });
    document.getElementById("inputCanvasSize").addEventListener("input", function(e) {
        document.getElementById("displayCanvasSize").innerHTML = e.target.valueAsNumber;
        viewport.resize(e.target.valueAsNumber, e.target.valueAsNumber);
    });
    document.getElementById("inputGridScale").addEventListener("input", function(e) {
        gridState.scale = gridState.initialScale = e.target.valueAsNumber;
    });
    document.getElementById("inputGridScaleMultiplier").addEventListener("input", function(e) {
        gridState.scaleIncrease = e.target.valueAsNumber;
    });
    document.getElementById("inputMaxFrames").addEventListener("input", function(e) {
        gridState.maxFrameNumber = e.target.valueAsNumber;
    });
	setInterval(function() {
		viewport.asyncPlot(gridState.grid.bind(gridState), 20);
		gridState.incrementFrame();
	}, gridState.frameDelay);

}

main();