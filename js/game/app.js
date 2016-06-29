function getAppName() {
  return "Trainer Studio"
}

function getAppAuthor() {
  return "Gerardo Student"
}

function getAppVersion() {
  return 1.0
}

function isAppComplete() {
  return false
}

function getAppCredits() {
  return "Created by Gerardo"
}

function getAppYear() {
  return 2016
}

// Version 2 (With Classes)
function getTrainer() {
  var t = new Trainer()
  t.firstName = "Ash"
  t.lastName = "Ketchum"
  t.age = 14
  t.slogan = "Gotta catch 'em all"
  t.favoriteElement = "Fire"
  t.favoriteColor = "red"
  
  // t.lastName = "Gggggggg"
  // var t = new Trainer({
  //   firstName: "Ash",
  //   lastName: "Ketchfshsfhjum",
  //   age: 19,
  //   slogan: "Gotta catch 'em all",
  //   favoriteElement: "Fire",
  //   favoriteColor: "red",
  //   energy: 75,
  //   happiness: 40,
  //   confidence: 90,
  //   intelligence: 60,
  //   strength: 80
  // })

  return t
}