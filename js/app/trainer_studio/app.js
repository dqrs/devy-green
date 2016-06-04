var trainer = getTrainer()

function init() {
  disableUndefinedButtons()
  $("button").click(function(event) {
    evaluateButton(event)
  })
  
}

function disableUndefinedButtons() {
  var buttons = $('button')
  buttons.each(function() {
    var button = $(this)
    var property = button.text().split(".")[1]
    if (!trainer.hasOwnProperty(property)) {
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
  var exceptionOccurred = false
  var result = {}
  
  try {
    result.returnValue = eval(code)
  } catch (err) {
    result.returnValue = err.message
    result.status = 'exception'
  }


  if (typeof(result.returnValue) === 'undefined') {
    result.status = 'incorrect'
  } else {
    result.status = "correct"
  }

  return result
}

function formatReturnValue(val) {
  var formattedVal
  if (typeof val === 'string') {
    formattedVal = `"${val}"`
  } else if (typeof val === 'undefined') {
    formattedVal = 'UNDEFINED'
  } else {
    formattedVal = val
  }
  return formattedVal
}

// function fillTemplate(template, code, result) {

// }

$(document).ready(init)
