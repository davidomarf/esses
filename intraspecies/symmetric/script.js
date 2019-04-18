// Canvas Setting
const WIDTH = 1200;
const HEIGHT = 600;

// Initial values for population
const POPULATION_INIT = 30;
const HAWK_INIT = 0;
const DOVE_INIT = POPULATION_INIT - HAWK_INIT;

// Global variables
let totalPopulation = {
    prev: 0,
    current: POPULATION_INIT
};
let hawkPopulation = {
    prev: 0,
    current: HAWK_INIT
};
let dovePopulation = {
    prev: 0,
    current: DOVE_INIT
};

let avgProportion = hawkPopulation.current / dovePopulation.current;

let population = []

let hawkPoints = 0;
let dovePoints = 0;

/************ Helping Functions ************/

function makeOldPopulationDie() {
    population = population.filter(e => e.age < 3);
}

function increaseAge() {
    population.map(e => e.age++);
}

function getAvgProportion() {
    // Convert previous avgProportion to "original" sum, add the new value, and divide again.
    return (
        ((avgProportion * (drawCall - 1)) + (hawkPopulation.current / dovePopulation.current)) / (drawCall)
    )
}

function getNewInformation() {
    // Make the last current number, the previous one, and calculate
    // the *new* current number
    hawkPopulation = {
        prev: hawkPopulation.current,
        current: population.filter(e => e.aggressiveness == 1).length
    }
    dovePopulation = {
        prev: dovePopulation.current,
        current: population.filter(e => e.aggressiveness == 0).length
    }
    totalPopulation = {
        prev: totalPopulation.current,
        current: dovePopulation.current + hawkPopulation.current
    }
}

function createPopulation() {
    // Create N hawks, and M doves, forcing a 50-50 distribution of sexes

    let hawk_n = round(HAWK_INIT / 2)
    for (let i = 0; i < hawk_n; i++) {
        population.push(new Animal("male", 1));
        population.push(new Animal("female", 1));
    }

    let dove_n = round(DOVE_INIT / 2)
    for (let i = 0; i < dove_n; i++) {
        population.push(new Animal("male", 0));
        population.push(new Animal("female", 0));
    }
}

function fightPopulation() {
    // Makes every subject in population, fight against every other member
    // Not "nature-accurate", maybe will be greatly improved if we add a 
    // "location" for subjects, so close subjects have more fight-probability
    for (let i = 0; i < population.length; i++) {
        for (let j = i; j < population.length; j++) {
            if (j === i) continue;
            population[i].fight(population[j]);
        }
    }
}

function reproducePopulation() {
    // Calculate the average score (Animal.points) for the population
    let avg = population.map(a => a.points).reduce((a, b) => (a + b)) / population.length

    // Select only the subjects scored above-average
    let successful = population.filter(e => e.points > avg)

    // If for some reason, successful is empty, it means no subject scored above-average,
    // which means all subjects got the same score. So we select the subjects randomly.
    if (successful.length === 0) successful = population.filter(() => random() > .5);

    // Why the 6? I'm not sure. Will fix later. Other numbers make the population either
    // grow uncontrollably, or go extinct after just a few generations.
    let n = population.length / 6;

    for (let i = 0; i < n; i++) {
        // There will be **at least** n new subjects in the population.
        population.push(random(successful).reproduce(random(successful)));

        // There will be, 99% of the time, an extra child for a pair of subjects
        if (random() < .99) {
            population.push(random(successful).reproduce(random(successful)));

            // There will be, ~.49% of the time, one more extra child for a pair of subjects
            if (random() < .005) {
                population.push(random(successful).reproduce(random(successful)));
            }
        }
    }
}

/********** HTML related functions **********/

function createInformationHTML() {
    createDiv("Population size: <span class='value'>" + POPULATION_INIT + "</span>")
        .id("population-size");
    createDiv("Hawk members:    <span class='value'>" + HAWK_INIT + "</span>")
        .id("hawk-members");
    createDiv("Dove members:    <span class='value'>" + DOVE_INIT + "</span>")
        .id("dove-members");
    createDiv("Proportion H/D:  <span class='value'>" + (HAWK_INIT / DOVE_INIT) + "</span>")
        .id("proportion");
    createDiv("Avg. Proportion H/D:  <span class='value'>" + avgProportion + "</span>")
        .id("avg-proportion");
    createDiv("Generations:  <span class='value'>" + drawCall + "</span>")
        .id("generations");
}

function updateHTMLContent() {
    select(".value", "#population-size").html(population.length);
    select(".value", "#hawk-members").html(hawkPopulation.current);
    select(".value", "#dove-members").html(dovePopulation.current);
    select(".value", "#proportion").html((hawkPopulation.current / dovePopulation.current).toFixed(2));
    select(".value", "#generations").html(drawCall);
    avgProportion = getAvgProportion()
    select(".value", "#avg-proportion").html(avgProportion.toFixed(2));
}

function plotValues(time) {
    stroke("blue");
    line(time, HEIGHT - totalPopulation.prev - 1,
        time + 1, HEIGHT - totalPopulation.current - 1);
    stroke("red");
    line(time, HEIGHT - hawkPopulation.prev - 1,
        time + 1, HEIGHT - hawkPopulation.current - 1);
    stroke("green");
    line(time, HEIGHT - dovePopulation.prev - 1,
        time + 1, HEIGHT - dovePopulation.current - 1);
}

/***************** P5.JS *****************/

function setup() {
    createCanvas(WIDTH, HEIGHT);

    createPopulation();
    createInformationHTML();
    const body = select("body");
    // noLoop();
}

let drawCall = 0;
function draw() {
    drawCall++;
    if (drawCall % WIDTH === 0) background(255)
    if (drawCall > WIDTH) {
        translate(-WIDTH * int(drawCall / WIDTH), 0);
    }

    fightPopulation();
    increaseAge();
    reproducePopulation();
    makeOldPopulationDie();
    getNewInformation();
    updateHTMLContent();
    plotValues(drawCall);
}