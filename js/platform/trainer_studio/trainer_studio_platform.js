// var trainer = getTrainer()
var t = new TrainerReference(getTrainer())
var tReference = new TrainerReference(getTrainer())

function init() {
  $(`#chatBubble`).click(removeChatBubble)
  


  $('.replace-with-panel').each(function() {
    constructPanel(this)
  });

  $('body').on(`click`, `.minimize`, togglePanelMinimization)
  $('body').on(`click`, `.activate`, activateDisplayMode)
  $('body').on('click', '.btn-action', actionButtonClicked)

  setupTooltip()
}

$(document).ready(init)

function setupTooltip() {
  $(document).tooltip({
    content: getSourceCode,
    items: 'button.correct-call,button.correct-val'
  })
}

function activateDisplayMode() {
  // get id of the parent panel of this button
  var icon = $(this)
  var currentPanel = icon.parent().parent()

  // re-construct panel body from json, using the specified mode
  // replace current panel body new panel body 
  // var oldPanel = panel.find('.panel-b')
  constructPanel(currentPanel, icon.attr('displayMode'))
}

function constructPanel(_div, _mode) {
  // start at div marked as panel root
  var div = $(_div)
  var panelData = panels[div.attr('id')]  
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

  }

  // event handlers?
  // debug mode vs etc.
  div.replaceWith(panel)
}

function constructDebugFeatureModule(featureData) {
  var featureModule = $('#templates .feature-module').clone().attr('expected-expression', featureData.expression)

  // label
  var label = $('#templates .label-' + featureData.type).clone()
  label.find('.label-text').text(
    convertCodeToEnglish(featureData.expression)
  )
  featureModule.append(label)
  
  // start with code-entry
  var codeEntryModule = $('#templates .code-entry').clone()
  featureModule.append(codeEntryModule)

  return featureModule
}

function constructTableFeatureModule(featureData) {
  var trTemplate = $('#templates tr').clone()
  trTemplate.find('.label').text(
    convertCodeToEnglish(featureData.expression)
  )
  trTemplate.find('.value').text(
    eval(featureData.expression)
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
  var value = eval(featureData.expression)
  var template = $(`#templates .stat-bar`).clone()

  template.attr('id', featureData.expression)
  template.find('label').text(
    convertCodeToEnglish(featureData.expression)
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

  // if (element.is('button')) {
    var property = getPropertyFromButton(element)
    var tooltipText = `<h5>Source Code:</h5>`
    var source = t[property].toString()
    tooltipText += `<pre><code>${source}</code></pre>`
  // }

  return tooltipText
}

function togglePanelMinimization() {
  var element = $(this)
  var minimized = element.hasClass('glyphicon-collapse-up')

  if (minimized) {
    $(this).parent().parent().find('.panel-body').removeClass('hidden')
    $(this).addClass('glyphicon-collapse-down').removeClass('glyphicon-collapse-up')
  } else {
    $(this).parent().parent().find('.panel-body').addClass('hidden')
    $(this).addClass('glyphicon-collapse-up').removeClass('glyphicon-collapse-down')
  }
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

// function evaluateButton(event) {
//   var button = $(event.target)
//   var code = button.text()

//   var testResult = testCode(code)

//   var templateClass
//   if (testResult.status === "correct") {
//     templateClass = 'correctResultTemplate'
//   } else {
//     templateClass = 'errorResultTemplate'
//   }

//   var template = $("."+templateClass).first().clone()
//   template.removeClass(templateClass)
//   template.removeClass('hidden')

//   var formatted = formatReturnValue(testResult.returnValue)

//   template.find('label').text(code)
//   template.find('input').attr('value', formatted)

//   button.parent().parent().replaceWith(template)
// }


// function fillTemplate(template, code, result) {

// }


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

function actionButtonClicked() {
  var newModule
  var button = $(this)
  var codeModule = button.parent().parent()
  var featureModule = codeModule.parent()
  var panel = button.parent().parent().parent().parent()
  
  if (codeModule.is('.code-entry')) {
    // get code from text input
    var expression = codeModule.find('input').val()
    var expectedExpression = featureModule.attr('expected-expression')
    // check if it matches the expected
    if (expression === expectedExpression) {
      // if matches, render code button correct 
      newModule = $('#templates .code-button.correct').clone()
      newModule.find('.code-input button').text(expression)
      codeModule.replaceWith(newModule)      
    } else {
      // else, render code button incorrect 
      newModule = $('#templates .code-button.incorrect').clone()
      newModule.find('.code-input button').text(expression)
      codeModule.replaceWith(newModule)
    }
  } else if (codeModule.is('.code-button.correct')) {
    
    // get code from text input
    var expression = codeModule.find('.code-input button').text()
    var testResult = testCode(expression)

    newModule = $(
      "#templates .return-val-viewer." + testResult.status
    ).clone()

    var formattedVal = formatReturnValue(testResult.returnValue)

    // newModule.find('label').text(code)
    newModule.find('.code-input button').text(formattedVal)
    newModule.find('.code-action-module button').attr('expression', expression)

    codeModule.replaceWith(newModule)    
  } else if (codeModule.is('.code-button.incorrect')) {
  
    // Start over, just display text input and buttons
    var expression = codeModule.find('.code-input button').text()
    newModule = $("#templates .code-entry").clone()
    newModule.find('input').val(expression)
    
    codeModule.replaceWith(newModule)    
  } else if (codeModule.is('.return-val-viewer')) {
    // reset was clicked, 
    // so we want to re-display the code button
    var expression = button.attr('expression')
    newModule = $("#templates .code-button.correct").clone()

    newModule.find('.code-input button').text(button.attr('expression'))
    codeModule.replaceWith(newModule)
  }

  newModule.find('.btn-action').click(actionButtonClicked)
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





























