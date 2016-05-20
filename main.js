require('cycle-shell')(main, {
  welcome: `Welcome to my game. Type help for instructions or look to get started.`
})
var html = require('hypervdux')

var styles = {
  error: {
    color: 'red'
  },
  image: {
    width: 200,
    margin: 15
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  }
}

var inventory = {}

var rooms = {
  first: {
    description: 'There is a light and a sofa.',
    image: 'https://at-cdn-s01.audiotool.com/2014/06/04/documents/c6lyUDHdglDCFV7uSXoewmGsxndgg/0/cover256x256-e48406d4f9004f6791fac2d8b7cd8de1.jpg',
    next: 'second',
    items: {
      light: {
        description: 'This is a bright light. There seems to be nothing out of the ordinary about it.',
        image: 'https://images-na.ssl-images-amazon.com/images/I/6140Zp-7tlL._SL256_.jpg',
      },
      sofa: {
        description: 'The old sofa smells like a cat. Buried under one of the cushions is a key.',
        image: 'http://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/9b/9b28f3e158700d8818d31e26c1cbf2cb3f511473.png?2016041012',
        reveals: 'key'
      },
      key: {
        description: 'An old key. With this you can escape the first room.',
        image: 'http://img11.deviantart.net/b271/i/2010/313/9/e/key__png_by_fatimah_al_khaldi-d32hlgp.png',
        hidden: true,
        takeable: true
      }
    }
  },
    second: {
    description: 'There is a sword and a shield. There is a wall on one side that looks old.',
    image: 'http://vignette3.wikia.nocookie.net/assassinscreed/images/e/e5/ACII-Armory_2.png/revision/latest?cb=20120731153219',
    previous: 'first',
    items: {
      sword: {
        description: 'A sword that probably looked more impressive in the past.',
        image: 'http://icons.iconseeker.com/png/fullsize/300/300-sword.png',
        takeable: true
      },
      shield: {
        description: 'A bright metal shield.',
        image: 'http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/glossy-silver-icons-symbols-shapes/018813-glossy-silver-icon-symbols-shapes-shield.png',
        takeable: true
      },
      wall: {
        description: 'The wall seems to have large cracks. As you touch the wall to inspect it breaks apart revealing a hidden compartment.',
        image: 'http://t3.rbxcdn.com/68e89df0bffbb5ac32692148a604ec7b',
        reveals: 'compartment'
      },
      compartment: {
        description: 'Inside the compartment you find the key to escape this room.',
        image: 'http://vignette2.wikia.nocookie.net/elderscrolls/images/3/3f/Skyrim-med-chest.png/revision/latest?cb=20120612185054',
        hidden: true,
        reveals: 'key'
      },
      key: {
        description: 'An old key. With this you can escape the second room.',
        image: 'http://img11.deviantart.net/b271/i/2010/313/9/e/key__png_by_fatimah_al_khaldi-d32hlgp.png',
        hidden: true,
        takeable: true
      }
    }
  }
}

var currentRoom = rooms.first

// var game = new Game(options);
var player = new Player(options); 
this.attacks = {
  'sword': sword,
  'axe': axe,
  'wand': wand
}


function main (verb, noun) {
  verb = verb.toLowerCase()
  if (verb === 'look') {
    return look()
  } else if (verb === 'help') {
    return help()
  } else if (verb === 'inspect') {
    return inspect(noun)
  } else if (verb === 'unlock') {
    return move()
  } else if (verb === 'take') {
    return take(noun)
  } else if (verb === 'inventory') {
    return viewInventory()
  } else {
    return error("I don't know how to do that.")
  }
}

function help () {
  return `
  Commands:
  
  look - get a description of your surroundings.
  inspect - get a closer look at a specific item in the room.
  unlock - unlock the room and move to the next room.
  take - grab an item and add it to your inventory.
  inventory - check what is currently in your inventory
  `
}

function take (noun) {
  var item = currentRoom.items[noun]
  if (item && !item.hidden && item.takeable) {
    inventory[noun] = item.description
    return `Taken.`
  } else {
    return error(`I can't find that item.`)
  }
}

function move () {
  if (inventory.key) {
    if (currentRoom.next) {
      currentRoom = rooms[currentRoom.next]

      if (currentRoom.enemies.count > 0) {
        battle = new Battle(player, enemies);
        victory = battle.run();
        if (!victory) {
          return "Your character died! Game over!"
        }
        updatePlayerStats(battle)
      }

      delete (inventory.key)
      return look()
    } else {
      return `You Win The Game!!!` 
    }
  } else {
    return error(`You can't leave this room yet!`)
  }
}

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

function inspect (noun) {
  var item = currentRoom.items[noun]
  if (item && !item.hidden) {
    if (item.reveals) {
      revealItem(item.reveals)
    }
    return addImage(item)
  } else {
    return error(`I can't find that item.`)
  }
}

function addImage (item) {
  return html`<div style=${styles.container}>
    <img style=${styles.image} src=${item.image}/>
    <p>${item.description}</p>
    </div>
  `
}

function viewInventory () {
  if (Object.keys(inventory).length > 0) {
    return inventory
  } else {
    return error(`I haven't taken any items yet.`)
  }
}

function revealItem (itemName) {
  var hiddenItem = currentRoom.items[itemName]
  hiddenItem.hidden = false
}

function look () {
  return addImage(currentRoom)
}

function error (msg) {
  return html`<div style=${styles.error}>${msg}</div>`
}
