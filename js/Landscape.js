export default function Landscape(sites, crossingPointsArray, canvasWidth = 1000, canvasHeight = 800) {
    this.sites = sites;
    this.locuses = crossingPointsArray;
    this.center = {
        x: canvasWidth / 2,
        y: canvasHeight / 2
    };
    this.borders = [
        100, 200, 300
    ]
    this.lands = new Map([
        ['Океан', 0],
        ['Озеро', 1],
        ['Берег', 2],
        ['Лес', 3],
        ['Пустыня', 4],
        ['Гора', 5]
    ]);
    this.colors = new Map([
        [0, '#171e3c'],
        [1, '#336699'],
        [2, '#cbb688'],
        [3, '#7d9365'],
        [4, '#d0d5c1'],
        [5, '#e2e5d9']
    ]);
}

Landscape.prototype.init = function() {
    this.setLocusMiddleValue();
    this.generateMap();
    console.log(this.locuses);
    return this.locuses;
}

Landscape.prototype.setLocusMiddleValue = function() {
    this.locuses.forEach((locus) => {
        let summary = {x: 0, y: 0};
        locus.forEach((dot) => {
            summary.x += dot.x;
            summary.y += dot.y;
        });
        locus.center = {
            x: summary.x / locus.length,
            y: summary.y / locus.length
        };
    });
}

Landscape.prototype.generateMap = function() {
    this.generateOcean();
    this.generateLands();
    this.setNeighbors();
    this.generateSand();
}


Landscape.prototype.generateOcean = function() {
    this.locuses.forEach((locus, i) => {
        locus.color = this.colors.get(this.lands.get("Океан"));
    });
}

Landscape.prototype.setNeighbors = function() {
    this.locuses.forEach((locus1) => {
        locus1.neighbors = [];
        this.locuses.forEach((locus2) => {
            if(locus1 !== locus2) {
                for(let i = 0; i < locus1.length; i++) {
                    let foundFlag = 0;
                    for(let j = 0; j < locus2.length; j++) {
                        if(Math.round(locus1[i].x) == Math.round(locus2[j].x) && Math.round(locus1[i].y) == Math.round(locus2[j].y)) {
                            locus1.neighbors.push(locus2);
                            foundFlag = 1;
                            break;
                        }
                    }
                    if(foundFlag)
                        break;
                }
            }
        });
    });
}

Landscape.prototype.generateLands = function() {
    this.locuses.forEach((locus) => {
        this.generationChance(locus, "Лес");
    });
}

Landscape.prototype.generateSand = function() {
    this.locuses.forEach((locus) => {
        this.generationChance(locus, "Берег");
    });
}

Landscape.prototype.generationChance = function(locus, biom) {
    let resultColor = this.colors.get(this.lands.get(biom));
    let maximumChance = 100;
    let minimumChance = 100;
    switch (biom) {
        case "Берег":
            console.log(locus.neighbors);
            for(let i = 0; i < locus.neighbors.length; i++) {
                if(locus.neighbors[i].color == this.colors.get(this.lands.get("Океан")) && locus.color !== this.colors.get(this.lands.get("Океан"))) {
                    locus.color = resultColor;
                    break;
                }
            }
            break;
        case "Лес":
            if(
                Math.abs(locus.center.x - this.center.x) < this.borders[0] &&
                Math.abs(locus.center.y - this.center.y) < this.borders[0]
            )
                minimumChance = 0;
            else if(
                    Math.abs(locus.center.x - this.center.x) < this.borders[1] &&
                    Math.abs(locus.center.y - this.center.y) < this.borders[1]
                )
                minimumChance = 10;
            else if(
                    Math.abs(locus.center.x - this.center.x) < this.borders[2] &&
                    Math.abs(locus.center.y - this.center.y) < this.borders[2]
                )
                minimumChance = 70;
            if(Math.round(Math.random() * maximumChance) > minimumChance)
                locus.color = resultColor;
            break;
    }
}