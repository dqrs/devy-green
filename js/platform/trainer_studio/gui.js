function setupGUI() {
  $(document).off('.data-api')

  $(document).on(`click`, `.btn-action`, actionButtonClicked)
  $(document).on(`click`, `.code-tag-module.debug-mode`, createCodeTagPopover)
  $(document).on(
    `click`, `.code-tag-module.display-mode`, changeCodeTagToDebugMode
  )
  $(document).on(`click`, `.close-popover`, closePopoverButtonClicked)
  $(document).on(`click`, `.go-back`, backButtonClicked)
  $(document).on(
    `click`, `.popover-display`, returnValActivateButtonClicked
  )
  $(document).on(`keyup`, handleKeyPress) 
  $(document).on(`keyup`, `.input-sm`,   triggerActionButtonOnEnter) 
  $(document).on(`click`, `.minimize`,   togglePanelMinimization)
  $(document).on(`click`, `.activate`,   activatePanelMode)
  $(document).on(`click`, `#chatBubble`, removeChatBubble)
  // $(document).on(`click`, `#clear-data`, clearUserData)

  if (user.course.features.createTrainer.mode === 'display') {
    $('#trainer-placeholder').addClass('hidden')
    $('#main').removeClass('hidden')
  }

  setupAppCodeTags()
  
  $('.panel-placeholder').each(function() {
    createPanel(this)
  })

  setupSourceCodeTooltips()
}


function setupAppCodeTags() {
  $('#header .code-tag-placeholder').each(function() {
    createCodeTagModule(this)
  })
  $('#trainer-placeholder .code-tag-placeholder').each(function() {
    createCodeTagModule(this)
  })
  $('footer .code-tag-placeholder').each(function() {
    createCodeTagModule(this)
  })
}

function setupSourceCodeTooltips() {
  $(document).tooltip({
    content: getSourceCodeForTooltip,
    items: '.return-val-viewer .btn-code,.code-viewer-module.expression-correct .btn-code'
  })
}

function handleKeyPress(e) {
  event.stopImmediatePropagation()
  
  // hide all popovers on escape
  if (e.keyCode == 27) {
    $('.code-input button, .code-tag-module').popover('destroy')
  }
}

function triggerActionButtonOnEnter(e) {
  event.stopImmediatePropagation()
  if (e.keyCode == 13) {
    $(':focus').parent().parent().find('.btn-action').click()
  }
}

function createTestResultsModuleTemplate(feature) {
  return $('#templates .test-results-popover').first().clone().attr('feature-id',feature.id).prop('outerHTML')
}

function getActionButtonClickContext(clickedElement) {
  var button = $(clickedElement)

  var codeModule = button.parent().parent()
  var featureModule = codeModule.parent()
  var featureId = featureModule.attr('feature-id')
  var feature = user.course.features[featureId]
  
  return {
    codeModule,
    featureModule,
    featureId,
    feature
  }
}

function getPopoverControlButtonClickContext(clickedElement) {
  var button = $(clickedElement)

  var popover = button.parent().parent().parent()
  var featureId = popover.attr('feature-id')
  var featureModule = $(`.feature-module[feature-id="${featureId}"`)
  var codeModule = featureModule.find('.code-module')
  var feature = user.course.features[featureId]
  
  return {
    codeModule,
    featureModule,
    featureId,
    feature
  }
}

function closePopoverButtonClicked(event) {
  event.stopImmediatePropagation()

  var element = $(event.currentTarget)
  var popover = element.parent().parent().parent()
  var featureId = popover.attr('feature-id')
  var codeTagModule = $(`.code-tag-module[feature-id="${featureId}"]`)
  codeTagModule.popover('destroy')
}

function backButtonClicked(event) {
  event.stopImmediatePropagation()

  var {codeModule, featureModule, featureId, feature} = getActionButtonClickContext(this)

  if (feature.status === 'expression-incorrect') {
    codeViewerBackButtonClicked(this, 'popoverControlButton')
  } else if (feature.status === 'expression-correct') {
    codeViewerBackButtonClicked(this, 'popoverControlButton')
  } else if (feature.status.split("-")[0] === 'execution') {
    returnValBackButtonClicked(this)
  }
}

