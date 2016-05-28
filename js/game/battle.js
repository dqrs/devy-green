class Battle {

  /*
    setupPlayer(...) creates a new Trainer object based
    on the player's choice of starting character. Then
    it saves the trainer object as the battle's 'player' instance variable.
    
    Note: The player chooses which pokemon to start with.
    Options are 'Bulbasaur', 'Charmander', and 'Squirtle.'
  */
  setupPlayer(playerName, speciesChosen) {
    // initialize player's pokemon
    var playerPokemon = new Pokemon({
      XP: 100,
      family: familydex[speciesChosen],
      owner: 'player'
    })

    // initialize player
    this.player = new Trainer({
      name: playerName,
      pokemon: playerPokemon,
      items: []
    })
  }

  /*
    Todo: Document
  */
  setupEnemy(enemyName) {
    this.enemy = new Trainer({
      name: enemyName
    })

    this.enemy.pokemon = this.createEnemyPokemon(3)
  }


  /////////Battle Messages///////////////////////////////
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
    return `${this.player.name} quit!`
  }

  /*
    Todo: Document
  */
  describeAttack(attackResult) {
    var msg = `<b>${attackResult.attacker.species}</b> `
    msg += `used the `
    msg += `<b>${attackResult.attack.name}</b> attack `
    msg += `on <b>${attackResult.target.species}</b> `
    msg += `causing <b>${attackResult.damage}</b> `
    msg += `units of damage.`
    return msg
  }
  /////////End Battle Messages////////////////////////////
  
  /*
    updateStats() is called if the player defeats all the enemies.
    All it does it call the updateStats() method of the player's pokemon, passing in the enemies from this battle.

    Todo: rename these methods. make them use same terms and make them shorter
  */
  updateStats() {
    this.player.pokemon.updateAttributesAfterBattle(this.enemy.pokemon)
  }

  /*
    battleIsOver() returns true if the battle has ended
    ans false if it hasn't.
    
    The battle is over if the player's pokemon is dead
    (has 0 HP) or if all of the enemy's pokemon are dead.
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
  checkIfPlayerWonBattle() {
    if (this.battleIsOver() && this.player.pokemon.HP > 0) {
      return true
    } else {
      return false
    }
  }

  /*
    Todo: Document
  */
  enemyAttacksPlayer() {
    var attacker = this.selectEnemyAttacker()
    var enemyAttack = attacker.selectAttack()
    
    var attackResult = this.executeAttack({
      attacker: attacker,
      attack: enemyAttack,
      target: player.pokemon
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

    var hit = determineIfAttackHitOrMissed(attack)

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
    Simplest version. Creates the three enemies specifically
    written here by the programmer. Not automatic at all.
  */
  createThreeSpecificPokemon() {
    var enemySquirtle = new Pokemon({
      XP: 125,
      family: familydex['Squirtle']
    })
    
    var enemyCharmander = new Pokemon({
      XP: 100,
      family: familydex['Charmander']
    })
    
    var enemyBulbasaur = new Pokemon({
      XP: 150,
      family: familydex['Bulbasaur']
    })

    var pokemonArray = []
    pokemonArray.push(enemySquirtle)
    pokemonArray.push(enemyCharmander)
    pokemonArray.push(enemyBulbasaur)

    return pokemonArray
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
    Alternate Implementation for selectEnemyAttacker()
  */
  selectFirstEnemyAttacker() {
    return this.enemy.pokemon[0]
  }

  /*
    Alternate Implementation for selectEnemyAttacker()
  */
  selectLastEnemyAttacker() {
    var indexOfLastEnemy = this.enemy.pokemon.length - 1
    return this.enemy.pokemon[indexOfLastEnemy]
  }

  /*
    Alternate Implementation for selectEnemyAttacker()
  */
  selectRandomEnemyAttacker() {
    var attackerIndex = Math.floor(
      Math.random() * this.enemy.pokemon.length
    )
    return this.enemy.pokemon[attackerIndex]
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