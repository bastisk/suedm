var baseurl = 'https://suedboard.tk/api/call_api.php'; //removed for privacy reasons
var apikey = '123456'; //temporary API Key - valid for all users...
angular.module('suedm.services', [])

//All helperfunctions for parsing the kill0rz API
.factory('Helper', function() {
  var Helper = {};

  Helper.parseFolders = function(serverresponse) {
    var folderstring = serverresponse.split("200");
    folderstring[1] = atob(folderstring[1]);
    var folderarray = folderstring[1].split("\n");
    var output = [];
    for (var i = 0; i < folderarray.length - 1; i++) {
      var split = folderarray[i].split(";");
      if (split[1] != "unsortiert")
        output.push({
          id: split[0],
          name: split[1]
        });
    }
    return output;
  }

  Helper.parseInbox = function(response) {
    if (response.length > 3) {
      var output = [];
      var payload = response.substring(3);
      var messages = payload.split("\n");
      for (var i = 0; i < messages.length; i++) {
        messages[i] = atob(messages[i]);
      }
      for (var i = 0; i < messages.length; i++) {
        var meta = messages[i].split(";")[0];
        var meta = meta.split("-");
        var id = messages[i].split(";")[1];
        var id = id.split("\n")[0];
        output.push({
          id: id,
          subject: meta[0],
          sender: meta[1],
          date: meta[2]
        });
      }
      return output;
    } else return false;
  }

  Helper.parseSubjects = function(serverresponse) {
    var folderstring = serverresponse.substring(3);
    folderstring = atob(folderstring);
    var folderarray = folderstring.split("\n");
    var output = [];
    for (var i = 0; i < folderarray.length - 1; i++) {
      var split = folderarray[i].split(";");
      output.push({
        id: split[0],
        subject: split[1],
        sender: split[2],
        date: split[3]
      });
    }
    return output;
  }

  Helper.parseWhoIs = function(response) {
    var output = [];
    var payload = response.substring(3);
    payload = atob(payload);
    var elements = payload.split("\n");
    for (var i = 0; i < elements.length - 1; i++) {
      output.push({
        user: elements[i],
        date: elements[i + 1]
      });
      i++;
    }
    return output;
  }

  Helper.parseUsers = function(response) {
    var output = [];
    var payload = response.substring(3);
    payload = atob(payload);
    var elements = payload.split("\n");
    for (var i = 0; i < elements.length - 1; i++) {
      output.push({
        name: elements[i]
      });
    }
    return output;
  }

  return Helper;
})

//All functions for accessing the kill0rz API
.factory('API', function($http, UserService) {
  var API = {};

  API.checklogin = function(username, pw) {
    return $http.post(baseurl, {
      user: username,
      pw: pw,
      apikey: apikey,
      action: 'checklogin'
    });
  }

  API.getonlineusers = function() {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'whoisonline'
    });
  }

  API.getrecipient = function(user) {

    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      search_username: user,
      action: 'searchreciepient'
    });
  }

  API.getrecipients = function() {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'searchrecipient'
    });
  }

  API.sendmessage = function(subject, message, recipient) {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'sendmessage',
      subject: btoa(subject),
      message: btoa(message),
      recipient: btoa(recipient)
    });
  }

  API.getfolders = function() {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'readmessage_folders'
    });
  }

  API.getfolder = function(folder) {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'readmessage_subjects',
      selected_folder: folder
    });
  }

  API.getoutbox = function() {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'readmessage_subjects',
      selected_folder: 'outbox',
      outbox: true
    });
  }

  API.getinbox = function() {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'readmessage_subjects',
      selected_folder: 'inbox',
      inbox: true
    });
  }

  API.getmessage = function(id) {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'readmessage_message',
      msgID: id
    });
  }

  API.getmessageinbox = function(id) {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'readmessage_message',
      msgID: id,
      inbox: 'true'
    });
  }

  API.getmessageoutbox = function(id) {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'readmessage_message',
      msgID: id,
      outbox: 'true'
    });
  }

  API.getshoutbox = function() {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'load_shoutbox'
    });
  }

  API.sendshoutbox = function(message) {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'write_shoutbox',
      shoutbox_message: btoa(message)
    });
  }

  API.getnewmsgcount = function() {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'get_new_msg_count'
    });
  }

  API.getinboxfolder = function() {
    return $http.post(baseurl, {
      user: UserService.username,
      pw: UserService.password,
      apikey: apikey,
      action: 'get_new_msg_subjects_with_ids'
    });
  }
  return API;
})


.service('SubjectsService', function() {
  this.selectedFolder;
})

.service('UserService', function() {
  this.username;
  this.password;
  this.getUsername = function() {
    return this.username;
  }
  this.getPassword = function() {
    return this.password;
  }
})

.service('MessageService', function() {
  this.MsgId;
  this.sender;
  this.subject;
  this.date;
  this.text;
})

//Filter to enable HTML trust
.filter('html_fix', function($sce) {
  return function(stringToParse) {
    return $sce.trustAsHtml(stringToParse);
  }
});
