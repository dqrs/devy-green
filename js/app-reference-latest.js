/* app.js
  This file will contain the code you'll write to
  personalize your app and bring it to life.
*/

/* 
  appName [variable // string]:

  - Stores your application's name

  - For Example:
    * Pokemon Playground 2000
    * Shdave D's Awesome App
*/


/* 
  appVersion [variable // string]:

  - Stores your application's version

  - For Example:
    * 0.4 alpha
    * 1.0
*/
var appVersion = "beta"

/* 
  appYear [variable // integer]:
  
  - Stores the year your application was created
*/
var appYear = "2016"

/* 
  authorFirstName [variable // string]: 

  - Stores your first name
*/
var authorFirstName = 'Ts'

/* 
  authorLastName [variable // string]: 

  - Stores your last name
*/
var authorLastName = 'Last'

/*
  getAppAuthor [function]:

  - Parameters: none

  - Action: constructs the author's full name from
    {authorFirstName} and {authorLastName}

  - Return Value: author's full name
*/
function getAppAuthor() {
  return authorFirstName + ' ' + authorLastName
}


/* 
  appCity [variable // string]: 

  - Stores the name of your app's city

  - For Example:
    * Sherman Oaks
    * Las Vegas
    * Austin
*/
var appCity = "Reno"
var appState = "Nevada"

/* 
  appState [variable // string]: 

  - Stores the name of your app's state

  - For Example:
    * California
    * Texas
    * Nevada
*/

/*
  getAppLocation [function]:

  - Parameters: none

  - Action: constructs a string that contains your {appCity}
    and {appState} formatted in the usual way.
  }

  - For example: 
    * 'Austin, Texas'
    * 'Sacramento, California'
    * etc.

  - Return Value: location [string]
*/
function getAppLocation() {
  var location = `${appCity}, ${appState}`
  return location
}

/*
  getAppCredits [function]:

  - Parameters: none

  - Action: constructs the app's 'credits' message, which 
    should contain:
      * the app's name
      * author's full name
      * the app's year 
      * plus any other text you want to add.

  - Return Value: app credits [string]

  - For Example:
    * "Trainer Studio was created in 2016 by Sammy Student"
    * "Sammy Student created Trainer Studio in 2016 :)"
*/
function getAppCredits() {
  return "Something"
}


/*
  getAppIcon [function]:
  
  - Parameters: iconNumber [integer]
  
  - Action: constructs the filename of your app's icon from the
    {iconNumber} provided. The filename should include the full path to the icon file.
  
  - Return Value: icon filename [string]
  
  - For Example:
    * getAppIcon(1) should return `assets/icons/1.png`
    * getAppIcon(4) should return `assets/icons/4.png`
*/
function getAppIcon(num) {
  return `assets/icons/4.png`
}


/*
  setFont [function]:

  - Parameters: fontNumber [number]
  
  - Action: sets the app's default font to a font-family
    based on the {fontNumber} given, as shown below.

      fontNumber:         Action:  
      1             ==>   set to 'serif'
      2             ==>   set to 'cursive'
      3             ==>   set to 'fantasy'
      4             ==>   set to 'monospace'
      5             ==>   set to 'sans-serif'
  
  - Return Value: none
  
  - Hint: Take a look in the docs for a function that can set
  the app's default font

  - Extra Credit:
    * Return the string "Success!" if the font was set
    successfully. Otherwise, return "Error!"
    * If you're on a mac, open the Font Book application to see
    all the fonts available on your computer...
*/
function setFont(fontNum) {
  if (fontNum === 1) {
    setDefaultFont('serif')
  } else if (fontNum === 2) {
    setDefaultFont('cursive')
  }
}


/*
  setBackgroundColor [function]:

  - Parameters: colorName [string]

  - Action: sets your app's background color to the {colorName}
    given. Make sure your function can successfully set the color
    when given 'red', 'green', 'blue', 'black', and 'white'.

  - Return Value: none

  - Hint: Look in the docs for a function that can set the color
    of an HTML element. You'll have to figure out how to translate
    'red' to an RGB value.

  - Extra Credit: Add support for 'pink', 'orange', and 'yellow'.
*/
function setBackgroundColor(colorName) {
  if (colorName === 'red') {
    // set the background color to a red color


  } else if (colorName === 'green') {
    // set the background color to a green color
    // ...

  } else if (colorName === 'blue') {

    // ...
  
  }
}

/*
  setCodeTagColor [function]:

  - Parameters: colorName [string]

  - Action: sets your app's code tag color to the {colorName}
    given. Make sure your function can successfully set the color
    when given 'black', 'dark gray', 'dark blue', and 'dark red.'

  - Return Value: A confirmation message stating what the code
    tag color was set to. [string]
    - For example: `Code tag color was set to dark gray`

  - Hint: Make sure to write the setBackgroundColor function
    before trying to write this function.
*/




/*
  setWallpaper [function]:

  - Parameters: wallpaperNumber

  - Action: Sets the app's wallpaper according to the 
    {wallpaperNumber} given. 

  - For example, setWallpaper(3) should set the wallpaper
    to the `assets/wallpaper/3.jpg`
  
  - Return Value: none

  - Hint: Look in the docs for a function that can set the wallpaper.

  - Extra Credit: If the user sets the wallpaper to 0,
    remove the wallpaper.
*/



/* 
  appLocationURL [variable // string]: 

  - stores the URL to a Google Map of your app's location

  - For Example:
    * https://www.google.com/maps/place/9+Dots/@34.0880332,-118.3411233,17z/data=!3m1!4b1!4m5!3m4!1s0x80c2bf2c60ad3e81:0x2efadb41115b9452!8m2!3d34.0880332!4d-118.3389293

  - Hint: Go to maps.google.com and type in your app's location name.
*/



/*
  getAppMapLink [function]:

  - Parameters: none

  - Action: constructs the HTML code for a link to a Google Map of
    your app's location.

    * The link should use your {appLocationURL} as its href.
    * The link should display your app's location, using the
      getAppLocation function you wrote.
    
  - Return Value: map link [string]

  - For Example:
    getAppMapLink() could return:
    `<a href="https://www.google.com/maps/place/9+Dots/@34.0880332,-118.3411233,17z/data=!3m1!4b1!4m5!3m4!1s0x80c2bf2c60ad3e81:0x2efadb41115b9452!8m2!3d34.0880332!4d-118.3389293">Hollywood, CA</a>`

  - Hint: Look at the API docs for a function to create
    links.
*/



/*
  getAppSeason [function]:

  - Parameters: month [string]

  - Action: determines the season that the month is in(  
    Summer/Fall/Winter, etc.) 

  - Return Value: the season [string]

*/
function getAppSeason(month) {
  var springMonths = ["March", "April", "May"]
  var summerMonths = ["June", "July", "August"]
  var fallMonths = ["September", "October", "November"]
  var winterMonths = ["December", "January", "February"]
  
  
}




















