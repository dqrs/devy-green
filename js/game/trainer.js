class Trainer {
  
  /*
    
  */
  constructor(options) {
    this.firstName = options.firstName
    this.lastName = options.lastName
    this.age = options.age
    this.favoriteElement = options.favoriteElement
    this.favoriteColor = options.favoriteColor
    this.slogan = options.slogan
    this.energy = options.energy
    this.happiness = options.happiness
    this.confidence = options.confidence
    this.intelligence = options.intelligence
    this.strength = options.strength
  }

  getFullName() {

  }

  getReverseName() {
    
  }

  getDoubleFullName() {
    // return `${this.firstName} ${this.firstName} ${this.lastName} ${this.lastName}`
  }

  getImageFileName() {
    // return `${this.firstName} ${this.lastName}.png`
  }

  getFirstNameLastInitial() {
  }

  getFirstInitialLastName() {
    // return `${this.firstName[0]}. ${this.lastName}`
  }

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
    // tts(this.slogan)
  }

  // say(message) {
  //   tts(message)
  // }
}