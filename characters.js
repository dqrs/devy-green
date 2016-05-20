class Character {

    constructor(options) {
        this.health = options.health;
        this.maxHealth = options.maxHealth;
        this.element = options.element;
        this.experience = options.experience;
        this.level = options.level;
        this.attacks = option.attacks;
        this
    }

    useAttack(attack, target) {
        damage = attack.power * this.calcXpMultiplier(this.experience);
        target.getAttacked(this, damage);
    }

    getAttacked(attacker, damage) {
        eltMultiplier = this.calcEltMultiplier(this.element, attacker.element);
        damage = damage * eltMultiplier;
        this.health -= damage;
    }

    /*
    Used by enemy AI to choose an attack randomly
    */
    AIAttack(target) {
        attackIndex = Math.floor(
            Math.random() * this.attacks.count
        )
        randomAttack = this.attacks[attackIndex]
        this.useAttack({ attack: randomAttack, target: target})
    }

    /*
    When the
    */
    levelUp() {

    }

    updateXP() {

    }

    /* 
    Calculates a damage multiplier based on the elements of the
    attacker and target involved in combat.
    
    For example, WATER overpowers FIRE, 
    so if attacker is WATER and target is FIRE,
    the multiplier will be 1.5 (3/2)

    However, if attacker is FIRE and target is WATER,
    the multiplier will be 0.67 (2/3)

    If attacker and targer are the same element, 
    we return a multiplier of 1.0

    Pairings:
    FIRE beats PLANT
    PLANT beats WATER
    WATER beats FIRE
    */
    calcEltMultiplier(attackerElement, targetElement) {
        EXTRA_DAMAGE = 1.5
        NORMAL_DAMAGE = 1.0
        REDUCED_DAMAGE = 0.67

        if (attackerElement == "FIRE") {
            if (targetElement == "WATER") {
                return REDUCED_DAMAGE
            } else if (targetElement == "PLANT") {
                return EXTRA_DAMAGE
            } else {
                return NORMAL_DAMAGE
            }
        } else if (attackerElement == "WATER") {
            // todo finish
        } else if (attackerElement == "PLANT") {
            // todo finish
        }
    }

    /*
    Calculates the experience multiplier.
    The more experience a character has, 
    the more damage it generates when it attacks
    */
    calcXpMultiplier() {

    }
}

character.useAttack({target: enemy1, attack: sword});
character.getAttacked({attacker: enemy2, attack: sword});

character1 = new Character({
    health: 100,
    element: WATER;
    experience: 100;
    level: 1,
    attacks: [sword, axe]
});