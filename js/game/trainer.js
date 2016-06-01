class Trainer {
  
  constructor(options) {
    this.name = options.name,
    this.age = options.age,
    this.league = options.league,
    this.favoriteElement = options.favoriteElement,
    this.slogan = options.slogan
  }

  /*
    Returns the name of the Pokemon's image file.
    The image changes based on the Pokemon's species and
    whether it is alive or not.
    For example:
      a Charmander pokemon's image file should be:
        'Charmander.png' if it is alive
        and 'Charmander-Dead.png' if it is dead.
      a Blastoise pokemon's image file should be:
        'Blastoise.png' if it is alive
        and 'Blastoise-Dead.png' if it is dead.
  */
  imageFileName() {
    return `${this.name}.png`
  }

  getLeague() {
    return "Implement this"
  }

  getFullName() {
  }

  getReverseName() {
  }

  getWeakestElement() {

  }

  getFirstNameLastInitial() {
  }

  getFirstInitialLastName() {
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
