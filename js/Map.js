import Voronov from './Voronov.js';
import Landscape from './Landscape.js';

export default function Map(canvasId='canvas', controlsId='controls') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.controls = document.getElementById(controlsId);
    this.width = this.canvas.getBoundingClientRect().width;
    this.height = this.canvas.getBoundingClientRect().height;
}

Map.prototype.init = function() {
    let voronov = new Voronov(this.width, this.height, 100);
    const {sites, linesArray, crossingPointsArray} = voronov.init();
    
    let landscape = new Landscape(sites, crossingPointsArray, this.width, this.height);
    const locuses = landscape.init();
    this.draw.call(this, sites, linesArray, locuses);
}

Map.prototype.draw = function(sites, linesArray, crossingPointsArray) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    //ctx.strokeRect(0, 0, this.width, this.height);
    this.drawSites(sites);
    //this.drawLines(linesArray);
    this.drawCrossingPoints(crossingPointsArray);
}

Map.prototype.drawSites = function(sites) {
    const ctx = this.ctx;
    sites.forEach((site, i) => {
        ctx.fillStyle = "red";
        ctx.fillRect(site.x - 2, site.y - 2, 5, 5);
        // ctx.font = 'bold 30px sans-serif';
        // ctx.strokeText(
        //     `${i}`, 
        //     site.x - 30, 
        //     site.y);
    });
}

Map.prototype.drawLines = function(linesArray) {
    const ctx = this.ctx;
    linesArray.forEach((lines) => {
        lines.forEach((line) => {
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
            ctx.strokeStyle = "#000";
            ctx.closePath();
        });
    });
}


Map.prototype.drawCrossingPoints = function(crossingPointsArray) {
    const ctx = this.ctx;
    //console.log(crossingPointsArray);
    crossingPointsArray.forEach((crossingPoints, ind) => {
        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.fillStyle = crossingPoints.color;
        ctx.moveTo(crossingPoints[0].x, crossingPoints[0].y);
        crossingPoints.forEach((crossingPoint, i) => {
            if(i != 0) 
                ctx.lineTo(crossingPoint.x, crossingPoint.y);
                // ctx.fillRect(crossingPoint.x-2, crossingPoint.y-2, 5, 5);
                // ctx.fillStyle = "red";
                // if(ind == 29) {
                //     ctx.font = 'bold 25px sans-serif';
                //     ctx.strokeText(
                //         `(${Math.round(crossingPoint.x)}, ${Math.round(crossingPoint.y)})`, 
                //         crossingPoint.x - 30, 
                //         crossingPoint.y);
                // }
        });
        ctx.lineTo(crossingPoints[0].x, crossingPoints[0].y);
        // if(ind == 2) 
            ctx.fill();
        ctx.stroke();
        ctx.closePath();
    });
}
