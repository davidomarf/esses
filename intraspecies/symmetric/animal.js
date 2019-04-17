class Animal {
    constructor(sex, geneticAggressiveness) {
        let aggressiveness = 0;
        if (geneticAggressiveness > random()) aggressiveness = 1;
        this.geneticAggressiveness = geneticAggressiveness;
        this.aggressiveness = aggressiveness;
        this.sex = sex;
        this.points = 0;
        this.age = 0;
    }

    reproduce(animal, sex) {
        // if(this.sex == animal.sex) return null;
        if (!sex) sex = random(["male", "female"]);
        let aggressiveness = (this.geneticAggressiveness + animal.geneticAggressiveness) / 2;
        // aggressiveness += random(-.1, .1);
        // console.log(this, animal, aggressiveness)
        return new Animal(sex, aggressiveness);
    }

    won() {
        this.points += 50;
    }

    lost() {
        this.points = this.points;
    }

    injured() {
        this.points -= 100;
    }

    bored() {
        this.points -= 10;
    }

    fight(animal) {
        if (this.aggressiveness == 1) {
            if (animal.aggressiveness == 0) {
                animal.lost();
                this.won()
            } else {
                animal.injured();
                animal.lost();
                this.won();
            }
        }
        else {
            if (animal.aggressiveness == 0) {
                animal.bored();
                this.bored();
                animal.lost();
                this.won();
            }
            else {
                animal.won();
                this.lost();
            }
        }
    }
}