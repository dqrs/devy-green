class Trainer {


  /*
    constructor [method]:

    - Parameters: none

    - Action: creates a new Pokemon Trainer with
      the following properties:
        firstName
        lastName
        age
        slogan
        favoriteElement
        favoriteColor
        
        energy
        happiness
        confidence
        intelligence
        strength

    - Return Value: a new Pokemon Trainer
  */

  /*
  getFullName [method]:

  - Parameters: none

  - Action: constructs the trainer's full name from
    the trainer's {firstName} and {lastName}

  - Return Value: full name [string]

  - Example: `Ash Ketchum` [string]
  */
  


  /*
  getReverseName [method]:

  - Parameters: none

  - Action: constructs the trainer's 'reverse name' from
    the trainer's {lastName}, a comma, and trainer's {firstName}
  
  - Return Value: reverse name [string]

  - Example: `Ketchum, Ash` [string]
  */
  


  /*
  getDoubleFullName [method]:

  - Parameters: none

  - Action: constructs the trainer's 'double full name' from
    the trainer's {firstName} and {lastName} by including
    each name twice.

  - Return Value: double full name [string]

  - Example: `Ash Ash Ketchum Ketchum` [string]
  */
  


  /*
  getDoubleReverseName [method]:

  - Parameters: none

  - Action: constructs the trainer's 'double reverse name' from
    the trainer's {firstName} and {lastName}

  - Return Value: double reverse name [string]

  - Example: `Ketchum Ketchum, Ash Ash` [string]
  */
  


  /*
  getFirstNameLastInitial [method]:

  - Parameters: none

  - Action: constructs a string containing the trainer's {firstName}
    and the first letter of the the trainer's {lastName} followed by
    a period

  - Return Value: first name last initial [string]

  - Example: `Ash K.` [string]

  - Hint: Do a google search for how to get the first letter
    of a string in javascript
  */
  


  /*
  getFirstInitialLastName [method]:

  - Parameters: none

  - Action: constructs a string containing the first letter of the
    trainer's {firstName} followed by a period and the trainer's
    {lastName}

  - Example: `A. Ketchum` [string]

  - Return Value: first initial last name [string]
  */
  

  
  /*
  getElementWeakestAgainst [method]:

  - Parameters: none

  - Action: constructs a string indicating what element this trainer
    is weakest against based on the trainer's favorite element.

      The rules are:
        * Water is weakest against Plant
        * Plant is weakest against Fire
        * Fire is weakest against Water
    
    (We're assuming the trainer's favorite element is 'Water', 'Fire', or 'Plant' only)

  - Return Value: element weakest against [string]
  
  - Example: 
    For a trainer whose favorite element is 'Water',
    this method should return `Plant` [string].

  - Extra Credit:
    If the trainer's element is not 'Water', 'Fire', or 'Plant',
    the method should return 'Error! Element not recognized'
  */
  


  /*
  getElementStrongestAgainst [method]:

  - Parameters: none

  - Action: constructs a string indicating what element this trainer
    is strongest against based on the trainer's favorite element.

      The rules are:
        * Water is strongest against Fire
        * Plant is strongest against Water
        * Fire is strongest against Plant
    
    (We're assuming the trainer's favorite element is 'Water', 'Fire', or 'Plant' only)

  - Return Value: element weakest against [string]
  
  - Example: 
    For a trainer whose favorite element is 'Water',
    this method should return `Fire` [string].

  - Extra Credit:
    If the trainer's element is not 'Water', 'Fire', or 'Plant',
    the method should return 'Error! Element not recognized'
  */
  


  /*
  writeHi [method]:

  - Parameters: none

  - Action: creates a chat bubble near the trainer's picture
    that prints out 'Hi'. 

  - Return Value: none

  - Hint: Look for a function in the API docs that can create
    a chat bubble with the string you give it.
  */  



  /*
  writeSlogan [method]:

  - Parameters: none

  - Action: creates a chat bubble near the trainer's picture
    that prints out the trainer's slogan

  - Return Value: none
  */
  writeSlogan() {
    createChatBubble(this.slogan)
  }    


  /*
  write [method]:

  - Parameters: message [string]

  - Action: creates a chat bubble near the trainer's picture
    that prints out the {message} given

  - Return Value: none
  */
  


  /*
  sayHi [method]:

  - Parameters: none

  - Action: speaks the word 'Hi' out loud on your computer's speakers.

  - Return Value: none

  - Hint: Look for a function in the API docs that can speak
    words out loud by converting text to speech. 
  */
  

  
  /*
  saySlogan [method]:

  - Parameters: none

  - Action: speaks your trainer's slogan out loud on your
    computer's speakers.

  - Return Value: none
  */

  

  /*
  say [method]:

  - Parameters: message [string]

  - Action: speaks out loud whatever {message} is given, using
    your computer's speakers.

  - Return Value: none
  */



  /*
  sleep [method]:

  - Parameters: none

  - Action: simulates your trainer sleeping and updates your
    trainer's variables accordingly.

      Sleeping shoud:
        * restore your trainer's energy to 100
        * add 10 to your trainer's happiness
        * print out a chat bubble with the message 'Sleeping...ZZZ...'
    
  - Return Value: none
  
  - Extra Credit: Make sure your trainer's happiness never goes above 100
  */



  /*
  exercise [method]:

  - Parameters: none

  - Action: simulates your trainer exercising and updates your
    trainer's variables accordingly.

      Exercising shoud:
        * subtract 20 from your trainer's energy
        * add 10 to your trainer's strength
        * add 10 to your trainer's happiness
        * print out a chat bubble with the message 'Exercising...'

      BUT If your trainer does not have at least 20 energy,
      then your trainer should NOT exercise. (i.e. no variables should be changed and no message shoudld be printed)
    
  - Return Value: returns true if your trainer had enough energy
    to exercise and false if not [boolean]

    - Extra Credit: Make sure none of your trainer's variables
      go below 0 or above 100
  */


  
  /*
  work [method]:

  - Parameters: none

  - Action: simulates your trainer working and updates your
    trainer's variables accordingly.

      Working shoud:
        * subtract 25 from your trainer's energy
        * subtract 20 from your trainer's happiness
        * add 45 to your trainer's coins
        * print out a chat bubble with the message 'Working...'

      BUT If your trainer does not have at least 25 energy AND
      at least 20 happiness, then your trainer should NOT work.
      (i.e. no variables should be changed and no message should be printed)
    
  - Return Value: returns true if your trainer was able to work and 
    false if not [boolean]

  - Extra Credit: Make sure none of your trainer's variables
    go below 0 or above 100
  */
 
}