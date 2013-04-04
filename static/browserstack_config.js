define(
  ['apres', 'jquery'],
  function(apres, $) {
    var BrowserstackConfigWidget = function(elem, params) {
      var params = apres.controller().params;

      function message(message, classes) {
        elem.find("div.alert").removeClass().addClass("alert " + classes).html(message).show();
      }

      function message_hide() {
        elem.find("div.alert").hide();
      }

      function load(url) {
        elem.find('.details').addClass('hide');
        elem.find('.alert').removeClass().addClass("alert alert-info").html("Loading ...");
        $.ajax({
          url: "/api/browserstack",
          type: "GET",
          data: {url: url},
          dataType: "json",
          success: function (data, ts, xhr) {
            var browsers = data.results.browserstack_browsers || [];
            setBrowsers(browsers);
            elem.find('.browserstack-api-key').val(data.results.browserstack_api_key);
            elem.find('.details').show();
            message_hide();
          },
          error: function(xhr, ts, e) {
            if (xhr && xhr.responseText) {
                var data = $.parseJSON(xhr.responseText);
                message("Error loading BrowserStack config: " + data.errors[0], "alert-error");
            } else {
                message("Error loading BrowserStack config: " + e, "alert-error");
            }
          }

        });
      }

      function getBrowsers() {
        var checked = elem.find("input:checked");
        var browserStackBrowsers = [];
        for (var i = 0; i < checked.length; i++) {
          var str = $(checked[i]).val();
          var parts = str.split('-');
          var platform = parts[0];
          var browser = parts[1];
          var browserVerson = parts[2] || '';
          browserStackBrowsers.push({
            platform: platform,
            browserName: browser,
            version: browserVerson
          });
        }
        return browserStackBrowsers;
      }

      function setBrowsers(browserStackBrowsers) {
        for (var i = 0; i < browserStackBrowsers.length; i++) {
          var o = browserStackBrowsers[i];
          var searchValue = o.platform + "-" + o.browserName + "-" + o.version;
          elem.find("input[value='"+searchValue+"']").attr('checked', 'checked');
        }

      }
      
      this.events = {
        "click #browserstack-save": function() {
          var browserstack_browsers = getBrowsers();
          var browserstack_api_key = elem.find(".browserstack-api-key").val();
          $.ajax("/api/browserstack", {
                data: {
                  url:params.repo_url,
                  browserstack_api_key:browserstack_api_key,
                  browserstack_browsers: JSON.stringify(browserstack_browsers)
                },
                error: function(xhr, ts, e) {
                  console.log(e);
                  message("Error saving browserstack credentials.", "alert-error");
                },
                success: function(data, ts, xhr) {
                  message("Browserstack credentials saved.", "alert-success");
                },
                type: "POST",
          });
        },
      };
      // There is a global "repo" object which is generated by the server
      var repo_url = apres.controller().params.repo_url;
      load(repo_url);
      
    };

    return BrowserstackConfigWidget;
  }
);
