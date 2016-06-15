// Global vars
var db
var user
var token
var loginResult
var _error
var _snapshot
var t
var tReference
//

function initApp() {
  // Display loading icon?

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

  // auth /////////////////////////////////////
  var provider = new firebase.auth.GithubAuthProvider();
  provider.addScope('email');
  // provider.addScope('repo');

  firebase.auth().signInWithPopup(provider).then(
    handleLoginSuccess).catch(handleLoginError)
}

initApp()

function handleLoginSuccess(result) {
  loginResult = result
  // This gives you a GitHub Access Token. You can use it to access the GitHub API.
  token = result.credential.accessToken;
  // The signed-in user info.
  user = result.user;

  db.ref(`users`).once(`value`).then(function(snapshot) {
    // if user doesn't already exist in db, 
    // then initialize the new user with base data
    if (!snapshot.hasChild(user.uid)) {
      initializeNewUser(user)
    }

    // store global reference to course data in user
    // then set up the UI with course data
    db.ref('courses/' + user.uid).once('value').then(function (snapshot) {
      user.course = snapshot.val()
      setupUI()
    })    
  });
}

function initializeNewUser(user) {
  var userData = {}
  userData.name = user.displayName
  db.ref('users/' + user.uid).set(userData)
  
  var userPanels = basePanels
  db.ref('courses/' + user.uid + '/panels').set(userPanels)
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
  $(`body`).on(`click`, `.activate`,   activateDisplayMode)
  $(`body`).on(`click`, `.btn-action`, actionButtonClicked)
  $(`body`).on(`click`, `#chatBubble`, removeChatBubble)

  $('.replace-with-panel').each(function() {
    constructPanel(this)
  });

  setupTooltip()
}

function setupTooltip() {
  $(document).tooltip({
    content: getSourceCode,
    items: 'button.correct-call,button.correct-val'
  })
}

function constructPanel(_div, _mode) {
  // start at div marked as panel root
  var div = $(_div)
  var panelData = user.course.panels[div.attr('id')]  

  // minimized = user.panels[panel].minimized

  var panel = $('#templates .panel').first().clone()
  panel.attr('id', div.attr('id'))

  var mode = _mode || panelData.mode
  var displayType = panelData.displayType
  panel.addClass(mode)
  panel.addClass(displayType)
  var table

  // panel head
  panel.find('.panel-title').text(panelData['title'])

  // panel body
  var body = panel.find('.panel-body')

  if (mode === "display") {
    panel.find('.activate').attr('displayMode', 'debug').toggleClass('glyphicon-flash').toggleClass('glyphicon-cog')
  }

  if (mode === "display" && displayType === "tableType") {
    table = $('#templates .table-template').clone()
    table.appendTo(body)
  }
  
  // for each feature, construct appropriate featureModule
  for (var i=0; i < panelData['features'].length; i++) {
    var featureModule
    var featureData = panelData['features'][i]

    if (mode === "debug") {
      featureModule = constructDebugFeatureModule(featureData)
      body.append(featureModule)
    } else if (displayType === "tableType") {
      featureModule = constructTableFeatureModule(featureData)
      table.append(featureModule)
    } else if (displayType === "barType") {
      featureModule = constructBarFeatureModule(featureData)
      body.append(featureModule)
    } else {
      alert('unrecognized display type')
    }

    featureModule.attr('index', i)
  }

  if (panelData.minimized == true) {
    minimizePanel(panel)
  }

  div.replaceWith(panel)
}

function activateDisplayMode() {
  // get id of the parent panel of this button
  var icon = $(this)
  var currentPanel = icon.parent().parent()

  // re-construct panel body from json, using the specified mode
  constructPanel(currentPanel, icon.attr('displayMode'))
}

function constructDebugFeatureModule(featureData) {
  var featureModule = $('#templates .feature-module').clone().attr('expected-expression', featureData.expectedExpression)

  // label
  var label = $('#templates .label-' + featureData.type).clone()
  label.find('.label-text').text(
    convertCodeToEnglish(featureData.expectedExpression)
  )
  featureModule.append(label)
  
  var debugModule
  if (featureData.status === 'empty') {
    createCodeEntryModule()
  } else if (
    featureData.status.split(" ")[1] === 'entry') { 
    debugModule = createCodeViewerModule(
      featureData.entry, featureData.expectedExpression
    )
  } else if (featureData.status === 'executed') {
    debugModule = createReturnValViewerModule(featureData.entry)
  }
  featureModule.append(debugModule)

  return featureModule
}

