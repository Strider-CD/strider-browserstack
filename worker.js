//
// Strider Worker extension for Browser Stack tests
//


var browserstack = require('browserstack')
var check = require('httpcheck')
var fs = require('fs')
var path = require('path')
var request = require('request')

// Port on which the application-under-test webserver should bind to on localhost.
// Browser Stack Connector will tunnel from this to BrowserStack Cloud for tests
var HTTP_PORT

// Path to BrowserStack Connector PID file
var PIDFILE = path.join(__dirname, "tunnel.pid")

// BrowserStack test timeout in ms
// Permits self-healing in worst-case hang
var BROWSERSTACK_TEST_TIMEOUT = 1000 * 60 * 45 // 45 minutes

var connectorProc

var cleanupRun = false

// Read & parse a JSON file
function getJson(filename, cb) {
  fs.readFile(filename, function(err, data) {
    if (err) return cb(err, null)
    try {
      var json = JSON.parse(data)
      cb(null, json)
    } catch(e) {
      cb(e, null)
    }
  })
}

// Is browserStack configured for this context?
function browserStackConfigured(ctx) {
  var browserStackAPIKey = ctx.jobData.repo_config.browserstack_api_key
  var browserStackUsername = ctx.jobData.repo_config.browserstack_username
  var browserStackPassword = ctx.jobData.repo_config.browserstack_password

  if (!browserStackAPIKey
    || !browserStackPassword
    || !browserStackUsername) {
    return false
  }

  return true
}

// This will shut down the tunnel in a nice way
function cleanup(ctx, cb) {
  if (!browserStackConfigured(ctx)) {
    return cb(0)
  }
  cleanupRun = true
  var msg = "Shutting down BrowserStack Connector"
  console.log(msg)
  ctx.striderMessage(msg)
  if (connectorProc) connectorProc.kill("SIGINT")
  // Give BrowserStack Connector 5 seconds to gracefully stop before sending SIGKILL
  setTimeout(function() {
    if (connectorProc) connectorProc.kill("SIGKILL")
    fs.unlink(PIDFILE, function() {})
    msg = "BrowserStack Connector successfully shut down"
    console.log(msg)
    ctx.striderMessage(msg)

    return cb(0)
  }, 5000)
}

