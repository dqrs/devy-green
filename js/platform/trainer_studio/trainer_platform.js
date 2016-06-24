// Global vars
window.t = false

window.db = false
window.user = false
window.token = false

window.guiSetup = false
window.testResults = {}
// window.streams = {}
// window.stream = null

window.activeTest = 'NONE'

window.testQueue = []
window.testHarnesses = []
window.featureIdMap = []

// var lastModuleChanged

// App Entry Point
window.onload = function() {
  initTestHarnesses()
  initApp()
} 

function initApp() {
  // Import student's Trainer and reference Trainer 
  t = getTrainer()
  // stream = tape.createStream({objectMode: true})
  // stream.on('data', function(row) {
  //   console.log(JSON.stringify(row))
  //   // consumeTapeStream
  // })
  // tReference = new TrainerReference(getTrainer())

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
  db.ref('courses/' + user.uid + '/panels').set(basePanels)
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

function dismissPopover(event) {
  event.stopImmediatePropagation()
  $(event.currentTarget).popover('hide')
}

function setupGUI() {
  $(document).off('.data-api')

  $(`body`).on(`click`, `#chatBubble`, removeChatBubble)
  $(`body`).on(`click`, `.minimize`,   togglePanelMinimization)
  $(`body`).on(`click`, `.activate`,   activatePanelMode)
  $(`body`).on(`click`, `.btn-action`, actionButtonClicked)
  $(`body`).on(`keyup`, `.input-sm`,   handleKeyPress) 
  $(`body`).on(`click`, `#clear-data`, clearUserData)
  $(`body`).on(`click`, `.popover`,    dismissPopover)

  // Experimental
  $(`body`).on(`click`, `#app-name`, replaceTag)
  // $(document).on(`keyup`, handleKeyPress) 

  $('.replace-with-panel').each(function() {
    createPanel(this)
  })

  setupTooltip()
  // $(document).popover({
  //   html: true,
  //   container: 'body',
  //   selector: '.code-input a',
  //   title: createPopoverTitle,
  //   content: createPopoverContent,
  //   placement: 'auto bottom',
  //   trigger: 'manual'
  // }).popover('show')

  // Trigger submit on enter keypress (TODO)
}

function handleKeyPress(e) {
  event.stopImmediatePropagation()
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
    items: '.correct-call,.correct-val'
  })
}

function runTestsForFeature(featureId) {
  // var tape = JSON.parse(JSON.stringify(tape))
  // alert("testing! feature: " + featureId)
  tape.createStream({objectMode: true}).on('data',
    function(row) {
      consumeTapeStream(row, featureId, 0)
    }
  );

  // featureId = feature.expressionExpected
  tape(featureId, tests[featureId])
}

function createPopoverTemplate(featureId) {
  return $('#templates .popover-custom').clone().addClass(featureId).prop('outerHTML')
}

function createPopoverTitle(featureId) { 
  return $(`#templates .popover-title`).first().html()
}

function createPopoverContent(featureId) {
  return $('#templates .popover-content').first().html()
}

function consumeTapeStream(row, testHarness) {
// function consumeTapeStream(row, featureId, cloneId) {
  // alert(row)
  // console.log(JSON.stringify(row))
  var featureId = testHarness.featureId
  if (row.type === "test") {
    // var featureId = row.name
    // var featureId = activeTest
    // var featureId = featureIdMap[row.id]

    console.log(`Starting test #${row.id}: ${featureId}`)
    // beginning of test
    $(`.popover.${featureId} .test-suite-name`).text(row.name)
    testResults[featureId] = {}
    testResults[featureId]['numPassed'] = 0
    testResults[featureId]['numTotal'] = 0

  } else if (row.type === "assert") {
    // var featureId = activeTest
    // var featureId = featureIdMap[row.test]

    console.log(`Assertion #${row.id} for test #${row.test}: ${featureId}`)
    testResults[featureId]['numTotal'] += 1
    
    if (row.ok) {
      testResults[featureId]['numPassed'] += 1
      var tmp = $(`#templates .test-result-module.correct`).first().clone()
      tmp.find('.test-name').text(row.name)
    } else {
      var tmp = $(`#templates .test-result-module.incorrect`).first().clone()
      tmp.find('.test-name').text(row.name)
      tmp.find('.test-actual').text(row.actual)
      tmp.find('.test-expected').text(row.expected)
    }
    
    $(`.popover.${featureId} table.test-results`).append(tmp)

  } else if (row.type === "end") {
    // var featureId = activeTest
    // var featureId = featureIdMap[row.test]

    console.log(`Finishing test #${row.test} / ${featureId}`)

    $(`.popover.${featureId} .num-tests-passed`).text(testResults[featureId]['numPassed'])
    $(`.popover.${featureId} .num-tests-total`).text(testResults[featureId]['numTotal'])
    if (testResults[featureId]['numPassed'] == testResults[featureId]['numTotal']) {
      $(`.code-input a.${featureId}`).addClass('correct-val').removeClass('incorrect-val')
    } else {
      $(`.code-input a.${featureId}`).addClass('incorrect-val').removeClass('correct-val')
    }

    // checkForPanelCompletion()
    releaseTestHarness(testHarness.id)

  } else {
    alert("Unrecognized tape control event")
  }
}

