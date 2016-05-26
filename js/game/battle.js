class Battle {

  constructor(player, enemies) {
    this.player = player;
    this.enemies = enemies;
  }

  startBattleMessage() {
    var message = `<p>The battle has begun!</p>`
    message += `<p>Click to continue</p>`
    return message
  }

  continueMessage() {
    return '<p>Click to continue</p>'
  }

  chooseAttackMessage() {
    var message = "<p>Choose your attack!</p>"
    return message
  }

  attackChosenMessage(attackName) {
    var message = `<p>You chose the attack: `
    message += `<strong>${attackName}</strong></p>`
    return message
  }

  chooseTargetMessage() {
    var message = '<p>Now choose your target!</p>'
    return message
  }

  battleOverMessage() {
    return `<p>The battle has ended!</p>`
  }

  playerLostMessage() {
    var message = `<p>${player.name} lost!</p>`
    return message
  }

  playerWonMessage() {
    var message = `<p>${player.name} won!</p>`
    return message
  }

  playerQuitMessage() {
    return `${player.name} quit the battle!`
  }

  /*
  Looks at the HP of the player and all enemies
  to determine if the battle is over or not
  */
  battleIsOver() {
    if (player.pokemon.HP == 0) {
      return true;
    } else {
      var enemyHP = 0;
      for (var i = 0; i < enemies.length; i++) {
        enemyHP += enemies[i].HP;
      }
      return (enemyHP == 0);
    }
  }
  /*
  Returns true if the player won the battle
  Otherwise, returns false
  */
  determineWinner() {
    // TODO:
    if (this.player.HP > 0) {
      return true;
    } else {
      return false;
    }
  }

  /*
    Selects the next enemy that will attack the Player

    Alternatives:
    select enemy with least/most HP
    select enemy with least/most XP
    select enemy with strongest element against this player
    round robin through enemies
    etc.
  */
  selectEnemyAttacker() {
    return this.selectRandomEnemy()
  }

  selectRandomEnemy() {
    var attackerIndex = Math.floor(
      Math.random() * this.enemies.length
    )
    return this.enemies[attackerIndex]
  }

  enemiesAttackPlayer() {
    var attacker = this.selectEnemyAttacker()
    var enemyAttack = attacker.selectAttack()
    
    var attackResult = this.executeAttack({
      attacker: attacker,
      attack: enemyAttack,
      target: player.pokemon
    })

    return attackResult
  }

  playerAttacksEnemies(action) {
    var attacker = this.player.pokemon
    var playerAttack = attacker.attacks[action.attackName]
    var target = this.enemies[action.targetIndex]

    var attackResult = this.executeAttack({
      attacker: attacker,
      attack: playerAttack,
      target: target
    })

    return attackResult
  }

  executeAttack(options) {
    var attacker = options.attacker
    var attack = options.attack
    var target = options.target

    var damage = attacker.calcAttackDamage(attack, target)
    target.receiveAttackDamage(damage)

    var attackResult = {
      attacker: attacker,
      attack: attack,
      target: target,
      damage: damage,
      status: 'hit'
    }
    return attackResult
  }

  describeAttack(attackResult) {
    var msg = `<strong>${attackResult.attacker.species}</strong> `
    msg += `used the `
    msg += `<strong>${attackResult.attack.name}</strong> attack `
    msg += `on <strong>${attackResult.target.species}</strong> `
    msg += `causing <strong>${attackResult.damage}</strong> `
    msg += `units of damage.`
    return msg
  }

  /*
    Returns the array index of the enemy pokemon provided
    Assumes that the enemy can only have one pokemon
    of each species. For example, the enemy cannot have 
    more than one 'Charizard' pokemon
  */
  locateEnemyPokemon(pokemon) {
    for (var i=0; i < this.enemies.length; i++) {
      if (this.enemies[i].species === pokemon.species) {
        return i
      }
    }
    return -1 // indicates that we could not find the pokemon
  }

  /*
  The player's turn is a pair of two numbers:
  (action, target)
  The action is the number of an attack or item.
  Then target is the number of the enemy to apply the action to.
  Note: enemy can be null 
  (for example, applying a shield doesn't require specifying an enemy)
  */

   /*
  Based on the battle that just occurred,
  we increase the player's XP.

  For each enemy that the player defeated,
  we increase the player's XP based on the XP of the enemy.

  Then we check to see if the player earned enough XP
  to level-up.
  */
  
  updatePlayerStats(battle) {

  }
}