function actionButtonClicked(event) {
  event.stopImmediatePropagation()

  var {codeModule, featureModule, featureId, feature} = getActionButtonClickContext(this)

  if (feature.status === 'expression-empty') {
    // user has just typed in an expression,
    // so let's check to see if it's correct
    codeEntrySaveButtonClicked(this)

  } else if (feature.status === 'expression-incorrect') {
    // incorrect expression entered,
    // so let's go back to the code entry module
    codeViewerBackButtonClicked(this, 'actionButton')

  } else if (feature.status === 'expression-correct') {
    // Correct expression was entered, so 
    // now it's time to run tests and evaluate it
    codeViewerRunButtonClicked(this)

  } else if (feature.status.split("-")[0] === 'execution') {
    // User's code is correct and she wants to activate it
    returnValActivateButtonClicked(this)
  }
}

function codeEntrySaveButtonClicked(clickedElt) {
  var {codeModule, featureModule, featureId, feature} = getActionButtonClickContext(clickedElt)

  // user has just typed in an expression,
  // so let's check to see if it's correct
  feature.expressionEntered = codeModule.find('input').val()    
  if (feature.expressionEntered === feature.expressionExpected) {
    feature.status = "expression-correct"
  } else {
    feature.status = "expression-incorrect"
  }
  saveFeatureToDB(feature)
  newModule = createCodeViewerModule(feature)
  codeModule.replaceWith(newModule)
  newModule.find('.code-action-module button').focus()
}

function codeViewerBackButtonClicked(clickedElt, buttonType) {
  if (buttonType === 'actionButton') {
    var {codeModule, featureModule, featureId, feature} = getActionButtonClickContext(clickedElt)
  } else if (buttonType === 'popoverControlButton') {
    var {codeModule, featureModule, featureId, feature} = getPopoverControlButtonClickContext(clickedElt)
  } else {
    alert("unrecognized buttonType")
  }

  // User wants to return to code entry module
  feature.status = 'expression-empty'
  saveFeatureToDB(feature)
  newModule = createCodeEntryModule(feature)
  codeModule.replaceWith(newModule)
  newModule.find('.code-action-module button').focus()
}

function codeViewerRunButtonClicked(clickedElt) {
  var {codeModule, featureModule, featureId, feature} = getActionButtonClickContext(clickedElt)

  // Correct expression was entered, so 
  // now it's time to run tests and evaluate it
  feature.status = 'execution-in-progress'
  feature.returnValue = formatReturnValue(
    evaluateExpression(feature.expressionEntered)  
  )
  saveFeatureToDB(feature)
  
  newModule = createReturnValViewerModule(feature)
  codeModule.replaceWith(newModule)
  newModule.find('.code-action-module button').focus()
  
  featureModule.append(createTestResultsModule(feature))
  runTestsForFeatureAsync(feature)
}

function returnValBackButtonClicked(clickedElt) {
  // user has asked to reset this feature
  // so we want to re-display the code viewer module
  var {codeModule, featureModule, featureId, feature} = getPopoverControlButtonClickContext(clickedElt)

  // featureModule.find('.code-input button').popover('hide')
  featureModule.find('.test-results-module').remove()
  feature.status = "expression-correct"
  saveFeatureToDB(feature)
  
  newModule = createCodeViewerModule(feature)
  codeModule.replaceWith(newModule)
  newModule.find('.code-action-module button').focus()
  featureModule.siblings('.test-results-module').remove()
}


