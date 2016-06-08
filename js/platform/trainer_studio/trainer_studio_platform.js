// var trainer = getTrainer()
var t = new TrainerReference(getTrainer())
var tReference = new TrainerReference(getTrainer())

function init() {
  $(`#chatBubble`).click(removeChatBubble)
  
  $(`button`).each(setupButton)
  $('.minimize').click(toggleModule)
  setupTooltip()
}

function toggleModule() {
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

$(document).ready(init)

function setupTooltip() {
  $(document).tooltip({
    content: getSourceCode,
    items: 'button.function'
  })
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

// function getSourceCodeFromInput() {
//   return "THIS WORKS"
// }

function setupButton() {
  var button = $(this)

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
  // get property name
  var property = button.text().split(".")[1]

  // remove args if it's a method call
  var argsRegEx = /\(.*\)/
  property = property.replace(argsRegEx,'')

  return property
}


function evaluateButton(event) {
  var button = $(event.target)
  var code = button.text()

  var testResult = testCode(code)

  var templateClass
  if (testResult.status === "correct") {
    templateClass = 'correctResultTemplate'
  } else {
    templateClass = 'errorResultTemplate'
  }

  var template = $("."+templateClass).first().clone()
  template.removeClass(templateClass)
  template.removeClass('hidden')

  var formatted = formatReturnValue(testResult.returnValue)

  template.find('label').text(code)
  template.find('input').attr('value', formatted)

  button.parent().parent().replaceWith(template)
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


