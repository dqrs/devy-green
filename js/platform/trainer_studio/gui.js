function setupGUI() {
  $(document).off('.data-api')

  $(document).on(`click`, `.btn-action`, actionButtonClicked)
  $(document).on(`click`, `.code-tag-module.debug-mode`, createCodeTagPopover)
  // $(document).on(`click`, `.test-results-popover`, dismissPopover)
  $(document).on(`click`, `.close-popover`, closePopoverButtonClicked)
  $(document).on(`click`, `.go-back`, backButtonClicked)
  $(document).on(`contextmenu`, `.debug-module-popover`, dismissPopover)
  $(document).on(`click`, `.popover-display`, changeCodeTagToDisplayMode)
  $(document).on(`click`, `.code-tag-module.display-mode`, changeCodeTagToDebugMode)
  $(document).on(`keyup`, handleKeyPress) 
  $(document).on(`keyup`, `.input-sm`,   triggerActionButtonOnEnter) 
  $(document).on(`click`, `.minimize`,   togglePanelMinimization)
  $(document).on(`click`, `.activate`,   activatePanelMode)
  $(document).on(`click`, `#chatBubble`, removeChatBubble)
  $(document).on(`click`, `#clear-data`, clearUserData)

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

function createTestResultsModuleTemplate(feature) {
  return $('#templates .test-results-popover').clone().attr('feature-id',feature.id).prop('outerHTML')
}

// function createTestResultsModuleTitle(feature) { 
//   return $(`#templates .test-results-popover .popover-title`).first().html()
// }

// function createTestResultsModuleContent(feature) {
//   return $('#templates .test-results-popover .popover-content').first().html()
// }

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
  var element = $(event.currentTarget)
  var popover = element.parent().parent().parent()
  var featureId = popover.attr('feature-id')
  $(`.code-tag-module[feature-id="${featureId}"]`).popover('hide')
}

function backButtonClicked(event) {
  event.stopImmediatePropagation()

  var {codeModule, featureModule, featureId, feature} = getActionButtonClickContext(this)

  if (feature.status === 'expression-incorrect') {
    codeViewerBackButtonClicked(this)
  } else if (feature.status === 'expression-correct') {
    codeViewerBackButtonClicked(this)
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
    codeEntryButtonClicked(this)

  } else if (feature.status === 'expression-incorrect') {
    // incorrect expression entered,
    // so let's go back to the code entry module
    codeViewerBackButtonClicked(this)

  } else if (feature.status === 'expression-correct') {
    // Correct expression was entered, so 
    // now it's time to run tests and evaluate it
    evalExpressionButtonClicked(this)

  } else if (feature.status.split("-")[0] === 'execution') {
    // User's code is correct and she wants to activate it
    changeCodeTagToDisplayMode(this)
  }
}

