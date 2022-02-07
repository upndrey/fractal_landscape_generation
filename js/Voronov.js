export default function Voronov(canvasWidth, canvasHeight, sitesCount, seed=2, maxCallStack=9999) {
    this.sitesCount = sitesCount;
    this.sites;
    this.locuses;
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.eps = 0.9;
    this.seed = seed;
    this.maxCallStack = maxCallStack;
}

Voronov.prototype.init = function() {
    let sites = this.generateSites();
    let locusesResult = this.generateLocuses();
    if(locusesResult == -1) {
        this.sites = undefined;
        this.locuses = undefined;
        return this.init();
    }
    let {linesArray, crossingPointsArray} = locusesResult;
    return {sites, linesArray, crossingPointsArray};
};

Voronov.prototype.generateSites = function() {
    let random = this.RandomMulberry32(this.seed);
    this.sites = [];
    this.sites = new Array(this.sitesCount).fill(null).map(() => {
        let site = {
            x: Math.round(random() * this.width),
            y: Math.round(random() * this.height)
        };
        return site;
    }, this)
    return this.sites;
}

Voronov.prototype.RandomMulberry32 = function (a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

Voronov.prototype.generateLocuses = function() {
    let regenerationFlag = 0;
    let linesArray = [];
    let crossingPointsArray = [];
    this.sites.forEach((siteA, ind) => {
        if(regenerationFlag)
            return;
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
                return A*(y-y0)-B*(x-x0);
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
                    y2: Y2,
                    func: lineFunc,
                    siteDirection: lineFunc(siteA.x, siteA.y)
                });
            }
        });
        linesArray.push(lines);
        let crossingPoints = [];
        
        crossingPoints.push({
            x: 0,
            y: 0
        });
        crossingPoints.push({
            x: this.width,
            y: 0
        });
        crossingPoints.push({
            x: 0,
            y: this.height
        });
        crossingPoints.push({
            x: this.width,
            y: this.height
        });
        lines.forEach((lineA) => {
            crossingPoints.push({
                x: lineA.x1,
                y: lineA.y1
            });
            crossingPoints.push({
                x: lineA.x2,
                y: lineA.y2
            });
            lines.forEach((lineB) => {
                if(lineA === lineB)
                    return;
                let x1 = lineA.x1;
                let y1 = lineA.y1;

                let x2 = lineA.x2;
                let y2 = lineA.y2;

                
                let x3 = lineB.x1;
                let y3 = lineB.y1;

                let x4 = lineB.x2;
                let y4 = lineB.y2;
                let x = ((x1*y2-x2*y1)*(x4-x3)-(x3*y4-x4*y3)*(x2-x1))/((y1-y2)*(x4-x3)-(y3-y4)*(x2-x1));
                let y = ((y3-y4)*x-(x3*y4-x4*y3))/(x4-x3);
                x *= -1;
                if(x >= 0 && x <= this.width && y >=0 && y <=this.height)
                    crossingPoints.push({
                        x,
                        y
                    });
            });
        });
        let resultCrossingPoints = [];
        crossingPoints.forEach((crossPoint) => {
            let isCorrectCrossPoint = true;
            lines.forEach((line) => {
                if(isCorrectCrossPoint == false)
                    return;
                    
                let crossPointDirection = line.func(crossPoint.x, crossPoint.y);
                // if(ind == 2 && Math.round(crossPoint.x) == 172)
                //     console.log(line.siteDirection, crossPointDirection, crossPoint)
                if(line.siteDirection >= 0 && Math.round(crossPointDirection) >= 0 || isNaN(crossPointDirection)) {
                    isCorrectCrossPoint = true;
                }
                else if(line.siteDirection <= 0 && Math.round(crossPointDirection) <= 0 || isNaN(crossPointDirection)) {
                    isCorrectCrossPoint = true;
                }
                else {
                    isCorrectCrossPoint = false;
                    
                }
            });
            if(isCorrectCrossPoint) {
                let hasPoint = false;
                for(let i = 0; i < resultCrossingPoints.length; i++) {
                    // if(ind == 29)
                    //     console.log(crossPoint, resultCrossingPoints[i])
                    if(
                        Math.abs(resultCrossingPoints[i].x - crossPoint.x) < this.eps &&
                        Math.abs(resultCrossingPoints[i].y - crossPoint.y) < this.eps
                    ){
                        // if(ind == 29)
                        //     console.log("deleted")
                        hasPoint = true;
                        break;
                    }
                }
                if(!hasPoint)
                    resultCrossingPoints.push(crossPoint);
            }
        });
        // if(ind == 29)
        //     console.log(crossingPoints, resultCrossingPoints)
        resultCrossingPoints = this.removeIntersections(resultCrossingPoints);
        if(resultCrossingPoints == -1) {
            regenerationFlag = 1;
            return;
        }
        crossingPointsArray.push(resultCrossingPoints);
    });
    if(regenerationFlag)
        return -1;
    return {linesArray, crossingPointsArray};
}

Voronov.prototype.removeIntersections = function(resultCrossingPoints) {
    let endFlag = 1;
    let callStack = 0;
    while(endFlag && callStack < this.maxCallStack) {
        callStack++;
        if(callStack == this.maxCallStack - 1) {
            console.log("stack fulled, rerender");
            return -1;
        }
        endFlag = 0;
        for(let i = 0; i < resultCrossingPoints.length - 1; i++) {
            for(let j = 0; j < resultCrossingPoints.length; j++) {
                if(i == j)
                    continue;
                if(resultCrossingPoints[j+1]) {
                    if(this.hasIntersection(
                        resultCrossingPoints[i].x, resultCrossingPoints[i].y, 
                        resultCrossingPoints[i+1].x, resultCrossingPoints[i+1].y, 
                        resultCrossingPoints[j].x, resultCrossingPoints[j].y, 
                        resultCrossingPoints[j+1].x, resultCrossingPoints[j+1].y, 
                        )) {
                        resultCrossingPoints = this.shuffle(resultCrossingPoints, j, j+1);
                        endFlag = 1;
                        break;
                    }
                }
                else {
                    if(this.hasIntersection(
                        resultCrossingPoints[i].x, resultCrossingPoints[i].y, 
                        resultCrossingPoints[i+1].x, resultCrossingPoints[i+1].y, 
                        resultCrossingPoints[j].x, resultCrossingPoints[j].y, 
                        resultCrossingPoints[0].x, resultCrossingPoints[0].y, 
                        )) {
                        resultCrossingPoints = this.shuffle(resultCrossingPoints, j, 0);
                        endFlag = 1;
                        break;
                    }
                }
            }
            if(endFlag)
                break;
        }
    }
    return resultCrossingPoints;
}

Voronov.prototype.hasIntersection = function(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2){
    let v1 = (bx2-bx1)*(ay1-by1)-(by2-by1)*(ax1-bx1);
    let v2 = (bx2-bx1)*(ay2-by1)-(by2-by1)*(ax2-bx1);
    let v3 = (ax2-ax1)*(by1-ay1)-(ay2-ay1)*(bx1-ax1);
    let v4 = (ax2-ax1)*(by2-ay1)-(ay2-ay1)*(bx2-ax1);
    return (v1*v2<0) && (v3*v4<0);
 }

 Voronov.prototype.shuffle = function(array, j1, j2) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }