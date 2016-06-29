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
  if (row.type === "test") {
    
    // console.log(`Starting test #${row.id}: ${featureId}`)
    // beginning of test
    $(`.popover[feature-id="${feature.id}"] .test-suite-name`).text(row.name)
    testResults[feature.id] = {}
    testResults[feature.id]['numPassed'] = 0
    testResults[feature.id]['numTotal'] = 0

  } else if (row.type === "assert") {
    // console.log(`Assertion #${row.id} for test #${row.test}: ${feature.id}`)
    testResults[feature.id]['numTotal'] += 1
    
    if (row.ok) {
      testResults[feature.id]['numPassed'] += 1
      var tmp = $(`#templates .test-result-module.correct`).first().clone()
      tmp.find('.test-name').text(row.name)
    } else {
      var tmp = $(`#templates .test-result-module.incorrect`).first().clone()
      tmp.find('.test-name').text(row.name)
      // tmp.find('.test-actual').text(row.actual)
      // tmp.find('.test-expected').text(row.expected)
    }
    
    $(`.popover[feature-id="${feature.id}"] table.test-results`).append(tmp)

  } else if (row.type === "end") {
    // console.log(`Finishing test #${row.test} / ${feature.id}`)

    $(`.popover[feature-id="${feature.id}"] .num-tests-passed`).text(testResults[feature.id]['numPassed'])
    $(`.popover[feature-id="${feature.id}"] .num-tests-total`).text(testResults[feature.id]['numTotal'])
    if (testResults[feature.id]['numPassed'] == testResults[feature.id]['numTotal']) {
      $(`[feature-id="${feature.id}"] .code-input a`).addClass('execution-correct').removeClass('execution-incorrect')
      feature.status = 'execution-correct'
    } else {
      $(`[feature-id="${feature.id}"] .code-input a`).addClass('execution-incorrect').removeClass('execution-correct')
      feature.status = 'execution-incorrect'
    }

    releaseTestHarness(testHarness.id)
    saveFeatureToDB(feature)
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
      
      testHarness(feature.id, tests[feature.id])
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