function constructTableFeatureModule(featureData) {
  var trTemplate = $('#templates tr').clone()
  trTemplate.find('.label').text(
    convertCodeToEnglish(featureData.expectedExpression)
  )
  trTemplate.find('.value').text(
    eval(featureData.expectedExpression)
  )
  return trTemplate
}


// function setupStatBar(property) {
//   var value = t[property]
//   var template = $(`#templates .stat-bar`).clone()
//   template.attr('id', property)
//   template.find('label').text(property)
//   template.find('.progress-bar').css({
//     width: `${value}%`,
//     backgroundColor: colors.pop()
//   })
//   template.find('.bar-reading').text(`${value}/100`)
//   $('#current-state .panel-body.display').append(template)
// }


var colorIndex = 0
var colors = ["#090", "#36c","#f4ff00","#f00", "purple"]

function constructBarFeatureModule(featureData) {
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

function convertCodeToEnglish(text) {
  return camelToTitleCase(getPropertyFromExpression(text))
}

function getSourceCode() {
  var element = $(this)

  var property = getPropertyFromButton(element)
  var tooltipText = `<h5>Source Code:</h5>`
  var source = t[property].toString()
  tooltipText += `<pre><code>${source}</code></pre>`

  return tooltipText
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

// function togglePanelDisplayMode() {
//   var icon = $(this)
//   var panel = icon.parent().parent()
//   var activePanelBody = panel.find('.panel-body.active')
//   var hiddenPanelBody = panel.find('.panel-body.hidden')
//   activePanelBody.removeClass('active').addClass('hidden')
//   hiddenPanelBody.removeClass('hidden').addClass('active')

//   icon.toggleClass('glyphicon-flash').toggleClass('glyphicon-cog enabled')
// }


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


// function panelsPath() {
//   return `courses/${user.uid}/panels/`
// }

function actionButtonClicked() {
  var newModule
  var button = $(this)
  var codeModule = button.parent().parent()
  var featureModule = codeModule.parent()
  var index = featureModule.attr('index')
  var panel = button.parent().parent().parent().parent().parent()
  var panelId = panel.attr('id')

  if (codeModule.is('.code-entry')) {
    // get code from text input
    var entry = codeModule.find('input').val()
    
    // save entry to db
    var featurePath = `courses/${user.uid}/panels/${panelId}/`
    featurePath += `features/${index}/` 
    db.ref(featurePath).child('entry').set(entry)

    // save new status to db
    var expected = featureModule.attr('expected-expression')
    var status = (entry === expected) ? "correct" : "incorrect"
    db.ref(featurePath).child('status').set(`${status} entry`)
    
    // create code viewer module
    newModule = createCodeViewerModule(entry, expected)

  } else if (codeModule.is('.code-button.correct')) {
    
    // get code from text input
    var entry = codeModule.find('.code-input button').text()
    newModule = createReturnValViewerModule(entry)

  } else if (codeModule.is('.code-button.incorrect')) {
  
    // Start over, just display text input and buttons
    var entry = codeModule.find('.code-input button').text()
    newModule = createCodeEntryModule(entry)

  } else if (codeModule.is('.return-val-viewer')) {
    
    // reset was clicked, 
    // so we want to re-display the code button
    var entry = button.attr('expression')
    newModule = createCodeViewerModule(entry, entry)
  }
  
  if (newModule) {
    codeModule.replaceWith(newModule)
  }
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

function createReturnValViewerModule(entry) {
  var testResult = testCode(entry)

  var module = $(
    "#templates .return-val-viewer." + testResult.status
  ).clone()

  var formattedVal = formatReturnValue(testResult.returnValue)

  module.find('.code-input button').text(formattedVal)
  module.find('.code-action-module button').attr('expression', entry)

  return module
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


function deleteUser(user) {
  db.ref('users/' + user.uid).set(null)
  db.ref('courses/' + user.uid).set(null)
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
