/* 
App.js is the driver of the javascript application.
It interacts with battle.js which contains the game-world objects
And gui.js which controls the user's GUI

Using MVC:
App is the controller
Battle contains the models
GUI is the view
*/

class App {

  constructor() {
    this.player = null
    this.enemies = null
    this.battle = null
    this.gui = null

    this.setupBattleData()
    this.setupStateMachine()
  }

  // Main Function
  run() {
    // Wait until DOM has loaded  
    $(document).ready(setupGUI)
  }

  setupGUI() {
    this.gui = new GUI(this.battle)
  }

  setupStateMachine() {
    this.fsm = StateMachine.create({
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
        onbattleStart:          battleStart,
        onplayerChooseAttack:   playerChooseAttack,
        onplayerChooseTarget:   playerChooseTarget,
        onplayerUseAttack:      playerUseAttack,
        onenemiesUseAttack:     enemiesUseAttack,
        onbattleOver:           battleOver,
      }
    })  
  }

  // State Setup Functions
  battleStart(event, from, to, msg) {
    this.gui.setMessage(battle.startBattleMessage())
  }

  playerChooseAttack(event, from, to, msg) {
    this.gui.setMessage(battle.chooseAttackMessage())
  }

  playerChooseTarget(event, from, to, msg) {
    this.gui.setMessage(battle.attackChosenMessage(action.attack)) 
    this.gui.appendMessage(battle.chooseTargetMessage()) 
  }

  playerUseAttack(event, from, to, msg) {
    // execute the attack in-game
    var attackResult = this.battle.playerAttacksEnemies(
      this.gui.action
    )
    
    // animate the attack and update GUI
    this.gui.displayAttack(attackResult)
  }

  enemiesUseAttack(event, from, to, msg) {
    // execute the attack in-game
    var attackResult = this.battle.enemiesAttackPlayer()
    
    // animate the attack and update GUI
    this.gui.displayAttack(attackResult)
  }


  battleOver(event, from, to, msg) {
    this.gui.clearMessage()
    $('#message').append('<p>The battle has ended!</p>')
    $('#message').append(`<p>${gameOverMessage}</p>`)
  }

  setupBattleData() {

    // initialize enemies
    var enemies = []

    enemies.push(
      new Character({
        species: 'Charmeleon',
        HP: 95,
        maxHP: 95,
        element: 'fire',
        XP: 150,
        level: 2,
        attacks: {
          'Fire Blast': new Attack({
            name: 'Fire Blast',
            power: 3,
            accuracy: 0.99
          }),
          'Ember Storm': new Attack({
            name: 'Ember Storm',
            power: 2,
            accuracy: 0.95
          })
        }
      })
    )
    enemies.push(
      new Character({
        species: 'Ivysaur',
        HP: 70,
        maxHP: 70,
        element: 'plant',
        XP: 90,
        level: 2,
        attacks: {
          'Stem Stick': new Attack({
            name: 'Stem Stick',
            power: 3,
            accuracy: 0.95
          }),
          'Vine Wrap': new Attack({
            name: 'Vine Wrap',
            power: 4,
            accuracy: 0.6
          })
        }
      })
    )
    enemies.push(
      new Character({
        species: 'Starmie',
        HP: 60,
        maxHP: 60,
        element: 'water',
        XP: 130,
        level: 1,
        attacks: {
          'Squirt Gun': new Attack({
            name: 'Squirt Gun',
            power: 2,
            accuracy: 0.99
          }),
          'Water Blast': new Attack({
            name: 'Water Blast',
            power: 3,
            accuracy: 0.95
          })
        }
      })
    )
    // assign owner and id's to enemies
    for (var i=0; i < enemies.length; i++) {
      enemies[i].owner = 'enemy'
      enemies[i].id = i
    }

    // init character's attacks

    // initialize character
    var character = new Character({
      species: 'Squirtle',
      HP: 100,
      maxHP: 100,
      element: 'water',
      XP: 120,
      level: 1,
      attacks: {
        'Squirt Gun': new Attack({
          name: 'Squirt Gun',
          power: 2,
          accuracy: 0.99
        }),
        'Water Blast': new Attack({
          name: 'Water Blast',
          power: 3,
          accuracy: 0.95
        })
      }
      owner: 'player',
      id: enemies.length,
    })

    // initialize player (global variable)
    this.player = new Player({
      name: 'Kevin',
      character: character,
      items: []
    }) 
    
    this.battle = new Battle(player, enemies)
  }
}

// Launch App
var app = new App()
app.run()