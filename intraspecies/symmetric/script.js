const WIDTH = 1000;
const HEIGHT = 600;

const POPULATION_INIT = 30;
const HAWK_INIT = 15;
const DOVE_INIT = POPULATION_INIT - HAWK_INIT;

let avgProportion = HAWK_INIT / DOVE_INIT;

let totalPopulation = [POPULATION_INIT];
let hawkPopulation = [HAWK_INIT];
let dovePopulation = [DOVE_INIT];

let population = []

let hawkPoints = 0;
let dovePoints = 0;

function showParameters() {
    createDiv("Population size: <span class='value'>" + POPULATION_INIT + "</span>").id("population-size");
    createDiv("Hawk members:    <span class='value'>" + HAWK_INIT + "</span>").id("hawk-members");
    createDiv("Dove members:    <span class='value'>" + DOVE_INIT + "</span>").id("dove-members");
    createDiv("Proportion H/D:  <span class='value'>" + (HAWK_INIT / DOVE_INIT) + "</span>").id("proportion");
    createDiv("Avg. Proportion H/D:  <span class='value'>" + avgProportion + "</span>").id("avg-proportion");
    createDiv("Generations:  <span class='value'>" + drawCall + "</span>").id("generations");
}

function updateValues() {
    let populationNode = select(".value", "#population-size");
    let hawksNode = select(".value", "#hawk-members");
    let dovesNode = select(".value", "#dove-members");
    let proportionNode = select(".value", "#proportion");
    let generationsNode = select(".value", "#generations");
    let avgNode = select(".value", "#avg-proportion");
    avgProportion =
        (
            avgProportion * (drawCall - 1) +
            (hawkPopulation[hawkPopulation.length - 1] / dovePopulation[dovePopulation.length - 1])
        ) / (drawCall)

    populationNode.html(population.length);
    hawksNode.html(hawkPopulation[hawkPopulation.length - 1]);
    dovesNode.html(dovePopulation[dovePopulation.length - 1]);
    proportionNode.html((hawkPopulation[hawkPopulation.length - 1] / dovePopulation[dovePopulation.length - 1]).toFixed(2));
    generationsNode.html(drawCall);
    avgNode.html(avgProportion.toFixed(2));
}

function plotValues(time) {
    stroke("blue");
    line(time, HEIGHT - totalPopulation[totalPopulation.length - 2] - 1,
        time + 1, HEIGHT - totalPopulation[totalPopulation.length - 1] - 1);
    stroke("red"); 1
    line(time, HEIGHT - hawkPopulation[hawkPopulation.length - 2] - 1,
        time + 1, HEIGHT - hawkPopulation[hawkPopulation.length - 1] - 1);
    stroke("green");
    line(time, HEIGHT - dovePopulation[dovePopulation.length - 2] - 1,
        time + 1, HEIGHT - dovePopulation[dovePopulation.length - 1] - 1);
}

function getNewValues() {
    hawkPopulation.push(population.filter(e => e.aggressiveness == 1).length);
    dovePopulation.push(population.filter(e => e.aggressiveness == 0).length);
    totalPopulation.push(hawkPopulation[hawkPopulation.length - 1] + dovePopulation[dovePopulation.length - 1]);

}

function createPopulation() {
    for (let i = 0; i < HAWK_INIT; i++) {
        population.push(new Animal("male", 1));
    }
    for (let i = 0; i < DOVE_INIT; i++) {
        population.push(new Animal("male", 0));
    }
}

function fightPopulation() {
    for (let i = 0; i < population.length; i++) {
        population[i].fight(random(population));
    }
}

function countPoints() {
    for (let i = 0; i < population.length; i++) {
        if (population[i].aggressiveness == 1) {
            hawkPoints += population[i].points;
        } else {
            dovePoints += population[i].points;
        }
        // population[i].points = 0;
        population[i].age++;
    }
}

function reproducePopulation() {
    // let totalPoints = hawkPoints + dovePoints;
    // hawkChilds = round(population.length / 3  * (hawkPoints / totalPoints)); 
    // doveChilds = round(population.length / 3 * (dovePoints / totalPoints));
    let avg = population.map(a => a.points).reduce((a, b) => (a + b)) / population.length
    let successful = population.filter(e => e.points > avg && e.points > 0)
    let n = population.length / 6;
    for (let i = 0; i < n; i++) {
        // if (successful[i].points > avg)
        // population.push(population[i].reproduce(population[i]));
        population.push(random(successful).reproduce(random(successful)));
        // population.push(successful[i].reproduce(random(successful)));
        if(random()>.99) continue;
        population.push(random(successful).reproduce(random(successful)));
        if (random() > .995) {
            population.push(successful[i].reproduce(random(successful)));
        }
    }

    // for(let i = 0; i < hawkChilds; i++){
    //     if(random() > .8){
    //         i++;
    //         population.push(new Animal("male", 0))
    //     } 
    //     population.push(new Animal("male", 1));
    // }
    // for(let i = 0; i < doveChilds; i++){
    //     if(random() > .8){
    //         i++;
    //         population.push(new Animal("male", 1))
    //     } 
    //     population.push(new Animal("male", 0));
    // }
    // let n = population.length
    // for(let i = 0; i < n; i++){
    //     if(population[i].points > 0){
    //         population.push(new Animal(population[i].aggressiveness))
    //     }
    // }
    // return;
}

function killOldPopulation() {
    population = population.filter(e => e.age < 3);
}


function setup() {
    createCanvas(WIDTH, HEIGHT);

    createPopulation();
    showParameters();
    const body = select("body");
    // noLoop();
}

let drawCall = 0;
function draw() {
    drawCall++;
    fightPopulation();
    countPoints();
    reproducePopulation();
    killOldPopulation();
    getNewValues();
    updateValues();
    plotValues(drawCall);
}

function mouseClicked() {
    drawCall++;
    fightPopulation();
    countPoints();
    reproducePopulation();
    killOldPopulation();
    getNewValues();
    updateValues();
    plotValues(drawCall);
    translate(WIDTH, 0);
}