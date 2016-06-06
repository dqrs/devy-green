var trainer = getTrainer()
var trainerReference = new TrainerReference(getTrainer())

function init() {
  disableUndefinedButtons()
  $("button").click(function(event) {
    evaluateButton(event)
  })
  $(`#chatBubble`).click(removeChatBubble)
  tts("Welcome!")  
}

function disableUndefinedButtons() {
  var buttons = $('button')
  buttons.each(function() {
    var button = $(this)

    // get property name
    var property = button.text().split(".")[1]

    // remove args if it's a method call
    var argsRegEx = /\(.*\)/
    property = property.replace(argsRegEx,'')

    if (typeof trainer[property] === 'undefined') {
      button.removeClass('btn-primary')
      button.attr('disabled', 'disabled')
    }
  })
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
    reference.returnValue = eval('trainerReference.' + methodCall)
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

$(document).ready(init)

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
  // utterance.voice = voices[trainer.voice];
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