// TODO: REimplement this
function checkForPanelCompletion() {
  // check to see if this completes the panel
  // var panel = user.course.panels[panelId]
  // if (panel && !panel.complete && panelIsComplete(panel)) {
    
  //   alert(`${panel.title} completed!`)
    
  //   // check for newly unlocked panels and re-render UI 
  //   var postReqs = getPostReqsOfPanel(panelId)
  //   // alert(`postReqs: ${JSON.stringify(postReqs)}`)

  //   for (var i=0; i < postReqs.length; i++) {
  //     createPanel($(`#${postReqs[i]}`))
  //   }
  // }
}


function actionButtonClicked(event) {
  event.stopImmediatePropagation()

  var runTests = false
  var newModule
  var button = $(this)
  var codeModule = button.parent().parent()
  var featureModule = codeModule.parent()
  var index = featureModule.attr('index')
  var panel = button.parent().parent().parent().parent().parent()
  var panelId = panel.attr('id')

  if (codeModule.is('.code-entry')) {
    // user has just typed in an expression, let's check it
    var expressionEntered = codeModule.find('input').val()    
    var expected = featureModule.attr('expression-expected')
    var status = (expressionEntered === expected) ? "entered correct" : "entered incorrect"    
    saveExpressionEnteredToDB(expressionEntered, status, panelId, index)
    
    // create code viewer module
    newModule = createCodeViewerModule(expressionEntered, expected)

  } else if (codeModule.is('.code-button.incorrect')) {
    // incorrect expression entered, so let's go back
    // Start over, just display text input and buttons
    var expressionEntered = codeModule.find('.code-input a').text()
    newModule = createCodeEntryModule(expressionEntered)

    // clear expressionEntered from db
    saveExpressionEnteredToDB('', 'empty', panelId, index)

  } else if (codeModule.is('.code-button.correct')) {
    // Correct expressione was entered, now time to execute it    
    var expressionEntered = codeModule.find('.code-input a').text()
    var expressionExpected = featureModule.attr('expression-expected')
    // alert("EXPRESSION EXPECTED: " + expressionExpected)
    featureModule.attr('expression-entered', expressionEntered)
    newModule = createReturnValViewerModule(expressionEntered, expressionExpected, panelId, index)
    runTests = true // TODO: remove

  } else if (codeModule.is('.return-val-viewer')) {
    // user has asked to reset this feature
    // so we want to re-display the code button
    var expressionEntered = featureModule.attr('expression-entered')
    var status = "entered correct"
    saveExpressionEnteredToDB(null, status, panelId, index)
    newModule = createCodeViewerModule(expressionEntered, expressionEntered)
  }
  
  if (newModule) {
    codeModule.replaceWith(newModule)
    newModule.find('.code-action-module button').focus()
    if (runTests) {
      var featureId = getPropertyFromExpression(featureModule.attr('expression-expected'))
      createTestResultsPopover(newModule, featureId)
    }
  }
}

function activatePanelMode(event) {
  event.stopImmediatePropagation()
  // get id of the parent panel of this button
  var icon = $(this)
  var currentPanel = icon.parent().parent()

  // re-create panel body from json, using the specified mode
  createPanel(currentPanel, icon.attr('mode'))
}

