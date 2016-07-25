var errorOccurredMessage = `Tests could not be run because an error occurred.`


function testGlobalVar(varName, type) {
  return function (test) {
    test.ok(window[varName], `${varName} is defined.`)
    test.equal(typeof window[varName], type, `${varName} is a ${type}.`)
    test.end()
  }
}

function testAppFunction(funcName) {
  return function(test) {
    test.ok(window[funcName], "Function is defined.")
    test.end()
  }
}

function testAttribute(attr, type) {
  return function (test) {
    try {
      var trainer = new Trainer()
      test.ok(trainer[attr], `Trainer's ${attr} is defined.`)
      test.equal(typeof trainer[attr], type,  `Trainer's ${attr} is a ${type}.`)
    } catch (err) {
      test.fail(errorOccurredMessage)
    } finally {
      test.end()
    }
  }
}

function testCurrentStateAttribute(attr) {
  return function (test) {
    try {
      var trainer = new Trainer()
      test.ok(trainer[attr], `Trainer's ${attr} is defined.`)
      test.equal(typeof trainer[attr], 'number',  `Trainer's ${attr} is a number.`)
      test.ok(trainer[attr] >= 0 && trainer[attr] <= 100, `Trainer's ${attr} is between 0 and 100.`)
    } catch (err) {
      test.fail(errorOccurredMessage)
    } finally {
      test.end()
    }
  } 
}
var tests  = {
  'placeholder': function(test) {
    test.ok(true, "This test has not yet been implemented.")
    test.end()
  },
  'appName': testGlobalVar('appName', "string"),
  'appVersion': testGlobalVar('appVersion', "string"),
  'appYear': testGlobalVar('appYear', "number"),
  'getAppAuthor': function(test) {
    try {
      
      test.ok(
        window['getAppAuthor'], 
        "Is defined"
      )
      
      var result = getAppAuthor()

      test.ok(
        result.includes(window.authorFirstName), 
        "Includes app author's first name"
      )
      test.ok(
        result.includes(window.authorLastName), 
       "Includes app author's last name"
      )
      test.ok(
        result.includes(" "), 
        "Includes a space"
      )
      test.equal(result, `${window.authorFirstName} ${window.authorLastName}` , "Matches expected output exactly")
    } catch (err) {
      test.fail(errorOccurredMessage)
    } finally {
      test.end()
    }
  },
  'getAppLocation': function(test) {
    try {
      
      test.ok(
        window['getAppLocation'], 
        "Is defined"
      )
      
      var result = getAppLocation()

      test.ok(
        result.includes(window.appCity), 
        "Includes app's city"
      )
      test.ok(
        result.includes(window.appState), 
       "Includes app's state"
      )
      test.ok(
        result.includes(", "), 
        "Includes a comma and a space"
      )
      test.equal(result, `${window.appCity}, ${window.appState}` , "Matches expected output exactly")
    } catch (err) {
      test.fail(errorOccurredMessage)
    } finally {
      test.end()
    }
  },
  'getAppCredits': function(test) {
    try {
      
      test.ok(
        window['getAppCredits'], 
        "Is defined"
      )
      
      var result = getAppCredits()

      test.ok(
        result.includes(window.appName), 
        "Includes app's name"
      )
      test.ok(
        result.includes(window.authorFirstName + " " + window.authorLastName), 
       "Includes author's full name"
      )
      test.ok(
        result.includes(appYear), 
       "Includes app's year"
      )
    } catch (err) {
      test.fail(errorOccurredMessage)
    } finally {
      test.end()
    }
  },
  'getAppIcon': function(test) {
    try {
      
      test.ok(
        window['getAppIcon'], 
        "Is defined"
      )
      
      var result = getAppIcon(3)

      test.ok(
        result.includes(`assets/icons/`), 
        "Includes path to the icons folder"
      )

      test.ok(
        result.includes(`.png`), 
        "Includes .png extension"
      )
      var r1 = getAppIcon(1)
      var r3 = getAppIcon(3)
      var r4 = getAppIcon(4)
      test.ok(
        r1.includes('1') && r3.includes('3') && r4.includes('4'), 
       "Includes correct icon file"
      )
      test.equal(
        getAppIcon(5), 
        `assets/icons/5.png`,
       "Matches expected output exactly"
      )
    } catch (err) {
      test.fail(errorOccurredMessage)
    } finally {
      test.end()
    }
  },
  'getAppLocationLink': testAppFunction('getAppLocationLink'),
  'setFont': function(test) {
    var spy = createSpy('setDefaultFont')

    try {

      test.ok(
        window['getAppCredits'], 
        "Is defined"
      )

      setFont(1)

      test.equal(
        spy.numCalls,
        1,
        "Calls the correct API function (setDefaultFont)"
      )

      setFont(1)
      var a1 = spy.args[0]
      test.equal(
        a1, 
       "serif",
        "Sets the font to 'serif' for fontNumber 1"
      )
      setFont(2)
      var a2 = spy.args[0]
      test.equal(
        a2, 
       "cursive",
        "Sets the font to 'cursive' for fontNumber 2"
      )
      setFont(3)
      var a3 = spy.args[0]
      test.equal(
        a3, 
       "fantasy",
        "Sets the font to 'fantasy' for fontNumber 3"
      )
      setFont(4)
      var a4 = spy.args[0]
      test.equal(
        a4, 
       "monospace",
        "Sets the font to 'monospace' for fontNumber 4"
      )
      setFont(5)
      var a5 = spy.args[0]
      test.equal(
        a5, 
       "sans-serif",
        "Sets the font to 'sans-serif' for fontNumber 5"
      )
   
    } catch (err) {
      test.fail(errorOccurredMessage)
    } finally {
      test.end()
      restoreSpy(spy)
    }
  },
  'setBackgroundColor': testAppFunction('setBackgroundColor'),
  'setCodeTagColor': testAppFunction('setCodeTagColor'),
  'setWallpaper': testAppFunction('setWallpaper'),
  'getAppSeason': function(test) {
    try {

      test.ok(
        window['getAppSeason'], 
        "Is defined"
      )

      var r1 = getAppSeason(1)
      var r2 = getAppSeason(2)

      test.ok(
        r1 === 'Winter' && r2 === 'Winter', 
        "Handles Winter months correctly (excluding December)"
      )

      var r3 = getAppSeason(3)
      var r4 = getAppSeason(4)
      var r5 = getAppSeason(5)

      test.ok(
        r3 === 'Spring' && r4 === 'Spring' && r5 === 'Spring',
        "Handles Spring months correctly"
      )

      var r6 = getAppSeason(6)
      var r7 = getAppSeason(7)
      var r8 = getAppSeason(8)

      test.ok(
        r6 === 'Summer' && r7 === 'Summer' && r8 === 'Summer',
        "Handles Summer months correctly"
      )

      var r9 = getAppSeason(9)
      var r10 = getAppSeason(10)
      var r11 = getAppSeason(11)

      test.ok(
        r9 === 'Fall' && r10 === 'Fall' && r11 === 'Fall',
        "Handles Fall months correctly"
      )

      var r12 = getAppSeason(12)
      test.ok(
        r12 === 'Winter',
        "Handles December (12) correctly"
      )
   
    } catch (err) {
      test.fail(errorOccurredMessage)
    } finally {
      test.end()
      restoreSpy(spy)
    }
  },
  'createTrainer': function(test) {
    var t
    try {
      t = new Trainer()
    } catch (err) {
      t = false
    }
    test.ok(t, "Trainer object created!")
    test.end()
  },
  'firstName': testAttribute('firstName', 'string'),
  'lastName': testAttribute('lastName', 'string'),
  'age': testAttribute('age', 'number'),
  'slogan': testAttribute('slogan', 'string'),
  'favoriteElement': testAttribute('favoriteElement', 'string'),
  'favoriteColor': testAttribute('favoriteColor', 'string'),
  'energy': testCurrentStateAttribute('energy'),
  'happiness': testCurrentStateAttribute('happiness'),
  'confidence': testCurrentStateAttribute('confidence'),
  'intelligence': testCurrentStateAttribute('intelligence'),
  'strength': testCurrentStateAttribute('strength'),
  'coins': testAttribute('coins', "number"),
  'getFullName': function (test) {
    var trainer = createTestTrainer()
    var fullName = trainer.getFullName()
    // setTimeOut
    test.ok(
      fullName.includes(trainer.firstName), 
      "Includes trainer's first name"
    )
    test.ok(
      fullName.includes(trainer.lastName), 
      "Includes trainer's last name"
    )
    test.ok(
      fullName.includes(" "), 
      "Includes a space"
    )
    test.equal(fullName, "Robert McTrainer", "Is formatted correctly")
    // alert(JSON.stringify(test))
    test.end()
    // setTimeout(function() {test.end()}, 500)
  },
  'getReverseName': function (test) {
    var trainer = createTestTrainer()
    var fullName = trainer.getReverseName()

    test.ok(
      fullName.includes(trainer.firstName), 
      "Includes trainer's first name"
    )
    test.ok(
      fullName.includes(trainer.lastName), 
      "Includes trainer's last name"
    )
    test.ok(
      fullName.includes(" "), 
      "Includes a space"
    )
    test.ok(
      fullName.includes(","), 
      "Includes a comma"
    )
    test.equal(fullName, "McTrainer, Robert", "Matches expected output exactly")
    test.end()
    // setTimeout(function() {test.end()}, 500)
  },
  'writeHi': function(test) {
    var spy = createSpy('createChatBubble')

    try {
      var trainer = createTestTrainer()
      trainer.writeHi()
      test.equal(
        spy.numCalls,
        1,
        "Called createChatBubble function"
      )

      test.equal(
        spy.args[0],
        "Hi",
        "Printed expected message 'Hi'"
      )
    } catch (err) {
      test.fail(errorOccurredMessage)
    } finally {
      test.end()
      restoreSpy(spy)
    }
  },
  'writeSlogan': function(test) {
    var spy = createSpy('createChatBubble')

    try {
      var trainer = createTestTrainer()
      trainer.writeSlogan()
      
      test.equal(
        spy.numCalls,
        1,
        "Called createChatBubble function"
      )

      test.equal(
        spy.args[0],
        trainer.slogan,
        "Printed the trainer's slogan property"
      )
   
    } catch (err) {
      test.fail(errorOccurredMessage)
    } finally {
      test.end()
      restoreSpy(spy)
    }
  },
  'write': function(test) {
    var spy = createSpy('createChatBubble')

    try {
      var trainer = createTestTrainer()
      var arb = 'Arbitrary text goes here'
      trainer.write(arb)
      
      test.equal(
        spy.numCalls,
        1,
        "Called createChatBubble function"
      )

      test.equal(
        spy.args[0],
        arb,
        "Printed the message supplied by the user"
      )
    } catch (err) {
      test.fail(errorOccurredMessage)
    } finally {
      test.end()
      restoreSpy(spy)
    }
  }
}

function createTestTrainer() {
  var trainer = new Trainer()
  trainer.firstName = "Robert"
  trainer.lastName = "McTrainer"
  trainer.age = 19
  trainer.slogan = "Gotta catch 'em all"
  trainer.favoriteElement = "Fire"
  trainer.favoriteColor = "red"
  trainer.energy = 75
  trainer.happiness = 40
  trainer.confidence = 90
  trainer.intelligence = 60
  trainer.strength = 80
  return trainer
}

function createSpy(funcName, numArgs) {
  var spy = {}
  spy['funcName'] = funcName
  spy['args'] = []
  spy['numCalls'] = 0
  spy['realFunc'] = window[funcName]
  window[funcName] = function() { 
    spy['numCalls']++
    spy['args'] = arguments
  }
  return spy
}

function restoreSpy(spy) {
  window[spy.funcName] = spy.realFunc
}