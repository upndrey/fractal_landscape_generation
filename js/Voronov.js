export default function Voronov(canvasWidth, canvasHeight) {
    this.sites;
    this.locuses;
    this.width = canvasWidth;
    this.height = canvasHeight;
}

Voronov.prototype.init = function() {
};

Voronov.prototype.generateSites = function(sitesCount) {
    this.sites = [];
    this.sites = new Array(sitesCount).fill(null).map(() => {
        let site = {
            x: Math.round(Math.random() * this.width),
            y: Math.round(Math.random() * this.height)
        };
        return site;
    }, this)
    console.log(this.sites);
    return this.sites;
}

Voronov.prototype.generateLocuses = function() {
    let linesArrays = [];
    this.sites.forEach((siteA) => {
        let lines = []; // уравнения прямых серединных перпендикуляров для отрезков между сайтом и остальными сайтами
        this.sites.forEach((siteB) => {
            if(siteA === siteB) {
                return;
            }
            const x0 = (siteA.x + siteB.x) / 2;
            const y0 = (siteA.y + siteB.y) / 2;
            const A = (siteA.y - siteB.y) / (siteA.x - siteB.x);
            const B = -1;
            let lineFunc = function(x, y) {
                return A*(y-y0)-B*(x-x0) == 0;
            };
            let lineFuncX = function(y) {
                return A*(y-y0) / B + x0;
            };
            let lineFuncY = function(x) {
                return B*(x-x0) / A + y0;
            };

            let var2 = -1;
            let X1, X2, Y1, Y2;
            if(lineFuncX(0) >= 0 && lineFuncX(0) <= this.width) {
                X1 = lineFuncX(0);
                Y1 = 0;
                var2 = 0;
            }
            else if(lineFuncX(this.height) >= 0 && lineFuncX(this.height) <= this.width) {
                X1 = lineFuncX(this.height);
                Y1 = this.height;
                var2 = 1;
            }
            else if(lineFuncY(0) >= 0 && lineFuncY(0) <= this.height) {
                X1 = 0;
                Y1 = lineFuncY(0);
                var2 = 2;
            }
            else if(lineFuncY(this.width) >= 0 && lineFuncY(this.width) <= this.height) {
                X1 = this.width;
                Y1 = lineFuncY(this.width);
                var2 = 3;
            }

            if(lineFuncX(0) >= 0 && lineFuncX(0) <= this.width && var2 !== 0) {
                X2 = lineFuncX(0);
                Y2 = 0;
            }
            else if(lineFuncX(this.height) >= 0 && lineFuncX(this.height) <= this.width && var2 !== 1) {
                X2 = lineFuncX(this.height);
                Y2 = this.height;
            }
            else if(lineFuncY(0) >= 0 && lineFuncY(0) <= this.height && var2 !== 2) {
                X2 = 0;
                Y2 = lineFuncY(0);
            }
            else if(lineFuncY(this.width) >= 0 && lineFuncY(this.width) <= this.height && var2 !== 3) {
                X2 = this.width;
                Y2 = lineFuncY(this.width);
            }
            if(siteA !== siteB) {
                lines.push({
                    x1: X1,
                    y1: Y1,
                    x2: X2,
                    y2: Y2
                });
            }
        });
        console.log(lines);
        linesArrays.push(lines);
        let crossingPoints = [];
    });
    return linesArrays;
}
