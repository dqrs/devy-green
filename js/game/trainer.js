class Trainer {  

  constructor() {
    // // basic info
    // this.firstName = "Dav" + "idson"
    // this.lastName = "Ketchum"
    // // this.age = 14
    // // this.slogan = "Gotta catch 'em all"
    // // this.favoriteElement = "Fire"
    // // this.favoriteColor = "red"

    // // // current status
    // this.energy = 80
    // this.happiness = 90
    // this.confidence = 30
    // this.intelligence = 40
    // this.strength = 30
    // this.coins = 55
  }

  getFullName() {
    // return this.firstName + ' ' + this.lastName
  }

  getReverseName() {
    return this.lastName + '' + this.firstName
  }

  getDoubleFullName() {
    return `${this.firstName} ${this.firstName} ${this.lastName} ${this.lastName}`
  }

  getFirstNameLastInitial() {
    // return `${this.firstName} ${this.lastName[0]}.`
  }

  getFirstInitialLastName() {
    // return `${this.firstName[0]}. ${this.lastName}`
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
  // getImageFileName() {
  //   return `${this.firstName} ${this.lastName}.png`
  // }

  // getLeague() {
  //   // return "Implement this"
  // }

  // getWeakestElement() {

  // }

  writeHi() {
    chatBubble("Hi")
  }

  writeSlogan() {
    chatBubble(this.slogan)
  }

  sayHi() {
    textToSpeech("Hi!")
  }

  saySlogan() {
    textToSpeech(this.slogan)
  }

  work() {
    this.energy -= 10
    this.happiness -= 20
    this.coins += 25
  }

}