/*
  This JSON object contains the static data for panels used by all students, as well as the initial student progress data for a student
  who has just started.
*/
basePanels = {
  "basic-info": {
    id: "basic-info",
    title: "Basic Information",
    mode: "debug",
    displayType: "tableType",
    complete: false,
    locked: false,
    minimized: false,
    prereqs: false,
    features: [
      {
        type: "variable",
        expectedExpression: "t.firstName",
        hasReturnValue: true,
        status: "empty",
        complete: false,
        entry: ''
      },
      {
        type: "variable",
        expectedExpression: "t.lastName",
        hasReturnValue: true,
        status: "empty",
        complete: false,
        entry: ''
      },
      {
        type: "variable",
        expectedExpression: "t.age",
        hasReturnValue: true,
        status: "empty",
        complete: false,
        entry: ''
      },
      {
        type: "variable",
        expectedExpression: "t.slogan",
        hasReturnValue: true,
        status: "empty",
        complete: false,
        entry: ''
      },
      // {
      //   type: "variable",
      //   expectedExpression: "t.favoriteElement",
      //   hasReturnValue: true,
      //   status: "empty",
      //   complete: false,
      //   entry: ''
      // },
      // {
      //   type: "variable",
      //   expectedExpression: "t.favoriteColor",
      //   hasReturnValue: true,
      //   status: "empty",
      //   complete: false,
      //   entry: ''
      // },
    ]
  },
  "current-state": {
    id: "current-state",
    title: "Current State",
    mode: "debug",
    displayType: "barType",
    complete: false,
    locked: true,
    minimized: false,
    prereqs: ["basic-info"],
    features: [
      {
        type: "variable",
        expectedExpression: "t.energy",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "variable",
        expectedExpression: "t.happiness",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "variable",
        expectedExpression: "t.confidence",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "variable",
        expectedExpression: "t.intelligence",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "variable",
        expectedExpression: "t.strength",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      // {
      //   type: "variable",
      //   expectedExpression: "t.coins",
      //   hasReturnValue: true,
      // status: "locked",
      // complete: false,
      // entry: ''
      // }
    ]
  },
  "name": {
    id: "name",
    title: "Name",
    mode: "debug",
    displayType: "tableType",
    complete: false,
    locked: true,
    minimized: false,
    prereqs: ['current-state'],
    features: [
      {
        type: "method",
        expectedExpression: "t.getFullName()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.getReverseName()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.getDoubleFullName()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.getReverseName()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.getImageFileName()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.getFirstNameLastInitial()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.getFirstNameLastInitial()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      }
    ]
  },
  "age": {
    id: "age",
    title: "Age",
    mode: "debug",
    displayType: "tableType",
    complete: false,
    locked: true,
    minimized: false,
    prereqs: ["name"],
    features: [
      {
        type: "method",
        expectedExpression: "t.getAgeInMonths()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.getAgeInWeeks()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.getAgeInDays()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.getAgeInHours()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.getAgeInMinutes()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.getAgeInSeconds()",
        hasReturnValue: true,
        status: "locked",
        complete: false,
        entry: ''
      },
    ]
  },
  "communicate": {
    id: "communicate",
    title: "Communicate",
    mode: "debug",
    displayType: "void",
    complete: false,
    locked: true,
    minimized: false,
    prereqs: ["age"],
    features: [
      {
        type: "method",
        expectedExpression: "t.writeHi()",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.writeSlogan()",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.write()",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.sayHi()",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.saySlogan()",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.say(something)",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
    ]
  },
  "activities": {
    id: "activities",
    title: "Activities",
    mode: "debug",
    displayType: "void",
    complete: false,
    locked: true,
    minimized: false,
    prereqs: ["communicate"],
    features: [
      {
        type: "method",
        expectedExpression: "t.work()",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.rest()",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.exercise(...)",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.watchTelevision()",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.readBook()",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.takeCompliment()",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
      {
        type: "method",
        expectedExpression: "t.takeInsult()",
        hasReturnValue: false,
        status: "locked",
        complete: false,
        entry: ''
      },
    ]
  }
}