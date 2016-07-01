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
function createTrainer() {
  var t = new Trainer()
  t.firstName = "David Gershuni I"
  t.lastName = "Ketchum"
  t.age = 14
  t.slogan = "Gotta catch 'em all"
  t.favoriteElement = "Fire"
  t.favoriteColor = "red"
  
  return t
}