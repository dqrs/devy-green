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

function textToSpeech(msg) {
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

function setHTMLBackgroundImage(src) {
  if (src) {
    $('body').css('background-image', `url(${src})`)
  } else {
    $('body').css('background-image', `none`)
  }
}

// Todo: Should also save to the db
function setColor(target, r, g, b) {
  var el
  if (target === 'background') {
    el = $('body')
  } else if (target === 'highlight') {
    el = $('.panel-title, .code-tag-module')
  }
  el.css('background-color', `rgb(${r}, ${g}, ${b})`)
}


function createLink(displayText, URL) {
  return `<a href="${URL}">${displayText}</a>`
}

function setDefaultFont(fontName) {
  var d = new Detector()
  if (d.detect(fontName)) {
    $('body').css('font-family', fontName)
    return true
  } else {
    return false
  }
}

function setCodeFont() {

}