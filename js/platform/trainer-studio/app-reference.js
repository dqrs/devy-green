/* 
  appName [variable]:
  - stores your application's name
*/
var appName = "Trainer Studio"

/* 
  appVersion [variable]:
  - stores your application's name
*/
var appVersion = "1.0 alpha"

/* 
  appYear [variable]:
  - stores the year your application was created
*/
var appYear = 2016

/* 
  authorFirstName [variable]: 
  - stores your first name
*/

var authorFirstName = "Gerardo"
/* 
  authorlastName [variable]: 
  - stores your first name
*/
var authorLastName = "Student"

/* 
  authorFirstName [variable]: 
  - stores your first name
*/

/*
  getAppAuthor [function]:
  - parameters: none
  - action: constructs the app author's full name from
    authorFirstName and authorLastName
  - return value: author's full name
*/
function getAppAuthor() {
  return authorFirstName + ' ' + authorLastName
}

/*
  getAppCredits [function]:
  - parameters: none
  - action: constructs the app's 'credits' message, which 
    should contain:
      * the app's name
      * author's full name
      * the app's year 
      * plus any other text you want to add.
      For example:
      "Trainer Studio was created in 2016 by Sammy Student"
  - return value: app's 'credits' [string]
*/
function getAppCredits() {
  return `${appName} was created by with love by ${getAppAuthor()} at 9 Dots in $`
}

/* 
  appLocation [variable]: 
  - stores your first name
*/
var appLocation = "Los Angeles"

/*
  getAppLocationLink [function]:
  - parameters: none
  - action: constructs the app author's full name from
    authorFirstName and authorLastName
  - return value: author's full name
*/
function getAppLocationLink() {
  var mapsURL = "https://www.google.com/maps/place/"
  mapsURL += appLocation.replace(" ", "+")
  return createLink(appLocation, mapsURL)
}


/*
  getAppSeason [function]:
  - parameters: month [string]
  - action: determines the season that the month is in(  
    Summer/Fall/Winter, etc.) 
  - return value: the season [string]
*/
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


/* 
  appLocation [variable]: 
  - stores your first name
*/
var appIconNumber = 3

/*
  getAppLocationLink [function]:
  - parameters: none
  - action: constructs the app author's full name from
    authorFirstName and authorLastName
  - return value: author's full name
*/
function getAppIcon() {
  return `assets/icons/${appIconNumber}.png`
}

/*
  setBackgroundColor [function]:
  - parameters: none
  - action: constructs the app author's full name from
    authorFirstName and authorLastName
  - return value: author's full name
*/
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

/*
  setHighlightColor [function]:
  - parameters: none
  - action: constructs the app author's full name from
    authorFirstName and authorLastName
  - return value: author's full name
*/
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

/*
  setFont [function]:
  - parameters: none
  - action: constructs the app author's full name from
    authorFirstName and authorLastName
  - return value: author's full name
*/
function setFont(fontName) {
  var success = setDefaultFont(fontName)
  if (success) {
    return "Success: Font set successfully!"
  } else {
    return "Error: This computer does not support that font!"
  }
}

/*
  setWallpaper [function]:
  - parameters: none
  - action: constructs the app author's full name from
    authorFirstName and authorLastName
  - return value: author's full name
*/
function setWallpaper(wallpaperNumber) {
  if (wallpaperNumber == 0) {
    setHTMLBackgroundImage(false)
  } else if (wallpaperNumber > 0 && wallpaperNumber <= 10) {
    setHTMLBackgroundImage(`assets/wallpaper/${wallpaperNumber}.jpg`)
    return true
  } else {
    return false
  }
}


