function codeEntryButtonClicked(clickedElt) {
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

function codeViewerBackButtonClicked(clickedElt) {
  var {codeModule, featureModule, featureId, feature} = getPopoverControlButtonClickContext(clickedElt)

  // incorrect expression entered,
  // so let's go back to the code entry module
  feature.status = 'expression-empty'
  saveFeatureToDB(feature)
  newModule = createCodeEntryModule(feature)
  codeModule.replaceWith(newModule)
  newModule.find('.code-action-module button').focus()
}

function evalExpressionButtonClicked(clickedElt) {
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
  var popover = newModule.parent().parent().parent()
  createTestResultsModule(popover, feature)
}

function returnValBackButtonClicked(clickedElt) {
  var {codeModule, featureModule, featureId, feature} = getPopoverControlButtonClickContext(clickedElt)

  // user has asked to reset this feature
  // so we want to re-display the code viewer module
  featureModule.find('.code-input a').popover('hide')
  feature.status = "expression-correct"
  saveFeatureToDB(feature)
  
  newModule = createCodeViewerModule(feature)
  codeModule.replaceWith(newModule)
  newModule.find('.code-action-module button').focus()

  // remove test results module
  featureModule.siblings('.test-results-module').remove()
}

function changeCodeTagToDisplayMode(clickedElt) {
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
  feature.status = 'expression-empty'
  saveFeatureToDB(feature)
  var debugModule = createCodeTagDebugModule(feature)
  var displayModule = $(`.code-tag-module[feature-id="${feature.id}"`)
  displayModule.replaceWith(debugModule)
  debugModule.click()
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

function createUnlockedPanelBody(panel, panelData, mode, displayType) {
  var table
  var panelBody = panel.find('.panel-body')

  // create a table before
  // we start appending features (which are table rows)
  table = $('#templates .table-template').clone()
  table.appendTo(panelBody)
  
  // for each feature create a code tag
  for (var i=0; i < panelData.features.length; i++) {
    var featureModule
    var featureId = panelData.features[i]
    var feature = user.course.features[featureId]

    featureModule = createTableFeatureModuleWithCodeTag(feature)
    table.append(featureModule)

    // if (featureModule.popover) {
    //   featureModule.popover()
    // }
  }

  // Activate code tags within this panel
  panelBody.find('.code-tag-placeholder').each(function() {
    createCodeTagModule(this)
  })
}

// function createUnlockedPanelBody(panel, panelData, mode, displayType) {
//   var table
//   var panelBody = panel.find('.panel-body')

//   // if panel is in display mode and its display mode
//   // is a table, then create a table before
//   // we start appending features (which are table rows)
//   if (mode === "display" && displayType === "tableType") {
//     table = $('#templates .table-template').clone()
//     table.appendTo(panelBody)
//   }
  
//   // for each feature, create appropriate type of featureModule
//   for (var i=0; i < panelData.features.length; i++) {
//     var featureModule
//     var featureId = panelData.features[i]
//     var feature = user.course.features[featureId]

//     if (mode === "debug") {
//       // alert(JSON.stringify(feature))
//       featureModule = createDebugFeatureModule(feature)
//       panelBody.append(featureModule)
//     } else if (displayType === "barType") {
//       featureModule = createBarFeatureModule(feature)
//       panelBody.append(featureModule)
//     } else if (displayType === "tableType") {
//       featureModule = createTableFeatureModule(feature)
//       table.append(featureModule)
//     } else {
//       alert('unrecognized display type')
//     }

//     if (featureModule.popover) {
//       featureModule.popover()
//     }
//   }

// }

function createLockedPanelBody(panel) {
  panel.find('.panel-body').replaceWith($('#templates .locked-panel').clone())
}

function createDebugFeatureModule(feature) {
  var featureModule = $('#templates .feature-module').clone()
  featureModule.attr('feature-id', feature.id)
  
  var debugModule
  if (feature.status === 'expression-empty') {
    debugModule = createCodeEntryModule(feature)

  } else if (feature.status.split('-')[0] === 'expression') { 
    debugModule = createCodeViewerModule(feature)

  } else if (feature.status.split('-')[0] === 'execution') {
    debugModule = createReturnValViewerModule(feature)
    featureModule.popover = function() {
      createTestResultsModule(debugModule, feature)
    }
  } else {
    alert('unrecognized feature status')
  }

  featureModule.append(debugModule)

  return featureModule
}

function createTableFeatureModuleWithCodeTag(feature) {
  var trTemplate = $('#templates tr.with-code-tag').clone()
  trTemplate.find('.label').text(
    convertCodeToEnglish(feature.expressionExpected)
  )
  // trTemplate.find('.value').text(
  //   eval(feature.expressionExpected)
  // )
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
  } else if (feature.status.split('-')[0] === 'execution') {
    instrux = globalInstrux['execution']
  } else {
    instrux = "XXXXXXXXXXXX"
  }
  return instrux
}

function setPopoverTitle(feature) {
  var instrux = getInstruxFromStatus(feature)
  var popover = $(`.popover[feature-id="${feature.id}"]`)
  popover.find('.instrux').text(instrux)
  if (feature.status === 'expression-empty') {
    popover.find('.go-back').addClass('hidden')
  } else {
    popover.find('.go-back').removeClass('hidden')
  }
}

function createCodeEntryModule(feature) {
  var module = $('#templates .code-entry').clone()
  if (feature.expressionEntered) {
    module.find('input').val(feature.expressionEntered)
  }

  setPopoverTitle(feature)
  return module
}


function createCodeViewerModule(feature) {
  var module = $('#templates .code-viewer-module.' + feature.status).clone()
  module.find('.code-input a').text(feature.expressionEntered)
  setPopoverTitle(feature)
  return module
}

function createReturnValViewerModule(feature) {
  var module = $("#templates .return-val-viewer").clone()
  module.find('.code-input a').text(feature.returnValue)
  setPopoverTitle(feature)
  return module
}

function createTestResultsModule(popover, feature) {

  // module.find('.code-input a').popover({
  //   html: true,
  //   container: 'body',
  //   template: createTestResultsModuleTemplate(feature),
  //   title: createTestResultsModuleTitle(feature),
  //   content: createTestResultsModuleContent(feature),
  //   placement: 'auto bottom',
  //   trigger: 'manual'
  // }).popover('show')
  var testResultsModule = $('#templates .test-results-module').clone()
  popover.find('.popover-content').append(testResultsModule)

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
  var title = $('#templates .debug-module-popover .popover-title').first().clone()
  title.find('.instrux').text(getInstruxFromStatus(feature))
  // if (feature.status === 'expression-correct') {
  //   title.find('.popover-display').removeClass('hidden')
  // }
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