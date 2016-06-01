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

  setupEnemyGUI() {
    var enemyGUI = $(`#enemyGUI`)
    enemyGUI.on(`click`, `.enemy`, handlePlayerChoosesTarget)
    var enemy = $(`.enemy`)
    for (var i=0; i < this.battle.enemy.pokemon.length; i++) {
      this.updatePokemon(
        enemy.clone(), this.battle.enemy.pokemon[i]
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

  setupPlayerGUI() {
    $(`#playerName`).text(this.battle.player.name)
    var playerTable = $(`#playerGUI`)
    this.updatePokemon(playerTable, this.battle.player.pokemon)
    this.setupAttacksMenu()
    this.updateAttacksMenu()
    this.updateItemsMenu()
    this.setupGameControlButtons()
  }

  updatePlayerGUI() {
    var playerTable = $(`#playerGUI`)
    this.updatePokemon(playerTable, this.battle.player.pokemon)
  }

  setupGameControlButtons() {
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
      var attackTarget = $(`.enemy[value="${enemyIndex}"]`)
      var attacker = $(`.playerImage`)
    } else { // enemy is attacking player
      var enemyIndex = this.battle.locateEnemyPokemon(attackResult.attacker)
      var attackTarget = $(`#playerPokemon`)
      var attacker = $(`.enemy[value="${enemyIndex}"] .enemyImage`)
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