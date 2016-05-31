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
  setupBattle();
  setupStateMachine();
  gui = new GUI(battle);

  // Wait until DOM has loaded
  $(document).ready(function() {
    gui.setup()
    fsm.pageReady()
  })
}

launchGame()

function setupBattle() {
  // initialize enemies (global variable)
  battle = new Battle()

  // todo: let the player pick this
  battle.setupPlayer('Gerardo', 'Bulbasaur')
  battle.setupEnemy('Ash')
}