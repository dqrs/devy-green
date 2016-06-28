function setupGUI() {
  $(document).off('.data-api')

  $(document).on(`keyup`, handleKeyPress) 
  $(document).on(`click`, `#chatBubble`, removeChatBubble)
  $(document).on(`click`, `.minimize`,   togglePanelMinimization)
  $(document).on(`click`, `.activate`,   activatePanelMode)
  $(document).on(`click`, `.btn-action`, actionButtonClicked)
  $(document).on(`keyup`, `.input-sm`,   triggerActionButtonOnEnter) 
  $(document).on(`click`, `#clear-data`, clearUserData)
  $(document).on(`click`, `.test-results-popover`, dismissPopover)
  $(document).on(`contextmenu`, `.debug-module-popover`, dismissPopover)
  $(document).on(`click`, `.code-tag-module`, createDebugModulePopover)
  $(document).on(`click`, `.popover-display`, popoverActivateButtonClicked)


  // $('.code-tag-placeholder').each(function() {
  //   createCodeTagModule(this)
  // })

  $('.panel-placeholder').each(function() {
    createPanel(this)
  })

  setupTooltip()
}

function setupTooltip() {
  $(document).tooltip({
    content: getSourceCode,
    items: '.correct-call,.return-val'
  })
}

function handleKeyPress(e) {
  event.stopImmediatePropagation()
  
  // hide all popovers on escape
  if (e.keyCode == 27) {
    $('.code-input a').popover('hide')
  }
}

function triggerActionButtonOnEnter(e) {
  event.stopImmediatePropagation()
  if (e.keyCode == 13) {
    $(':focus').parent().parent().find('.btn-action').click()
  }
}

function dismissPopover(event) {
  event.stopImmediatePropagation()
  event.preventDefault()
  $(event.currentTarget).popover('hide')
}

function createTestResultsPopoverTemplate(featureId) {
  return $('#templates .test-results-popover').clone().addClass(featureId).prop('outerHTML')
}

function createTestResultsPopoverTitle(featureId) { 
  return $(`#templates .test-results-popover .popover-title`).first().html()
}

function createTestResultsPopoverContent(featureId) {
  return $('#templates .test-results-popover .popover-content').first().html()
}

