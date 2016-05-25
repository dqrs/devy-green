EXTRA_DAMAGE = 1.5
NORMAL_DAMAGE = 1.0
REDUCED_DAMAGE = 0.67

class Pokemon {

  constructor(options) {
    this.species = options.species
    this.HP = options.HP
    this.maxHP = options.maxHP
    this.element = options.element
    this.XP = options.XP
    this.level = options.level
    this.attacks = options.attacks
    this.owner = options.owner
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


  /*
    Used by enemy AI to choose an attack randomly

    Alternatives:
    select strongest attack
    select weakest attack
    select attack by element
    select most accurate attack
    round robin through attacks
    etc.
  */
  selectAttack(target) {
    return this.selectRandomAttack()
  }

  selectRandomAttack() {
    var attacks = this.getArrayOfAttacks()
    var attackIndex = Math.floor(
      Math.random() * attacks.length
    )

    return attacks[attackIndex]
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
  The more experience a pokemon has, 
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
  
  getArrayOfAttacks() {
    return Object.keys(this.attacks).map(key => this.attacks[key])  
  }
}