class Battle {
    constructor(player, enemies) {
        this.enemies = enemies;
        this.player = player;
    }

    /*
    This is the main loop for running combat
    */
    run() {
        var turn = 1
        while(!this.battleIsOver()) {
            if (turn % 2 == 1) {
                this.playersTurn();
            } else {
                this.enemiesTurn();
            }
        }
        return this.determineWinner();
    }

    /*
    Looks at the hp of the player and all enemies
    to determine if the battle is over or not
    */
    battleIsOver() {
        if (this.player.hp == 0) {
            return true;
        } else {
            enemyHP = 0;
            for (var i = 0; i < enemies.count; i++) {
                enemyHP += enemies[i].hp;
            }
            return (enemyHP == 0);
        }
    }

    /*
    Returns true if the player won the battle
    Otherwise, returns false
    */
    determineWinner() {
        if (this.player.hp > 0) {
            return true;
        } else {
            return false;
        }
    }

    playersTurn() {
        this.display();
        input = this.getPlayersInput();
        this.runPlayersTurn(input);
    }

    getPlayersInput() {

        return input
    }

    /*
    The player's turn is a pair of two numbers:
    (action, target)
    The action is the number of an attack or item.
    Then target is the number of the enemy to apply the action to.
    Note: enemy can be null 
    (for example, applying a shield doesn't require specifying an enemy)
    */
    runPlayersTurn(input) {
        action = this.player.actions[input.action]
        if (action.type == "ITEM") {
            this.player.useItem(action)
        } else if (action.type == "ATTACK") {
            this.player.character.useAttack(action)
        }
        this.display()
        this.waitForPlayerToContinue()
    }

    runEnemiesTurn() {
        for (var i=0; i < this.enemies.count; i++) {
            enemy = this.enemies[i]
            enemy.AIAttack(this.player.character)
            this.display()
            this.waitForPlayerToContinue()
        }
    }
    
    /*
    For now, this wills display the same
    for players turn and enemies turn, eventually
    we'll make them different
    And add animations
    Display enemies
        hp
        level
        number (for selection)
    Display player
        hp
        xp
        level
    Display inventory/items
    
    */
    display() {

    }

}

