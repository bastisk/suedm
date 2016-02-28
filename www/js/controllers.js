angular.module('suedm.controllers', [])

.controller('MenuCtrl', function($state, $scope, UserService) {
  $scope.user = [];
  $scope.user.username = UserService.username;
  $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);

  $scope.logout = function() {
    localStorage.clear();
    UserService.username = "";
    UserService.password = "";
    $state.go('login');
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
    if ($scope.user.save == true) {
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

  $scope.doRefresh = function() {
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

.controller('SubjectsCtrl', function($state, $sanitize, $stateParams, API, $scope, Helper, MessageService) {
  $scope.doRefresh = function() {
    init();
    $scope.$broadcast('scroll.refreshComplete');
  }
      var init = function() {
          $scope.foldername = $stateParams.folder;
        if ($stateParams.folder == "inbox") {
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
              $scope.foldername = $stateParams.folder;
            });
          } else if ($stateParams.folder == "outbox"){
              API.getoutbox().success(function(response) {
                var subjects = Helper.parseSubjects(response);
                $scope.subjects = subjects;
              });
          } else {
            API.getfolder($stateParams.folder).success(function(response) {
              $scope.subjects = [];
              $scope.subjects = Helper.parseSubjects(response);
            });
            $scope.foldername = $stateParams.folder;
          }
        }
        init();

        $scope.open = function(subject){
          MessageService.MsgId = subject.id
          MessageService.sender = subject.sender;
          MessageService.subject = subject.subject;
          MessageService.date = subject.date;
        }


      })

    .controller('InboxCtrl', function($state, API, $scope, Helper) {
      $scope.doRefresh = function() {
        init();
        $scope.$broadcast('scroll.refreshComplete');
      }
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
      $scope.doRefresh = function() {
        init();
        $scope.$broadcast('scroll.refreshComplete');
      }
      var init = function() {
        $scope.shout = [];
        API.getshoutbox().success(function(response) {
          var response = response.split('200')[1];
          console.log(response);
          response = atob(response);
          console.log(response);
          var shoutbox = response.split('<table style="width:100%;text-align:left;" border="0">')[1];
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
        API.sendshoutbox($scope.shout.message).success(function(response) {
          if (response == "200")
            $state.go($state.current, {}, {
              reload: true
            });
        })
      }
    })

    .controller('WhoIsOnlineCtrl', function($scope, API, Helper) {
      $scope.doRefresh = function() {
        init();
        $scope.$broadcast('scroll.refreshComplete');
      }
      var init = function() {
        API.getonlineusers().success(function(response) {
          $scope.users = Helper.parseWhoIs(response);
        });
      }
      init();
    })

    .controller('NeuCtrl', function($scope, $state, API, Helper, MessageService, $stateParams) {
      var init = function() {
        $scope.message = {};
        API.getrecipients().success(function(response) {
          $scope.users = Helper.parseUsers(response);
          if($stateParams.type == "answer"){
            $scope.message.text = "\n\n--------Original Message------------\nSend by: " + MessageService.sender + "\nDate: " + MessageService.date + "\n\n" + MessageService.text;
            $scope.message.subject = "RE: " + MessageService.subject;
            $scope.message.recipient = MessageService.sender;
          }
        });
      }
      init();

      $scope.send = function() {
        console.log($scope.message);
        API.sendmessage($scope.message.subject, $scope.message.text, $scope.message.recipient).success(function(response) {
          if(response == "200"){
            MessageService.MsgId = "";
            MessageService.sender = "";
            MessageService.subject = "";
            MessageService.date = "";
            MessageService.text = "";
            $state.go('tabs.folders');
          }

          else alert(response);
        });
      }

    })

    .controller('SettingsCtrl', function($scope, $state, API, Helper, UserService, $stateParams) {
      var init = function() {
        if(localStorage.getItem('username')){
          $scope.save = true;
        }
      }
      init();

      $scope.savechange = function(save){
        if(save == true){
          console.log("on");
          localStorage.setItem('username', UserService.username);
          localStorage.setItem('password', UserService.password); //TB Fixed - very insecure!!!!
        } else {
          localStorage.clear();
        }

      }

    })

    .controller('MessageCtrl', function($state, $sanitize, API, $scope, $stateParams, MessageService) {
      var init = function() {
        $scope.meta = MessageService;
        if($stateParams.folder == "inbox"){
          API.getmessageinbox($stateParams.msgId).success(function(response) {
            $scope.message = atob(response.substr(3));
          });
        }
        else if ($stateParams.folder == "outbox"){
          API.getmessageoutbox($stateParams.msgId).success(function(response) {
            $scope.message = atob(response.substr(3));
          });
        }
        else {
          API.getmessage($stateParams.msgId).success(function(response) {
            $scope.message = atob(response.substr(3));
          });
        }
      }
      init();

      $scope.answer = function(){
        MessageService.text = $scope.message;
      }
    });
