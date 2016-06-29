function setupGUI() {
  $(document).off('.data-api')

  $(document).on(`click`, `.btn-action`, actionButtonClicked)
  $(document).on(`click`, `.code-tag-module.debug-mode`, createCodeTagPopover)
  $(document).on(`click`, `.test-results-popover`, dismissPopover)
  $(document).on(`contextmenu`, `.debug-module-popover`, dismissPopover)
  $(document).on(`click`, `.popover-display`, changeCodeTagToDisplayMode)
  $(document).on(`click`, `.code-tag-module.display-mode`, changeCodeTagToDebugMode)
  $(document).on(`keyup`, handleKeyPress) 
  $(document).on(`keyup`, `.input-sm`,   triggerActionButtonOnEnter) 
  $(document).on(`click`, `.minimize`,   togglePanelMinimization)
  $(document).on(`click`, `.activate`,   activatePanelMode)
  $(document).on(`click`, `#chatBubble`, removeChatBubble)
  $(document).on(`click`, `#clear-data`, clearUserData)


  $('.code-tag-placeholder').each(function() {
    createCodeTagModule(this)
  })

  $('.panel-placeholder').each(function() {
    createPanel(this)
  })

  setupTooltip()
}

function setupTooltip() {
  $(document).tooltip({
    content: getSourceCodeForTooltip,
    items: '.return-val-viewer .btn-code,.code-viewer-module.expression-correct .btn-code'
  })
}

