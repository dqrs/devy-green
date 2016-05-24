EXTRA_DAMAGE = 1.5
NORMAL_DAMAGE = 1.0
REDUCED_DAMAGE = 0.67

class Character {

  constructor(options) {
    this.species = options.species;
    this.HP = options.HP;
    this.maxHP = options.maxHP;
    this.element = options.element;
    this.XP = options.XP;
    this.level = options.level;
    this.attacks = options.attacks;
  }

  useAttack(attack, target) {
    var damageAttempted = attack.power * this.calcXpMultiplier()
    var damageAbsorbed = target.getAttackedBy(this, damageAttempted)
    return this.generateAttackDescription(attack, target, damageAbsorbed)
  }

  getAttackedBy(attacker, damage) {
    var eltMultiplier = this.calcEltMultiplier(this.element, attacker.element)
    damage = Math.round(damage * eltMultiplier)
    this.HP -= damage
    
    // ensure that HP is never negative
    if (this.HP < 0) {
      this.HP = 0
    }

    return damage
  }

  generateAttackDescription(attack, target, damage) {
    return `<strong>${this.species}</strong> ` +
    `used the <strong>${attack.name}</strong> attack ` +
    `on <strong>${target.species}</strong> ` +
    `causing <strong>${damage}</strong> units of damage.`
  }

  /*
  Used by enemy AI to choose an attack randomly
  */
  AIAttack(target) {
    attackIndex = Math.floor(
      Math.random() * this.attacks.length
    )
    randomAttack = this.attacks[attackIndex]
    this.useAttack({ attack: randomAttack, target: target})
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
    if (attackerElement === "fire") {
      if (targetElement === "water") {
        return REDUCED_DAMAGE
      } else if (targetElement === "plant") {
        return EXTRA_DAMAGE
      } else {
        return NORMAL_DAMAGE
      }
    } else if (attackerElement === "water") {
      if (targetElement === "plant") {
        return REDUCED_DAMAGE
      } else if (targetElement === "fire") {
        return EXTRA_DAMAGE
      } else {
        return NORMAL_DAMAGE
      }
    } else if (attackerElement === "plant") {
      if (targetElement === "fire") {
        return REDUCED_DAMAGE
      } else if (targetElement === "water") {
        return EXTRA_DAMAGE
      } else {
        return NORMAL_DAMAGE
      }
    }
  }

  /*
  Calculates the XP multiplier.
  The more experience a character has, 
  the more damage it generates when it attacks
  */
  calcXpMultiplier() {
    return this.XP / 10
  }
  
  /*
  When the
  */
  levelUp() {

  }

  updateXP() {

  }
}