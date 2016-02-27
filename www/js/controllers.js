angular.module('suedm.controllers', [])

.controller('MenuCtrl', function($state, $scope, UserService) {
  $scope.user = [];
  $scope.user.username = UserService.username;

  $scope.logout = function(){
    localStorage.clear();
    UserService.username = "";
    UserService.password = "";
  }
})

.controller('LoginCtrl', function($state, $sanitize, $scope, UserService, API, $ionicModal) {
  var init = function() {
    $scope.user = [];
    if (!UserService.username || !UserService.password) {
      UserService.username = localStorage.getItem('username');
      UserService.password = localStorage.getItem('password');
    }
    API.checklogin(UserService.username, UserService.password).success(function(response) {
      if (response == "200")
        $state.go('tabs.folders');
    });
  }

  $scope.join = function() {
    var username = $sanitize($scope.user.username);
    var password = $sanitize($scope.user.password);
    UserService.username = username;
    UserService.password = password;
    if($scope.user.save == true){
      localStorage.setItem('username', username);
      localStorage.setItem('password', password); //TB Fixed - very insecure!!!!
    }
    API.checklogin(UserService.username, UserService.password).success(function(response) {
      if (response == "200")
        $state.go('tabs.folders');
    });
  }
  init();
})

.controller('FoldersCtrl', function($state, $sanitize, SubjectsService, API, $scope, Helper) {
  var init = function() {
    API.getfolders().success(function(response) {
      $scope.folders = Helper.parseFolders(response);
    });
    API.getnewmsgcount().success(function(response) {
      $scope.newmcount = response.split("200")[1];
    })
  }
  $scope.openFolder = function(foldername) {
    SubjectsService.selectedFolder = foldername;
    $state.go('tabs.subjects');
  }

  init();

  $scope.doRefresh = function(){
    init();
     $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.openInbox = function() {
    $state.go('tabs.inbox');
  }
})

.controller('SettingsController', function($state, $sanitize) {
  var self = this;
  self.logout = function() {
    localStorage.clear();
    $state.go('login');
  }
})

.controller('SubjectsCtrl', function($state, $sanitize, $stateParams, API, $scope, Helper) {
  var init = function() {
    API.getfolder($stateParams.folder).success(function(response) {
      $scope.subjects = [];
      $scope.subjects = Helper.parseSubjects(response);
    });
    $scope.foldername = $stateParams.folder;
  }
  init();
})

.controller('InboxCtrl', function($state, API, $scope, Helper) {
  var init = function() {
    /*
    API.getfolder("unsortiert").success(function(response) {
      var subjects = Helper.parseSubjects(response);
      if (subjects) {
        API.getinboxfolder().success(function(response2) {
          var newsubjects = Helper.parseInbox(response2);
          for (var i = 0; i < subjects.length; i++) {
            for (var j = 0; j < newsubjects.length; j++) {
              if (subjects[i].id == newsubjects[j].id) subjects[i].new = true;
            }
          }
          $scope.subjects = subjects;
        })
      } else $scope.subjects = subjects;
    })
    */
    API.getinbox().success(function(response) {
      var subjects = Helper.parseSubjects(response);
      //$scope.subjects = subjects;
      if (subjects) {
        API.getinboxfolder().success(function(response2) {
          var newsubjects = Helper.parseInbox(response2);
          for (var i = 0; i < subjects.length; i++) {
            for (var j = 0; j < newsubjects.length; j++) {
              if (subjects[i].id == newsubjects[j].id) subjects[i].new = true;
            }
          }
          $scope.subjects = subjects;
        })
      } else $scope.subjects = subjects;


    });
  }
  init();
})

.controller('OutboxCtrl', function($state, API, $scope, Helper) {
  var init = function() {
    API.getoutbox().success(function(response) {
      var subjects = Helper.parseSubjects(response);
      $scope.subjects = subjects;
    });
  }
  init();
})

.controller('ShoutboxCtrl', function($scope, $sanitize, API, $state, UserService) {
  var init = function() {
    $scope.shout = [];
    API.getshoutbox().success(function(response) {
      var shoutbox = response.split('200<table style="width:100%;text-align:left;" border="0">')[1];
      var shoutbox = shoutbox.split('</table>')[0];
      var rows = shoutbox.split("<tr>");
      var entities = [];
      for (var i = 0; i < rows.length; i++) {
        if (rows[i] != "") {
          var elements = rows[i].split("<td");
          var date = elements[1].substr(86).split("</td>")[0];
          var user = elements[2].substr(63).split("</td>")[0];
          var text = elements[3].substr(41).split("</td>")[0];
          entities.push({
            date: date,
            user: user,
            text: text
          });
        }
      }
      $scope.shoutbox = entities;
      $scope.username = UserService.username;

    })
  }
  init();

  $scope.sendShout = function() {
    console.log($scope.shout.message);
    API.sendshoutbox($scope.shout.message).success(function(response) {
      console.log(response);
      if (response == "200")
        $state.go($state.current, {}, {
          reload: true
        });
    })
  }
})

.controller('WhoIsOnlineCtrl', function($scope, API, Helper) {
  var init = function() {
    API.getonlineusers().success(function(response) {
      $scope.users = Helper.parseWhoIs(response);
    });
  }
  init();
})

.controller('NeuCtrl', function($scope, API, Helper) {
  var init = function() {
    $scope.message = {};
    API.getrecipients().success(function(response) {
      $scope.users = Helper.parseUsers(response);
    })
  }
  init();

  $scope.send = function(){
    console.log($scope.message);
    API.sendmessage($scope.message.subject, $scope.message.text, $scope.message.receipient).success(function(response){
      console.log(response);
    });
  }

})

.controller('MessageCtrl', function($state, $sanitize, API, $scope, $stateParams) {
  var init = function() {
    API.getmessage($stateParams.msgId).success(function(response) {
      console.log(response);
      $scope.message = response.split("200")[1];
    })
  }
  init();
});
