class Trainer {
  
  /*
    Static Attributes:
    firstName
    lastName
    age
    slogan
    favoriteColor
    favoriteELement

    // State/Vitals:
    happiness
    intelligence
    energy
    health
    confidence
    money

    // void functions
    sayHi()
    sayMotto()
    say(message)

    // string interpolation
    getFullName()
    getReverseName()
    getDoubleName()
    getFirstNameLastInitial()
    getFirstInitialLastName()
    getImageFileName()
    
    // conditionals threshold functions
    getConfidenceDescription()
    getHappinessDescription()
    getIntelligenceDescription()
    getLeague()
    // conditionals other
    getWeakestElement()

    // calculations
    getAgeInMonths()
    getAgeInDays()
    getAgeInWeeks()
    getAgeInMinutes()
    getAgeInSeconds()

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
  getImageFileName() {
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