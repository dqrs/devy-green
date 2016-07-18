/* trainer.js documentation */

  /*
    constructor [method]:

    - parameters: none

    - action: creates a new Pokemon Trainer

    - return value: a new Pokemon Trainer

  */



  /*
    Note: For all of the specs below, assume the trainer has
    firstName: `Ash` and lastName: `Ketchum`
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
 