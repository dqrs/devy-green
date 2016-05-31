function setupStateMachine() {
  fsm = StateMachine.create({
    initial: 'loading',
    events: [
      {
        from: 'loading',
        name: 'pageReady',  
        to:   'battleStart' 
      },
      {
        from: 'battleStart',
        name: 'continueBattle',  
        to:   'playerChoosesAttack' 
      },
      {
        from: 'playerChoosesAttack',
        name: 'attackChosen',
        to:   'playerChoosesTarget'
      },
      {
        from: 'playerChoosesTarget',
        name: 'targetChosen',  
        to:   'playerUsesAttack'
      },
      {
        from: 'playerUsesAttack',
        name: 'enemyDefeated',  
        to:   'battleOver' 
      },
      {
        from: 'playerUsesAttack', 
        name: 'continueBattle',  
        to:   'enemyUsesAttack' 
      },
      {
        from: 'enemyUsesAttack',
        name: 'playerDefeated',
        to:   'battleOver'
      },
      {
        from: 'enemyUsesAttack',
        name: 'continueBattle',  
        to:   'playerChoosesAttack' 
      },
      {
        from: '*',
        name: 'quit',  
        to:   'battleOver'
      }
    ],
    callbacks: {
      onbattleStart:           battleStartState,
      onplayerChoosesAttack:   playerChoosesAttackState,
      onplayerChoosesTarget:   playerChoosesTargetState,
      onplayerUsesAttack:      playerUsesAttackState,
      onenemyUsesAttack:       enemyUsesAttackState,
      onbattleOver:            battleOverState,
    }
  })  
}

// State Functions
function battleStartState(event, from, to, msg) {
  gui.setMessage(battle.startBattleMessage())
}

function playerChoosesAttackState(event, from, to, msg) {
  gui.setMessage(battle.chooseAttackMessage())
}

function playerChoosesTargetState(event, from, to, msg) {
  gui.setMessage(battle.attackChosenMessage(gui.action.attackName)) 
  gui.appendMessage(battle.chooseTargetMessage()) 
}

function playerUsesAttackState(event, from, to, msg) {
  // execute the attack in-game
  var attackResult = battle.playerAttacksEnemy(gui.action)
  
  // animate the attack and update GUI
  gui.displayAttack(attackResult)
}

function enemyUsesAttackState(event, from, to, msg) {
  // execute the attack in-game
  var attackResult = battle.enemyAttacksPlayer()
  
  // animate the attack and update GUI
  gui.displayAttack(attackResult)
}

function battleOverState(event, from, to, msg) {
  gui.setMessage(battle.battleOverMessage())
  gui.appendMessage(battleOutcomeMessage)
}