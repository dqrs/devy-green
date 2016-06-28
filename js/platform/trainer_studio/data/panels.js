/*
  This JSON object contains the static data for panels used by all students, as well as the initial student progress data for a student
  who has just started.
*/
panels = {
  "app-info": {
    id: "app-info",
    title: "App Information",
    mode: "debug",
    displayType: "tableType",
    complete: false,
    locked: false,
    minimized: false,
    prereqs: false,
    features: [
      "getAppName",
      "getAppAuthor",
      "getAppVersion",
    ]
  },
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
      "firstName",
      "lastName",
      "age",
      "slogan",
      "favoriteElement",
      "favoriteColor"
    ]
  },
  "current-state": {
    id: "current-state",
    title: "Trainer Status",
    mode: "debug",
    displayType: "barType",
    complete: false,
    locked: false,
    minimized: false,
    prereqs: false,
    // prereqs: ["basic-info"],
    features: [
      "energy",
      "happiness",
      "confidence",
      "intelligence",
      "strength",
      "coins",
    ]
  },
  "name": {
    id: "name",
    title: "Name",
    mode: "debug",
    displayType: "tableType",
    complete: false,
    locked: false,
    minimized: false,
    // prereqs: ['current-state'],
    prereqs: false,
    features: [
      "getFullName",
      "getReverseName",
      "getDoubleFullName",
      "getDoubleReverseName",
      "getImageFileName",
      "getFirstNameLastInitial",
      "getFirstNameLastInitial",
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
    prereqs: false,
    // prereqs: ["name"],
    features: [
      "getAgeInMonths",
      "getAgeInWeeks",
      "getAgeInDays",
      "getAgeInHours",
      "getAgeInMinutes",
      "getAgeInSeconds",
    ]
  },
  "communicate": {
    id: "communicate",
    title: "Communicate",
    mode: "debug",
    displayType: "void",
    complete: false,
    locked: false,
    minimized: false,
    prereqs: false,
    // prereqs: ["age"],
    features: [
      "writeHi",
      "writeSlogan",
      "write",
      "sayHi",
      "saySlogan",
      "say",
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
      "work",
      "rest",
      "exercise",
      "watchTelevision",
      "readBook",
      "takeCompliment",
      "takeInsult",
    ]
  }
}