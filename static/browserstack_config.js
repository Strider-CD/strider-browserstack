define(
  ['apres', 'jquery'],
  function(apres, $) {

    // Use this to build the form
    var browserStackBrowsers =  [
      { version: '240x320', device: 'HTC Wildfire', os: 'opera' },
      { version: '320x480', device: 'LG Optimus One', os: 'opera' },
      { version: '360x640',
        device: 'Nokia 5800 XpressMusic',
        os: 'opera' },
      { version: '480x800',
        device: 'Samsung Galaxy S II',
        os: 'opera' },
      { version: '480x854', device: 'Motorola Droid X', os: 'opera' },
      { version: '540x960', device: 'Motorola Atrix 4G', os: 'opera' },
      { version: '1024x600',
        device: 'Samsung Galaxy Tab',
        os: 'opera' },
      { version: '1280x800',
        device: 'Samsung Galaxy Tab 10.1',
        os: 'opera' },
      { version: '10.0', browser: 'opera', os: 'win' },
      { version: '11.1', browser: 'opera', os: 'win' },
      { version: '11.5', browser: 'opera', os: 'win' },
      { version: '11.6', browser: 'opera', os: 'win' },
      { version: '12.10', browser: 'opera', os: 'win' },
      { version: '12.14', browser: 'opera', os: 'win' },
      { version: '3.0', browser: 'firefox', os: 'win' },
      { version: '3.6', browser: 'firefox', os: 'win' },
      { version: '4.0', browser: 'firefox', os: 'win' },
      { version: '5.0', browser: 'firefox', os: 'win' },
      { version: '6.0', browser: 'firefox', os: 'win' },
      { version: '7.0', browser: 'firefox', os: 'win' },
      { version: '8.0', browser: 'firefox', os: 'win' },
      { version: '9.0', browser: 'firefox', os: 'win' },
      { version: '10.0', browser: 'firefox', os: 'win' },
      { version: '11.0', browser: 'firefox', os: 'win' },
      { version: '12.0', browser: 'firefox', os: 'win' },
      { version: '13.0', browser: 'firefox', os: 'win' },
      { version: '14.0', browser: 'firefox', os: 'win' },
      { version: '15.0', browser: 'firefox', os: 'win' },
      { version: '16.0', browser: 'firefox', os: 'win' },
      { version: '17.0', browser: 'firefox', os: 'win' },
      { version: '18.0', browser: 'firefox', os: 'win' },
      { version: '19.0', browser: 'firefox', os: 'win' },
      { version: '20.0', browser: 'firefox', os: 'win' },
      { version: '6.0', browser: 'ie', os: 'win' },
      { version: '7.0', browser: 'ie', os: 'win' },
      { version: '8.0', browser: 'ie', os: 'win' },
      { version: '4.0', browser: 'safari', os: 'win' },
      { version: '5.0', browser: 'safari', os: 'win' },
      { version: '5.1', browser: 'safari', os: 'win' },
      { version: '14.0', browser: 'chrome', os: 'win' },
      { version: '15.0', browser: 'chrome', os: 'win' },
      { version: '16.0', browser: 'chrome', os: 'win' },
      { version: '17.0', browser: 'chrome', os: 'win' },
      { version: '18.0', browser: 'chrome', os: 'win' },
      { version: '19.0', browser: 'chrome', os: 'win' },
      { version: '20.0', browser: 'chrome', os: 'win' },
      { version: '21.0', browser: 'chrome', os: 'win' },
      { version: '22.0', browser: 'chrome', os: 'win' },
      { version: '23.0', browser: 'chrome', os: 'win' },
      { version: '24.0', browser: 'chrome', os: 'win' },
      { version: '25.0', browser: 'chrome', os: 'win' },
      { version: '26.0', browser: 'chrome', os: 'win' },
      { version: '27.0', browser: 'chrome', os: 'win' },
      { version: '8.0', browser: 'ie', os: 'win' },
      { version: '9.0', browser: 'ie', os: 'win' },
      { version: '10.0', browser: 'ie', os: 'win' },
      { version: '2.2', device: 'Samsung Galaxy S', os: 'android' },
      { version: '2.3', device: 'Samsung Galaxy S II', os: 'android' },
      { version: '4.1', device: 'Samsung Galaxy S III', os: 'android' },
      { version: '2.3', device: 'Samsung Galaxy Note', os: 'android' },
      { version: '4.1',
        device: 'Samsung Galaxy Note II',
        os: 'android' },
      { version: '4.0', device: 'Samsung Galaxy Nexus', os: 'android' },
      { version: '2.3', device: 'Motorola Droid Razr', os: 'android' },
      { version: '2.3', device: 'Motorola Droid 4', os: 'android' },
      { version: '2.3', device: 'Motorola Photon 4G', os: 'android' },
      { version: '4.0', device: 'Motorola Atrix HD', os: 'android' },
      { version: '4.0', device: 'Motorola Razr', os: 'android' },
      { version: '4.1',
        device: 'Motorola Razr Maxx HD',
        os: 'android' },
      { version: '1.5', device: 'HTC Hero', os: 'android' },
      { version: '2.2', device: 'HTC Wildfire', os: 'android' },
      { version: '4.0', device: 'HTC Evo 3D', os: 'android' },
      { version: '4.0', device: 'HTC One X', os: 'android' },
      { version: '1.6', device: 'Sony Xperia X10', os: 'android' },
      { version: '4.0', device: 'Sony Xperia Tipo', os: 'android' },
      { version: '2.2', device: 'LG Optimus 3D', os: 'android' },
      { version: '4.2', device: 'LG Nexus 4', os: 'android' },
      { version: '4.0', device: 'Amazon Kindle Fire 2', os: 'android' },
      { version: '4.0',
        device: 'Amazon Kindle Fire HD 8.9',
        os: 'android' },
      { version: '4.1', device: 'Google Nexus 7', os: 'android' },
      { version: '4.0',
        device: 'Samsung Galaxy Note 10.1',
        os: 'android' },
      { version: '4.0',
        device: 'Samsung Galaxy Tab 2 10.1',
        os: 'android' },
      { version: '11.1', browser: 'opera', os: 'mac' },
      { version: '11.6', browser: 'opera', os: 'mac' },
      { version: '12.0', browser: 'opera', os: 'mac' },
      { version: '12.12', browser: 'opera', os: 'mac' },
      { version: '12.13', browser: 'opera', os: 'mac' },
      { version: '5.0', browser: 'firefox', os: 'mac' },
      { version: '6.0', browser: 'firefox', os: 'mac' },
      { version: '7.0', browser: 'firefox', os: 'mac' },
      { version: '8.0', browser: 'firefox', os: 'mac' },
      { version: '9.0', browser: 'firefox', os: 'mac' },
      { version: '10.0', browser: 'firefox', os: 'mac' },
      { version: '11.0', browser: 'firefox', os: 'mac' },
      { version: '12.0', browser: 'firefox', os: 'mac' },
      { version: '13.0', browser: 'firefox', os: 'mac' },
      { version: '14.0', browser: 'firefox', os: 'mac' },
      { version: '15.0', browser: 'firefox', os: 'mac' },
      { version: '16.0', browser: 'firefox', os: 'mac' },
      { version: '17.0', browser: 'firefox', os: 'mac' },
      { version: '18.0', browser: 'firefox', os: 'mac' },
      { version: '19.0', browser: 'firefox', os: 'mac' },
      { version: '20.0', browser: 'firefox', os: 'mac' },
      { version: '4.0', browser: 'safari', os: 'mac' },
      { version: '5.0', browser: 'safari', os: 'mac' },
      { version: '5.1', browser: 'safari', os: 'mac' },
      { version: '14.0', browser: 'chrome', os: 'mac' },
      { version: '16.0', browser: 'chrome', os: 'mac' },
      { version: '17.0', browser: 'chrome', os: 'mac' },
      { version: '18.0', browser: 'chrome', os: 'mac' },
      { version: '19.0', browser: 'chrome', os: 'mac' },
      { version: '20.0', browser: 'chrome', os: 'mac' },
      { version: '21.0', browser: 'chrome', os: 'mac' },
      { version: '22.0', browser: 'chrome', os: 'mac' },
      { version: '23.0', browser: 'chrome', os: 'mac' },
      { version: '24.0', browser: 'chrome', os: 'mac' },
      { version: '25.0', browser: 'chrome', os: 'mac' },
      { version: '26.0', browser: 'chrome', os: 'mac' },
      { version: '27.0', browser: 'chrome', os: 'mac' },
      { version: '6.0', browser: 'safari', os: 'mac' },
      { version: '3.0', device: 'iPhone 3GS', os: 'ios' },
      { version: '4.0', device: 'iPhone 4', os: 'ios' },
      { version: '5.1', device: 'iPhone 4S', os: 'ios' },
      { version: '6.0', device: 'iPhone 4S (6.0)', os: 'ios' },
      { version: '6.0', device: 'iPhone 5', os: 'ios' },
      { version: '3.2', device: 'iPad', os: 'ios' },
      { version: '4.3.2', device: 'iPad 2', os: 'ios' },
      { version: '5.0', device: 'iPad 2 (5.0)', os: 'ios' },
      { version: '5.1', device: 'iPad 3rd', os: 'ios' },
      { version: '6.0', device: 'iPad 3rd (6.0)', os: 'ios' }
    ];

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
            elem.find('.browserstack-username').val(data.results.browserstack_username);
            elem.find('.browserstack-password').val(data.results.browserstack_password);
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
          var os = parts[0];
          var browser = parts[1];
          var version = parts[2] || '';
          // As consumed by node API: https://github.com/scottgonzalez/node-browserstack
          browserStackBrowsers.push({
            os: os,
            browser: browser,
            version: browserVerson,
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
          var browserstack_username = elem.find(".browserstack-username").val();
          var browserstack_password = elem.find(".browserstack-password").val();
          $.ajax("/api/browserstack", {
                data: {
                  url:params.repo_url,
                  browserstack_api_key:browserstack_api_key,
                  browserstack_username:browserstack_username,
                  browserstack_password:browserstack_password,
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
