class Trainer {
  constructor(options) {
    this.name = options.name
    this.items = []
    this.pokemon = options.pokemon
  }

  useItem(item) {
    item.use(this)
    this.removeItemFromInventory(item)
  }

  removeItemFromInventory(item) {

  }
}

// if (item instanceof FirstAidKit) {
//   this.useFirstAidKit()
// } else if (item instanceof AttackPickup) {
//   this.useAttack()
// } else if (item instanceof Trap) {
//   this.useTrap()
// }
// etc ..