function createPanel(_div, _mode) {
  // start at div marked as panel placeholder
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
    createUnlockedPanelBody(panel, panelData, mode, displayType)
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

function createLockedPanelBody(panel) {
  panel.find('.panel-body').replaceWith($('#templates .locked-panel').clone())
}

function createUnlockedPanelBody(panel, panelData, mode, displayType) {
  var table
  var panelBody = panel.find('.panel-body')

  // create a table before
  // we start appending features (which are table rows)
  table = $('#templates .table-template').first().clone()
  table.appendTo(panelBody)
  
  // for each feature create a code tag
  for (var i=0; i < panelData.features.length; i++) {
    var featureModule
    var featureId = panelData.features[i]
    var feature = user.course.features[featureId]

    featureModule = createTableFeatureModuleWithCodeTag(feature)
    table.append(featureModule)
  }

  // Activate code tags within this panel
  panelBody.find('.code-tag-placeholder').each(function() {
    createCodeTagModule(this)
  })
}

function createCodeTagPopover(event) {
  event.stopImmediatePropagation()

  var element = $(event.currentTarget)
  var featureId = element.attr('feature-id')
  var feature = user.course.features[featureId]

  element.popover({
    html: true,
    container: 'body',
    template: createCodeTagPopoverTemplate(feature),
    title: createCodeTagPopoverTitle(feature),
    content: createDebugFeatureModule(feature).prop('outerHTML'),
    placement: 'auto bottom',
    trigger: 'manual'
  }).popover('show')
  
  if (feature.status.startsWith('execution')) {
    runTestsForFeatureAsync(feature)
  }
}

function createCodeTagPopoverTemplate(feature) {
  return $('#templates .debug-module-popover').first().clone().attr('feature-id', feature.id).prop('outerHTML')
}

function createCodeTagPopoverTitle(feature) { 
  var titleDiv = $('#templates .debug-module-popover .popover-title').first().clone()
  
  setPopoverTitle(feature, titleDiv)
  
  return titleDiv.html()
}

function createCodeTagPopoverContent(feature) {
  return createDebugFeatureModule(feature)
}

function createDebugFeatureModule(feature) {
  var featureModule = $('#templates .feature-module').first().clone()
  featureModule.attr('feature-id', feature.id)
  
  var debugModule
  if (feature.status === 'expression-empty') {
    debugModule = createCodeEntryModule(feature)
    featureModule.append(debugModule)
  } else if (feature.status.startsWith('expression')) { 
    debugModule = createCodeViewerModule(feature)
    featureModule.append(debugModule)
  } else if (feature.status.startsWith('execution')) {
    featureModule.append(createReturnValViewerModule(feature))
    featureModule.append(createTestResultsModule(feature))
  } else {
    alert('unrecognized feature status')
  }

  return featureModule
}

function createTableFeatureModuleWithCodeTag(feature) {
  var trTemplate = $('#templates tr.with-code-tag').first().clone()
  trTemplate.find('.label').text(
    convertCodeToEnglish(feature.expressionExpected)
  )
  trTemplate.find('.code-tag-placeholder').attr('id', feature.id)
  return trTemplate
}

function createTableFeatureModule(feature) {
  var trTemplate = $('#templates tr.display-info').clone()
  trTemplate.find('.label').text(
    convertCodeToEnglish(feature.expressionExpected)
  )
  trTemplate.find('.value').text(
    eval(feature.expressionExpected)
  )
  return trTemplate
}

var colorIndex = 0
var colors = ["#090", "#36c","#f4ff00","#f00", "purple"]

function createBarFeatureModule(feature) {
  var value = eval(feature.expressionExpected)
  var template = $(`#templates .stat-bar`).clone()

  template.attr('id', feature.expressionExpected)
  template.find('label').text(
    convertCodeToEnglish(feature.expressionExpected)
  )
  colorIndex = (++colorIndex % colors.length)
  template.find('.progress-bar').css({
    width: `${value}%`,
    backgroundColor: colors[colorIndex]
  })
  template.find('.bar-reading').text(`${value}/100`)
  
  return template
}

function getInstruxFromStatus(feature) {
  var instrux
  if (feature.status === 'expression-empty') {
    instrux = globalInstrux['expression-empty']
  } else if (feature.status === 'expression-correct') {
    instrux = globalInstrux['expression-correct']
  } else if (feature.status === 'expression-incorrect') {
    instrux = globalInstrux['expression-incorrect']
  } else if (feature.status.startsWith('execution')) {
    instrux = globalInstrux['execution']
  } else {
    alert("unrecognized feature status")
  }
  return instrux
}

function setPopoverTitle(feature, _titleDiv) {
  var instrux = getInstruxFromStatus(feature)
  var titleDiv = _titleDiv || $(`.popover[feature-id="${feature.id}"] .popover-title`)
  
  titleDiv.find('.instrux').text(instrux)
  
  // Hide back button if on first step (expr empty)
  if (feature.status === 'expression-empty') {
    titleDiv.find('.go-back').addClass('hidden')
  } else {
    titleDiv.find('.go-back').removeClass('hidden')
  }
  
  // Display expression if viewing return value
  if (feature.status.startsWith('execution')) {
    titleDiv.find('.expr').text(feature.expressionEntered)
  } else {
    titleDiv.find('.expr').text('')
  }
}

function createCodeEntryModule(feature) {
  var module = $('#templates .code-entry').first().clone()
  if (feature.expressionEntered) {
    console.log(JSON.stringify(feature))
    module.attr('testVal', true)
    module.find('input').val(feature.expressionEntered)
  }

  setPopoverTitle(feature)
  return module
}

function createCodeViewerModule(feature) {
  var module = $('#templates .code-viewer-module.' + feature.status).first().clone()
  module.find('.code-input button').text(feature.expressionEntered)
  setPopoverTitle(feature)
  return module
}

function createReturnValViewerModule(feature) {
  var module = $("#templates .return-val-viewer").first().clone()
  module.find('.code-input button').text(feature.returnValue)
  setPopoverTitle(feature)

  return module
}

function createTestResultsModule(feature) {
  var testResultsModule = $('#templates .test-results-module').first().clone()
  return testResultsModule
}


function createCodeTagModule(_div, _mode) {
  var div = $(_div)
  var feature = user.course.features[div.attr('id')]

  var codeTagModule
  
  if (!feature.mode) {
    if (feature.status === 'execution-correct') {
      feature.mode = 'display'  
    } else {
      feature.mode = 'debug'    
    }
  }

  if (feature.mode === 'debug') {
    codeTagModule = createCodeTagDebugModule(feature)
  } else if (feature.mode === 'display') {
    codeTagModule = createCodeTagDisplayModule(feature)
  } else {
    alert(`unrecognized feature mode: '${feature.mode}'`)
  }

  div.replaceWith(codeTagModule)
}

function createCodeTagDebugModule(feature) {
  var module = $('#templates .code-tag-module.debug-mode').first().clone()
  if (!feature.placeholderText) {
    feature.placeholderText = feature.id
  }
  module.find('.code-tag-text').text(
    "<" + feature.placeholderText + ">"
  )
  module.attr('feature-id', feature.id)
  return module
}

function createCodeTagDisplayModule(feature) {
  var module = $('#templates .code-tag-module.display-mode').first().clone()  
  
  // Convert return value to display value
  var displayValue
  if (feature.id === 'getAppVersion' && 
    Object.prototype.toString.call(feature.returnValue) === "[object Number]") {
    // For app version number format v number as 1.0, 2.1, etc," 
    displayValue = feature.returnValue.toPrecision(2)
  } else {
   displayValue = feature.returnValue.toString().replace(/"/g, '')
  }

  module.find('.code-tag-text').text(displayValue)
  module.attr('feature-id', feature.id)
  return module
}


function returnValActivateButtonClicked(clickedElt) {
  var {codeModule, featureModule, featureId, feature} = getActionButtonClickContext(clickedElt)

  feature.mode = 'display'
  saveFeatureToDB(feature)

  var debugModule = $(`.code-tag-module[feature-id="${feature.id}"`)
  debugModule.popover('hide')

  if (feature.id === 'createTrainer') {
    $('#trainer-placeholder').addClass('hidden')
    $('#main').removeClass('hidden')
  } else {
    var displayModule = createCodeTagDisplayModule(feature)
    debugModule.replaceWith(displayModule)
  }
}

function changeCodeTagToDebugMode(event) {
  event.stopImmediatePropagation()
  var element = $(event.currentTarget)
  var featureId = element.attr('feature-id')
  var feature = user.course.features[featureId]

  feature.mode = 'debug'
  // feature.status = 'expression-empty'
  saveFeatureToDB(feature)
  var debugModule = createCodeTagDebugModule(feature)
  var displayModule = $(`.code-tag-module[feature-id="${feature.id}"`)
  displayModule.replaceWith(debugModule)
  debugModule.click()
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

function evaluateExpression(code) {
  var returnValue
  try {
    returnValue = eval(code)
  } catch (err) {
    returnValue = err.message
  }
  return returnValue
}

function formatReturnValue(val) {
  var formattedVal
  if (typeof val === 'string') {
    formattedVal = `"${val}"`
  } else if (typeof val === 'object') {
    formattedVal = JSON.stringify(val)
  } else if (typeof val === 'undefined') {
    formattedVal = '(UNDEFINED)'
  } else {
    formattedVal = val
  }
  return formattedVal
}

function getSourceCodeForTooltip() {
  var element = $(this)

  var featureModule = element.parent().parent().parent()
  var property = featureModule.attr('feature-id')
  var tooltipText = `<h5>Source Code:</h5>`
  
  var source
  if (property in t) {
    source = t[property].toString()
  } else if (property in window) {
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
