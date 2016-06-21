class Trainer {
  
  // constructor(options) {
  //   this.firstName = options.firstName
  //   this.lastName = options.lastName
  //   this.age = options.age
  //   this.favoriteElement = options.favoriteElement
  //   this.favoriteColor = options.favoriteColor
  //   this.slogan = options.slogan
  //   this.energy = options.energy
  //   this.happiness = options.happiness
  //   this.confidence = options.confidence
  //   this.intelligence = options.intelligence
  //   this.strength = options.strength
  // }

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

  getFullName() {
    return this.firstName + ' ' + this.lastName
  }

  getReverseName() {
    return this.lastName + ', ' + this.firstName
  }
  getDoubleFullName() {
    // return `${this.firstName} ${this.firstName} ${this.lastName} ${this.lastName}`
  }


  // getWeakestElement() {

  // }

  getFirstNameLastInitial() {
    // return `${this.firstName} ${this.lastName[0]}.`
  }

  getFirstInitialLastName() {
    // return `${this.firstName[0]}. ${this.lastName}`
  }

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

  // say(message) {
  //   tts(message)
  // }
}