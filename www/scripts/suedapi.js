//Jquery Handler for Sued:Board API
/* V.0.1 by Basti SK 2015
*
* tl;dr: Fuck yeah, I'm using callbacks. Deal with it ! ^^
*/
var ApiURL = "/api/board"


function checkLogin(username, password, apikey, callback) {
    var state = false;
    $.post(ApiURL, { user: username, pw: password, apikey: apikey, action: "checklogin" }, function (response) {
        if (response == "200")
            state = true;
        callback(state);
    });
}

function getFolders(username, password, apikey, callback) {
    var folders = {};
    $.post(ApiURL, { user: username, pw: password, apikey: apikey, action: "readmessage_folders" }, function (response) {
        var folderlist = parseFolders(response);
        callback(folderlist);
    });
}

function getSubjects(username, password, apikey, folder, callback) {
    var subjects = {};
    $.post(ApiURL, { user: username, pw: password, apikey: apikey, action: "readmessage_subjects", selected_folder: folder }, function (response) {
        var subjectlist = parseSubjects(response);
        console.log(subjectlist);
        callback(subjectlist);
    });
}

function getMessage(username, password, apikey, messageid, callback) {
    var message = {};
    $.post(ApiURL, { user: username, pw: password, apikey: apikey, action: "readmessage_message", msgID: messageid }, function (response) {
        var output = response.split("200");
        console.log(output);
        callback(output[1]);
    });
}

function parseFolders(serverresponse) {
    var folderstring = serverresponse.split("200");
    console.log(folderstring);
    var folderarray = folderstring[1].split("\n");
    var output = [];
    for (var i = 0; i < folderarray.length - 1; i++) {
        var split = folderarray[i].split(";");
        output.push({ id: split[0], name: split[1] });
    }
    return output;
}

function parseSubjects(serverresponse) {
    var folderstring = serverresponse.substring(3);
    var folderarray = folderstring.split("\n");
    console.log(folderarray);
    var output = [];
    for (var i = 0; i < folderarray.length - 1; i++) {
        var split = folderarray[i].split(";");
        output.push({ id: split[0], subject: split[1], sender: split[2], date: split[3] });
    }
    return output;
}

function splitter(string, callback) {
    var folderarray = string.split("\n");
    callback(folderarray);
}
