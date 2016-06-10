var panels = {
  "basic-info": {
    title: "Basic Information",
    mode: "debug",
    features: [
      {
        type: "variable",
        expression: "t.firstName",
        hasReturnValue: true,
        displayType: "table"
      },
      {
        type: "variable",
        expression: "t.lastName",
        hasReturnValue: true,
        displayType: "table"
      },
      {
        type: "variable",
        expression: "t.favoriteElement",
        hasReturnValue: true,
        displayType: "table"
      }
    ]
  },
  "current-state": {
    title: "Current State",
    mode: "debug",
    features: [
      {
        type: "variable",
        expression: "t.energy",
        hasReturnValue: true,
        displayType: "bar"
      },
      {
        type: "variable",
        expression: "t.happiness",
        hasReturnValue: true,
        displayType: "bar"
      },
      {
        type: "variable",
        expression: "t.confidence",
        hasReturnValue: true,
        displayType: "bar"
      },
      {
        type: "variable",
        expression: "t.intelligence",
        hasReturnValue: true,
        displayType: "bar"
      },
      {
        type: "variable",
        expression: "t.strength",
        hasReturnValue: true,
        displayType: "bar"
      },
      {
        type: "variable",
        expression: "t.coins",
        hasReturnValue: true,
        displayType: "bar"
      }
    ]
  },
  "name": {
    title: "Name",
    mode: "debug",
    features: [
      {
        type: "method",
        expression: "t.getFullName()",
        hasReturnValue: true,
        displayType: "table"
      },
      {
        type: "method",
        expression: "t.getReverseName()",
        hasReturnValue: true,
        displayType: "table"
      },
      {
        type: "method",
        expression: "t.getDoubleFullName()",
        hasReturnValue: true,
        displayType: "table"
      },
      {
        type: "method",
        expression: "t.getReverseName()",
        hasReturnValue: true,
        displayType: "table"
      },
      {
        type: "method",
        expression: "t.getImageFileName()",
        hasReturnValue: true,
        displayType: "table"
      },
      {
        type: "method",
        expression: "t.getFirstNameLastInitial()",
        hasReturnValue: true,
        displayType: "table"
      },
      {
        type: "method",
        expression: "t.getFirstNameLastInitial()",
        hasReturnValue: true,
        displayType: "table"
      }
    ]
  },
  "communicate": {
    title: "Communicate",
    mode: "debug",
    features: [
      {
        type: "method",
        expression: "t.writeHi()",
        hasReturnValue: false,
        displayType: "void"
      },
      {
        type: "method",
        expression: "t.writeSlogan()",
        hasReturnValue: false,
        displayType: "void"
      },
      {
        type: "method",
        expression: "t.write(...)",
        hasReturnValue: false,
        displayType: "void"
      },
      {
        type: "method",
        expression: "t.sayHi()",
        hasReturnValue: false,
        displayType: "void"
      },
      {
        type: "method",
        expression: "t.saySlogan()",
        hasReturnValue: false,
        displayType: "void"
      },
      {
        type: "method",
        expression: "t.say(something)",
        hasReturnValue: false,
        displayType: "void"
      },
    ]
  },
  "activities": {
    title: "Activities",
    mode: "debug",
    features: [
      {
        type: "method",
        expression: "t.work()",
        hasReturnValue: false,
        displayType: "void"
      },
      {
        type: "method",
        expression: "t.rest()",
        hasReturnValue: false,
        displayType: "void"
      },
      {
        type: "method",
        expression: "t.exercise(...)",
        hasReturnValue: false,
        displayType: "void"
      },
      {
        type: "method",
        expression: "t.watchTelevision()",
        hasReturnValue: false,
        displayType: "void"
      },
      {
        type: "method",
        expression: "t.readBook()",
        hasReturnValue: false,
        displayType: "void"
      },
      {
        type: "method",
        expression: "t.takeCompliment()",
        hasReturnValue: false,
        displayType: "void"
      },
      {
        type: "method",
        expression: "t.takeInsult()",
        hasReturnValue: false,
        displayType: "void"
      },
    ]
  },
}





            

    
  