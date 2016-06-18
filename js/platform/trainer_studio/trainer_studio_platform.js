// Global vars
t = false
tReference = false

db = false
user = false
token = false

uiSetup = false
// var lastModuleChanged
//

// App Entry Point
window.onload = function() {
  initApp()
  setupTags()
  // window.tape_dom.installCSS();
  // window.tape_dom.stream(window.tape);
} 

function setupTags() {
  $(`body`).on(`click`, `#app-name`, replaceTag)
  $(`body`).on(`click`, `#test`, runTest)
}

function runTest() {
  tape.createStream({ objectMode: true }).on('data', function (row) {
    alert(JSON.stringify(row))
  });

  tape('timing test', function (t) {
      t.plan(2);

      t.equal(typeof Date.now, 'function');
      var start = Date.now();

      setTimeout(function () {
          t.equal(Date.now() - start, 100);
      }, 100);
  });
}

function initApp() {
  // Todo: Display loading icon?

  // Import student's Trainer and reference Trainer 
  t = getTrainer()
  tReference = new TrainerReference(getTrainer())

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDkfHrjTE9jevhoE3PcI-biQFrbiaPHuDo",
    authDomain: "project-3047158032960725719.firebaseapp.com",
    databaseURL: "https://project-3047158032960725719.firebaseio.com",
    storageBucket: "",
  };
  firebase.initializeApp(config);

  // db //////////////////////////////////
  db = firebase.database()

  firebase.auth().onAuthStateChanged(function(_user) {
    if (_user) {
      // User is signed in.
      user = _user
      db.ref(`users`).once(`value`).then(initUser)
    } else {
      var provider = new firebase.auth.GithubAuthProvider();
      provider.addScope('email');

      firebase.auth().signInWithPopup(provider).then(
        handleLoginSuccess
      ).catch(
        handleLoginError
      )
    }
  });
}

function handleLoginSuccess(result) {
  // Use token to access the GitHub API.
  token = result.credential.accessToken;
  // The signed-in user info.
  user = result.user;

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
    if (!uiSetup) {
      setupUI()
      uiSetup = true
    }
  })
}

function setupNewUser() {
  var userData = {}
  userData.name = user.displayName
  db.ref('users/' + user.uid).set(userData)
  
  // alert("About to set up new user")
  // alert("basePanels['basic-info'].prereqs: " + basePanels['basic-info'].prereqs)
  db.ref('courses/' + user.uid + '/panels').set(basePanels)
}

function handleLoginError(error) {
  _error = error
  // Handle Errors here.
  var errorfCode = error.code;
  var errorMessage = error.message;
  
  // The email of the user's account used.
  var email = error.email;
  
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  
  alert("Something went wrong logging you in. Please refresh the page and try again.")
}

function setupUI() {
  $(`body`).on(`click`, `.minimize`,   togglePanelMinimization)
  $(`body`).on(`click`, `.activate`,   activatePanelMode)
  $(`body`).on(`click`, `.btn-action`, actionButtonClicked)
  $(`body`).on(`click`, `#chatBubble`, removeChatBubble)
  $(`body`).on(`keyup`, `.input-sm`,   handleKeyPress) 
  $(`body`).on(`click`, `#clear-data`, clearUserData) 
  // $(document).on(`keyup`, handleKeyPress) 

  $('.replace-with-panel').each(function() {
    createPanel(this)
  });

  setupTooltip()

  // Trigger submit on enter keypress
}

function handleKeyPress(e) {
  if (e.keyCode == 13) {
    triggerActionButtonOnEnter()
  } else if (e.keyCode == 27) {
    alert("Escape pressed!")
  }
}

function triggerActionButtonOnEnter() {
  $(':focus').parent().parent().find('.btn-action').click()
}

function setupTooltip() {
  $(document).tooltip({
    content: getSourceCode,
    items: 'button.correct-call,button.correct-val'
  })
}

