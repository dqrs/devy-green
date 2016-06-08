class TrainerReference {
  
  /*
    // Static Attributes:
    firstName
    lastName
    age
    slogan
    favoriteColor
    favoriteELement

    // Dynamic Attributes (State/Vitals):
    money
    happiness
    intelligence
    energy
    confidence

    // string interpolation
    getFullName()
    getReverseName()
    getDoubleName()
    getFirstNameLastInitial()
    getFirstInitialLastName()
    getImageFileName()
    
    // conditionals - threshold functions
    getConfidenceDescription()
    getHappinessDescription()
    getIntelligenceDescription()
    getLeague()
    
    // conditionals - other
    getWeakestElement()

    // calculations
    getAgeInMonths()
    getAgeInDays()
    getAgeInWeeks()
    getAgeInMinutes()
    getAgeInSeconds()

    // void functions
    printHi()
    printSlogan()
    print(message)
    sayHi()
    saySlogan()
    say(message)
    
    // Methods that update a single instance variable
    setCoins(num)
    lose10Coins()
    gain10Coins()
    loseCoins(num)
    gainCoins(num)


    // Methods that update multiple instance variables
    work()
    rest()
    exercise()
    watchTV()
    readBook()
    takeCompliment()
    takeInsult()

    giveCompliment()
    
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

  /*
    Might not need this... could use constructor
  */
  // copyStaticAttributes(otherTrainer) {
  //   this.firstName = otherTrainer.firstName,
  //   this.lastName = otherTrainer.lastName,
  //   this.age = otherTrainer.age,
  //   this.favoriteElement = otherTrainer.favoriteElement,
  //   this.favoriteColor = otherTrainer.favoriteColor,
  //   this.slogan = otherTrainer.slogan
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
  getImageFileName() {
    return this.getFullName() + '.png'
  }


  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }

  getReverseName() {
    return `${this.lastName}, ${this.firstName}`
  }

  getDoubleFullName() {
    return `${this.firstName} ${this.firstName} ` +
     `${this.lastName} ${this.lastName}`
  }

  getFirstNameLastInitial() {
    return `${this.firstName} ${this.lastName[0]}.`
  }

  getFirstInitialLastName() {
    return `${this.firstName[0]}. ${this.lastName}`
  }  
  
  getElementWeakestAgainst() {

  }

  getElementStrongestAgainst() {

  }

  getAgeDescription() {
    var description = ''
    if (this.age < 10) {
      description = 'kid'
    } else if (this.age < 13) {
      description = 'pre-teen'
    } else if (this.age < 20) {
      description = 'teenager'
    } else {
      description = 'adult'
    }
    return description
  }

  writeHi() {
    chatBubble("Hi")
  }

  writeSlogan() {
    chatBubble(this.slogan)
  }

  sayHi() {
    tts("Hi!")
  }
  
  saySlogan() {
    tts(this.slogan)
  }

}