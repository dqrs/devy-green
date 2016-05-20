var enemies = [
  {
    species: "Charizard",
    element: "Fire",
    HP: 60,
    maxHP: 100,
    XP: 1000,
    level: 3
  },
  {
    species: "Charizard2",
    element: "Fire",
    HP: 50,
    maxHP: 100,
    XP: 1050,
    level: 3
  },
  {
    species: "Charizard3",
    element: "Fire",
    HP: 60,
    maxHP: 100,
    XP: 1500,
    level: 4
  },
  {
    species: "Charizard3",
    element: "Fire",
    HP: 60,
    maxHP: 100,
    XP: 1500,
    level: 4
  },
  {
    species: "Charizard3",
    element: "Fire",
    HP: 60,
    maxHP: 100,
    XP: 1500,
    level: 4
  }
]

var player = {
  name: "Devin",
  character: {
    species: "Squirtle",
    element: "Water",
    HP: 50,
    maxHP: 100,
    XP: 1000,
    level: 2,
    attacks: [
      'Squirt Gun',
      'Water Blast',
      'Defend'
    ]
  },
  items: [
    'Smoke Bomb',
    'Shield',
  ]
}

$(document).ready(function() {
  updatePlayerArea()
  setupEnemiesArea()
});


function updatePlayerArea() {
  var playerTable = $("#playerArea")
  updateStats(playerTable, player.character)

}

function updateStats(table, character) {
  table.find(".species").text(character.species);
  table.find(".element").text(character.element);
  table.find(".HP").text(character.HP);
  table.find(".maxHP").text(character.maxHP);
  table.find(".XP").text(character.XP);
  table.find(".level").text(character.level);
  return table;
}

function setupEnemiesArea() {
  enemiesArea = $("#enemiesArea")
  enemyTable = $(".enemyTable")
  for (var i=0; i < enemies.length; i++) {
    updateStats(
      enemyTable.clone(), enemies[i]
    ).toggleClass('hidden').appendTo(enemiesArea);
  }
}







