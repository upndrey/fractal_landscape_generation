import Voronov from './Voronov.js';

export default function Map(canvasId='canvas', controlsId='controls') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.controls = document.getElementById(controlsId);
    this.width = this.canvas.getBoundingClientRect().width;
    this.height = this.canvas.getBoundingClientRect().height;
}

Map.prototype.init = function() {
    let voronov = new Voronov(this.width, this.height);
    const sites = voronov.generateSites(3);
    const linesArray = voronov.generateLocuses();
    this.draw.call(this, sites, linesArray);
    //setInterval(this.draw.bind(this, sites, linesArray), 20);
}

Map.prototype.draw = function(sites, linesArray) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.strokeRect(0, 0, this.width, this.height);
    this.drawSites(sites);
    this.drawLines(linesArray);
}

Map.prototype.drawSites = function(sites) {
    const ctx = this.ctx;
    sites.forEach((site) => {
        ctx.fillRect(site.x, site.y, 2, 2);
        ctx.fillStyle = "#000";
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