class Battle {

  constructor() {
    this.setupPlayer()
    this.setupEnemy()
  }
  /*
    setupPlayer(...) creates a new Trainer object based
    on the player's choice of name and starting Pokemon. Then
    it saves the trainer as the battle's 'player' instance variable.
    
    Note: The player chooses which Pokemon to start with.
    Options are 'Bulbasaur', 'Charmander', and 'Squirtle.'
  */
  setupPlayer() {

    // initialize player
    this.player = new Trainer({
      name: 'Misty Trainer',
      age: 14,
      favoriteElement: "Water",
      slogan: "Never give up! Never surrender!"
    })
    
    // initialize player's Pokemon
    var playerPokemon = new Pokemon({
      XP: 420,
      family: familydex['Bulbasaur'],
      owner: 'player'
    })

    this.player.pokemon = playerPokemon
  }

  /*
    Todo: Document
  */
  setupEnemy(enemyName) {
    this.enemy = new Trainer({
      name: 'Ash Ketchum',
      age: 13,
      favoriteElement: "Plant",
      slogan: "Gotta catch 'em all!"
    })

    this.enemy.pokemon = this.createEnemyPokemon(3)
  }

  /*
    Document..
    Currently uses createRandomEnemies
    Alternatives:
      - create random enemies
      - create unique enemies
      - create duplicate enemies
      - create enemies with same element
      - create weak enemies
      - create powerful enemies
  */
  createEnemyPokemon(num) {
    var pokemon = this.createThreeSpecificPokemon()
    this.assignPokemonToEnemy(pokemon)
    this.assignPokemonIDNumbers(pokemon)
    return pokemon
  }

  /*
    Alternative strategy for createEnemies()
    Simplest version. Creates the three enemies specifically
    written here by the programmer. Not automatic at all.
  */
  createThreeSpecificPokemon() {
    var enemySquirtle = new Pokemon({
      XP: 200,
      family: familydex['Squirtle']
    })
    
    var enemyCharmander = new Pokemon({
      XP: 200,
      family: familydex['Charmander']
    })
    
    var enemyBulbasaur = new Pokemon({
      XP: 200,
      family: familydex['Bulbasaur']
    })

    var pokemonArray = []
    pokemonArray.push(enemySquirtle)
    pokemonArray.push(enemyCharmander)
    pokemonArray.push(enemyBulbasaur)

    return pokemonArray
  }

  /*
    Todo: Document
  */
  startBattleMessage() {
    var message = `<p>The battle has begun!</p>`
    return message
  }

  /*
    Todo: Document
  */
  continueMessage() {
    return `<p>Click to continue</p>`
  }

  /*
    Todo: Document
  */
  chooseAttackMessage() {
    var message = `<p>Choose your attack!</p>`
    return message
  }

  /*
    Todo: Document
  */
  attackChosenMessage(attackName) {
    return `<p>You chose the attack: <b>${attackName}</b></p>`
  }

  /*
    Todo: Document
  */
  chooseTargetMessage() {
    var message = '<p>Now choose your target!</p>'
    return message
  }

  /*
    Todo: Document
  */
  battleOverMessage() {
    return `<p>The battle has ended!</p>`
  }

  /*
    Todo: Document
  */
  playerLostMessage() {
    var message = `<p>${this.player.name} lost!</p>`
    return message
  }

  /*
    Todo: Document
  */
  playerWonMessage() {
    var message = `<p>${this.player.name} won!</p>`
    return message
  }

  /*
    Todo: Document
  */
  playerQuitMessage() {
    return `<p>${this.player.name} quit!</p>`
  }

  /*
    Todo: Document
  */
  attackResultMessage(attackResult) {
    var msg = this.hitOrMissedMessage(attackResult)
    msg += this.attackDetailsMessage(attackResult)

    return msg
  }

  /*
    Returns a string indicating whether the attack hit or missed
    its target.
    
  */
  hitOrMissedMessage(attackResult) {
    if (attackResult.hit) {
      return `<p>Attack <b>hit</b>!!</p>`
    } else {
      return `<p>Attack <b>missed</b>!!</p>`
    }
  }

  attackDetailsMessage(attackResult) {
    var msg  = `<p><b>${attackResult.attacker.species}</b> `
        msg += `used the `
        msg += `<b>${attackResult.attack.name}</b> attack `
        msg += `on <b>${attackResult.target.species}</b> `
        msg += `causing <b>${attackResult.damage}</b> `
        msg += `units of damage.</p>`
    return msg
  }

  /////////End Battle Messages////////////////////////////
  
  /*
    updateStats() is called if the player defeats all the enemies.
    All it does it call the updateStats() method of the player's Pokemon, passing in the enemies from this battle.

    Todo: rename these methods. make them use same terms and make them shorter
  */
  updateStats() {
    this.player.pokemon.updateAttributesAfterBattle(this.enemy.pokemon)
  }

