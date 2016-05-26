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
        name: 'enemiesDefeated',  
        to:   'battleOver' 
      },
      {
        from: 'playerUsesAttack', 
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
      onenemiesUseAttack:      enemiesUseAttackState,
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
  var attackResult = battle.playerAttacksEnemies(gui.action)
  
  // animate the attack and update GUI
  gui.displayAttack(attackResult)
}

function enemiesUseAttackState(event, from, to, msg) {
  // execute the attack in-game
  var attackResult = battle.enemiesAttackPlayer()
  
  // animate the attack and update GUI
  gui.displayAttack(attackResult)
}

function battleOverState(event, from, to, msg) {
  gui.setMessage(battle.battleOverMessage())
  gui.appendMessage(battleOutcomeMessage)
}