$(function(){
  var repo_url = $("html").data('controller-params').repo_url;
  
// Generate the Browserstack browsers.
 var browsersRaw = [ { version: '1024x600',
    device: 'Samsung Galaxy Tab',
    os: 'opera' },
  { version: '1280x800',
    device: 'Samsung Galaxy Tab 10.1',
    os: 'opera' },
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
  { browser: 'chrome', version: '14.0', os: 'win' },
  { browser: 'chrome', version: '15.0', os: 'win' },
  { browser: 'chrome', version: '16.0', os: 'win' },
  { browser: 'chrome', version: '17.0', os: 'win' },
  { browser: 'chrome', version: '18.0', os: 'win' },
  { browser: 'chrome', version: '19.0', os: 'win' },
  { browser: 'chrome', version: '20.0', os: 'win' },
  { browser: 'chrome', version: '21.0', os: 'win' },
  { browser: 'chrome', version: '22.0', os: 'win' },
  { browser: 'chrome', version: '23.0', os: 'win' },
  { browser: 'chrome', version: '24.0', os: 'win' },
  { browser: 'chrome', version: '25.0', os: 'win' },
  { browser: 'chrome', version: '26.0', os: 'win' },
  { browser: 'chrome', version: '27.0', os: 'win' },
  { browser: 'ie', version: '6.0', os: 'win' },
  { browser: 'ie', version: '7.0', os: 'win' },
  { browser: 'ie', version: '8.0', os: 'win' },
  { browser: 'opera', version: '10.0', os: 'win' },
  { browser: 'opera', version: '11.1', os: 'win' },
  { browser: 'opera', version: '11.5', os: 'win' },
  { browser: 'opera', version: '11.6', os: 'win' },
  { browser: 'opera', version: '12.10', os: 'win' },
  { browser: 'opera', version: '12.14', os: 'win' },
  { browser: 'firefox', version: '3.0', os: 'win' },
  { browser: 'firefox', version: '3.6', os: 'win' },
  { browser: 'firefox', version: '4.0', os: 'win' },
  { browser: 'firefox', version: '5.0', os: 'win' },
  { browser: 'firefox', version: '6.0', os: 'win' },
  { browser: 'firefox', version: '7.0', os: 'win' },
  { browser: 'firefox', version: '8.0', os: 'win' },
  { browser: 'firefox', version: '9.0', os: 'win' },
  { browser: 'firefox', version: '10.0', os: 'win' },
  { browser: 'firefox', version: '11.0', os: 'win' },
  { browser: 'firefox', version: '12.0', os: 'win' },
  { browser: 'firefox', version: '13.0', os: 'win' },
  { browser: 'firefox', version: '14.0', os: 'win' },
  { browser: 'firefox', version: '15.0', os: 'win' },
  { browser: 'firefox', version: '16.0', os: 'win' },
  { browser: 'firefox', version: '17.0', os: 'win' },
  { browser: 'firefox', version: '18.0', os: 'win' },
  { browser: 'firefox', version: '19.0', os: 'win' },
  { browser: 'firefox', version: '20.0', os: 'win' },
  { browser: 'safari', version: '4.0', os: 'win' },
  { browser: 'safari', version: '5.0', os: 'win' },
  { browser: 'safari', version: '5.1', os: 'win' },
  { browser: 'ie', version: '8.0', os: 'win' },
  { browser: 'ie', version: '9.0', os: 'win' },
  { browser: 'ie', version: '10.0', os: 'win' },
  { browser: 'chrome', version: '14.0', os: 'mac' },
  { browser: 'chrome', version: '16.0', os: 'mac' },
  { browser: 'chrome', version: '17.0', os: 'mac' },
  { browser: 'chrome', version: '18.0', os: 'mac' },
  { browser: 'chrome', version: '19.0', os: 'mac' },
  { browser: 'chrome', version: '20.0', os: 'mac' },
  { browser: 'chrome', version: '21.0', os: 'mac' },
  { browser: 'chrome', version: '22.0', os: 'mac' },
  { browser: 'chrome', version: '23.0', os: 'mac' },
  { browser: 'chrome', version: '24.0', os: 'mac' },
  { browser: 'chrome', version: '25.0', os: 'mac' },
  { browser: 'chrome', version: '26.0', os: 'mac' },
  { browser: 'chrome', version: '27.0', os: 'mac' },
  { browser: 'opera', version: '11.1', os: 'mac' },
  { browser: 'opera', version: '11.6', os: 'mac' },
  { browser: 'opera', version: '12.0', os: 'mac' },
  { browser: 'opera', version: '12.12', os: 'mac' },
  { browser: 'opera', version: '12.13', os: 'mac' },
  { browser: 'firefox', version: '5.0', os: 'mac' },
  { browser: 'firefox', version: '6.0', os: 'mac' },
  { browser: 'firefox', version: '7.0', os: 'mac' },
  { browser: 'firefox', version: '8.0', os: 'mac' },
  { browser: 'firefox', version: '9.0', os: 'mac' },
  { browser: 'firefox', version: '10.0', os: 'mac' },
  { browser: 'firefox', version: '11.0', os: 'mac' },
  { browser: 'firefox', version: '12.0', os: 'mac' },
  { browser: 'firefox', version: '13.0', os: 'mac' },
  { browser: 'firefox', version: '14.0', os: 'mac' },
  { browser: 'firefox', version: '15.0', os: 'mac' },
  { browser: 'firefox', version: '16.0', os: 'mac' },
  { browser: 'firefox', version: '17.0', os: 'mac' },
  { browser: 'firefox', version: '18.0', os: 'mac' },
  { browser: 'firefox', version: '19.0', os: 'mac' },
  { browser: 'firefox', version: '20.0', os: 'mac' },
  { browser: 'safari', version: '4.0', os: 'mac' },
  { browser: 'safari', version: '5.0', os: 'mac' },
  { browser: 'safari', version: '5.1', os: 'mac' },
  { browser: 'safari', version: '6.0', os: 'mac' },
  { version: '3.2', device: 'iPad', os: 'ios' },
  { version: '4.3.2', device: 'iPad 2', os: 'ios' },
  { version: '5.0', device: 'iPad 2 (5.0)', os: 'ios' },
  { version: '5.1', device: 'iPad 3rd', os: 'ios' },
  { version: '6.0', device: 'iPad 3rd (6.0)', os: 'ios' },
  { version: '3.0', device: 'iPhone 3GS', os: 'ios' },
  { version: '4.0', device: 'iPhone 4', os: 'ios' },
  { version: '5.1', device: 'iPhone 4S', os: 'ios' },
  { version: '6.0', device: 'iPhone 4S (6.0)', os: 'ios' },
  { version: '6.0', device: 'iPhone 5', os: 'ios' },
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
  { version: '4.2', device: 'LG Nexus 4', os: 'android' } ]

// The previous json is from the getBrowsers() call from their API.
// The format sucks, so let's rearrange it:


var byOS = _.groupBy(browsersRaw, function(x){return x.os});

var grouped = {};
_.each(byOS, function(os, k){
  var browsers = _.reject(os, function(x){return !x.browser})
  if (browsers.length){
    grouped[k] = _.groupBy(browsers, function(x){return x.browser});
  }
})

var fancyNames = {win : "Windows", mac : "Mac", ie: "Internet Explorer"}

var renderBrowsers = function(){
  var $browsers = $("#browsers").empty();
  _.each(grouped, function(browsers, os){
    
    var $os = $("<div class='os'>")
    $os.append("<h2>" + fancyNames[os] + "</h2>");

    _.each(browsers, function(versions, browser){
      var $browser = $("<div class='browser'>")
      $browser.append("<h3>" + (fancyNames[browser] || browser) + "</h3>");

      _.each(versions, function(json){
        var version = json.version
          , $version = $("<div class='version'>")
        $version.append("<label for='" + os + browser + version + "'>" + version + "</h4>")
        $version.append("<input class='browserstack-browser' type='checkbox' name = '" + os + browser + version + "' + data-browserstring='" + JSON.stringify(json) + "' />")

        $browser.append($version);
      })

      $os.append($browser);
    })
    $browsers.append($os);
  })
}



var load = function(url) {

  renderBrowsers()

  $.ajax({
    url: "/api/browserstack",
    type: "GET",
    data: {url: repo_url},
    dataType: "json",
    success: function (data, ts, xhr) {
      var browsers = data.results.browserstack_browsers || [];
      setBrowsers(browsers);
      $('.browserstack-api-key').val(data.results.browserstack_api_key);
      $('.browserstack-username').val(data.results.browserstack_username);
      $('.browserstack-password').val(data.results.browserstack_password);

    },
    error: function(xhr, ts, e) {
      if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          alert("Error loading BrowserStack config: " + data.errors[0], "alert-error");
      } else {
          alert("Error loading BrowserStack config: " + e, "alert-error");
      }
    }
  });
}


$(".btn-save-browserstack").delegate(document.body, 'click', function(e){

  var data = {
      url : repo_url
    , browserstack_api_key : $(".browserstack-api-key").val()
    , browserstack_username : $(".browserstack-username").val()
    , browserstack_password : $(".browserstack-password").val()
    , browserstack_browsers : []
  }
  
  $(".browserstack-browser:checked").each(function(){
    data.browserstack_browsers.push($(this).data('browserstring'))
  })

  data.browserstack_browsers = JSON.stringify(data.browserstack_browsers);

  $.post("/api/browserstack", data, function(res) {
    if (res.errors){
      alert(res.errors);
    }
  })
  e.preventDefault();
})
 

var setBrowsers = function(browsers) {
  _.each(browsers, function(browser){
    $(".browserstack-browser[name='" + browser.os + browser.browser + browser.version + "']").attr('checked', 'checked');
  })
}

load();
});