  /*
    battleIsOver() returns true if the battle has ended
    ans false if it hasn't.
    
    The battle is over if the player's Pokemon is dead
    (has 0 HP) or if all of the enemy's Pokemon are dead.
  */
  battleIsOver() {
    if (this.player.pokemon.HP == 0) {
      return true
    } else {
      var totalEnemyHP = 0
      for (var i = 0; i < this.enemy.pokemon.length; i++) {
        totalEnemyHP += this.enemy.pokemon[i].HP
      }
      return (totalEnemyHP == 0)
    }
  }
  
  /*
    checkIfPlayerWonBattle() returns true if the player won the battle. Otherwise, it returns false.
  */
  // checkIfPlayerWonBattle() {
  //   if (this.battleIsOver() && this.player.pokemon.HP > 0) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  /*
    Todo: Document
  */
  enemyAttacksPlayer() {
    var attacker = this.selectEnemyAttacker()
    var enemyAttack = attacker.selectAttack()
    
    var attackResult = this.executeAttack({
      attacker: attacker,
      attack: enemyAttack,
      target: this.player.pokemon
    })

    return attackResult
  }

  /*
    Todo: Document

    action is given by the app.js which sets the 
    action object based on the user's choice.
    action has the following properties
      action.attackName
      action.targetIndex
  */
  playerAttacksEnemy(action) {
    var attacker = this.player.pokemon
    var playerAttack = attacker.attacks[action.attackName]
    var target = this.enemy.pokemon[action.targetIndex]

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

    var hit = this.determineIfAttackHitOrMissed(attack)

    if (hit) {
      var damage = attacker.calcDamage(attack, target)
      target.subtractHP(damage)
    } else {
      damage = 0
    }

    var attackResult = {
      attacker: attacker,
      attack: attack,
      target: target,
      damage: damage,
      hit: hit
    }

    return attackResult
  }

  /*
    determineIfAttackHitOrMissed(...) returns a boolean value
    (true or false) indicating whether the attack hit its target or not.
    Returns true if the attack hit and false if it missed.
  */
  determineIfAttackHitOrMissed(attack) {
    var rand = Math.random()

    if (rand < attack.accuracy) {
      return true
    } else {
      return false
    }
  }

  /*
    Todo: Document
  */
  assignPokemonToEnemy(pokemonArray) {
    for (var i=0; i < pokemonArray.length; i++) {
      pokemonArray[i].owner = 'enemy'
    }
  }

  /*
    Used by the application to locate enemies.
  */
  assignPokemonIDNumbers(pokemonArray) {
    for (var i=0; i < pokemonArray.length; i++) {
      pokemonArray[i].id = i
    }
  }

  /*
    Alternative strategy for createEnemies()
    Creates 'num' enemies, each one randomly selected from
    the familydex.
  */
  createRandomPokemon(num) {
    var familydexArray = toArray(familydex)
    var randomEnemies = []
    
    for (var i=0; i < num; i++) {
      var randomIndex = Math.floor(
        Math.random() * familydexArray.length
      )
      var enemy = new Pokemon({
        owner: 'enemy',
        XP: 50 + Math.random() * 100,
        family: familydexArray[randomIndex]
      })
      randomEnemies.push(enemy)
    }
    this.enemy.pokemon = randomEnemies
  }

  /*
    Alternative strategy for createEnemies()
    Todo: Document
    
  */
  createUniquePokemon(num) {
    
  }

  /*
    Alternative strategy for createPokemon()
    Todo: Document
  */
  createDuplicatePokemon(num) {
    
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
    return this.selectFirstEnemyAttacker()
  }

  /*
    Returns an array of the enemy pokemon that are still alive.
  */
  getEnemiesThatAreStillAlive() {
    var livingEnemies = []
    for (var i=0; i < this.enemy.pokemon.length; i++) {
      var pokemon = this.enemy.pokemon[i]
      if (pokemon.isAlive()) {
        livingEnemies.push(pokemon)
      }
    }
    return livingEnemies
  }

  /*
    Alternate Implementation for selectEnemyAttacker()
  */
  selectFirstEnemyAttacker() {
    var livingEnemies = this.getEnemiesThatAreStillAlive()
    return livingEnemies[0]
  }

  /*
    Alternate Implementation for selectEnemyAttacker()
  */
  selectLastEnemyAttacker() {
    var livingEnemies = this.getEnemiesThatAreStillAlive()
    var indexOfLastEnemy = this.enemy.pokemon.length - 1
    return livingEnemies[indexOfLastEnemy]
  }

  /*
    Alternate Implementation for selectEnemyAttacker()
  */
  selectRandomEnemyAttacker() {
    var livingEnemies = this.getEnemiesThatAreStillAlive()
    var attackerIndex = Math.floor(
      Math.random() * this.enemy.pokemon.length
    )
    return livingEnemies[attackerIndex]
  }

  /*
    locateEnemyPokemon() returns the array index of the enemy pokemon provided.
  */
  locateEnemyPokemon(pokemon) {
    for (var i=0; i < this.enemy.pokemon.length; i++) {
      if (this.enemy.pokemon[i].id === pokemon.id) {
        return i
      }
    }
    return -1 // indicates that we could not find the pokemon
  }
}