function actionButtonClicked() {
  var newModule
  var button = $(this)
  var codeModule = button.parent().parent()
  var featureModule = codeModule.parent()
  var index = featureModule.attr('index')
  var panel = button.parent().parent().parent().parent().parent()
  var panelId = panel.attr('id')

  if (codeModule.is('.code-entry')) {

    var entry = codeModule.find('input').val()    
    var expected = featureModule.attr('expected-expression')
    var status = (entry === expected) ? "entered correct" : "entered incorrect"    
    saveEntryToDB(entry, status, panelId, index)
    
    // create code viewer module
    newModule = createCodeViewerModule(entry, expected)

  } else if (codeModule.is('.code-button.correct')) {
    
    var entry = codeModule.find('.code-input button').text()
    newModule = createReturnValViewerModule(entry, panelId, index)

    // check to see if this completes the panel
    var panel = user.course.panels[panelId]
    if (!panel.complete && panelIsComplete(panel)) {
      
      alert(`${panel.title} completed!`)
      
      // check for newly unlocked panels and re-render UI 
      var postReqs = getPostReqsOfPanel(panelId)
      // alert(`postReqs: ${JSON.stringify(postReqs)}`)

      for (var i=0; i < postReqs.length; i++) {
        createPanel($(`#${postReqs[i]}`))
      }
    }

  } else if (codeModule.is('.code-button.incorrect')) {
  
    // Start over, just display text input and buttons
    var entry = codeModule.find('.code-input button').text()
    newModule = createCodeEntryModule(entry)

    // clear entry from db
    saveEntryToDB('', 'empty', panelId, index)

  } else if (codeModule.is('.return-val-viewer')) {
    
    // user has asked to reset this feature
    // so we want to re-display the code button
    var entry = button.attr('expression')
    var status = "entered correct"
    saveEntryToDB(null, status, panelId, index)
    newModule = createCodeViewerModule(entry, entry)
  }
  
  if (newModule) {
    codeModule.replaceWith(newModule)
    // lastModuleChanged = newModule
  }
}

function activatePanelMode() {
  // get id of the parent panel of this button
  var icon = $(this)
  var currentPanel = icon.parent().parent()

  // re-create panel body from json, using the specified mode
  createPanel(currentPanel, icon.attr('mode'))
}

function togglePanelMinimization() {
  var element = $(this)
  var minimized = element.hasClass('glyphicon-collapse-up')
  var panel = $(this).parent().parent()
  
  panel.find('.panel-body').toggleClass('hidden')
  $(this).toggleClass('glyphicon-collapse-up').toggleClass('glyphicon-collapse-down')
  db.ref(`courses/${user.uid}/panels/${panel.attr('id')}/minimized`).set(!minimized)
}

function minimizePanel(panel) {
  panel.find('.panel-body').addClass('hidden')
  panel.find('.minimize').addClass('glyphicon-collapse-up').removeClass('glyphicon-collapse-down')
}

function maximizePanel(panel) {
  panel.find('.panel-body').removeClass('hidden')
  panel.find('.minimize').removeClass('glyphicon-collapse-up').addClass('glyphicon-collapse-down')
}

function featureIsComplete(feature) {
  return feature.status === "executed correct"
}

