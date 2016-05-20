class Attack {
    constructor(options) {
        this.power = options.power;
        this.name = options.name;
        this.accuracy = options.accuracy;
    }
}

sword = new Attack({
    power: 10,
    name: "Sword of Erdos",
    accuracy: 0.95
});
