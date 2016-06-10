var panels = {
  "basic-info": {
    title: "Basic Information",
    mode: "debug",
    displayType: "tableType",
    features: [
      {
        type: "variable",
        expression: "t.firstName",
        hasReturnValue: true,
      },
      {
        type: "variable",
        expression: "t.lastName",
        hasReturnValue: true,
      },
      {
        type: "variable",
        expression: "t.age",
        hasReturnValue: true,
      },
      {
        type: "variable",
        expression: "t.slogan",
        hasReturnValue: true,
      },
      {
        type: "variable",
        expression: "t.favoriteElement",
        hasReturnValue: true,
      },
      {
        type: "variable",
        expression: "t.favoriteColor",
        hasReturnValue: true,
      },
    ]
  },
  "current-state": {
    title: "Current State",
    mode: "debug",
    displayType: "barType",
    features: [
      {
        type: "variable",
        expression: "t.energy",
        hasReturnValue: true,
      },
      {
        type: "variable",
        expression: "t.happiness",
        hasReturnValue: true,
      },
      {
        type: "variable",
        expression: "t.confidence",
        hasReturnValue: true,
      },
      {
        type: "variable",
        expression: "t.intelligence",
        hasReturnValue: true,
      },
      {
        type: "variable",
        expression: "t.strength",
        hasReturnValue: true,
      },
      // {
      //   type: "variable",
      //   expression: "t.coins",
      //   hasReturnValue: true,
      // }
    ]
  },
  "name": {
    title: "Name",
    mode: "debug",
    displayType: "tableType",
    features: [
      {
        type: "method",
        expression: "t.getFullName()",
        hasReturnValue: true,
      },
      {
        type: "method",
        expression: "t.getReverseName()",
        hasReturnValue: true,
      },
      {
        type: "method",
        expression: "t.getDoubleFullName()",
        hasReturnValue: true,
      },
      {
        type: "method",
        expression: "t.getReverseName()",
        hasReturnValue: true,
      },
      {
        type: "method",
        expression: "t.getImageFileName()",
        hasReturnValue: true,
      },
      {
        type: "method",
        expression: "t.getFirstNameLastInitial()",
        hasReturnValue: true,
      },
      {
        type: "method",
        expression: "t.getFirstNameLastInitial()",
        hasReturnValue: true,
      }
    ]
  },
  "age": {
    title: "Age",
    mode: "debug",
    features: [
      {
        type: "method",
        expression: "t.getAgeInMonths()",
        hasReturnValue: true,
      },
      {
        type: "method",
        expression: "t.getAgeInWeeks()",
        hasReturnValue: true,
      },
      {
        type: "method",
        expression: "t.getAgeInDays()",
        hasReturnValue: true,
      },
      {
        type: "method",
        expression: "t.getAgeInHours()",
        hasReturnValue: true,
      },
      {
        type: "method",
        expression: "t.getAgeInMinutes()",
        hasReturnValue: true,
      },
      {
        type: "method",
        expression: "t.getAgeInSeconds()",
        hasReturnValue: true,
      },
    ]
  },
  "communicate": {
    title: "Communicate",
    mode: "debug",
    displayType: "void",
    features: [
      {
        type: "method",
        expression: "t.writeHi()",
        hasReturnValue: false,
      },
      {
        type: "method",
        expression: "t.writeSlogan()",
        hasReturnValue: false,
      },
      {
        type: "method",
        expression: "t.write()",
        hasReturnValue: false,
      },
      {
        type: "method",
        expression: "t.sayHi()",
        hasReturnValue: false,
      },
      {
        type: "method",
        expression: "t.saySlogan()",
        hasReturnValue: false,
      },
      {
        type: "method",
        expression: "t.say(something)",
        hasReturnValue: false,
      },
    ]
  },
  "activities": {
    title: "Activities",
    mode: "debug",
    displayType: "void",
    features: [
      {
        type: "method",
        expression: "t.work()",
        hasReturnValue: false,
      },
      {
        type: "method",
        expression: "t.rest()",
        hasReturnValue: false,
      },
      {
        type: "method",
        expression: "t.exercise(...)",
        hasReturnValue: false,
      },
      {
        type: "method",
        expression: "t.watchTelevision()",
        hasReturnValue: false,
      },
      {
        type: "method",
        expression: "t.readBook()",
        hasReturnValue: false,
      },
      {
        type: "method",
        expression: "t.takeCompliment()",
        hasReturnValue: false,
      },
      {
        type: "method",
        expression: "t.takeInsult()",
        hasReturnValue: false,
      },
    ]
  },
}





            

    
  