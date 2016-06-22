var tests  = {
  'firstName': function (test) {
    var trainer = createTestTrainer()
    test.ok(trainer.firstName, "Trainer's first name is defined.")
    test.end()
  },
  'lastName': function (test) {
    var trainer = createTestTrainer()
    test.ok(trainer.lastName, "Trainer's last name is defined.")
    test.end()
  },
  'age': function (test) {
    var trainer = createTestTrainer()
    test.ok(trainer.age, "Trainer's age is defined.")
    test.end()
  },
  'slogan': function (test) {
    var trainer = createTestTrainer()
    test.ok(trainer.slogan, "Trainer's slogan is defined.")
    test.end()
  },
  'getFullName': function (test) {
    var trainer = createTestTrainer()
    var fullName = trainer.getFullName()

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
    test.end()
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
    test.equal(fullName, "McTrainer, Robert", "Is in the correct order")
    test.end()
  },
  'writeHi': function(test) {
    test.fail(false, false, "This is not a real test yet.")   
    test.end()
  }
}