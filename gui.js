function setupEnemiesGUI() {
  enemiesGUI = $("#enemiesGUI")
  enemiesGUI.on('click', '.enemy', handlePlayerChooseTarget)
  enemy = $(".enemy")
  for (var i=0; i < enemies.length; i++) {
    updateStats(
      enemy.clone(), enemies[i]
    ).removeClass('hidden').addClass('visible').attr('value', i).appendTo(enemiesGUI);
  }
}

function updateEnemiesGUI() {
  $(".enemy.visible").each(function() {
    index = parseInt($(this).attr('value'))
    updateStats($(this), enemies[index])
  });
}

function setupPlayerGUI() {
  var playerTable = $('#playerGUI')
  $('#playerName').text(player.name)
  updateStats(playerTable, player.character)
  setupAttacksMenu()
  updateAttacksMenu()
  updateItemsMenu()
  setupGameControlButtons()
}

function updatePlayerGUI() {
  var playerTable = $('#playerGUI')
  updateStats(playerTable, player.character)
  // updateAttacksMenu()
  // updateItemsMenu()
}

function setupGameControlButtons() {
  $('button#continue').click(handleContinue)
  $('button#quit').click(handleQuit) 
}

function setupAttacksMenu() {
  $('#attacksMenu').on('click', 'button', handlePlayerChooseAttack)
}

function updateAttacksMenu() {
  attacksMenu = $("#attacksMenu")
  attacks = player.character.attacks
  for (var i=0; i < attacks.length; i++) {
    attack = attacks[i]
    attacksMenu.append(
      $(`<li>
          <button class="attack" value=${i}>
            ${attack.name}
          </button>
        </li>`)
    )
  }
}

function updateStats(element, character) {
  element.find('img').attr('src', `images/${character.species}.png`)
  element.find(".species").text(character.species);
  element.find(".element").text(character.element);
  element.find(".HP").text(character.HP);
  element.find(".maxHP").text(character.maxHP);
  element.find(".XP").text(character.XP);
  element.find(".level").text(character.level);
  return element;
}
function updateItemsMenu() {
  // Todo
}

function animateAttack(enemyIndex, scenario) {
  if (scenario === 'playerAttack') {
    var attackTarget = $(`.enemy[value="${enemyIndex}"]`)
    var attacker = $('.playerImage')
  } else { // enemyAttack
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

function flashTarget() {
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

// Event Handlers
action = {} // global var

function handleContinue(event) {
  if (fsm.current === "battleStart") {
    fsm.continueBattle();
  } else if (fsm.current === "playerUseAttack") {
    if (battleIsOver()) {
      gameOverMessage = `${player.name} won!`
      fsm.enemiesDefeated()
    } else {
      fsm.continueBattle()
    }
  } else if (fsm.current === "enemiesUseAttack") {
    if (battleIsOver()) {
      gameOverMessage = `${player.name} lost!`
      fsm.playerDefeated()
    } else {
      fsm.continueBattle()
    }
  }
}

function handleQuit(event) {
  gameOverMessage = `${player.name} quit the battle!`
  fsm.quit();
}

function handlePlayerChooseAttack(event) {
  element = $(event.target)
  action.attack = parseInt(element.attr('value'))
  fsm.attackChosen();
}

function handlePlayerChooseTarget(event) {
  action.target = parseInt(event.currentTarget.getAttribute('value'))
  fsm.targetChosen()
}