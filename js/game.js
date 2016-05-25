/* 
  game.js is the driver of the javascript application.
  It interacts with battle.js, which contains the game-world objects and gui.js, which controls the user's GUI
*/

/* 
  Main Function: launchGame()
  Global vars:
  - fsm
  - player
  - enemies
  - battle
  - gui
  - battleOutcomeMessage
*/
function launchGame() {
  setupBattleData();
  gui = new GUI(battle);
  setupStateMachine();

   // Wait until DOM has loaded
  $(document).ready(function() {
    gui.setup()
    fsm.pageReady()
  })
}

launchGame()


function setupBattleData() {
  // initialize enemies (global variable)
  enemies = []

  enemies.push(
    new Pokemon({
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
    new Pokemon({
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
    new Pokemon({
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
    // enemies[i].id = i
  }

  // initialize player's pokemon
  var pokemon = new Pokemon({
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
    },
    owner: 'player'
  })

  // initialize player (global variable)
  player = new Player({
    name: 'Kevin',
    pokemon: pokemon,
    items: []
  }) 
  
  // initialize player (global variable)
  battle = new Battle(player, enemies)
}