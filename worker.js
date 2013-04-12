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

// This will shut down the tunnel
function cleanup(ctx, cb) {
  cleanupRun = true
  var msg = "Shutting down BrowserStack Connector"
  console.log(msg)
  ctx.striderMessage(msg)
  connectorProc.kill("SIGINT")
  // Give BrowserStack Connector 5 seconds to gracefully stop before sending SIGKILL
  setTimeout(function() {
    connectorProc.kill("SIGKILL")
    msg = "BrowserStack Connector is dead"
    console.log(msg)
    ctx.striderMessage(msg)

    return cb(0)
  }, 5000)
}

// then we start the BrowserStack test process.
function test(ctx, cb) {
  HTTP_PORT = ctx.browsertestPort || 8031

  var browserStackAPIKey = ctx.jobData.repo_config.browserstack_api_key
  var browserStackUsername = ctx.jobData.repo_config.browserstack_username
  var browserStackPassword = ctx.jobData.repo_config.browserstack_password
  var browserStackBrowsers = ctx.jobData.repo_config.browserstack_browsers
  if (browserStackBrowsers === undefined || browserStackBrowsers.length === 0) {
    // XXX Some default
    browserStackBrowsers = [
      {
        browserName:"chrome",
        version:"",
        platform:"Windows 2008"
      }
    ]
  }
  if (browserStackAPIKey === undefined || browserStackPassword === undefined || browserStackUsername === undefined) {
    ctx.striderMessage(("BrowserStack tests detected but BrowserStack credentials have not been configured!\n"
      + "  Please visit project config page to enter them"))
    return cb(1)
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

  // Start the BrowserStack Connector. Returns childProcess object.
  function startConnector(username, password, apiKey, cb) {
    var tcmd = path.join(__dirname, "node_modules", "browserstack-cli", "bin", "cli.js") + " --ssl -k " + apiKey + " -u " + username + ":" + password + " tunnel localhost:" + HTTP_PORT
    var tsh = ctx.shellWrap(tcmd)
    return ctx.forkProc(ctx.workingDir, tsh.cmd, tsh.args, cb)
  }

  // Server is up, start BrowserStack Connector
  function serverUp() {
    connectorProc = startConnector(browserStackUsername, browserStackPassword, browserStackAPIKey,
      function(exitCode) {
      console.log("Connector exited with code: %d", exitCode)
      // If the connector exited before the cleanup phase has run, it failed to start
      if (!cleanupRun) {
        console.log("Killing connector")
        ctx.striderMessage("Error starting BrowserStack Connector - failing test")
        ctx.striderMessage("Shutting down server")
        cleanupRun = true
        return cb(1)
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

        var qunitUrl = "http://localhost:" + ctx.browsertestPort + "/foo" + ctx.browsertestPath + "?testNumber=115"
        console.log("qunitUrl: %s", qunitUrl)
        // Create a Chrome worker for now.
        client.createWorker({
          os: 'win',
          browser: 'chrome',
          version: '27.0',
          url: qunitUrl
        }, function(err, worker) {
          if (err) {
            console.log("Error creating browserstack worker: " + err)
            ctx.striderMessage("Error creating BrowserStack worker: " + err)
            return cb(1)
          }
          ctx.striderMessage("Created BrowserStack worker")
          console.log("Created BrowserStack worker")

        })

        ctx.events.on('testDone', function(data) {
          console.log("received testDone event: %j", data)
          ctx.striderMessage(JSON.stringify(data, null, '\t'))
          cb(data.failed)
        })

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