function panelIsComplete(panel) {
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

function createPanel(_div, _mode) {
  // start at div marked as panel root
  var div = $(_div)
  var panelData = user.course.panels[div.attr('id')]
  var panel = $('#templates .panel').first().clone()

  panel.attr('id', div.attr('id'))

  var mode = _mode || panelData.mode
  var displayType = panelData.displayType
  panel.addClass(mode)
  panel.addClass(displayType)

  createPanelHead(panel, panelData, mode)
  if (panelIsLocked(panelData)) {
    createLockedPanelBody(panel)
  } else {
    createPanelBody(panel, panelData, mode, displayType)
  }

  if (panelData.minimized) {
    minimizePanel(panel)
  }

  div.replaceWith(panel)
}

function createPanelHead(panel, panelData, mode) {
  panel.find('.panel-title').text(panelData['title'])
  if (mode === "display") {
    panel.find('.activate').attr('mode', 'debug').toggleClass('glyphicon-flash').toggleClass('glyphicon-cog')
  }
}

function createPanelBody(panel, panelData, mode, displayType) {
  var table
  var body = panel.find('.panel-body')

  if (mode === "display" && displayType === "tableType") {
    table = $('#templates .table-template').clone()
    table.appendTo(body)
  }
  
  // for each feature, create appropriate featureModule
  for (var i=0; i < panelData.features.length; i++) {
    var featureModule
    var featureData = panelData.features[i]

    if (mode === "debug") {
      featureModule = createDebugFeatureModule(featureData)
      body.append(featureModule)
    } else if (displayType === "tableType") {
      featureModule = createTableFeatureModule(featureData)
      table.append(featureModule)
    } else if (displayType === "barType") {
      featureModule = createBarFeatureModule(featureData)
      body.append(featureModule)
    } else {
      alert('unrecognized display type')
    }

    featureModule.attr('index', i)
  }
}

function createLockedPanelBody(panel) {
  panel.find('.panel-body').replaceWith($('#templates .locked-panel').clone())
}

function replaceTag() {
  // alert("hi")
  // var codeEntryModule = createCodeEntryModule()
  // var container = $('<div></div>')
  var featureModule = createDebugFeatureModule({
    expectedExpression: 'getAppName()',
    type: "method",
    status: "empty",
    entry: ""
  }) //.appendTo(container)

  featureModule.appendTo($('body')).css({
    position: 'absolute',
    top: '100px',
    left: '100px',
    border: '1px solid white'
  })
}


function createDebugFeatureModule(featureData) {
  var featureModule = $('#templates .feature-module').clone().attr('expected-expression', featureData.expectedExpression)

  var label = $('#templates .label-' + featureData.type).clone()
  label.find('.label-text').text(
    convertCodeToEnglish(featureData.expectedExpression)
  )
  featureModule.append(label)
  
  var debugModule
  if (featureData.status === 'empty' || featureData.status === 'locked') {
    debugModule = createCodeEntryModule()
  } else if (
    featureData.status === 'entered correct' ||
    featureData.status === 'entered incorrect'
  ) { 
    debugModule = createCodeViewerModule(
      featureData.entry, featureData.expectedExpression
    )
  } else if (
    featureData.status === 'executed correct' ||
    featureData.status === 'executed incorrect') {
    debugModule = createReturnValViewerModule(featureData.entry)
  }
  featureModule.append(debugModule)

  return featureModule
}

function createTableFeatureModule(featureData) {
  var trTemplate = $('#templates tr').clone()
  trTemplate.find('.label').text(
    convertCodeToEnglish(featureData.expectedExpression)
  )
  trTemplate.find('.value').text(
    eval(featureData.expectedExpression)
  )
  return trTemplate
}

var colorIndex = 0
var colors = ["#090", "#36c","#f4ff00","#f00", "purple"]

function createBarFeatureModule(featureData) {
  var value = eval(featureData.expectedExpression)
  var template = $(`#templates .stat-bar`).clone()

  template.attr('id', featureData.expectedExpression)
  template.find('label').text(
    convertCodeToEnglish(featureData.expectedExpression)
  )
  colorIndex = ++colorIndex % colors.length
  template.find('.progress-bar').css({
    width: `${value}%`,
    backgroundColor: colors[colorIndex]
  })
  template.find('.bar-reading').text(`${value}/100`)
  
  return template
}

function createCodeEntryModule(entry) {
  var module = $('#templates .code-entry').clone()
  if (entry) {
    module.find('input').val(entry)
  }
  return module
}

function createCodeViewerModule(entry, expected) {
  var status = (entry === expected) ? "correct" : "incorrect" 
  var module = $('#templates .code-button.' + status).clone()
  module.find('.code-input button').text(entry)

  return module
}

function createReturnValViewerModule(entry, panelId, index) {
  var testResult = testCode(entry)

  var module = $(
    "#templates .return-val-viewer." + testResult.status
  ).clone()

  var formattedVal = formatReturnValue(testResult.returnValue)

  module.find('.code-input button').text(formattedVal)
  module.find('.code-action-module button').attr('expression', entry)

  var status = "executed " + testResult.status
  saveEntryToDB(null, status, panelId, index)
  return module
}

function convertCodeToEnglish(text) {
  return camelToTitleCase(getPropertyFromExpression(text))
}

// Returns an array of panelIDs who have panelId as a prereq
function getPostReqsOfPanel(panelId) {
  var allPanelIDs = Object.keys(user.course.panels)
  var postReqs = []
  for (var i=0; i < allPanelIDs.length; i++) {
    var panel = user.course.panels[allPanelIDs[i]]
    if (panel.prereqs && panel.prereqs.includes(panelId)) {
      postReqs.push(allPanelIDs[i])
    }
  }
  return postReqs
}

function getSourceCode() {
  var element = $(this)

  var property = getPropertyFromButton(element)
  var tooltipText = `<h5>Source Code:</h5>`
  var source = t[property].toString()
  tooltipText += `<pre><code>${source}</code></pre>`

  return tooltipText
}

function setupButton() {
  var button = $(this)

  if (button.hasClass('notCode')) { return }

  button.click(function(event) {
    evaluateButton(event)
  })

  // get property name
  var property = getPropertyFromButton(button)

  if (typeof t[property] === 'undefined') {

    button.removeClass('btn-primary')
    button.attr('disabled', 'disabled')
    button.parent().parent().find('label').attr('disabled', 'disabled')

  } else if (typeof t[property] === 'function') {

    button.addClass('function')
    button.parent().parent().find('label').addClass('function')

  } else {

    button.addClass('attribute')
    button.parent().parent().find('label').addClass('attribute')

  }
}

function getPropertyFromButton(button) {
  return getPropertyFromExpression(button.text())
}

/*
  Converts an expression like 't.say("hello")' to 'say'
  Or trainer.getHeight to 'getHeight'
*/
function getPropertyFromExpression(text) {
  // get property name if called on obj
  if (text.split(".").length == 2) {
    text = text.split(".")[1]
  }
  // remove args if it's a method call
  var argsRegEx = /\(.*\)/
  text = text.replace(argsRegEx,'')
  
  return text
}

function savePanelToDB(panel) {
  var panelPath = `courses/${user.uid}/panels/${panel.id}/`
  db.ref(panelPath).update(panel)
}

function saveEntryToDB(entry, status, panelId, index) {
  var featurePath = `courses/${user.uid}/panels/${panelId}/`
  featurePath += `features/${index}/` 
  
  // save entry to db if supplied (otherwise, just update status)
  if (entry) {
    db.ref(featurePath).child('entry').set(entry)
  }
  // save status to db
  db.ref(featurePath).child('status').set(status)
  if (status === "executed correct") {
    db.ref(featurePath).child('complete').set(true)
    // NOTE, this will never set complete to false...
    // Probably want to reconsider this in case student
    // breaks feature
  }
}

function testCode(code) {
  var methodCall = code.split(".")[1]

  var result = {}
  var reference = {}
  try {
    reference.returnValue = eval('tReference.' + methodCall)
  } catch (err) {
    reference.returnValue = err.message
  }

  try {
    result.returnValue = eval(code)
  } catch (err) {
    result.returnValue = err.message
  }

  if (result.returnValue === reference.returnValue) {
    result.status = "correct"
  } else {
    result.status = "incorrect"
  }

  return result
}

function formatReturnValue(val) {
  var formattedVal
  if (typeof val === 'string') {
    formattedVal = `"${val}"`
  } else if (typeof val === 'undefined') {
    formattedVal = '(void)'
  } else {
    formattedVal = val
  }
  return formattedVal
}

function camelToTitleCase(text) {
  var result = text.replace(/([A-Z])/g, " $1" )
  return result.charAt(0).toUpperCase() + result.slice(1);
}


function clearUserData() {
  db.ref('users/' + user.uid).set(null)
  db.ref('courses/' + user.uid).set(null)
  location.reload()
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

function tts(msg) {
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






