function popoverActivateButtonClicked(event) {
  event.stopImmediatePropagation()

  // figure out who we are
  var button = $(event.currentTarget)
  var featureModule = button.parent().siblings().find('.feature-module')
  var featureId = getPropertyFromExpression(
    featureModule.attr('expression-expected')
  )
  
  var codeTagModule = $(`#${featureId}-tag`)
  var displayModule = $('#templates .code-tag-module.display-mode').first().clone()

  displayModule.attr('id', featureId)
  displayModule.attr('panel-id', 'app-info')
  
  // replace code tag proper disply module
  var displayValue = featureModule.find('.return-val-viewer a').text()
  displayValue = displayValue.replace(/"/g, '')

  displayModule.find('.code-tag-text').text(displayValue)
  codeTagModule.popover('hide')
  codeTagModule.replaceWith(displayModule)
  
  // later:
    // save state to db (display mode)
}

function actionButtonClicked(event) {
  event.stopImmediatePropagation()

  var newModule
  var runTests = false
  var debugModulePopover = false
  var button = $(this)
  var codeModule = button.parent().parent()
  var featureModule = codeModule.parent()
  var featureId = featureModule.attr('feature-id')
  var index = featureModule.attr('index')

  // TODO: Replace this w/ better solution
  if (featureModule.parent().is('.popover-content')) {
    var panelId = 'app-info'
    debugModulePopover = true
  } else {
    var panel = button.parent().parent().parent().parent().parent()
    var panelId = panel.attr('id')
  }

  if (codeModule.is('.code-entry')) {
    // user has just typed in an expression, let's check it
    var expressionEntered = codeModule.find('input').val()    
    var expected = featureModule.attr('expression-expected')
    var status = (expressionEntered === expected) ? "entered correct" : "entered incorrect"    
    saveExpressionEnteredToDB(expressionEntered, status, featureId)
    
    // create code viewer module
    newModule = createCodeViewerModule(expressionEntered, expected)

  } else if (codeModule.is('.code-button.incorrect')) {
    // incorrect expression entered, so let's go back
    // Start over, just display text input and buttons
    var expressionEntered = codeModule.find('.code-input a').text()
    newModule = createCodeEntryModule(expressionEntered)

    // clear expressionEntered from db
    saveExpressionEnteredToDB('', 'empty', featureId)

  } else if (codeModule.is('.code-button.correct')) {
    // Correct expressione was entered, now time to execute it    
    var expressionEntered = codeModule.find('.code-input a').text()
    var expressionExpected = featureModule.attr('expression-expected')
    featureModule.attr('expression-entered', expressionEntered)
    newModule = createReturnValViewerModule(expressionEntered, expressionExpected, featureId, true)

    // mod to add activate icon for popover debug modules
    if (panelId === 'app-info') {
      featureModule.parent().siblings('.popover-title').append(
        `<span class="popover-display glyphicon glyphicon glyphicon-flash" mode="display"></span>`
      )
    }

    runTests = true // TODO: remove

  } else if (codeModule.is('.return-val-viewer')) {
    // user has asked to reset this feature
    // so we want to re-display the code button
    var expressionEntered = featureModule.attr('expression-entered')
    featureModule.find('.code-input a').popover('hide')
    var status = "entered correct"
    saveExpressionEnteredToDB(null, status, featureId)
    newModule = createCodeViewerModule(expressionEntered, expressionEntered)
  }
  
  if (newModule) {
    codeModule.replaceWith(newModule)
    newModule.find('.code-action-module button').focus()
    if (runTests && !debugModulePopover) {
      createTestResultsPopover(newModule, featureId)
    }
  }
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
  div.replaceWith(panel)

  createPanelHead(panel, panelData, mode)
  if (panelIsLocked(panelData)) {
    createLockedPanelBody(panel)
  } else {
    createPanelBody(panel, panelData, mode, displayType)
  }

  if (panelData.minimized) {
    minimizePanel(panel)
  }
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

  // if panel is in display mode and its display mode
  // is a table, then create a table before
  // we start appending features (which are table rows)
  if (mode === "display" && displayType === "tableType") {
    table = $('#templates .table-template').clone()
    table.appendTo(panelBody)
  }
  
  // for each feature, create appropriate featureModule
  for (var i=0; i < panelData.features.length; i++) {
    var featureModule
    var featureId = panelData.features[i]
    var featureData = user.course.features[featureId]

    if (mode === "debug") {
      // alert(JSON.stringify(featureData))
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

    featureModule.attr('feature-id', featureId)
    if (featureModule.popover) {
      featureModule.popover()
    }
  }

}

function createLockedPanelBody(panel) {
  panel.find('.panel-body').replaceWith($('#templates .locked-panel').clone())
}

function createDebugFeatureModule(featureData) {
  var runTests = false
  var featureId = getPropertyFromExpression(featureData.expressionExpected)
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
    debugModule = createReturnValViewerModule(featureData.expressionEntered, featureData.expressionExpected, null, false)
    featureModule.attr('expression-entered', featureData.expressionEntered)
    runTests = true
  } else {
    alert('unrecognized feature status')
  }

  featureModule.append(debugModule)
  if (runTests) {
    featureModule.popover = function() {
      createTestResultsPopover(debugModule, featureId)
    }
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
    template: createTestResultsPopoverTemplate(featureId),
    title: createTestResultsPopoverTitle(featureId),
    content: createTestResultsPopoverContent(featureId),
    placement: 'auto bottom',
    trigger: 'manual'
  }).popover('show')

  // runTestsForFeature(featureId)
  runTestsForFeatureAsync(featureId)
}

