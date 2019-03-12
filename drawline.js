var pointArray; //save point objects
var lastX, lastY;
var canvas;
var ctx;
var firstPointSelected; //indicate if there is a point at least

//init canvas & context
window.onload = function() {
    canvas = document.getElementById("dlCanvas");
    ctx = canvas.getContext("2d");
    ctx.lineWidth = 3;
    canvas.addEventListener("click", onMouseClick, false);
    clearPoints();
};

function onMouseClick(e){
    //console.log("clicked");
    lastX = e.pageX - canvas.offsetLeft; //x in canvas
    lastY = e.pageY - canvas.offsetTop; //y in canvas
    pointArray.push({x:lastX, y:lastY}); //add point
    if(!firstPointSelected){
		//first point, move to the first click
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        firstPointSelected = true;
    } else {
		//there are points, draw from last to current click
        ctx.lineTo(lastX, lastY);
        ctx.stroke();
    }
}

function savePoints(){
    localStorage.setItem("savedPoints", JSON.stringify(pointArray));
    //localStorage.savedPoints = pointArray;
}

function loadPoints(){
    clearPoints();
    pointArray = JSON.parse(localStorage.getItem("savedPoints"));
    reDraw();
}

//clear all existing points from canvas, prefill the canvas with an image
function clearPoints(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    firstPointSelected = false;
    var sample = document.getElementById("sample_map");
    ctx.drawImage(sample, 0, 0);
    pointArray = new Array();
}

//re draw all points when load from storage/file
function reDraw(){
    if(pointArray.length > 1) { //move forward only if there is a line (2 points)
        var point = pointArray[0]; //first point
        lastX = point.x;
        lastY = point.y;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        for(var i = 1; i < pointArray.length; i++) { //following points
            point = pointArray[i];
            lastX = point.x;
            lastY = point.y;
            ctx.lineTo(lastX, lastY);
        }
        ctx.stroke();
        firstPointSelected = true;
    }
}

//save points to file in user disk
function savePointsFile(){
    download(JSON.stringify(pointArray), "points", "text/plain");
}

//user upload points from a file
function loadPointsFile(file){
    //console.log(file);
    clearPoints();
    var fileReader = new FileReader();
    fileReader.addEventListener("loadend", function(e){
        pointArray = JSON.parse(fileReader.result);
        reDraw();
    });
    fileReader.readAsText(file);
}

//util function to donwload file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