// BrowserStack test process.
function test(ctx, cb) {
  // Only start BrowserStack if it is configured for this project.

  if (!browserStackConfigured(ctx)) {
    return cb(0)
  }

  function log(msg) {
    ctx.striderMessage(msg)
    console.log(msg)
  }

  HTTP_PORT = ctx.browsertestPort || 8031

  var browserStackAPIKey = ctx.jobData.repo_config.browserstack_api_key
  var browserStackUsername = ctx.jobData.repo_config.browserstack_username
  var browserStackPassword = ctx.jobData.repo_config.browserstack_password
  var browserStackBrowsers = ctx.jobData.repo_config.browserstack_browsers
  if (browserStackBrowsers === undefined || browserStackBrowsers.length === 0) {
    // Default to Chrome 27.0 on Windows
    browserStackBrowsers = [
      {
        os: 'win',
        browser: 'chrome',
        version: '27.0',
      }
    ]
  }
  var startPhaseDone = false
  // Run 
  log("Trying BrowserStack tests...")
  // The project webserver should be available via HTTP once started.
  // This section implements a check which will attempt to make a HTTP request for /
  // expecting a 200 response code. It will try HTTP_CHECK_RETRIES times, waiting 1 second
  // between checks. If it fails after HTTP_CHECK_RETRIES times, the server process will be killed
  // and the test failed.
  var tries = 0
  log("Waiting for webserver to come up on localhost:" + HTTP_PORT)

  check({url:"http://localhost:"+HTTP_PORT+"/", log:log}, function(err) {
    if (err) {
      startPhaseDone = true
      return cb(1)
    }
    startPhaseDone = true
    serverUp()
  })

  // Start the BrowserStack Connector, killing previous one if PID file found. Write out PID file for new process.
  // Wait until Connector ready.
  function startConnector(username, password, apiKey, exitCb) {
    // Check for existing tunnel PID
    fs.readFile(PIDFILE, function(err, data) {
      if (!err && data) {
        console.debug("strider-browserstack: found existing PIDfile, killing process %s", data)
        try {
          process.kill(data, "SIGKILL")
        } catch(e) {
          console.debug("strider-browserstack: exception trying to kill PID %s: %s", data, e)
        }
      }
      var tcmd = path.join(__dirname, "node_modules", "browserstack-cli", "bin", "cli.js") +
        " --ssl -k " + apiKey + " -u " + username + ":" + password + " tunnel localhost:" + HTTP_PORT
      var tsh = ctx.shellWrap("exec " + tcmd)
      // TODO: Should be a timeout in case browserstack hangs on startup
      connectorProc = ctx.forkProc(ctx.workingDir, tsh.cmd, tsh.args, exitCb)
      fs.writeFile(PIDFILE, connectorProc.pid, function(err) {
        if (err) {
          console.error("strider-browserstack: could not write PID file %s", err)
        }
      })
      // Wait until connector outputs "Press Ctrl-C to exit"
      // before executing tests
      connectorProc.stdout.on('data', function(data) {
        if (/Press Ctrl-C to exit/.exec(data) !== null) {
          log("BrowserStack tunnel is ready")

          var client = browserstack.createClient({
              username: browserStackUsername,
              password: browserStackPassword
          })
          var resultsReceived = 0
          var buildStatus = 0
          var resultMessages = []
          var finished = false
          browserStackBrowsers.forEach(function(browser) {
            var browserId = browser.os + "-" + browser.browser + "-" + browser.version
            // ctx.browsertestPort and ctx.browsertestPath come from the `prepare` phase test
            // plugin - e.g. strider-qunit.
            var testUrl = "http://localhost:" +
                ctx.browsertestPort + "/" + browserId + ctx.browsertestPath
            var worker
            client.createWorker({
              os: browser.os,
              browser: browser.browser,
              version: browser.version,
              url: testUrl,
              timeout: 3600
            }, function(err, w) {
              if (err) {
                log("Error creating BrowserStack worker: " + err)
                return cb(1)
              }
              worker = w
              log("Created BrowserStack worker: " + browserId + " (browserstack id: " + worker.id + ")")

            })

            setTimeout(function() {
              if (!worker.done) {
                log("ERROR: Timeout of " + BROWSERSTACK_TEST_TIMEOUT + " ms exceeded for " + browserId + " - terminating ")
                ctx.events.emit('testDone', { id: browserId, total:0, failed:1, passed:0, runtime: BROWSERSTACK_TEST_TIMEOUT })
              }
            }, BROWSERSTACK_TEST_TIMEOUT)
            ctx.events.on('testDone', function(result) {
              if (finished) return
              if (result.id === browserId && worker && !worker.done) {
                resultMessages.push("Results for tests on " + result.id + ": " + result.total + " total " +
                  result.failed + " failed " + result.passed + " passed " + result.runtime + " ms runtime") 
                if (result.failed !== 0) {
                  buildStatus = 1
                }
                log("Terminating BrowserStack worker: " + browserId + " (browserstack id: " + worker.id + ")")
                client.terminateWorker(worker.id)
                worker.done = true
                resultsReceived++
              }
              // If all the results are in, finish the build
              if (resultsReceived == browserStackBrowsers.length) {
                finished = true
                resultMessages.forEach(function(msg) {
                  log(msg)
                })
                cb(buildStatus)
              }
            })
          })
         }
      })
    })
  }

  // Server is up, start BrowserStack Connector
  function serverUp() {
    startConnector(browserStackUsername, browserStackPassword, browserStackAPIKey,
      function(exitCode) {
      console.log("BrowserStack Connector exited with code: %d", exitCode)
      // If the connector exited before the cleanup phase has run, it failed to start
      if (!cleanupRun) {
        log("Error starting BrowserStack Connector - failing test")
        cleanupRun = true
        fs.unlink(PIDFILE, function() {})
        return cb(1)
      }
    })

  }
}


module.exports = function(ctx, cb) {

  ctx.addBuildHook({
    cleanup:cleanup,
    test:test
  })

  console.log("strider-browserstack worker extension loaded")
  cb(null, null)
}