function createReturnValViewerModule(expressionEntered, expressionExpected, featureId, evaluateCode) {
  var result
  if (evaluateCode) {
    result = evaluateExpression(expressionEntered)
  } else {
    result = "(void)"
  }

  var module = $("#templates .return-val-viewer").clone()
  var formattedVal = formatReturnValue(result.returnValue)
  
  module.find('.code-input a').text(formattedVal).addClass(featureId)

  module.find('.code-action-module a').attr('expression-entered', expressionEntered)

  // TODO: Need to update entry's status when correctly executed
  var status = "executed " + result.status
  if (featureId) {
    saveExpressionEnteredToDB(null, status, featureId)
  }

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

function getSourceCode() {
  var element = $(this)

  var property = getPropertyFromButton(element)
  var tooltipText = `<h5>Source Code:</h5>`
  var source
  // alert('property = ' + property)
  if (property in t) {
    source = t[property].toString()
  } else if (typeof property != 'undefined') {
    source = window[property].toString()
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

function convertCodeToEnglish(text) {
  return camelToTitleCase(getPropertyFromExpression(text))
}

function camelToTitleCase(text) {
  var result = text.replace(/([A-Z])/g, " $1" )
  return result.charAt(0).toUpperCase() + result.slice(1);
}


// function createDebugModulePopover(module, featureId) {

//   module.find('.code-input a').popover({
//     html: true,
//     container: 'body',
//     template: createDebugModulePopoverTemplate(featureId),
//     title: createDebugModulePopoverTitle(featureId),
//     content: createDebugModulePopoverContent(featureId),
//     placement: 'auto bottom',
//     trigger: 'manual'
//   }).popover('show')

//   // runTestsForFeature(featureId)
//   runTestsForFeatureAsync(featureId)
// }

// Clone template
// Fill it in with data
  // id
  // placeholder text
// add popover event handlers
// then link it into the rest of the state machine stuff (?)

function createCodeTagModule(_div, _mode) {
  var div = $(_div)
  var codeTagData = user.course.panels['app-info'][div.attr('id')] 
  // TODO: Select template based on mode
  var codeTagModule = $('#templates .code-tag-module.debug-mode').first().clone()

  codeTagModule.attr('id', div.attr('id'))
  codeTagModule.attr('panel-id', 'app-info')
  codeTagModule.attr('index', 0)
  div.replaceWith(codeTagModule)
}

function createDebugModulePopover(event) {
  var button = $(event.currentTarget)
  var panelId = button.attr('panel-id')
  var index = button.attr('index')
  var featureData = user.course.panels[panelId].features[index]
  var featureId = getPropertyFromExpression(featureData.expressionExpected)

  button.popover({
    html: true,
    container: 'body',
    template: createDebugModulePopoverTemplate(featureId),
    title: createDebugModulePopoverTitle(featureId),
    content: function() {
      var module = createDebugFeatureModule(featureData)
      return module.prop('outerHTML')
    },
    placement: 'auto bottom',
    trigger: 'manual'
  }).popover('show')
}

function createDebugModulePopoverTemplate(featureId) {
  return $('#templates .debug-module-popover').clone().addClass(featureId).prop('outerHTML')
}

function createDebugModulePopoverTitle(featureId) { 
  return $(`#templates .debug-module-popover .popover-title`).first().html()
}

function createDebugModulePopoverContent(featureId, index) {
  // TODO: Implement real vals
  // var featureData = codeTags[featureId]

  var featureModule = createDebugFeatureModule({
    expressionExpected: 'getAppName()',
    type: "method",
    status: "empty",
    expressionEntered: ""
  })

  return featureModule
}

// function popoverCodeNotes() {
  // should code tags be stored in separate file?
  // base_course.js with panels and code_tags as vars?
  // or separate file for each

  // when tag is clicked
  // popover should be created
  // popover given id of clicked code-tag

  // popover title is empty
  // popover content is a code entry module
  // for placeholder vals, works as usual except no tests run
  // jus checks if return val is defined/ a string??
  // expected expression and expected return val?

  // for create trainer tag
  // check if code matches expected regex
  // if so, then eval the code
  // be sure to save their trainer variable name
  // and make it a global var
  // then it needs to be used for all future calls

  // GUI:
  // should be a large empty box with a border and button inside
  // then when clicked, should fill GUI as current
  // the state of all of these buttons should saved

  // what about multiple trainers?
  // should create global update function to let kids
  // modify trainer ojects and  redisplay

  // what about the trainer image??

// }

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
