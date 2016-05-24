/* 
App.js is the driver of the javascript application.
It interacts with battle.js which contains the game-world objects
And gui.js which controls the user's GUI

Using MVC:
App is the controller
Battle contains the models
GUI is the view
*/

// Main/Init Function
function main() {
  setupGameData()
  setupStateMachine()
  
  // Wait until DOM has loaded  
  $(document).ready(setupGUI);
}

main() // run game

function setupGUI() {
  setupPlayerGUI()
  setupEnemiesGUI()
}

function setupStateMachine() {
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
  $('#message').html(battle.startBattleMessage())
}

function playerChooseAttack(event, from, to, msg) {
  $("#message").text('')
  $('#message').html(battle.chooseAttackMessage())
}

function playerChooseTarget(event, from, to, msg) {
  $("#message").text('')
  $('#message').append(battle.attackChosenMessage(action.attack)) 
  $('#message').append(battle.chooseTargetMessage()) 
}

function playerUseAttack(event, from, to, msg) {
  // execute the attack in game
  var attack = player.character.attacks[action.attack]
  var target = enemies[action.target]
  var description = player.character.useAttack(attack, target)
  
  animateAttack(action.target, 'playerAttack')

  // // update GUI with new game state post-attack  
  // updateEnemiesGUI()
  // updatePlayerGUI()
  
  // print out log of the attack
  $("#message").text('')
  $("#message").html(description)
  $('#message').append('<p>Click to continue</p>')
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
  // updateEnemiesGUI()
  // updatePlayerGUI()

  // print out log of the attack
  $("#message").text('')
  $("#message").html(description)
  $('#message').append('<p>Click to continue</p>')
}


function battleOver(event, from, to, msg) {
  $("#message").text('')
  $("#message").append('<p>The battle has ended!</p>')
  $("#message").append(`<p>${gameOverMessage}</p>`)
}

function setupGameData() {
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
    HP: 95,
    maxHP: 95,
    element: "fire",
    XP: 150,
    level: 2,
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
    HP: 70,
    maxHP: 70,
    element: "plant",
    XP: 90,
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
    HP: 60,
    maxHP: 60,
    element: "water",
    XP: 130,
    level: 1,
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