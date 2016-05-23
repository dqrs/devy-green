// Main/Init Function
$(document).ready(function() {
  initGameData()
  setupPlayerArea()
  setupEnemiesArea()
  // starts battle
  initFSM()
  // var victory = battle.run();

  // game over, update stats
  // if (!victory) {
  //   return "Your character died! Game over!"
  // }
  // updatePlayerStats(battle)
});

function setupEnemiesArea() {
  enemiesArea = $("#enemiesArea")
  enemiesArea.on('click', '.enemy', handleChooseTarget)
  enemy = $(".enemy")
  for (var i=0; i < enemies.length; i++) {
    updateStats(
      enemy.clone(), enemies[i]
    ).toggleClass('hidden').val(i).appendTo(enemiesArea);
  }
}

function setupPlayerArea() {
  var playerTable = $("#playerArea")
  updateStats(playerTable, player.character)
  setupAttacksMenu()
  updateAttacksMenu()
  updateItemsMenu()
  setupGameControlButtons()
}

function setupGameControlButtons() {
  $('button#continue').click(handleContinue)
  $('button#quit').click(handleQuit) 
}

function setupAttacksMenu() {
  $('#attacksMenu').on('click', 'button', handleChooseAttack)
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

// function launchAttack(event) {
//   $("#messageArea").text(this.target)
//   $(event.target).text()
// }



function initFSM() {
  fsm = StateMachine.create({
    initial: 'battleStart',
    events: [
      {
        name: 'continue',  
        from: 'battleStart',  to: 'chooseAttack' 
      },
      {
        name: 'attackChosen',  
        from: 'chooseAttack',  to: 'chooseTarget'
      },
      {
        name: 'targetChosen',  
        from: 'chooseTarget',  to: 'showAttack'
      },
      {
        name: 'continue',  
        from: 'showAttack',  to: 'battleOver' 
      },
      // todo: finish...
      {
        name: 'quit',  
        from: ['*'],
        to: 'battleOver'
      }
    ],
    callbacks: {
      onenterbattleStart: setupBattleStart,
      onenterchooseAttack: setupChooseAttack,
      onenterchooseTarget: setupChooseTarget,
      onentershowAttack: setupShowAttack,
      onenterbattleOver: setupBattleOver,
    }
  });  
}

// State Setup Functions
function setupBattleStart(event, from, to, msg) {
  $("#message").text("The battle has begun!")
  $('#message').append('<br/>Click continue')
}

function setupChooseAttack(event, from, to, msg) {
  $("#message").text("Choose your attack!")
}

function setupChooseTarget(event, from, to, msg) {
  $('#message').text(`You chose attack ${action.attack}`)
  $('#message').append('Now choose your target')
}

function setupShowAttack(event, from, to, msg) {
  $("#message").text("Your attack will commence!")
}

function setupBattleOver(event, from, to, msg) {
  $("#message").text("The battle has ended!")
}

// Event Handlers
function handleContinue(event) {
  fsm.continue();
}

function handleQuit(event) {
  fsm.quit();
}

function handleChooseAttack(event) {
  element = $(event.target)
  action.attack = element.val()
  fsm.attackChosen();
}

function handleChooseTarget(event) {
  action.target = element.val()
  action.target = element.val()
  fsm.targetChosen();
}

action = {} // global var


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

  // initalize battle
  battle = new Battle(player, enemies);
}