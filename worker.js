//
// Strider Worker extension for Browser Stack tests
//


var browserstack = require('browserstack')
var fs = require('fs')
var path = require('path')
var request = require('request')

// # of tries for application-under-test webserver to start up on specified port
// We test once per second
var HTTP_CHECK_RETRIES = 10

// Interval in between HTTP checks in ms
var HTTP_CHECK_INTERVAL = 1000

// Port on which the application-under-test webserver should bind to on localhost.
// Browser Stack Connector will tunnel from this to BrowserStack Cloud for tests
var HTTP_PORT

// Path to BrowserStack Connector PID file
var PIDFILE = path.join(__dirname, "tunnel.pid")

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

  if (browserStackAPIKey === undefined
    || browserStackPassword === undefined
    || browserStackUsername === undefined) {
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
  connectorProc.kill("SIGINT")
  // Give BrowserStack Connector 5 seconds to gracefully stop before sending SIGKILL
  setTimeout(function() {
    connectorProc.kill("SIGKILL")
    fs.unlink(PIDFILE)
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
  ctx.striderMessage("trying BrowserStack tests...")
  // The project webserver should be available via HTTP once started.
  // This section implements a check which will attempt to make a HTTP request for /
  // expecting a 200 response code. It will try HTTP_CHECK_RETRIES times, waiting 1 second
  // between checks. If it fails after HTTP_CHECK_RETRIES times, the server process will be killed
  // and the test failed.
  var tries = 0
  ctx.striderMessage("Waiting for webserver to come up on localhost:" + HTTP_PORT)
  var intervalId = setInterval(function() {
    // Check for http response on http://localhost:HTTP_PORT/
    request("http://localhost:"+HTTP_PORT+"/", function(err, response) {
      if (startPhaseDone) {
        clearInterval(intervalId)
        return
      }
      if (!err && response.statusCode) {
        ctx.striderMessage("Got HTTP response on localhost:" + HTTP_PORT + " indicating server is up")
        startPhaseDone = true
        clearInterval(intervalId)
        serverUp()
      } else {
        tries++
        console.log("Error on localhost:%d: %s", HTTP_PORT, err)
        if (tries >= HTTP_CHECK_RETRIES) {
          var msg = ("HTTP check on localhost:" + HTTP_PORT + " failed after " + tries
            + " retries, server not up - failing test")
          ctx.striderMessage(msg)
          clearInterval(intervalId)
          startPhaseDone = true
          return cb(1)
        }
      }
    })
  }, HTTP_CHECK_INTERVAL)

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
          console.log("exception: " + e)

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
          ctx.striderMessage("BrowserStack tunnel is ready")
          console.log("browserstack tunnel is up")

          var client = browserstack.createClient({
              username: browserStackUsername,
              password: browserStackPassword
          })
          var resultsReceived = 0
          var buildStatus = 0
          browserStackBrowsers.forEach(function(browser) {
            var qunitId = browser.os + "-" + browser.browser + "-" + browser.version
            var qunitUrl = "http://localhost:" +
                ctx.browsertestPort + "/" + qunitId + ctx.browsertestPath + "?testNumber=115"
            console.log("qunitUrl: %s", qunitUrl)
            // TODO: handle timeouts
            var worker
            client.createWorker({
              os: browser.os,
              browser: browser.browser,
              version: browser.version,
              url: qunitUrl
            }, function(err, w) {
              if (err) {
                console.log("Error creating browserstack worker: " + err)
                ctx.striderMessage("Error creating BrowserStack worker: " + err)
                return cb(1)
              }
              worker = w
              ctx.striderMessage("Created BrowserStack worker: " + qunitId)
              console.log("Created BrowserStack worker: " + qunitId)

            })

            // TODO: timeouts in case testDone event never received.
            ctx.events.on('testDone', function(result) {
              if (result.id === qunitId) {
                ctx.striderMessage(JSON.stringify(result, null, '\t'))
                if (result.failed !== 0) {
                  buildStatus = 1
                }
                if (worker) {
                  console.log("Terminating BrowserStack worker: " + qunitId)
                  ctx.striderMessage("Terminating BrowserStack worker: " + qunitId)
                  client.terminateWorker(worker.id)
                }
                resultsReceived++
              }
              // If all the results are in, finish the build
              if (resultsReceived == browserStackBrowsers.length) {
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
      console.log("Connector exited with code: %d", exitCode)
      // If the connector exited before the cleanup phase has run, it failed to start
      if (!cleanupRun) {
        console.log("Killing connector")
        ctx.striderMessage("Error starting BrowserStack Connector - failing test")
        ctx.striderMessage("Shutting down server")
        cleanupRun = true
        fs.unlink(PIDFILE)
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
