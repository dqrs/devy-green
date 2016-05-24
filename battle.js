class Battle {
  constructor(player, enemies) {
    this.player = player;
    this.enemies = enemies;
  }

  startBattleMessage() {
    message = '<p>The battle has begun!</p>'
    message += '<p>Click to continue</p>'
    return message
  }

  chooseAttackMessage() {
    message = "<p>Choose your attack!</p>"
    return message
  }

  attackChosenMessage(attackNum) {
    var attackName = this.player.character.attacks[attackNum].name
    message = `<p>You chose the attack: `
    message += `<strong>${attackName}</strong></p>`
    return message
  }

  chooseTargetMessage() {
    message = '<p>Now choose your target!</p>'
    return message
  }
  /*
  Looks at the HP of the player and all enemies
  to determine if the battle is over or not
  */
  function battleIsOver() {
    if (player.character.HP == 0) {
      return true;
    } else {
      var enemyHP = 0;
      for (var i = 0; i < enemies.length; i++) {
        enemyHP += enemies[i].HP;
      }
      return (enemyHP == 0);
    }
  }
  /*
  Returns true if the player won the battle
  Otherwise, returns false
  */
  determineWinner() {
    if (this.player.HP > 0) {
      return true;
    } else {
      return false;
    }
  }

  /*
  The player's turn is a pair of two numbers:
  (action, target)
  The action is the number of an attack or item.
  Then target is the number of the enemy to apply the action to.
  Note: enemy can be null 
  (for example, applying a shield doesn't require specifying an enemy)
  */

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
}