function togglePanelMinimization(event) {
  event.stopImmediatePropagation()
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
    // alert(`${panel.title} was just unlocked!`)
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
  var panelBody = panel.find('.panel-body')

  if (mode === "display" && displayType === "tableType") {
    table = $('#templates .table-template').clone()
    table.appendTo(panelBody)
  }
  
  // for each feature, create appropriate featureModule
  for (var i=0; i < panelData.features.length; i++) {
    var featureModule
    var featureData = panelData.features[i]

    if (mode === "debug") {
      featureModule = createDebugFeatureModule(featureData)
      panelBody.append(featureModule)
    } else if (displayType === "tableType") {
      featureModule = createTableFeatureModule(featureData)
      table.append(featureModule)
    } else if (displayType === "barType") {
      featureModule = createBarFeatureModule(featureData)
      panelBody.append(featureModule)
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
  var featureModule = createDebugFeatureModule({
    expressionExpected: 'getAppName()',
    type: "method",
    status: "empty",
    expressionEntered: ""
  })

  featureModule.appendTo($('body')).css({
    position: 'absolute',
    top: '100px',
    left: '100px',
    border: '1px solid white'
  })
}


function createDebugFeatureModule(featureData) {
  var runTests = false
  var featureId
  var featureModule = $('#templates .feature-module').clone().attr('expression-expected', featureData.expressionExpected)

  var label = $('#templates .label-' + featureData.type).clone()
  label.find('.label-text').text(
    convertCodeToEnglish(featureData.expressionExpected)
  )
  featureModule.append(label)
  
  var debugModule
  if (featureData.status === 'empty') {
    debugModule = createCodeEntryModule()
  } else if (
    featureData.status === 'entered correct' ||
    featureData.status === 'entered incorrect'
  ) { 
    debugModule = createCodeViewerModule(
      featureData.expressionEntered, featureData.expressionExpected
    )
  } else if (
    featureData.status === 'executed correct' ||
    featureData.status === 'executed incorrect') {
    debugModule = createReturnValViewerModule(featureData.expressionEntered, featureData.expressionExpected)
    featureModule.attr('expression-entered', featureData.expressionEntered)
    featureId = getPropertyFromExpression(featureData.expressionExpected)
    // TODO: Implement this
    // runTestsForFeature(featureId)
    // runTestsForFeatureAsync(featureId)
    runTests = true
  } else {
    alert('unrecognized feature status')
  }

  featureModule.append(debugModule)
  if (runTests) {
    createTestResultsPopover(debugModule, featureId)
  }

  return featureModule
}

function createTableFeatureModule(featureData) {
  var trTemplate = $('#templates tr').clone()
  trTemplate.find('.label').text(
    convertCodeToEnglish(featureData.expressionExpected)
  )
  trTemplate.find('.value').text(
    eval(featureData.expressionExpected)
  )
  return trTemplate
}

var colorIndex = 0
var colors = ["#090", "#36c","#f4ff00","#f00", "purple"]

function createBarFeatureModule(featureData) {
  var value = eval(featureData.expressionExpected)
  var template = $(`#templates .stat-bar`).clone()

  template.attr('id', featureData.expressionExpected)
  template.find('label').text(
    convertCodeToEnglish(featureData.expressionExpected)
  )
  colorIndex = (++colorIndex % colors.length)
  template.find('.progress-bar').css({
    width: `${value}%`,
    backgroundColor: colors[colorIndex]
  })
  template.find('.bar-reading').text(`${value}/100`)
  
  return template
}

function createCodeEntryModule(expressionEntered) {
  var module = $('#templates .code-entry').clone()
  if (expressionEntered) {
    module.find('input').val(expressionEntered)
  }
  return module
}

function createCodeViewerModule(expressionEntered, expected) {
  var status = (expressionEntered === expected) ? "correct" : "incorrect" 
  var module = $('#templates .code-button.' + status).clone()
  module.find('.code-input a').text(expressionEntered)

  return module
}

function createTestResultsPopover(module, featureId) {

  module.find('.code-input a').popover({
    html: true,
    container: 'body',
    template: createPopoverTemplate(featureId),
    title: function () { return createPopoverTitle(featureId) },
    content: function () { return createPopoverContent(featureId) },
    placement: 'auto bottom',
    trigger: 'manual'
  }).popover('show')

  // runTestsForFeature(featureId)
  runTestsForFeatureAsync(featureId)
}

function createReturnValViewerModule(expressionEntered, expressionExpected, panelId, index) {
  var result = evaluateExpression(expressionEntered)
  var module = $("#templates .return-val-viewer").clone()
  var formattedVal = formatReturnValue(result.returnValue)
  var featureId = getPropertyFromExpression(expressionExpected)
  
  module.find('.code-input a').text(formattedVal).addClass(featureId)
  module.find('.code-action-module a').attr('expression-entered', expressionEntered)

  // TODO: Need to update entry's status when correctly executed
  var status = "executed " + result.status
  saveExpressionEnteredToDB(null, status, panelId, index)

  return module
}

function evaluateExpression(code) {
  var result = {}
  try {
    result.returnValue = eval(code)
  } catch (err) {
    result.returnValue = err.message
  }
  result.status = "correct" // TODO: Make this neutral

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
  var source
  // alert('property = ' + property)
  if (property in t) {
    source = t[property].toString()
  } else {
    source = '(UNDEFINED)'
  }
  tooltipText += `<pre><code>${source}</code></pre>`

  return tooltipText
}

function getPropertyFromButton(button) {
  var featureModule = button.parent().parent().parent()
  var expression = featureModule.attr('expression-expected')
  return getPropertyFromExpression(expression)
}

/*
  Converts an expression like 't.say("hello")' to 'say'
  Or trainer.getHeight to 'getHeight'
*/
function getPropertyFromExpression(text) {
  // alert("getting property from expresssion: " + text)
  // get property name if called on obj
  if (text.split(".").length == 2) {
    text = text.split(".")[1]
  }
  // remove args if it's a method call
  var argsRegEx = /\(.*\)/
  text = text.replace(argsRegEx,'')
  
  // alert("got: " + text)
  return text
}

function savePanelToDB(panel) {
  var panelPath = `courses/${user.uid}/panels/${panel.id}/`
  db.ref(panelPath).update(panel)
}

function saveExpressionEnteredToDB(expressionEntered, status, panelId, index) {
  var featurePath = `courses/${user.uid}/panels/${panelId}/`
  featurePath += `features/${index}/` 
  
  // save expressionEntered to db if supplied (otherwise, just update status)
  if (expressionEntered) {
    db.ref(featurePath).child('expressionEntered').set(expressionEntered)
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

function camelToTitleCase(text) {
  var result = text.replace(/([A-Z])/g, " $1" )
  return result.charAt(0).toUpperCase() + result.slice(1);
}


function clearUserData(event) {
  event.stopImmediatePropagation()
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

function createTestTrainer() {
  var trainer = new Trainer()
  trainer.firstName = "Robert"
  trainer.lastName = "McTrainer"
  trainer.age = 19
  trainer.slogan = "Gotta catch 'em all"
  trainer.favoriteElement = "Fire"
  trainer.favoriteColor = "red"
  trainer.energy = 75
  trainer.happiness = 40
  trainer.confidence = 90
  trainer.intelligence = 60
  trainer.strength = 80
  return trainer
}

function runTestsForFeatureAsync(featureId) {
  runAsyncTapeTest(
    function(testHarness) {
      // activeTest = featureId
      testHarness.featureId = featureId
      // alert("Starting test for " + featureId)
      testHarness.createStream({objectMode: true}).on('data',
        function(row) {
          return consumeTapeStream(row, testHarness)
        }
      );
      
      testHarness(featureId, tests[featureId])
    }
  )
}

function runAsyncTapeTest(testFunc) {
  var testHarness = acquireTestHarness()
  
  // if none immediately available, add test to queue
  if (!testHarness) {
    testQueue.push(testFunc) 
    // will be run as soon as next text harness is released
  } else {
    testFunc(testHarness)
  }
}

function initTestHarnesses() {
  for (var i=0; i < 20; i++) {
    testHarnesses.push({
      id: i,
      locked: false
    })
  }
}

function initTestHarness(i) {
  testHarnesses[i] = tape.createHarness()
  testHarnesses[i].id = i
  testHarnesses[i].locked = true
}

function acquireTestHarness() {
  var testHarness = null

  // if a test harness is available, get it now
  for (var i=0; i < testHarnesses.length; i++) {
    if (!(testHarnesses[i].locked)) {
      initTestHarness(i)
      testHarness = testHarnesses[i]
      break
    }
  }
  return testHarness
}

function releaseTestHarness(i) {
  // if anyone waiting, run them first (FIFO)
  var waitingTest = testQueue.shift()
  if (waitingTest) {
    initTestHarness(i)
    waitingTest(testHarnesses[i])
  } else {
    testHarnesses[i].locked = false
  }
}
