var NUM_TEST_HARNESSES = 5

function initTestHarnesses() {
  for (var i=0; i < NUM_TEST_HARNESSES; i++) {
    testHarnesses.push({
      id: i,
      locked: false
    })
  }
}

function acquireTestHarness() {
  var testHarness = null

  // if a test harness is available, get it now
  for (var i=0; i < testHarnesses.length; i++) {
    if (!(testHarnesses[i].locked)) {
      resetTestHarness(i)
      testHarness = testHarnesses[i]
      break
    }
  }
  return testHarness
}

function releaseTestHarness(i) {
  // if anyone waiting, run them first (FIFO)
  var waitingTest = testQueue.shift()
  if (waitingTest) {
    resetTestHarness(i)
    waitingTest(testHarnesses[i])
  } else {
    testHarnesses[i].locked = false
  }
}

function resetTestHarness(i) {
  testHarnesses[i] = tape.createHarness()
  testHarnesses[i].id = i
  testHarnesses[i].locked = true
}

function consumeTapeStream(row, testHarness) {
  // console.log(JSON.stringify(row))
  var feature = user.course.features[testHarness.featureId]
  var popover = $(`.popover[feature-id="${feature.id}"]`)

  if (row.type === "test") {

    testResults[feature.id] = {}
    testResults[feature.id]['numPassed'] = 0
    testResults[feature.id]['numTotal'] = 0

  } else if (row.type === "assert") {
    
    testResults[feature.id]['numTotal'] += 1
    
    if (row.ok) {
      testResults[feature.id]['numPassed'] += 1
      var tmp = $(`#templates .test-result-line-item.correct`).first().clone()
      tmp.find('.test-name').text(row.name)
    } else {
      var tmp = $(`#templates .test-result-line-item.incorrect`).first().clone()
      tmp.find('.test-name').text(row.name)
    }
    
    popover.find(`table.test-results`).append(tmp)

  } else if (row.type === "end") {
    popover.find(`.num-tests-passed`).text(testResults[feature.id]['numPassed'])
    popover.find(`.num-tests-total`).text(testResults[feature.id]['numTotal'])
    if (testResults[feature.id]['numPassed'] == testResults[feature.id]['numTotal']) {
      popover.find(`.btn-code`).addClass('execution-correct').removeClass('execution-incorrect')
      popover.find(`.btn-action`).removeClass('disabled')
      feature.status = 'execution-correct'
    } else {
      popover.find(`.btn-code`).addClass('execution-incorrect').removeClass('execution-correct')
      feature.status = 'execution-incorrect'
      popover.find(`.btn-action`).addClass('disabled')
    }

    releaseTestHarness(testHarness.id)
    if (feature.status === 'execution-correct') {
      saveFeatureToDB(feature)
    }
    checkForPanelCompletion(feature)

  } else {
    alert("Unrecognized tape control event")
  }
}

function runTestsForFeatureAsync(feature) {
  runAsyncTapeTest(
    function(testHarness) {
      testHarness.featureId = feature.id
      // alert("Starting test for " + feature.id)
      testHarness.createStream({objectMode: true}).on('data',
        function(row) {
          return consumeTapeStream(row, testHarness)
        }
      );
      
      if (feature.id in tests) {
        testHarness(feature.id, tests[feature.id])
      } else {
        console.log("NO TEST FOUND FOR: " + feature.id)
        testHarness(feature.id, tests['placeholder'])
      }
    }
  )
}

function runAsyncTapeTest(testFunc) {
  var testHarness = acquireTestHarness()
  
  // if none immediately available, add test to queue
  if (!testHarness) {
    testQueue.push(testFunc) 
    // will be run as soon as next text harness is released
  } else {
    testFunc(testHarness)
  }
}