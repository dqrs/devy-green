class Battle {

  constructor() {

  }

  /*
    createPlayer(...) creates a new player object based
    on the player's choice of starting character. Then
    it saves this player as the battle's player attribute.
    Note: The player chooses which pokemon to start with.
    Options are 'Bulbasaur', 'Charmander', and 'Squirtle.'
  */
  createPlayer(playerName, speciesChosen) {
    // initialize player's pokemon
    var playerPokemon = new Pokemon({
      XP: 100,
      forms: formedex[speciesChosen],
      owner: 'player'
    })

    // initialize player
    this.player = new Player({
      name: playerName,
      pokemon: playerPokemon,
      items: []
    })
  }

  /*
  Currently uses createRandomEnemies
  Alternatives:
    - create random enemies
    - create unique enemies
    - create duplicate enemies
    - create enemies with same element
    - create weak enemies
    - create powerful enemies
  */
  createEnemies(num) {
    this.createThreeSpecificEnemies()
    // this.createRandomEnemies(num)
  }

  /*
    Alternative strategy for createEnemies()
    Simplest version. Creates the three enemies specifically
    written here by the programmer. Not automatic at all.
  */
  createThreeSpecificEnemies() {
    var enemySquirtle = new Pokemon({
      owner: 'enemy',
      XP: 125,
      forms: formedex['Squirtle']
    })
    
    var enemyCharmander = new Pokemon({
      owner: 'enemy',
      XP: 100,
      forms: formedex['Charmander']
    })
    
    var enemyBulbasaur = new Pokemon({
      owner: 'enemy',
      XP: 150,
      forms: formedex['Bulbasaur']
    })

    this.enemies = []
    this.enemies.push(enemySquirtle)
    this.enemies.push(enemyCharmander)
    this.enemies.push(enemyBulbasaur)
  }

  /*
    Alternative strategy for createEnemies()
    Creates 'num' enemies, each one randomly selected from
    the formedex.
  */
  createRandomEnemies(num) {
    var formedexArray = toArray(formedex)
    var randomEnemies = []
    
    for (var i=0; i < num; i++) {
      var randomIndex = Math.floor(
        Math.random() * formedexArray.length
      )
      var enemy = new Pokemon({
        owner: 'enemy',
        XP: 50 + Math.random() * 100,
        forms: formedexArray[randomIndex]
      })
      randomEnemies.push(enemy)
    }
    this.enemies = randomEnemies
  }

  /*
    Alternative strategy for createEnemies()
    
  */
  createUniqueEnemies(num) {
    
  }

  /*
    Alternative strategy for createEnemies()
  */
  createDuplicateEnemies(num) {
    
  }
  /*
    Used by the application to locate enemies.
  */
  assignEnemiesIds() {
    for (var i=0; i < enemies.length; i++) {
      enemies[i].id = i
    }
  }


  /*
    battleIsOver() returns true if the battle has ended
    ans false if it hasn't.
    
    The battle is over if the player's pokemon is dead
    (has 0 HP) or if all of the enemies are dead.
  */
  battleIsOver() {
    if (this.player.pokemon.HP == 0) {
      return true
    } else {
      var totalEnemyHP = 0
      for (var i = 0; i < this.enemies.length; i++) {
        totalEnemyHP += this.enemies[i].HP
      }
      return (totalEnemyHP == 0)
    }
  }
  
  /*
    checkIfPlayerWonBattle() returns true if the player won the battle. Otherwise, it returns false.
  */
  checkIfPlayerWonBattle() {
    if (this.battleIsOver() && this.player.HP > 0) {
      return true
    } else {
      return false
    }
  }

  /*
    selectEnemyAttacker() selects the next enemy that will attack the Player.

    Alternate Implementations:
      - select first enemy
      - select last enemy
      - select random enemy
      - select enemy with least/most HP
      - select enemy with least/most XP
      - select enemy with strongest element against this player
      - round robin through enemies
  */
  selectEnemyAttacker() {
    return this.selectRandomEnemyAttacker()
  }

  /*
    Alternate Implementation for selectEnemyAttacker()
  */
  selectFirstEnemyAttacker() {
    
  }

  /*
    Alternate Implementation for selectEnemyAttacker()
  */
  selectLastEnemyAttacker() {

  }

  /*
    Alternate Implementation for selectEnemyAttacker()
  */
  selectRandomEnemyAttacker() {
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

  /*
    locateEnemyPokemon() returns the array index of the enemy pokemon provided.
  */
  locateEnemyPokemon(pokemon) {
    for (var i=0; i < this.enemies.length; i++) {
      if (this.enemies[i].id === pokemon.id) {
        return i
      }
    }
    return -1 // indicates that we could not find the pokemon
  }
  
  /*
    updateStats() is called if the player defeats all the enemies.
    All it does it call the updateStats() method of the player's pokemon, passing in the enemies from this battle.
  */
  updateStats() {
    this.player.pokemon.updateStats(this.enemies)
  }

  /////////Battle Messages///////////////////////////////
  startBattleMessage() {
    var message = `<p>The battle has begun!</p>`
    message += `<p>Click to continue</p>`
    return message
  }

  continueMessage() {
    return '<p>Click to continue</p>'
  }

  chooseAttackMessage() {
    var message = `<p>Choose your attack!</p>`
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
    var message = `<p>${this.player.name} lost!</p>`
    return message
  }

  playerWonMessage() {
    var message = `<p>${this.player.name} won!</p>`
    return message
  }

  playerQuitMessage() {
    return `${this.player.name} quit the battle!`
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
  /////////End Battle Messages////////////////////////////
  
  /*
    The player's turn is a pair of two numbers:
    (action, target)
    The action is the number of an attack or item.
    Then target is the number of the enemy to apply the action to.
    Note: enemy can be null 
    (for example, applying a shield doesn't require specifying an   enemy)
  */

}