function handleKeyPress(e) {
  event.stopImmediatePropagation()
  
  // hide all popovers on escape
  if (e.keyCode == 27) {
    $('.code-input a, .code-tag-module').popover('hide')
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

function createTestResultsPopoverTemplate(feature) {
  return $('#templates .test-results-popover').clone().attr('feature-id',feature.id).prop('outerHTML')
}

function createTestResultsPopoverTitle(feature) { 
  return $(`#templates .test-results-popover .popover-title`).first().html()
}

function createTestResultsPopoverContent(feature) {
  return $('#templates .test-results-popover .popover-content').first().html()
}

function changeCodeTagToDisplayMode(event) {
event.stopImmediatePropagation()
  var element = $(event.currentTarget)
  var featureId = element.parent().parent().attr('feature-id')
  var feature = user.course.features[featureId]

  feature.mode = 'display'
  saveFeatureToDB(feature)
  var displayModule = createCodeTagDisplayModule(feature)
  var debugModule = $(`.code-tag-module[feature-id="${feature.id}"`)
  debugModule.popover('hide')
  debugModule.replaceWith(displayModule)
}

function changeCodeTagToDebugMode(event) {
  event.stopImmediatePropagation()
  var element = $(event.currentTarget)
  var featureId = element.attr('feature-id')
  var feature = user.course.features[featureId]

  feature.mode = 'debug'
  feature.status = 'expression-empty'
  saveFeatureToDB(feature)
  var debugModule = createCodeTagDebugModule(feature)
  var displayModule = $(`.code-tag-module[feature-id="${feature.id}"`)
  displayModule.replaceWith(debugModule)
  debugModule.click()
}

function actionButtonClicked(event) {
  event.stopImmediatePropagation()

  // alert("actionButtonClicked!")

  var button = $(this)
  var codeModule = button.parent().parent()
  var featureModule = codeModule.parent()
  
  var featureId = featureModule.attr('feature-id')
  var feature = user.course.features[featureId]

  var newModule
  if (feature.status === 'expression-empty') {
    // user has just typed in an expression,
    // so let's check to see if it's correct
    _feature = feature
    _codeModule = codeModule
    _featureModule = featureModule
    _featureId = featureId

    feature.expressionEntered = codeModule.find('input').val()    
    if (feature.expressionEntered === feature.expressionExpected) {
      feature.status = "expression-correct"
    } else {
      feature.status = "expression-incorrect"
    }
    saveFeatureToDB(feature)
    newModule = createCodeViewerModule(feature)

  } else if (feature.status === 'expression-incorrect') {
    // incorrect expression entered,
    // so let's go back to the code entry module
    feature.status = 'expression-empty'
    saveFeatureToDB(feature)
    newModule = createCodeEntryModule(feature)

  } else if (feature.status === 'expression-correct') {
    // Correct expression was entered, so 
    // now it's time to run tests and evaluate it
    feature.status = 'execution-in-progress'
    feature.returnValue = formatReturnValue(
      evaluateExpression(feature.expressionEntered)  
    )
    saveFeatureToDB(feature)
    newModule = createReturnValViewerModule(feature)

    // display activate icon for popover debug modules
    if (feature.codeTag) {
      featureModule.parent().siblings('.popover-title').find('span.popover-display').removeClass('hidden')
    }

  } else if (feature.status.split("-")[0] === 'execution') {
    // user has asked to reset this feature
    // so we want to re-display the code viewer module
    featureModule.find('.code-input a').popover('hide')
    feature.status = "expression-correct"
    saveFeatureToDB(feature)
    newModule = createCodeViewerModule(feature)
  }
  
  codeModule.replaceWith(newModule)
  newModule.find('.code-action-module button').focus()
  if (feature.status === 'execution-in-progress' && !feature.codeTag) {
    createTestResultsPopover(newModule, feature)
  }
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
  
  // for each feature, create appropriate type of featureModule
  for (var i=0; i < panelData.features.length; i++) {
    var featureModule
    var featureId = panelData.features[i]
    var feature = user.course.features[featureId]

    if (mode === "debug") {
      // alert(JSON.stringify(feature))
      featureModule = createDebugFeatureModule(feature)
      panelBody.append(featureModule)
    } else if (displayType === "barType") {
      featureModule = createBarFeatureModule(feature)
      panelBody.append(featureModule)
    } else if (displayType === "tableType") {
      featureModule = createTableFeatureModule(feature)
      table.append(featureModule)
    } else {
      alert('unrecognized display type')
    }

    if (featureModule.popover) {
      featureModule.popover()
    }
  }

}

function createLockedPanelBody(panel) {
  panel.find('.panel-body').replaceWith($('#templates .locked-panel').clone())
}

function createDebugFeatureModule(feature) {
  var featureModule = $('#templates .feature-module').clone()
  featureModule.attr('feature-id', feature.id)

  var label = $('#templates .label-' + feature.type).clone()
  label.find('.label-text').text(
    convertCodeToEnglish(feature.expressionExpected)
  )
  featureModule.append(label)
  
  var debugModule
  if (feature.status === 'expression-empty') {
    debugModule = createCodeEntryModule(feature)

  } else if (feature.status.split('-')[0] === 'expression') { 
    debugModule = createCodeViewerModule(feature)

  } else if (feature.status.split('-')[0] === 'execution') {
    debugModule = createReturnValViewerModule(feature)
    featureModule.popover = function() {
      createTestResultsPopover(debugModule, feature)
    }
  } else {
    alert('unrecognized feature status')
  }

  featureModule.append(debugModule)

  return featureModule
}

function createTableFeatureModule(feature) {
  var trTemplate = $('#templates tr').clone()
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

function createCodeEntryModule(feature) {
  var module = $('#templates .code-entry').clone()
  if (feature.expressionEntered) {
    module.find('input').val(feature.expressionEntered)
  }
  return module
}

function createCodeViewerModule(feature) {
  var module = $('#templates .code-viewer-module.' + feature.status).clone()
  module.find('.code-input a').text(feature.expressionEntered)
  return module
}

function createReturnValViewerModule(feature) {
  var module = $("#templates .return-val-viewer").clone()
  module.find('.code-input a').text(feature.returnValue)
  return module
}

function createTestResultsPopover(module, feature) {

  module.find('.code-input a').popover({
    html: true,
    container: 'body',
    template: createTestResultsPopoverTemplate(feature),
    title: createTestResultsPopoverTitle(feature),
    content: createTestResultsPopoverContent(feature),
    placement: 'auto bottom',
    trigger: 'manual'
  }).popover('show')

  runTestsForFeatureAsync(feature)
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
  module.find('.code-tag-text').text(
    "<" + convertCodeToEnglish(feature.expressionExpected) + ">"
  )
  module.attr('feature-id', feature.id)
  return module
}

function createCodeTagDisplayModule(feature) {
  var module = $('#templates .code-tag-module.display-mode').first().clone()  
  
  // replace code tag proper disply module
  var displayValue = feature.returnValue.replace(/"/g, '')
  module.find('.code-tag-text').text(displayValue)
  module.attr('feature-id', feature.id)
  return module
}

function createCodeTagPopover(event) {
  var element = $(event.currentTarget)
  var featureId = element.attr('feature-id')
  var feature = user.course.features[featureId]

  element.popover({
    html: true,
    container: 'body',
    template: createCodeTagPopoverTemplate(feature),
    title: createCodeTagPopoverTitle(feature),
    content: function() {
      var module = createDebugFeatureModule(feature)
      return module.prop('outerHTML')
    },
    placement: 'auto bottom',
    trigger: 'manual'
  }).popover('show')
}

function createCodeTagPopoverTemplate(feature) {
  return $('#templates .debug-module-popover').clone().attr('feature-id', feature.id).prop('outerHTML')
}

function createCodeTagPopoverTitle(feature) { 
  var title = $('#templates .debug-module-popover h4').first().clone()
  title.find('.instrux').text(feature.instrux)
  if (feature.status === 'expression-correct') {
    title.find('.popover-display').removeClass('hidden')
  }
  return title.html()
}

function createCodeTagPopoverContent(feature) {
  return createDebugFeatureModule(feature)
  // var featureModule = createDebugFeatureModule(feature)
  // return featureModule
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