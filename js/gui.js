class GUI {

  constructor(battle) {
    this.action = {}
    this.battle = battle
    this.setupPlayerGUI()
    this.setupEnemiesGUI()
  }
  
  clearMessage() {
    $("#message").text('')
  }

  setMessage(messageHTML) {
    $('#message').html(messageHTML)
  }

  appendMessage(messageHTML) {
    $('#message').append(messageHTML)
  }

  setupEnemiesGUI() {
    var enemiesGUI = $("#enemiesGUI")
    enemiesGUI.on('click', '.enemy', handlePlayerChooseTarget)
    enemy = $(".enemy")
    for (var i=0; i < enemies.length; i++) {
      updateStats(
        enemy.clone(), enemies[i]
      ).removeClass('hidden').addClass('visible').attr('value', i).appendTo(enemiesGUI)
    }
  }

  updateEnemiesGUI() {
    $(".enemy.visible").each(function() {
      index = parseInt($(this).attr('value'))
      updateStats($(this), enemies[index])
    })
  }

  setupPlayerGUI() {
    var playerTable = $('#playerGUI')
    $('#playerName').text(player.name)
    updateStats(playerTable, player.character)
    setupAttacksMenu()
    updateAttacksMenu()
    updateItemsMenu()
    setupGameControlButtons()
  }

  updatePlayerGUI() {
    var playerTable = $('#playerGUI')
    updateStats(playerTable, player.character)
    // updateAttacksMenu()
    // updateItemsMenu()
  }

  setupGameControlButtons() {
    $('button#continue').click(handleContinue)
    $('button#quit').click(handleQuit) 
  }

  setupAttacksMenu() {
    $('#attacksMenu').on('click', 'button', handlePlayerChooseAttack)
  }

  updateAttacksMenu() {
    attacksMenu = $("#attacksMenu")
    attacks = player.character.attacks
    for (var i=0; i < attacks.length; i++) {
      attack = attacks[i]
      attacksMenu.append(
        $(`<li>
            <button class="attack" value=${attack.name}>
              ${attack.name}
            </button>
          </li>`)
      )
    }
  }

  updateStats(element, character) {
    element.find('img').attr('src', `images/${character.species}.png`)
    element.find(".species").text(character.species)
    element.find(".element").text(character.element)
    element.find(".HP").text(character.HP)
    element.find(".maxHP").text(character.maxHP)
    element.find(".XP").text(character.XP)
    element.find(".level").text(character.level)
    return element
  }
  
  updateItemsMenu() {
    // Todo
  }

  displayAttack(attackResult) {
    // print out description of the attack
    this.setMessage(this.battle.describeAttack(attackResult))
    this.appendMessage(this.battle.continueMessage())

    // add 'attacker' class to attacker
    // add 'target' class to target
    if (attackResult.attacker.owner == 'player') {
      var enemyIndex = this.battle.locateEnemyPokemon(attackResult.target)
      var attackTarget = $(`.enemy[value="${enemyIndex}"]`)
      var attacker = $('.playerImage')
    } else { // enemyAttack
      var enemyIndex = this.battle.locateEnemy(attackResult.attacker)
      var attackTarget = $(`#playerCharacter`)
      var attacker = $(`.enemy[value="${enemyIndex}"] .enemyImage`)
    }
    attackTarget.addClass('attackTarget')

    var targetPos = attackTarget.get(0).getBoundingClientRect()
    var attackerPos = attacker.get(0).getBoundingClientRect()

    attacker.css('position', 'absolute').offset(attackerPos).animate(
      {
        left: targetPos.left,
        top: targetPos.top
      },
      {
        duration: 1000,
        complete: flashTarget
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
    $('.attackTarget').animate(
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
    ).removeClass('attackTarget')

    // update GUI with new game state post-attack  
    updateEnemiesGUI()
    updatePlayerGUI()
  }
}