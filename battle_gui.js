// Main/Init Function
$(document).ready(function() {
  initGameData()
  setupPlayerGUI()
  setupEnemiesGUI()
  
  initFSM() // starts battle

  // game over, update stats
  // if (!victory) {
  //   return "Your character died! Game over!"
  // }
  // updatePlayerStats(battle)
});

function battleIsOver() {
  if (this.player.HP == 0) {
    return true;
  } else {
    var enemyHP = 0;
    for (var i = 0; i < this.enemies.length; i++) {
      enemyHP += this.enemies[i].HP;
    }
    return (enemyHP == 0);
  }
}

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

function initFSM() {
  fsm = StateMachine.create({
    initial: 'battleStart',
    events: [
      {
        from: 'battleStart',
        name: 'continueBattle',  
        to:   'playerChooseAttack' 
      },
      {
        from: 'playerChooseAttack',
        name: 'attackChosen',
        to:   'playerChooseTarget'
      },
      {
        from: 'playerChooseTarget',
        name: 'targetChosen',  
        to:   'playerUseAttack'
      },
      {
        from: 'playerUseAttack',
        name: 'enemiesDefeated',  
        to:   'battleOver' 
      },
      {
        from: 'playerUseAttack', 
        name: 'continueBattle',  
        to:   'enemiesUseAttack' 
      },
      {
        from: 'enemiesUseAttack',
        name: 'playerDefeated',
        to:   'battleOver'
      },
      {
        from: 'enemiesUseAttack',
        name: 'continueBattle',  
        to:   'playerChooseAttack' 
      },
      {
        from: '*',
        name: 'quit',  
        to:   'battleOver'
      }
    ],
    callbacks: {
      onenterbattleStart:          battleStart,
      onenterplayerChooseAttack:   playerChooseAttack,
      onenterplayerChooseTarget:   playerChooseTarget,
      onenterplayerUseAttack:      playerUseAttack,
      onenterenemiesUseAttack:     enemiesUseAttack,
      onenterbattleOver:           battleOver,
    }
  });  
}

// State Setup Functions
function battleStart(event, from, to, msg) {
  $("#message").text('')
  $("#message").append("<p>The battle has begun!</p>")
  $('#message').append('<p>Click to continue</p>')
}

function playerChooseAttack(event, from, to, msg) {
  $("#message").text('')
  $("#message").text("Choose your attack!")
}

function playerChooseTarget(event, from, to, msg) {
  $("#message").text('')
  var attackName = player.character.attacks[action.attack].name
  $('#message').append(`<p>You chose the attack: <strong>${attackName}</strong></p>`)
  $('#message').append('<p>Now choose your target!</p>')
}


function playerUseAttack(event, from, to, msg) {
  // execute the attack in game
  var attack = player.character.attacks[action.attack]
  var target = enemies[action.target]
  var description = player.character.useAttack(attack, target)
  
  animateAttack(action.target, 'playerAttack')

  // update GUI with new game state post-attack  
  updateEnemiesGUI()
  updatePlayerGUI()
  
  // print out log of the attack
  $("#message").text('')
  $("#message").html(description)
  $('#message').append('<p>Click to continue</p>')
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
}

function enemiesUseAttack(event, from, to, msg) {
  // execute the attack in game
  var attackerIndex = Math.floor(Math.random()*enemies.length)
  var attacker = enemies[attackerIndex]

  var attackIndex = Math.floor(Math.random()*attacks.length)
  var attack = attacker.attacks[attackIndex]

  var description = attacker.useAttack(attack, player.character)
  
  animateAttack(attackerIndex, 'enemyAttack')

  // update GUI with new game state post-attack  
  updateEnemiesGUI()
  updatePlayerGUI()

  // print out log of the attack
  $("#message").text('')
  $("#message").html(description)
  $('#message').append('<p>Click to continue</p>')
}

function battleOver(event, from, to, msg) {
  $("#message").text('')
  $("#message").append('<p>The battle has ended!</p>')
}

// Event Handlers
action = {} // global var

function handleContinue(event) {
  if (fsm.current === "battleStart") {
    fsm.continueBattle();
  } else if (fsm.current === "playerUseAttack") {
    if (battleIsOver()) {
      fsm.enemiesDefeated()
    } else {
      fsm.continueBattle()
    }
  } else if (fsm.current === "enemiesUseAttack") {
    if (battleIsOver()) {
      fsm.playerDefeated()
    } else {
      fsm.continueBattle()
    }
  }
}

function handleQuit(event) {
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

/*
Based on the battle that just occurred,
we increase the player's XP.

For each enemy that the player defeated,
we increase the player's XP based on the XP of the enemy.

Then we check to see if the player earned enough XP
to level-up.
*/
function updatePlayerStats(battle) {

}
function initGameData() {
  // init character's attacks
  var myAttacks = []
  var attack1 = new Attack({
    name: "Squirt Gun",
    power: 2,
    accuracy: 0.99
  });
  var attack2 = new Attack({
    name: "Water Blast",
    power: 3,
    accuracy: 0.95
  });
  myAttacks.push(attack1, attack2)


  // initialize character
  var myCharacter = new Character({
    species: "Squirtle",
    HP: 100,
    maxHP: 100,
    element: "water",
    XP: 120,
    level: 1,
    attacks: myAttacks
  });

  // initialize player (global variable)
  player = new Player({
    name: "Kevin",
    character: myCharacter,
    items: []
  }); 

  // initialize enemies
  enemies = [] // global
  var enemy1 = new Character({
    species: "Charmeleon",
    HP: 200,
    maxHP: 200,
    element: "fire",
    XP: 1000,
    level: 3,
    attacks: [
      new Attack({
        name: "Fire Blast",
        power: 3,
        accuracy: 0.99
      }),
      new Attack({
        name: "Ember Storm",
        power: 2,
        accuracy: 0.95
      }),
    ]
  });
  var enemy2 = new Character({
    species: "Ivysaur",
    HP: 150,
    maxHP: 150,
    element: "plant",
    XP: 900,
    level: 2,
    attacks: [
      new Attack({
        name: "Stem Stick",
        power: 3,
        accuracy: 0.95
      }),
      new Attack({
        name: "Vine Wrap",
        power: 4,
        accuracy: 0.6
      }),
    ]
  });
  var enemy3 = new Character({
    species: "Starmie",
    HP: 300,
    maxHP: 300,
    element: "water",
    XP: 1000,
    level: 3,
    attacks: [
      new Attack({
        name: "Squirt Gun",
        power: 2,
        accuracy: 0.99
      }),
      new Attack({
        name: "Water Blast",
        power: 3,
        accuracy: 0.95
      }),
    ]
  });
  enemies.push(enemy1)
  enemies.push(enemy2)
  enemies.push(enemy3)
}