;(function(){
  
  // Generate the Browserstack browsers.
  var browsersRaw = [
    { version: '1024x600',
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
      grouped[k] = _.groupBy(browsers, function(x){
        x.complete_name = completeName(x);
        return x.browser;
      });
    }
  });

  var fancyNames = {win : "Windows", mac : "Mac", ie: "Internet Explorer"}

  function save(url, data, done) {
    data = _.extend({url: url}, data);
    data.browserstack_browsers = JSON.stringify(data.browserstack_browsers);
    $.ajax({
      url: '/api/browserstack',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function (data, ts, xhr) {
        done(null);
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          e = data.errors[0];
        }
        done(e);
      }
    });
  }

  function completeName(version) {
    return version.os + '-' + version.browser + '-' + version.version;
  }

  function parseName(name) {
    var parts = name.split('-');
    return {
      os: parts[0],
      browser: parts[1],
      version: parts[2]
    };
  }

  app.controller('BrowserStackCtrl', ['$scope', function ($scope) {
    $scope.data = $scope.panelData.browserstack_config;
    $scope.fancyNames = fancyNames;
    $scope.completeName = completeName;
    $scope.groupedBrowsers = grouped;
    $scope.browser_map = {};
    for (var i=0; i<$scope.data.browserstack_browsers.length; i++) {
      $scope.browser_map[completeName($scope.data.browserstack_browsers[i])] = true;
    }
    $scope.save = function () {
      $scope.data.browserstack_browsers = [];
      for (var name in $scope.browser_map) {
        if ($scope.browser_map[name]) {
          $scope.data.browserstack_browsers.push(parseName(name));
        }
      }
      save($scope.repo.url, $scope.data, function (err) {
        if (err) {
          $scope.error('Failed to save browserstack settings: ' + err);
        } else {
          $scope.success('Saved browserstack settings');
        }
        $scope.$root.$digest();
      });
    };
    $scope.clear = function () {
      $scope.browser_map = {};
    };
  }]);

})();
