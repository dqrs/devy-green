function setupGUI() {
  $(document).off('.data-api')

  $(document).on(`click`, `.btn-action`, actionButtonClicked)
  $(document).on(`click`, `.btn-trigger`, triggerButtonClicked)
  $(document).on(`click`, `.code-tag-module.debug-mode`, createCodeTagPopover)
  $(document).on(
    `click`, `.change-display-mode-icon`, changeCodeTagToDebugMode
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

  if (user.course.features.createTrainer.mode === 'display') {
    renderTrainerDisplayModule('display')
  }

  setupAppCodeTagModules()
  
  $('.panel-placeholder').each(function() {
    createPanel(this)
  })

  setupSourceCodeTooltips()

  // trigger debug popovers for all partially completed features
  $(`.code-tag-module`).each(function() {
    var fid = $(this).attr('feature-id')
    if (!fid) {
      return // ignore popover template
    }
    var feature = user.course.features[fid]
    if (feature.mode === 'debug' && 
      feature.status != 'expression-empty') {
      $(this).click()
    }
  })

}

function renderTrainerDisplayModule(mode) {
  if (mode === 'display') {
    $('#trainer-placeholder').addClass('hidden')
    $('#main').removeClass('hidden')
    $(`.trainer-var`).text(user.course.trainerVar)
  } else if (mode === 'debug') {
    $('#trainer-placeholder').removeClass('hidden')
    $('#main').addClass('hidden')
  } else {
    alert("unrecognized mode for renderTrainerDisplayModule")
  }
}

function setupAppCodeTagModules() {
  $('#header .code-tag-placeholder').each(function() {
    console.log($(this).attr('id'))
    createCodeTagModule(this)
  })
  $('#trainer-placeholder .code-tag-placeholder').each(function() {
    console.log($(this).attr('id'))
    createCodeTagModule(this)
  })
  $('footer .code-tag-placeholder').each(function() {
    console.log($(this).attr('id'))
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


function triggerButtonClicked(event) {
  var button = $(event.currentTarget)
  var expression = button.text()
  eval(expression) // TODO: consider using evalExpression
}

function actionButtonClicked(event) {
  event.stopImmediatePropagation()

  // ignore if button was disabled
  if ($(event.currentTarget).hasClass('disabled')) {
    return
  }

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

function checkIfExpressionMatchesExpected(feature) {

  if (feature.id === 'createTrainer') {
    return checkIfMatchesTrainerConstructor(feature)

  } else if (feature.type === "global_var") {
    return checkIfMatchesGlobalVar(feature)

  } else if (feature.type === "instance_var") {
    return checkIfMatchesInstanceVar(feature)

  } else if (feature.type === "function") {
    return checkIfMatchesFunctionCall(feature)

  } else if (feature.type === 'method') {
    return checkIfMatchesMethodCall(feature)

  } else {
    alert("unrecognized feature type to match!")
  }
}

function checkIfMatchesTrainerConstructor(feature) {
  // perform regex match to allow diff trainer variables
  var newTrainerRegEx = /(var\s)((\w+)\s?=\s?new\sTrainer\s*\(\))/
  var matchArray = newTrainerRegEx.exec(feature.expressionEntered)
  if (matchArray) {
    feature.expressionToExecute = matchArray[2]
    saveFeatureToDB(feature)
    user.course.trainerVar = matchArray[3]
    saveCourseToDB()
    return true
  } else {
    return false
  }
}

function checkIfMatchesGlobalVar(feature) {
  // check matches variable name exactly
  return (feature.expressionEntered === feature.id)
}

function checkIfMatchesInstanceVar(feature) {
  // instance variable expression
  var parts = feature.expressionEntered.split(".")
  return (
    parts.length == 2 && 
    parts[0] === user.course.trainerVar &&
    parts[1] === feature.id
  )
}

function checkIfMatchesFunctionCall(feature) {
  // if (typeof feature.args === 'undefined') {
  //   console.log("No args attribute for " + feature.id)
  //   return true
  // }
  var funcRegex = buildFunctionRegex(feature)
  return funcRegex.exec(feature.expressionEntered)
}

function checkIfMatchesMethodCall(feature) {
  var parts = feature.expressionEntered.split(".")
  var funcRegex = buildFunctionRegex(feature)
  return (
    parts.length == 2 && 
    parts[0] === user.course.trainerVar &&
    funcRegex.exec(parts[1])
  )
}

function codeEntrySaveButtonClicked(clickedElt) {
  var {codeModule, featureModule, featureId, feature} = getActionButtonClickContext(clickedElt)

  // user has just typed in an expression,
  // so let's check to see if it's correct
  feature.expressionEntered = codeModule.find('input').val()    
  if (checkIfExpressionMatchesExpected(feature)) {
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
  // feature.returnValue = formatReturnValue(evaluateExpression(feature))
  // saveFeatureToDB(feature)
  
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
  panel.find('.panel-body').replaceWith($('#templates .locked-panel').first().clone())
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

  // Set focus to input of popover module
  var popover = $(`.popover[feature-id="${featureId}"]`).first()
  if (feature.status === 'expression-empty') {
    popover.find('input').focus()
  } else {
    popover.find('.btn-action').focus()
  }
  
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
    convertCodeToEnglish(feature.id)
  )
  trTemplate.find('.code-tag-placeholder').attr('id', feature.id)
  return trTemplate
}

function createTableFeatureModule(feature) {
  var trTemplate = $('#templates tr.display-info').first().clone()
  trTemplate.find('.label').text(
    convertCodeToEnglish(feature.id)
  )
  trTemplate.find('.value').text(
    eval(feature.expressionEntered)
  )
  return trTemplate
}

function getInstruxFromStatus(feature) {
  var instrux
  if (feature.status === 'expression-empty') {
    instrux = feature.entryInstrux
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
    // console.log(JSON.stringify(feature))
    // module.attr('testVal', true)
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
  module.find('.code-input .return-val').text(
    formatReturnValue(evaluateExpression(feature))
  )
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
    feature.placeholderText = convertCodeToEnglish(
      feature.id.replace('get','')
    )
  }
  module.find('.code-tag-text').text(
    "<" + feature.placeholderText + ">"
  )
  module.attr('feature-id', feature.id)

  return module
}

function createCodeTagDisplayModule(feature) { 
  if (feature.displayType === 'tableType') {
    return createCodeTagTableTypeDisplayModule(feature)
  } else if (feature.displayType === 'barType') {
    return createCodeTagBarTypeDisplayModule(feature)
  } else if (feature.displayType === 'imageType') {
    return createCodeTagImageTypeDisplayModule(feature)
  } else if (feature.displayType === 'linkType') {
    return createCodeTagLinkTypeDisplayModule(feature)
  } else if (feature.displayType === 'settingType') {
    return createCodeTagSettingTypeDisplayModule(feature)
  } else if (feature.displayType === 'triggerType') {
    return createCodeTagTriggerTypeDisplayModule(feature)
  }
}

var colorIndex = 0
var colors = ["#090", "#36c","#f4ff00","#f00", "purple"]
function createCodeTagBarTypeDisplayModule(feature) {
  var displayValue = evaluateExpression(feature)
  
  var template = $(`#templates .bar-type`).first().clone()

  template.attr('id', feature.id)
  colorIndex = (++colorIndex % colors.length)
  template.find('.progress-bar').css({
    width: `${displayValue}%`,
    backgroundColor: colors[colorIndex]
  })
  template.find('.bar-reading').text(`${displayValue}/100`)
  
  return template
}

function createCodeTagTableTypeDisplayModule(feature) {
  var displayValue = evaluateExpression(feature)
  var module = $('#templates .code-tag-module.display-mode').first().clone()
  module.find('.code-tag-text').text(displayValue)
  module.attr('feature-id', feature.id)
  return module
}

function createCodeTagImageTypeDisplayModule(feature) {
  var displayValue = evaluateExpression(feature)
  var module = $('#templates .code-tag-module.image-type').first().clone()
  module.attr('feature-id', feature.id)
  module.find('img').attr("src", displayValue)
  return module
}

function createCodeTagLinkTypeDisplayModule(feature) {
  var displayValue = evaluateExpression(feature)
  var module = $('#templates .code-tag-module.link-type').first().clone()
  var linkHTML = displayValue
  var linkEl = $(linkHTML).attr('target', "_blank")
  module.attr('feature-id', feature.id)
  module.find('a').replaceWith(linkEl)
  return module
}

function createCodeTagSettingTypeDisplayModule(feature) {
  var displayValue = evaluateExpression(feature)
  var module = $('#templates .code-tag-module.setting-type').first().clone()
  module.attr('feature-id', feature.id)
  
  var settingName = feature.expressionEntered.replace('setApp', '').replace(/\(.*\)/, '')
  var settingValue = /\((.*)\)/.exec(feature.expressionEntered)[1]
  module.find('label').text(`${settingName}: ${settingValue}`)
  return module
}

function createCodeTagTriggerTypeDisplayModule(feature) {
  var module = $('#templates .code-tag-module.trigger-type').first().clone()
  module.attr('feature-id', feature.id)
  
  module.find('label').text(feature.placeholderText)
  module.find('button').text(feature.expressionEntered)
  return module
}

function returnValActivateButtonClicked(clickedElt) {
  var {codeModule, featureModule, featureId, feature} = getActionButtonClickContext(clickedElt)

  feature.mode = 'display'
  saveFeatureToDB(feature)

  var debugModule = $(`.code-tag-module[feature-id="${feature.id}"`)
  debugModule.popover('hide')

  if (feature.id === 'createTrainer') {
    renderTrainerDisplayModule('display')
  } else {
    var displayModule = createCodeTagDisplayModule(feature)
    debugModule.replaceWith(displayModule)
  }
}

function changeCodeTagToDebugMode(event) {
  event.stopImmediatePropagation()
  var element = $(event.currentTarget)
  var featureId = element.parent().attr('feature-id')
  var feature = user.course.features[featureId]

  feature.mode = 'debug'
  // feature.status = 'expression-empty'
  saveFeatureToDB(feature)

  if (feature.id === 'createTrainer') {
    renderTrainerDisplayModule('debug')
  }
   
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

function evaluateExpression(feature) {
  // console.log(JSON.stringify(feature))
  if (feature.id === 'createTrainer') {
    try {
      eval("window." + feature.expressionToExecute)
    } catch (err) {
      window[user.course.trainerVar] = err.message
    }
    return window[user.course.trainerVar]

  } else {

    try {
      return eval(feature.expressionEntered)
    } catch (err) {
      return err.message
    } 
  }
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

  // /\s*\w+\s*\([\w\d\,\s]*\)\s*\{/
  var featureModule = element.parent().parent().parent()
  var property = featureModule.attr('feature-id')
  var tooltipText = `<h5>Source Code:</h5>`
  var feature = user.course.features[property]

  var trainer = {}
  if (user.course.trainerVar) {
    trainer = window[user.course.trainerVar]
  }

  var source
  if (property === 'createTrainer') {
    // display Trainer construcutor
    var constructorRegEx = /(constructor\s*\([\w\d\,\s]*\)\s*\{[^}]+\})/
    var pieces = constructorRegEx.exec(Trainer.prototype.constructor)
    if (pieces) {
      source = pieces[1]
    } else {
      source = "An error occurred while parsing the Trainer object's constructor function."
    }
  } else if (feature.type === 'global_var') {
    // display line where variable was defined/assigned first
    var reg = new RegExp("var\\s*" + property + "\\s*=\\s*.+$", "m")
    source = reg.exec(appSourceCode)
  } else if (feature.type === 'instance_var') {
    // display line where variable was defined/assigned first
    var reg = new RegExp("this\\." + property + "\\s*=\\s*.+$", "m")
    source = reg.exec(Trainer.prototype.constructor.toString())
  } else if (property in trainer) {
    // display method definition
    source = trainer[property].toString()
    // display function definition
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
  // get property name if called on obj
  if (text.split(".").length == 2) {
    text = text.split(".")[1]
  }
  // remove args if it's a method call
  var argsRegEx = /\([\w\d\s,]*\)/
  text = text.replace(argsRegEx,'')
  
  // alert("got: " + text)
  return text
}

function convertCodeToEnglish(text) {
  return camelToTitleCase(text)
}

function camelToTitleCase(text) {
  var result = text.replace(/([A-Z])/g, " $1" ).trimLeft()
  return result.charAt(0).toUpperCase() + result.slice(1);
}

var patterns = {}
patterns['str']  = "(['\"`])\\w+\\1"
patterns['num']  = "\\d*\\.?\\d+"
patterns['var']  = "\\w+"
patterns['bool'] = "(?:true)|(?:false)"// untested
patterns['prop'] = "\\w+\\.\\w+" // untested
patterns['func'] = "\\w+\\.\\w+" // untested

function buildFunctionRegex(feature) {
  var argsStart = "\\(\\s*"
  var argsSeparator = "\\s*,\\s*"
  var argsEnd = "\\s*\\)"
  
  var pattern = "^" + feature.id + "\\s*"
  pattern += argsStart
  // var numArgs = Object.keys(feature.args).length
  // for (var i=0; i < numArgs; i++) {
  var args = feature.args.split(', ')
  for (var i=0; i < args.length; i++) {
    
    // empty string means no args required
    if (args[i] === '') {
      continue
    }
    
    pattern += patterns[args[i]]
    if (i < args.length - 1) {
      pattern += argsSeparator
    }
  }
  pattern += argsEnd + "$"

  return new RegExp(pattern)
}
