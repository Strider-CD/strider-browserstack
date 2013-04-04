//
// Strider Webapp extension for Browser Stack tests
//

var path = require('path')

module.exports = function(ctx, cb) {
  /*
   * GET /api/browserstack/
   *
   * Get the current Strider config for specified project. This will be a JSON-encoded
   * object with the keys: browserstack_username, browserstack_access_key and browserstack_browsers
   *
   * @param url Github html_url of the project.
   */
  function getIndex(req, res) {
    var url = req.param("url")

    function error(err_msg) {
      console.error("Strider-Browserstack: getIndex() - %s", err_msg)
      var r = {
        errors: [err_msg],
        status: "error"
      }
      res.statusCode = 400
      return res.end(JSON.stringify(r, null, '\t'))
    }

    req.user.get_repo_config(url, function(err, repo, access_level, owner_user_obj) {
      if (err) {
        return error("Error fetching Repo Config for url " + url + ": " + err)
      }
      var r = {
        status: "ok",
        errors: [],
        results: {
          browserstack_username: repo.get('browserstack_username'),
          browserstack_access_key: repo.get('browserstack_access_key'),
          browserstack_browsers: repo.get('browserstack_browsers'),
        }
      }
      return res.end(JSON.stringify(r, null, '\t'))
    })
  }

  /*
   * POST /api/browserstack/
   *
   * Set the current Strider config for specified project.
   *
   * @param url Github html_url of the project.
   * @param browserstack_username Browserstack username.
   * @param browserstack_access_key Browserstack access key.
   * @param browserstack_browsers JSON-encoded list of object tuples.
   *
   */
  function postIndex(req, res) {
    var url = req.param("url")
    var browserstack_username = req.param("browserstack_username")
    var browserstack_access_key = req.param("browserstack_access_key")
    var browserstack_browsers = req.param("browserstack_browsers")

    function error(err_msg) {
      console.error("Strider-Browserstack: postIndex() - %s", err_msg)
      var r = {
        errors: [err_msg],
        status: "error"
      }
      res.statusCode = 400
      return res.end(JSON.stringify(r, null, '\t'))
    }

    req.user.get_repo_config(url, function(err, repo, access_level, owner_user_obj) {
      if (err) {
        return error("Error fetching Repo Config for url " + url + ": " + err)
      }
      // must have access_level > 0 to be able to continue;
      if (access_level < 1) {
        console.debug(
          "User %s tried to change Browserstack config but doesn't have admin privileges on %s (access level: %s)",
          req.user.email, url, access_level);
        return error("You must have access level greater than 0 in order to be able to configure Browserstack.");
      }
      var q = {$set:{}}
      if (browserstack_username) {
        repo.set('browserstack_username', browserstack_username)
      }
      if (browserstack_access_key) {
        repo.set('browserstack_access_key', browserstack_access_key)
      }
      if (browserstack_browsers) {
        var invalid = false
        try {
          browserstack_browsers = JSON.parse(browserstack_browsers)
          if (!Array.isArray(browserstack_browsers)) {
            invalid = true
          }
        } catch(e) {
          invalid = true
        }
        if (invalid) {
          return error("Error decoding `browserstack_browsers` parameter - must be JSON-encoded array")
        }
        repo.set('browserstack_browsers', browserstack_browsers)
      }
      var r = {
        status: "ok",
        errors: [],
        results: {
          browserstack_username: repo.get('browserstack_username'),
          browserstack_access_key: repo.get('browserstack_access_key'),
          browserstack_browsers: repo.get('browserstack_browsers'),
        }
      }
      if (browserstack_username || browserstack_access_key || browserstack_browsers) {
        req.user.save(function(err) {
            if (err) {
              var errmsg = "Error saving browserstack config " + req.user.email + ": " + err;
              return error(errmsg)
            }
            return res.end(JSON.stringify(r, null, '\t'))
        })
      } else {
        return res.end(JSON.stringify(r, null, '\t'))
      }
    })

  }

  // Extend RepoConfig model with 'Browserstack' properties
  function browserstackPlugin(schema, opts) {
    schema.add({
      browserstack_access_key: String,
      browserstack_username: String,
      browserstack_browsers: [],
    })
  }
  ctx.models.RepoConfig.plugin(browserstackPlugin)

  // Add webserver routes
  ctx.route.get("/api/browserstack",
    ctx.middleware.require_auth,
    ctx.middleware.require_params(["url"]),
    getIndex)
  ctx.route.post("/api/browserstack",
    ctx.middleware.require_auth,
    ctx.middleware.require_params(["url"]),
    postIndex)

  // Add panel HTML snippet for project config page
  ctx.registerPanel('project_config', {
    src: path.join(__dirname, "templates", "project_config.html"),
    title: "BrowserStack Config",
    id:"browserstack_config",
  })


  console.log("strider-browserstack webapp extension loaded")

  cb(null, null)
}
