// var trainer = getTrainer()
var t = new TrainerReference(getTrainer())
var tReference = new TrainerReference(getTrainer())

function init() {
  $(`#chatBubble`).click(removeChatBubble)
  


  $('.replace-with-panel').each(function() {
    constructPanel(this)
  });

  // $(`button`).each(setupButton)
  $('.minimize').click(togglePanelMinimization)
  $('.activate').click(togglePanelDisplayMode)

  setupTooltip()
  // setupStatBar('energy')
  // setupStatBar('confidence')
  // setupStatBar('happiness')
  // setupStatBar('intelligence')
  // setupStatBar('strength')

  $('.btn-action').click(actionButtonClicked)

  // localStorage.userName = "Ash Ketchum"
}

$(document).ready(init)

function setupTooltip() {
  $(document).tooltip({
    content: getSourceCode,
    items: 'button.function'
  })
}

function constructPanel(_div) {
  // start at div marked as panel root
  var div = $(_div)
  var data = panels[div.attr('id')]  
  var panel = $('#templates .panel').first().clone()

  // panel head
  panel.find('.panel-title').text(data['title'])

  // panel body
  var body = panel.find('.panel-body')

  // for each feature
  for (var i=0; i < data['features'].length; i++) {
    var feature = data['features'][i]
    var featureModule = $('#templates .feature-module').clone().attr('expected-expression', feature.expression)

    // label
    var label = $('#templates .label-' + feature.type).clone()
    label.find('.label-text').text(
      convertCodeToEnglish(feature.expression)
    )
    featureModule.append(label)
    
    // start with code-entry
    var codeEntryModule = $('#templates .code-entry').clone()
    featureModule.append(codeEntryModule)
    body.append(featureModule)
  }
  

  // event handlers?
  // debug mode vs etc.
  div.replaceWith(panel)
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

function togglePanelDisplayMode() {
  var icon = $(this)
  var panel = icon.parent().parent()
  var activePanelBody = panel.find('.panel-body.active')
  var hiddenPanelBody = panel.find('.panel-body.hidden')
  activePanelBody.removeClass('active').addClass('hidden')
  hiddenPanelBody.removeClass('hidden').addClass('active')

  icon.toggleClass('glyphicon-flash').toggleClass('glyphicon-cog enabled')
}

var colors = ["#090", "#36c","#f4ff00","#f00", "purple"]

function setupStatBar(property) {
  var value = t[property]
  var template = $(`#templates .statBar`).clone()
  template.attr('id', property)
  template.find('label').text(property)
  template.find('.progress-bar').css({
    width: `${value}%`,
    backgroundColor: colors.pop()
  })
  template.find('.bar-reading').text(`${value}/100`)
  $('#current-state .panel-body.display').append(template)
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
    formattedVal = ''
  } else {
    formattedVal = val
  }
  return formattedVal
}

function camelToTitleCase(text) {
  var result = text.replace(/([A-Z])/g, " $1" )
  return result.charAt(0).toUpperCase() + result.slice(1);
}





























