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
    title: "Current State",
    mode: "debug",
    displayType: "barType",
    complete: false,
    locked: true,
    minimized: false,
    // prereqs: ["basic-info"],
    prereqs: false,
    features: [
      "energy",
      "happiness",
      "confidence",
      "intelligence",
      "strength",
    ]
  },
  "resources": {
    id: "resources",
    title: "Resources",
    mode: "debug",
    displayType: "tableType",
    complete: false,
    locked: true,
    minimized: false,
    // prereqs: ["basic-info"],
    prereqs: false,
    features: [
      "coins"
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
    // prereqs: ['current-state'],
    prereqs: false,
    features: [
      "getFullName",
      "getReverseName",
      "getDoubleFullName",
      "getDoubleReverseName",
      "getFirstNameLastInitial",
      "getFirstInitialLastName",
    ]
  },
  "element": {
    id: "element",
    title: "Element",
    mode: "debug",
    displayType: "tableType",
    complete: false,
    locked: true,
    minimized: false,
    // prereqs: ['current-state'],
    prereqs: false,
    features: [
      "getElementWeakestAgainst",
      "getElementStrongestAgainst",
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
    // prereqs: ["name"],
    prereqs: false,
    features: [
      "getAgeInMonths",
      "getAgeInWeeks",
      "getAgeInDays",
      "getAgeInHours"
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
    // prereqs: ["age"],
    prereqs: false,
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
    minimized: false,
    locked: true,
    // prereqs: ["communicate"],
    prereqs: false,
    features: [
      "sleep",
      "exercise",
      "work",
      // "watchTelevision",
      // "readBook",
      // "takeCompliment",
      // "takeInsult",
    ]
  },
  "pokemon": {
    id: "pokemon",
    title: "Pokemon",
    mode: "debug",
    displayType: "void",
    complete: false,
    minimized: false,
    locked: true,
    // prereqs: ["communicate"],
    prereqs: false,
    features: [
      "getFirstPokemon",
      "getLastPokemon",
      "getPokemonNumber100",
      "getPokemonByIndex",
      "printAllPokemon",
      "printAllPokemonInReverse",
      "findPokemonByName",
      "findPokemonWithHighestAttack",
      "findPokemonWithHighestDefense",
      "findPokemonWithLowestSpeed",
      "findPokemonWithLowestHP",
      "findAllPokemonWithHPGreaterThan",
      "findAllPokemonWithAttackGreaterThan",
      "findAllPokemonWithAttackLessThan",
      "findAllPokemonWithName",
      "findAllPokemonWithoutName",
      "findAllPokemonStartingWithLetter",
    ]
  },
}