var app = angular.module('app', ['ionic']);
app.config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

        .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html'
            })
        .state('tabs.folders', {
            url: "/folders",
            views: {
                'folders': {
                    templateUrl: "templates/folders.html"
                }
            }  
        })
        .state('tabs.settings', {
            url: "/settings",
            views: {
                'settings':{
                    templateUrl: "templates/settings.html"
                }
            }
        })
        .state('tabs.subjects', {
            url: "/subjects",
            views: {
                'folders': {
                    templateUrl: "templates/subjects.html"
                }
            }
        })
        .state('tabs.message', {
            url: "/message",
            views: {
                'folders': {
                    templateUrl: "templates/message.html"
                }
            }
        })
        .state('tabs', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        });


        $urlRouterProvider.otherwise('/login');
    });

app.controller('LoginController', function ($state, $sanitize) {
    var self = this;

    var init = function () {
        var username = localStorage.getItem('username');
        var password = localStorage.getItem('password');
        var apikey = localStorage.getItem('apikey');
        if ((username != null) && (password != null) && (apikey != null)) {
            checkLogin(username, password, apikey, function getState(state) {
                if (state) $state.go('tabs.folders');
                else $state.go('login');
            });
        }
    }

    self.join = function () {
        var username = $sanitize(self.username);
        var password = $sanitize(self.password);
        var apikey = $sanitize(self.apikey);
        var save = $sanitize(self.save);
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('apikey', apikey);
        checkLogin(username, password, apikey, function getState(state) {
            if (state) $state.go('tabs.folders');
        });
    }

    init();

});

app.controller('FoldersController', function ($state, $sanitize, SubjectsService) {
    var self = this;
    var init = function () {
        var username = localStorage.getItem('username');
        var password = localStorage.getItem('password');
        var apikey = localStorage.getItem('apikey');
        getFolders(username, password, apikey, function getList(list) {
            self.folderlist = list;
        });
    }

    self.openFolder = function (foldername) {
        SubjectsService.selectedFolder = foldername;
        $state.go('tabs.subjects');
    }
    init();
    
});

app.controller('SettingsController', function ($state, $sanitize) {
    var self = this;
    self.logout = function () {
        localStorage.clear();
        $state.go('login');
    }
});

app.controller('SubjectsController', function ($state, $sanitize, SubjectsService, MessageService) {
    var self = this;
    var init = function () {
        var username = localStorage.getItem('username');
        var password = localStorage.getItem('password');
        var apikey = localStorage.getItem('apikey');
        var list = getSubjects(username, password, apikey, SubjectsService.selectedFolder, function getList(list) {
            self.subjectlist = list;
        });
        self.folder = SubjectsService.selectedFolder;
    }

    self.openMessage = function (MsgId, subject, sender, date) {
        MessageService.MsgId = MsgId;
        MessageService.subject = subject;
        MessageService.sender = sender;
        MessageService.date = date;
        $state.go('tabs.message');
    }
    init();

});

app.controller('MessageController', function ($state, $sanitize, MessageService) {
    var self = this;
    var init = function () {
        var username = localStorage.getItem('username');
        var password = localStorage.getItem('password');
        var apikey = localStorage.getItem('apikey');
        getMessage(username, password, apikey, MessageService.MsgId, function getMessage(message) {
            self.message = message;
        });
        self.meta = MessageService;
    }
    init();
});


app.service('SubjectsService', function () {
    this.selectedFolder;
});

app.service('MessageService', function () {
    this.MsgId;
    this.sender;
    this.subject;
    this.date;
});



app.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            $rootScope.hideTabs = 'tabs-item-hide';
            $scope.$on('$destroy', function() {
                $rootScope.hideTabs = '';
            });
        }
    };
});

app.filter('html_fix', function($sce){
    return function(stringToParse) {
        return $sce.trustAsHtml(stringToParse);
    }
});