var appName = "Trainer Studio 3"

var appVersion = "1.0 alpha"

var appYear = 2016

var authorFirstName = "Gerardo"
var authorLastName = "Student"
function getAppAuthor() {
  return authorFirstName + ' ' + authorLastName
}

var appLocation = "Los Angeles"
function getAppLocationLink() {
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
  return `${appName} was created by with love by ${getAppAuthor()} at 9 Dots in ${appLocation}`
}

var appIconNumber = 3
function getAppIcon() {
  return `assets/icons/${appIconNumber}.png`
}

function setBackgroundColor(color) {
  if (color === 'red') {
    setColor('background', 210, 40, 40)
  } else if (color === 'green') {
    setColor('background', 40, 210, 40)
  } else if (color === 'blue') {
    setColor('background', 40, 40, 210)
  } else if (color === 'gray') {
    setColor('background', 40, 40, 40)
  }
}

function setHighlightColor(color) {
  if (color === 'light') {
    setColor('highlight', 120, 150, 120)
    return `Highlight color set to ${color}`
  } else if (color === 'dark') {
    setColor('highlight', 30, 30, 50)
    return `Highlight color set to ${color}`
  } else if (color === 'special') {
    setColor('highlight', 40, 180, 180)
    return `Highlight color set to ${color}`
  }
}

function setFont(fontName) {
  setDefaultFont(fontName)
}


function setWallpaper(wallpaperNumber) {
  if (wallpaperNumber == 0) {
    setHTMLBackgroundImage(false)
  } else if (wallpaperNumber >= 0 && wallpaperNumber <= 10) {
    setHTMLBackgroundImage(`assets/wallpaper/${wallpaperNumber}.jpg`)
    return true
  } else {
    return false
  }
}


































