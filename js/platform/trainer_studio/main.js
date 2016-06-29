// Global vars

// TODO: Change this trainer variable name given by student
window.t = false 

window.db = false
window.user = false
window.token = false

window.guiSetup = false
window.testResults = {}

window.testQueue = []
window.testHarnesses = []

// App Entry Point
window.onload = function() {
  initTestHarnesses()
  initApp()
} 

function initApp() {
  // Import student's Trainer
  // TODO: Add try/catch to handle syntax errors
  t = getTrainer()
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDkfHrjTE9jevhoE3PcI-biQFrbiaPHuDo",
    authDomain: "project-3047158032960725719.firebaseapp.com",
    databaseURL: "https://project-3047158032960725719.firebaseio.com",
    storageBucket: "",
  }
  firebase.initializeApp(config);

  db = firebase.database()

  firebase.auth().onAuthStateChanged(function(_user) {
    if (_user) {
      // User is signed in
      user = _user
      db.ref(`users`).once(`value`).then(initUser)
    } else {
      // User is not signed in, so create sign-in popup
      var provider = new firebase.auth.GithubAuthProvider()
      provider.addScope('email')

      firebase.auth().signInWithPopup(provider).then(
        handleLoginSuccess
      ).catch(
        handleLoginError
      )
    }
  })
}

function handleLoginSuccess(result) {
  // Use token to access the GitHub API.
  token = result.credential.accessToken
  // The signed-in user info.
  user = result.user

  db.ref(`users`).once(`value`).then(initUser)
}

function initUser(usersSnapShot) {
  // clearUserData() // remove eventually (just for debugging)
  
  // if user doesn't already exist in db, 
  // then initialize the new user with base data
  if (!usersSnapShot.hasChild(user.uid)) {
    // alert("Initializing new user")
    setupNewUser()
  }

  // store global reference to course data in user
  // then set up the UI with course data
  db.ref('courses/' + user.uid).on('value', function (courseSnapshot) {
    user.course = courseSnapshot.val()
    if (!guiSetup) {
      setupGUI()
      guiSetup = true
    }
  })
}

function setupNewUser() {
  var userData = {}
  userData.name = user.displayName
  db.ref('users/' + user.uid).set(userData)  
  db.ref('courses/' + user.uid + '/panels').set(panels)
  db.ref('courses/' + user.uid + '/features').set(features)
}

function handleLoginError(error) {
  _error = error
  // Handle Errors here.
  var errorfCode = error.code
  var errorMessage = error.message
  
  // The email of the user's account used.
  var email = error.email
  
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential
  
  alert("Something went wrong logging you in. Please refresh the page and try again.")
}

function savePanelToDB(panel) {
  var panelPath = `courses/${user.uid}/panels/${panel.id}/`
  db.ref(panelPath).update(panel)
}

function saveFeatureToDB(feature) {
  var featurePath = `courses/${user.uid}/features/${feature.featureId}`
  db.ref(featurePath).update(feature)
}

function clearUserData(event) {
  if (event) {
    event.stopImmediatePropagation()
  }
  db.ref('users/' + user.uid).set(null)
  db.ref('courses/' + user.uid).set(null)
  location.reload()
}

function getPanelFromFeature(feature) {
  // alert('in getPanelFromFeature')
  var panel
  var panelIds = Object.keys(panels)
  for (var i=0; i < panelIds.length; i++) {
    if (panels[panelIds[i]].features.includes(feature.featureId)) {
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
    
    alert(`${panel.title} completed!`)
    
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
  if (panel.locked && !stayLocked) {
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

function chatBubble(msg) {
  $('#chatBubble').empty()
  $('#chatBubble').css({left: '150px'})
  $('#chatBubble').append('<div class="newMessage"></div>')

  $('.newMessage').typed({
    strings: [`"${msg}"`],
    typeSpeed: 5,
    showCursor: false
  })
}

function removeChatBubble() {
  $('#chatBubble').empty().css({left: '-500px'})
}

function textToSpeech(msg) {
  var utterance = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  utterance.voice = voices[3];
  utterance.text = msg;
  // utterance.voice = voices[t.voice];
  // utterance.voiceURI = 'native';
  // utterance.volume = 1; // 0 to 1
  // utterance.rate = 0.5; // 0.1 to 10
  // utterance.pitch = 1; //0 to 2
  // utterance.lang = 'en-US';

  // utterance.onend = function(e) {
  //   console.log('Finished in ' + event.elapsedTime + ' seconds.');
  // };
  window.speechSynthesis.speak(utterance);
}