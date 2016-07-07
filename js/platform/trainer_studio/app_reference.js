var appName = "Trainer Studio"

var appVersion = "1.0 alpha"

var appYear = 2016

var authorFirstName = "Gerardo"
var authorLastName = "Student"
function getAppAuthor() {
  return authorFirstName + ' ' + authorLastName
}

var appLocation = "Los Angeles"
function getAppLocationMap() {
  var mapsURL = "https://www.google.com/maps/place/"
  mapsURL += appLocation.replace(" ", "+")
  return createLink(appLocation, mapsURL)
}

function getAppSeason(month) {
  var springMonths = ["March", "April", "May"]
  var summerMonths = ["June", "July", "August"]
  var fallMonths = ["September", "October", "November"]
  var winterMonths = ["December", "January", "February"]
  
  if (springMonths.includes(month)) {
    return "Spring"
  } else if (summerMonths.includes(month)) {
    return "Summer"
  } else if (fallMonths.includes(month)) {
    return "Fall"
  } else if (winterMonths.includes(month)) {
    return "Winter"
  } else {
    return ""
  }
}

function getAppCredits() {
  return `${appName} was created by with love by ${getAuthorFullName()} at 9 Dots in ${appLocation}`
}


var appIconNumber = 3
function getAppIcon() {
  return `assets/icons/${appIconNumber}.png`
}

// TODO:
function setAppColor() {

}

// TODO:
function setAppFont(fontNumber) {
  if (wallpaperNumber >= 1 && wallpaperNumber <= 10) {
    setHTMLBackgroundImage(`assets/wallpaper/${wallpaperNumber}.jpg`)
    return true
  } else {
    return false
  }
}


function setAppWallpaper(wallpaperNumber) {
  if (wallpaperNumber >= 1 && wallpaperNumber <= 10) {
    setHTMLBackgroundImage(`assets/wallpaper/${wallpaperNumber}.jpg`)
    return true
  } else {
    return false
  }
}


































