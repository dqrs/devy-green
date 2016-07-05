/*
  This JSON object contains the static data for features used by all students.
*/


// TODO: Individualize these
globalInstrux = {
  "expression-empty": "Enter the expression that will return your trainer's firstName.",
  "expression-correct": "Correct expression! Click run to continue.",
  "expression-incorrect": "Incorrect! Check your expression carefully, and try again.",
  "execution": 'returned the value below.'
}

features = {
  "getAppName": {
    id: "getAppName",
    displayType: 'tableType',
    codeTag: true,
    placeholderText: "App Name",
    mode: 'debug',
    instrux: "Call the function that will return your app's name",
    type: "function",
    expressionExpected: "getAppName()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getAppAuthor": {
    id: "getAppAuthor",
    displayType: 'tableType',
    codeTag: true,
    placeholderText: "App Author",
    mode: 'debug',
    instrux: "Call the function that will return your app's author",
    type: "function",
    expressionExpected: "getAppAuthor()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getAppVersion": {
    id: "getAppVersion",
    displayType: 'tableType',
    codeTag: true,
    placeholderText: "App Version",
    mode: 'debug',
    instrux: "Call the function that will return your app's version #",
    type: "function",
    expressionExpected: "getAppVersion()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getAppCredits": {
    id: "getAppCredits",
    displayType: 'tableType',
    codeTag: true,
    placeholderText: "App Credits",
    mode: 'debug',
    instrux: "Call the function that will return your app's credits",
    type: "function",
    expressionExpected: "getAppCredits()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getAppYear": {
    id: "getAppYear",
    displayType: 'tableType',
    codeTag: true,
    mode: 'debug',
    placeholderText: "App Year",
    instrux: "Call the function that will return the year you created the app",
    type: "function",
    expressionExpected: "getAppYear()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "createTrainer": {
    id: "createTrainer",
    displayType: 'tableType',
    codeTag: true,
    mode: 'debug',
    placeholderText: "Pokemon Trainer",
    instrux: "Call the function that will create your Pokemon Trainer",
    type: "function",
    expressionExpected: "constructor",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
    trainerVar: false
  },
  "firstName": {
    id: "firstName",
    displayType: 'tableType',
    type: "variable",
    codeTag: true,
    mode: 'debug',
    placeholderText: "First Name",
    expressionExpected: "t.firstName",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "lastName": {
    id: "lastName",
    displayType: 'tableType',
    type: "variable",
    codeTag: true,
    mode: 'debug',
    placeholderText: "Last Name",
    instrux: "Call the function that will return your trainer's last name",
    expressionExpected: "t.lastName",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "age": {
    id: "age",
    displayType: 'tableType',
    type: "variable",
    codeTag: true,
    mode: 'debug',
    placeholderText: "Age",
    expressionExpected: "t.age",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "slogan": {
    id: "slogan",
    displayType: 'tableType',
    type: "variable",
    expressionExpected: "t.slogan",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "favoriteElement": {
    id: "favoriteElement",
    displayType: 'tableType',
    type: "variable",
    codeTag: true,
    mode: 'debug',
    placeholderText: "Favorite Element",
    expressionExpected: "t.favoriteElement",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "favoriteColor": {
    id: "favoriteColor",
    displayType: 'tableType',
    type: "variable",
    codeTag: true,
    mode: 'debug',
    placeholderText: "Favorite Color",
    expressionExpected: "t.favoriteColor",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "energy": {
    id: "energy",
    displayType: 'barType',
    type: "variable",
    expressionExpected: "t.energy",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "happiness": {
    id: "happiness",
    displayType: 'barType',
    type: "variable",
    expressionExpected: "t.happiness",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "confidence": {
    id: "confidence",
    displayType: 'barType',
    type: "variable",
    expressionExpected: "t.confidence",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "intelligence": {
    id: "intelligence",
    displayType: 'barType',
    type: "variable",
    expressionExpected: "t.intelligence",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "strength": {
    id: "strength",
    displayType: 'barType',
    type: "variable",
    expressionExpected: "t.strength",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "coins": {
    id: "coins",
    displayType: 'barType',
    type: "variable",
    expressionExpected: "t.coins",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getFullName": {
    id: "getFullName",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getFullName()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getReverseName": {
    id: "getReverseName",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getReverseName()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getDoubleFullName": {
    id: "getDoubleFullName",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getDoubleFullName()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getDoubleReverseName": {
    id: "getDoubleReverseName",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getDoubleReverseName()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getImageFileName": {
    id: "getImageFileName",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getImageFileName()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getFirstNameLastInitial": {
    id: "getFirstNameLastInitial",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getFirstNameLastInitial()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getLastNameFirstInitial": {
    id: "getLastNameFirstInitial",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getLastNameFirstInitial()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getAgeInMonths": {
    id: "getAgeInMonths",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getAgeInMonths()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getAgeInWeeks": {
    id: "getAgeInWeeks",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getAgeInWeeks()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getAgeInDays": {
    id: "getAgeInDays",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getAgeInDays()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getAgeInHours": {
    id: "getAgeInHours",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getAgeInHours()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getAgeInMinutes": {
    id: "getAgeInMinutes",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getAgeInMinutes()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "getAgeInSeconds": {
    id: "getAgeInSeconds",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.getAgeInSeconds()",
    expressionEntered: '',
    hasReturnValue: true,
    status: "expression-empty",
    complete: false,
  },
  "writeHi": {
    id: "writeHi",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.writeHi()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  },
  "writeSlogan": {
    id: "writeSlogan",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.writeSlogan()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  },
  "write": {
    id: "write",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.write()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  },
  "sayHi": {
    id: "sayHi",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.sayHi()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  },
  "saySlogan": {
    id: "saySlogan",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.saySlogan()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  },
  "say": {
    id: "say",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.say()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  },
  "work": {
    id: "work",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.work()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  },
  "rest": {
    id: "rest",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.rest()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  },
  "exercise": {
    id: "exercise",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.exercise()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  },
  "watchTelevision": {
    id: "watchTelevision",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.watchTelevision()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  },
  "readBook": {
    id: "readBook",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.readBook()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  },
  "takeCompliment": {
    id: "takeCompliment",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.takeCompliment()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  },
  "takeInsult": {
    id: "takeInsult",
    displayType: 'tableType',
    type: "method",
    expressionExpected: "t.takeInsult()",
    expressionEntered: '',
    hasReturnValue: false,
    status: "expression-empty",
    complete: false,
  }
}