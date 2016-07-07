// new Trainer()

class Trainer {  

  constructor() {
    this.firstName = 'Shdave'
    this.lastName = 'D'
    this.age = 30
    this.energy = 80
    this.happiness = 50
    this.slogan = 'Happiness only with success'
  }

  /*
   This method should construct and return the trainer's full name.
  */
  getFullName() {
    return this.firstName + ' ' + this.lastName
  }

  getReverseName() {
    return this.lastName + ', ' + this.firstName
  }

  getAgeInMonths() {
    return this.age * 12
  }

  getAgeInDays() {
    return this.getAgeInMonths() * 30
  }

  writeHi() {
    chatBubble('Hi')
  }

  writeSlogan() {
    chatBubble(this.slogan)
  }

  write(input) {
    chatBubble(input)
  }















  //getReverseName() {
    //return this.lastName + '' + this.firstName
  //}

  // getDoubleFullName() {
  //   return `${this.firstName} ${this.firstName} ${this.lastName} ${this.lastName}`
  // }

  // getFirstNameLastInitial() {
  //   // return `${this.firstName} ${this.lastName[0]}.`
  // }

  // getFirstInitialLastName() {
  //   // return `${this.firstName[0]}. ${this.lastName}`
  // }

  // /*
  //   Returns the name of the Pokemon's image file.
  //   The image changes based on the Pokemon's species and
  //   whether it is alive or not.
  //   For example:
  //     a Charmander pokemon's image file should be:
  //       'Charmander.png' if it is alive
  //       and 'Charmander-Dead.png' if it is dead.
  //     a Blastoise pokemon's image file should be:
  //       'Blastoise.png' if it is alive
  //       and 'Blastoise-Dead.png' if it is dead.
  // */
  // // getImageFileName() {
  // //   return `${this.firstName} ${this.lastName}.png`
  // // }

  // // getLeague() {
  // //   // return "Implement this"
  // // }

  // // getWeakestElement() {

  // // }

  // writeHi() {
  //   chatBubble("Hi")
  // }

  // writeSlogan() {
  //   chatBubble(this.slogan)
  // }

  // sayHi() {
  //   textToSpeech("Hi!")
  // }

  // saySlogan() {
  //   textToSpeech(this.slogan)
  // }

  // work() {
  //   this.energy -= 10
  //   this.happiness -= 20
  //   this.coins += 25
  // }

}