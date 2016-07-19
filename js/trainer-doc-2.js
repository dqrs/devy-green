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