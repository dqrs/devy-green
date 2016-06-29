class Trainer {  

  getFullName() {
    return this.firstName + ' ' + this.lastName
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
    // chatBubble("Hi")
  }

  writeSlogan() {
    // chatBubble(this.slogan)
  }

  sayHi() {
    // tts("Hi!")
  }

  saySlogan() {
    textToSpeech("Hi!")
  }

  saySlogan() {
    textToSpeech(this.slogan)
  }

}