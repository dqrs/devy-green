   // Event Handlers
function handleContinue(event) {
  if (fsm.current === "battleStart") {
    fsm.continueBattle()
  } else if (fsm.current === "playerUsesAttack") {
    if (battle.battleIsOver()) {
      battleOutcomeMessage = battle.playerWonMessage()
      fsm.enemiesDefeated()
    } else {
      fsm.continueBattle()
    }
  } else if (fsm.current === "enemiesUseAttack") {
    if (battle.battleIsOver()) {
      battleOutcomeMessage = battle.playerLostMessage()
      fsm.playerDefeated()
    } else {
      fsm.continueBattle()
    }
  }
}

function handleQuit(event) {
  battleOutcomeMessage = battle.playerQuitMessage()
  fsm.quit()
}

function handlePlayerChoosesAttack(event) {
  element = $(event.target)
  gui.action.attackName = element.attr('value')
  fsm.attackChosen()
}

function handlePlayerChoosesTarget(event) {
   gui.action.targetIndex = parseInt(
    event.currentTarget.getAttribute('value')
  )
  fsm.targetChosen()
}
