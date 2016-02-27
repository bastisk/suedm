angular.module('suedm', ['ionic', 'suedm.controllers', 'suedm.services'])


//Set Content Header for API - kill0rz API can't handle application/json :/
.config(function($httpProvider) {
  $httpProvider.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded';

  //Transform Parameter Data into suitable format
  $httpProvider.defaults.transformRequest = function(data) {
    if (data === undefined) {
      return data;
    }
    return $.param(data);
  }
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('tabs.folders', {
      url: "/folders",
      views: {
        'menuContent': {
          templateUrl: "templates/folders.html",
          controller: "FoldersCtrl"
        }
      }
    })
    .state('tabs.settings', {
      url: "/settings",
      views: {
        'menuContent': {
          templateUrl: "templates/settings.html",
          controller: "SettingsCtrl"
        }
      }
    })
    .state('tabs.subjects', {
      url: "/folders/:folder",
      views: {
        'menuContent': {
          templateUrl: "templates/subjects.html",
          controller: "SubjectsCtrl"
        }
      }
    })
    .state('tabs.message', {
      url: "/messages/:msgId",
      views: {
        'menuContent': {
          templateUrl: "templates/message.html",
          controller: "MessageCtrl"
        }
      }
    })
    .state('tabs.inbox', {
      url: "/inbox",
      views: {
        'menuContent': {
          templateUrl: "templates/inbox.html",
          controller: "InboxCtrl"
        }
      }
    })
    .state('tabs.outbox', {
      url: "/outbox",
      views: {
        'menuContent': {
          templateUrl: "templates/outbox.html",
          controller: "OutboxCtrl"
        }
      }
    })
    .state('tabs.shoutbox', {
      url: "/shoutbox",
      views: {
        'menuContent': {
          templateUrl: "templates/shoutbox.html",
          controller: "ShoutboxCtrl"
        }
      }
    })
    .state('tabs.whois', {
      url: '/whois',
      views: {
        'menuContent': {
          templateUrl: "templates/whoisonline.html",
          controller: "WhoIsOnlineCtrl"
        }
      }
    })
    .state('tabs.neu', {
      url: '/neu',
      views: {
        'menuContent': {
          templateUrl: "templates/neuenachricht.html",
          controller: "NeuCtrl"
        }
      }
    })
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      controller: 'MenuCtrl'
    });
  $urlRouterProvider.otherwise('/login');
});
