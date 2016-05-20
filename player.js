class Player {
  constructor(options) {
    this.inventory = [];
    this.character = options.character;
  }

  useItem(item) {
    // if (item instanceof FirstAidKit) {
    //   this.useFirstAidKit()
    // } else if (item instanceof AttackPickup) {
    //   this.useAttack()
    // } else if (item instanceof Trap) {
    //   this.useTrap()
    // }
    // etc ..
    item.use(this);
    this.removeItemFromInventory(item);
  }
}
