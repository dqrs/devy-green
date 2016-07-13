// Global vars

window.db = false
window.user = false
window.token = false

window.appSourceCode = ''

window.userSetup = false
window.guiSetup = false
window.testResults = {}

window.testQueue = []
window.testHarnesses = []

// App Entry Point
window.onload = function() {
  if (window.SYNTAX_ERROR) {
    $('#trainer-placeholder-inner').replaceWith($('#syntax-error-img').removeClass('hidden'))
  } else {
    initTestHarnesses()
    initApp()
  }
} 

// window.onerror = function(error) {
//   console.log(JSON.stringify(error))
//   $('#syntax-error-img').removeClass('hidden')
// }

function initApp() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDkfHrjTE9jevhoE3PcI-biQFrbiaPHuDo",
    authDomain: "project-3047158032960725719.firebaseapp.com",
    databaseURL: "https://project-3047158032960725719.firebaseio.com",
    storageBucket: "project-3047158032960725719.appspot.com",
  };
  firebase.initializeApp(config);

  db = firebase.database()

  firebase.auth().onAuthStateChanged(handleAuthStateChanged)
}

function handleAuthStateChanged(_user) {
  // alert(`authStateChanged called:\n_user = ${JSON.stringify(_user)}`)
  if (_user) {
    // User is signed in
    user = _user
    db.ref(`users`).once(`value`).then(initUser)
  } else {
    // User is not signed in, so create sign-in popup
    var provider = new firebase.auth.GithubAuthProvider()
    firebase.auth().signInWithPopup(provider).catch(handleLoginError)
  }
}

function initUser(usersSnapshot) {
  // usnap = usersSnapshot
  // usnapval = usersSnapshot.val()
  // alert(`users snapshot val = ${JSON.stringify(usnapval)}`)
  
  // if user doesn't already exist in db, 
  // then initialize the new user with base data
  if (!(user.uid in usersSnapshot.val())) {
    // alert("Initializing new user")
    initializeNewUser()
  }

  // store global reference to course data in user
  // then set up the UI with course data
  db.ref('courses/' + user.uid).on('value', function (courseSnapshot) {
    // csnap = courseSnapshot
    // csnapval = courseSnapshot.val()
    // alert(`course snapshot val = ${JSON.stringify(csnapval)}`)
    user.course = courseSnapshot.val()
    if (!guiSetup) {
      appSourceCode = loadAppSourceCode()
      
      // init trainer object
      var trainerVar = user.course.trainerVar
      if (trainerVar && window.Trainer) {
        window[trainerVar] = new Trainer()
      }
      setupGUI()
      guiSetup = true
    }
  })
}

function fbsignout() {
  firebase.auth().signOut()
}

function initializeNewUser() {
  db.ref('users/' + user.uid).set({
    name: user.displayName,
    initialized: true
  })  
  db.ref('courses/' + user.uid + '/panels').set(panels)
  db.ref('courses/' + user.uid + '/features').set(features)
}

// Loads the student's app.js code for parsing/reading
function loadAppSourceCode() {
  var studentAppPath = "js/app.js"
  var referenceAppPath = "js/platform/trainer-studio/app-reference.js"
  $.ajax(
    studentAppPath,
    // referenceAppPath,
    {
      cache: false,
      success: function(data, status, jqXHR) {
        appSourceCode = data
      }
    }
  )
}

function handleLoginError(error) {
  _loginError = error
  alert("Something went wrong logging you in. Please refresh the page and try again.")
}

function saveCourseToDB() {
  var coursePath = `courses/${user.uid}/`
  db.ref(coursePath).set(user.course)
}

function savePanelToDB(panel) {
  var panelPath = `courses/${user.uid}/panels/${panel.id}/`
  db.ref(panelPath).set(panel)
}

function saveFeatureToDB(feature) {
  var featurePath = `courses/${user.uid}/features/${feature.id}`
  db.ref(featurePath).set(feature)
}

function clearUserData() {
  user.delete()
  db.ref('users/' + user.uid).remove()
  db.ref('courses/' + user.uid).remove()
  // location.reload()
}

function getPanelFromFeature(feature) {
  // alert('in getPanelFromFeature')
  var panel
  var panelIds = Object.keys(panels)
  for (var i=0; i < panelIds.length; i++) {
    if (panels[panelIds[i]].features.includes(feature.id)) {
      panel = panels[panelIds[i]]
      break;
    }
  }
  // alert (`Returning panel: ${panel.id} for feature: ${feature.featureId}`)
  return panel
}

function checkForPanelCompletion(feature) {
  // alert('in checkForPanelCompletion')
  // check to see if this completes the panel
  var panel = getPanelFromFeature(feature)
  if (panel && !panel.complete && panelIsComplete(panel)) {
    
    // alert(`${panel.title} completed!`)
    
    // check for newly unlocked panels and re-render UI 
    var postReqs = getPostReqsOfPanel(panel.id)
    // alert(`postReqs: ${JSON.stringify(postReqs)}`)

    for (var i=0; i < postReqs.length; i++) {
      createPanel($(`#${postReqs[i]}`))
    }
  }
}

function featureIsComplete(featureId) {
  return user.course.features[featureId].status === "execution-correct"
}

function panelIsComplete(panel) {
  // alert('in panelIsComplete')
  var panelComplete = true
  for (var i=0; i < panel.features.length; i++) {
    if (!featureIsComplete(panel.features[i])) {
      panelComplete = false
      break
    }
  }
  panel.complete = panelComplete
  savePanelToDB(panel)

  return panel.complete
}

function panelIsLocked(panel) {
  var stayLocked = false

  if (panel.prereqs) {
    for (var i=0; i < panel.prereqs.length; i++) {
      var prereq = user.course.panels[panel.prereqs[i]]
      if (!prereq.complete) {
        stayLocked = true
        break
      }
    }
  }

  // check if panel was just unlocked for the first time
  if (panel.prereqs && panel.locked && !stayLocked) {
    panel.locked = false
    savePanelToDB(panel)
    alert(`${panel.title} was just unlocked!`)
  }

  return stayLocked
}

// Returns an array of panelIDs who have panelId as a prereq
function getPostReqsOfPanel(panelId) {
  var panelIds = Object.keys(user.course.panels)
  var postReqs = []
  for (var i=0; i < panelIds.length; i++) {
    var panel = user.course.panels[panelIds[i]]
    if (panel.prereqs && panel.prereqs.includes(panelId)) {
      postReqs.push(panelIds[i])
    }
  }
  return postReqs
}