class GUI {

  constructor(battle) {
    this.action = {}
    this.battle = battle
    this.messages = []
  }  

  setup() {
    this.setupPlayerGUI()
    this.setupEnemyGUI()
  }

  makeEnemiesSelectable() {
    $('.pokemonModule.enemy.visible').addClass('enemyHoverable')
  }

  makeEnemiesUnselectable() {
    $('.pokemonModule.enemy.visible').removeClass('enemyHoverable')
  }

  setupEnemyGUI() {
    this.setupEnemyTrainer()
    this.setupEnemyPokemon()
  }

  setupEnemyTrainer() {
    var trainerModule = $(`#enemyGUI .trainerModule`)
    this.updateTrainer(trainerModule, this.battle.enemy)
  }

  setupEnemyPokemon() {
    var enemyGUI = $(`#enemyGUI`)
    enemyGUI.on(`click`, `.pokemonModule.enemy`, handlePlayerChoosesTarget)
    var enemyModule = $(`.pokemonModule.enemy`)
    for (var i=0; i < this.battle.enemy.pokemon.length; i++) {
      this.updatePokemon(
        enemyModule.clone(), this.battle.enemy.pokemon[i]
      ).removeClass(`hidden`).addClass(`visible`).attr(`value`, i).appendTo(enemyGUI)
    }
  }

  updateEnemyGUI() {
    var gui = this
    $(`.enemy.visible`).each(function() {
      var index = parseInt($(this).attr(`value`))
      gui.updatePokemon($(this), gui.battle.enemy.pokemon[index])
    })
  }

  updatePokemon(element, pokemon) {
    element.find(`img`).attr(`src`, `images/${pokemon.imageFileName()}`)
    element.find(`.species`).text(pokemon.species)
    element.find(`.element`).text(pokemon.element)
    element.find(`.HP`).text(pokemon.HP)
    element.find(`.maxHP`).text(pokemon.maxHP)
    element.find(`.XP`).text(pokemon.XP)
    element.find(`.level`).text(pokemon.level)
    return element
  }

  updateTrainer(element, trainer) {
    element.find(`img`).attr(`src`, `images/${trainer.imageFileName()}`)
    element.find(`.name`).text(trainer.name)
    element.find(`.age`).text(trainer.age)
    element.find(`.league`).text(trainer.getLeague())
    element.find(`.favoriteElement`).text(trainer.favoriteElement)
    element.find(`.slogan`).text(`"${trainer.slogan}"`)
    return element
  }

  setupPlayerGUI() {
    var trainerModule = $(`#playerGUI .trainerModule`)
    this.updateTrainer(trainerModule, this.battle.player)

    var playerPokemonModule = $(`#playerGUI .pokemonModule`)
    this.updatePokemon(playerPokemonModule, this.battle.player.pokemon)
    
    this.setupAttacksMenu()
    this.updateAttacksMenu()
    this.updateItemsMenu()
    this.setupGameControlButtons()
  }

  updatePlayerGUI() {
    var trainerModule = $(`#playerGUI .trainerModule`)
    this.updateTrainer(trainerModule, this.battle.player)
    var pokemonModule = $(`#playerGUI .pokemonModule`)
    this.updatePokemon(pokemonModule, this.battle.player.pokemon)
  }


  setupGameControlButtons() {
    $(`#messageGUI`).click(handleContinue)
    $(`button#continue`).click(handleContinue)
    $(`button#quit`).click(handleQuit)
  }

  setupAttacksMenu() {
    $(`#attacksMenu`).on(
      `click`, `button`, handlePlayerChoosesAttack
    )
  }

  updateAttacksMenu() {
    var attacksMenu = $(`#attacksMenu`)
    var attacks = toArray(this.battle.player.pokemon.attacks)
    for (var i=0; i < attacks.length; i++) {
      var attack = attacks[i]
      attacksMenu.append(
        $(`<li>
            <button class="attack" value="${attack.name}">
              ${attack.name}
            </button>
          </li>`)
      )
    }
  }

  
  updateItemsMenu() {
    // Todo
  }

  clearMessages() {
    this.messages = []
    $(`#messageGUI`).empty()
  }
  
  typeMessages() {
    var self = this

    if (this.messages.length > 0) {
      $('.newMessage').removeClass('newMessage')
      
      var nextMessage = this.messages.shift()
      $('#messageGUI').append('<div class="newMessage"></div>')
      
      $('.newMessage').typed({
        strings: [nextMessage],
        typeSpeed: 5,
        showCursor: false,
        callback: function() {
          self.typeMessages()
        }
      })
    }
  }

  setMessage(messageHTML) {
    this.clearMessages()
    this.messages.push(messageHTML)
  }

  appendMessage(messageHTML) {
    this.messages.push(messageHTML)
    // $('#messageGUI').append('<div id="message2"></div>')
    // $('#message2').typed({
    //   stringsElement: $('#secondMessage'),
    //   showCursor: false,
    // })
    // $(`#hiddenMessages`).html(messageHTML)
    // $('#messages').typed({
    //   stringsElement: $('#hiddenMessages'),
    //   showCursor: false,
    // })
    // $(`#hiddenMessages`).append(messageHTML)
    // this.typeMessage()
    // this.typeMessage()
  }
  
  displayAttack(attackResult) {
    // select dom elements corresponding to attacker and target
    // based on the attackResult object
    if (attackResult.attacker.owner === `player`) {
      var enemyIndex = this.battle.locateEnemyPokemon(attackResult.target)
      var attackTarget = $(`.pokemonModule.enemy[value="${enemyIndex}"]`)
      var attacker = $(`#playerGUI .pokemonImage`)
    } else { // enemy is attacking player
      var enemyIndex = this.battle.locateEnemyPokemon(attackResult.attacker)
      var attackTarget = $(`#playerGUI .pokemonModule`)
      var attacker = $(`.pokemonModule.enemy[value="${enemyIndex}"] .enemyImage`)
    }
    attackTarget.addClass(`attackTarget`)

    var targetPos = attackTarget.get(0).getBoundingClientRect()
    var attackerPos = attacker.get(0).getBoundingClientRect()

    var self = this
    attacker.css(`position`, `absolute`).offset(attackerPos).animate(
      {
        left: targetPos.left,
        top: targetPos.top
      },
      {
        duration: 1000,
        complete: function() {
          self.flashTarget()
          // print out description of the attack
          self.setMessage(self.battle.attackResultMessage(attackResult))
          self.appendMessage(self.battle.continueMessage())
          self.typeMessages()
        }
      }
    ).animate(
      {
        left: attackerPos.left,
        top: attackerPos.top
      },
      {
        duration: 1000,
      }
    )
  }

  flashTarget() {
    $(`.attackTarget`).animate(
      {opacity: 0},
      {duration: 100, queue: true}
    ).animate(
      {opacity: 100},
      {duration: 100, queue: true}
    ).animate(
      {opacity: 0},
      {duration: 100, queue: true}
    ).animate(
      {opacity: 100},
      {duration: 100, queue: true}
    ).removeClass(`attackTarget`)

    // update GUI with new game state post-attack  
    gui.updateEnemyGUI()
    gui.updatePlayerGUI()
  }
}