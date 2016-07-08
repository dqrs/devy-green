function testAttribute(attr) {
  return function (test) {
    var trainer = new Trainer()
    test.ok(trainer[attr], `Trainer's ${attr} is defined.`)
    test.end()
  }
}

function testAppFuntion(funcName) {
  return function(test) {
    // var returnVal = window[funcName]()
    // test.ok(returnVal, `${funcName}() is defined and returns a value`)
    test.ok(true, "This test has not yet been implemented.")
    test.end()
  }
}

var tests  = {
  'placeholder': function(test) {
    test.ok(true, "This test has not yet been implemented.")
    test.end()
  },
  'getAppName': testAppFuntion('getAppName'),
  'getAppVersion': testAppFuntion('getAppVersion'),
  'getAppAuthor': testAppFuntion('getAppAuthor'),
  'getAppYear': testAppFuntion('getAppYear'),
  'getAppCredits': testAppFuntion('getAppCredits'),
  'createTrainer': function(test) {
    var t = new Trainer()
    test.ok(t, "Trainer object created!")
    test.end()
  },
  'firstName': testAttribute('firstName'),
  'lastName': testAttribute('lastName'),
  'age': testAttribute('age'),
  'slogan': testAttribute('slogan'),
  'favoriteElement': testAttribute('favoriteElement'),
  'favoriteColor': testAttribute('favoriteColor'),
  'energy': testAttribute('energy'),
  'happiness': testAttribute('happiness'),
  'confidence': testAttribute('confidence'),
  'intelligence': testAttribute('intelligence'),
  'strength': testAttribute('strength'),
  'coins': testAttribute('coins'),
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
    var chatBubbleCalled = 0
    var chatBubbleArg = ''
    var realChatBubble = chatBubble
    chatBubble = function(msg) { 
      chatBubbleCalled++
      chatBubbleArg = msg
    }

    var trainer = createTestTrainer()
    trainer.writeHi()
    test.equal(
      chatBubbleCalled,
      1,
      "Called chatBubble function"
    )

    test.equal(
      chatBubbleArg,
      "Hi",
      "Printed expected message 'Hi'"
    )
    // test.fail(false, false, "This is not a real test yet.")   
    chatBubble = realChatBubble 
    test.end()
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