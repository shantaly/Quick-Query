var username;
var courseID;
var courseName;
var selText;
var sessionNum;
var randArray;
var myAns;
var timer;
var grade = 0;
var arrayAnsw = [];
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
$(function() {
    var url = window.location;

    if(url.pathname == '/student/home'){
        getCookie();
        $.ajax({
            url: "/accounts/"+username+"/courses",
            data: $('form').serialize(),
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response['status']=='success') {
                    for (var i = 0; i < response['courses'].length; i++) {
                        $("#courses_navbar").append("<a href=\"#\" id=\""+response['courseC'][i]+"\"class=\"list-group-item course-list\"> <h4 class=\"list-group-item-heading\">"+response['courses'][i]+"</h4> <p class=\"list-group-item-text\">"+response['courseC'][i]+"</p></a>");
                    };
                }
                else{
                    $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Access Denied!</strong> Try logging in again.</div>");
                }
            },
            error: function(error) {
                $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Could not reach the server.</div>");
            }
        });
    };

    $(document).on('click', '.course-list', function() {
        courseID = $(this).attr('id');
        var courseName = document.getElementById(courseID).getElementsByClassName("list-group-item-heading")[0].innerHTML;
        document.cookie='courseID='+courseID+';path=/student/;';
        document.cookie='courseName='+courseName+';path=/student/;';
        location.href='/student/course';
    });

    if (url.pathname == '/student/course') {
        getCookie();
        $(".page-header").append(courseName);
    };

    if(url.pathname == '/student/sessions'){
        getSessions();
    }

    $(document).on('click', '.exam', function() {
        var action = $(this).attr('id');
        var password = $('.form-control:last').val();
        var data = action.split("_");

       /* if (!navigator.geolocation){
            $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Geolocation is not supported by your browser. Talk to your Instructor</div>");
            return;
        }

        function success(position) {
            var latitude  = position.coords.latitude;
            var longitude = position.coords.longitude;
            var dataObject = {'latitude': latitude, 'longitude': longitude, 'password': password}
            $.ajax({
                url: "/accounts/"+username+"/courses/"+courseID+"/"+data[1],
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(dataObject),
                dataType: 'json',
                success: function(response) {
                    if (response["status"]=="success") {
                        document.cookie='sess='+data[1]+';path=/student/sessions/questions;';
                        location.href='/student/sessions/questions';
                    }
                    else if(response["status"]=="error_accessDenied"){
                        $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Access Denied!</strong> Password is wrong or your are not in class.</div>");
                    }
                    else{
                        $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Access Denied!</strong> Try logging in again.</div>");
                    }
                },
                error: function () {
                    $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Could not reach the server.</div>");
                }
            });
        };

        var options = {enableHighAccuracy: true};

        function error() {
            $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Unable to retrieve your location. Check your connection.</div>");
        };

        navigator.geolocation.getCurrentPosition(success, error, options);*/
        var latitude  = 43.531317576;
        var longitude = -80.233732993;
        var dataObject = {'latitude': latitude, 'longitude': longitude, 'password': password}
        $.ajax({
            url: "/accounts/"+username+"/courses/"+courseID+"/"+data[1],
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dataObject),
            dataType: 'json',
            success: function(response) {
                if (response["status"]=="success") {
                    document.cookie='sess='+data[1]+';path=/student/sessions/questions;';
                    location.href='/student/sessions/questions';
                }
                else if(response["status"]=="error_accessDenied"){
                    $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Access Denied!</strong> Password is wrong or your are not in class.</div>");
                }
                else{
                    $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Access Denied!</strong> Try logging in again.</div>");
                }
            },
            error: function () {
                $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Could not reach the server.</div>");
            }
        });

    });

    $(document).on('click', '.passModal', function() {
        clearTimeout(timer);
        timer = 0;
    });

    function getSessions(){
        getCookie();
        $(".page-header").empty();
        $(".page-header").append("<i class=\"fa fa-book fa-fw\"></i>"+courseName);
        $.ajax({
            url: "/accounts/"+username+"/courses/"+courseID,
            data: $('form').serialize(),
            type: 'POST',
            dataType: 'json',
            timeout: 2000,
            success: function(response) {
                if (response['status']=='success') {
                    $("#active_sessions").empty();
                    $("#past_sessions").empty();
                    $("#modals").empty();
                    $('.modal-backdrop').remove();
                    $( "body" ).removeClass( "modal-open" );
                    var j = 0;
                    for (var i = 0; i < response['weeks'].length; i++) {
                        var res = response['dataActive'][i].split(" ",4);
                        date =res.join(" ");
                        if (response['isDone'][i] == 0) {
                            $("#active_sessions").append("<a class=\"list-group-item\"><div class=\"row\"><div class=\"col-xs-5\"><h4 class=\"list-group-item-heading\">Session "+response['weeks'][i]+"</h4><p class=\"list-group-item-text\">Date Activated: "+date+"</p></div><div class=\"col-xs-7 text-right\"><button data-toggle=\"modal\" data-target=\"#session_password_"+response['weeks'][i]+"\" type=\"button\" class=\"btn btn-success passModal\"><i class=\"fa fa-play\"></i> Start</button></div></div></a>");
                            $("#modals").append("<div class=\"modal fade\" id=\"session_password_"+response['weeks'][i]+"\"tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" style=\"display: none; color:#000;\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button><h2 class=\"modal-title text-center\" id=\"myModalLabel\">Session Authentication</h2></div><div class=\"modal-body\"><div class=\"row\"><div class=\"form-group\"><div class=\"col-xs-12 col-md-4 text-center\"><h4 style=\"padding-top: 3px;\">Passwrod</h4></div><div class=\"col-xs-12 col-md-8 text-center\"><input class=\"form-control\" id=\"sessPass\"><p class=\"help-block\" style=\"font-size: 14px;\">Enter password provided.</p></div></div></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button> <button id=\"start_"+response['weeks'][i]+"\" type=\"button\" class=\"btn btn-primary exam\" data-dismiss=\"modal\">Add</button></div></div></div></div>");
                        }else{
                        //past sessions
                            $("#past_sessions").append("<a class=\"list-group-item past-session-list\"><div class=\"row\"><div class=\"col-xs-5\"><h4 class=\"list-group-item-heading\">Session "+response['weeks'][i]+"</h4><p class=\"list-group-item-text\">Date Activated: "+date+"</p></div><div class=\"col-xs-7 text-right\"><button data-toggle=\"modal\" data-target=\"#session_grade_"+response['weeks'][i]+"\" type=\"button\" class=\"btn btn-success\"><i class=\"fa fa-tasks\"></i></button></div></div></a>");
                            var grade =response['grades'][j];
                            if (grade % 1 == 0) {
                                grade = parseInt(grade);
                            };
                            $("#modals").append("<div class=\"modal fade\" id=\"session_grade_"+response['weeks'][i]+"\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" style=\"display: none; color:#000;\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button><h2 class=\"modal-title text-center\" id=\"myModalLabel\">Session "+response['weeks'][i]+" Grade</h2></div><div class=\"modal-body\"><div class=\"row\"><div class=\"form-group\"style=\"margin: 20px;\"><div class=\"col-xs-12 col-md-12 text-center\"><div class=\"progress\"><div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"2\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"min-width: 2em; width: "+grade+"%;\">"+grade+"%</div></div></div></div></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div><</div>");
                            j++;
                        }
                    }
                }
                else if(response['status']=='error_sessions_null'){
                    console.log("No sessions");
                    $("#active_sessions").empty();
                    $("#past_sessions").empty();
                    $("#modals").empty();
                }
                else{
                    $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Access Denied!</strong> Try logging in again.</div>");
                }
                timer = window.setTimeout(getSessions, 10000);
            },
            error: function(error) {
                $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Could not reach the server.</div>");
                timer = window.setTimeout(getSessions, 60000);
            }
        });
    }

    if(url.pathname == '/student/sessions/questions'){
        getQuestions();
    }

    function getQuestions(){
        getCookie();
        $(".page-header").empty();
        $(".page-header").append("<i class=\"fa fa-book fa-fw\"></i>"+courseName +"   <small>  Session "+sessionNum+"</small>");
        $.ajax({
            url: "/accounts/"+username+"/courses/"+courseID+"/"+sessionNum+"/getQs",
            data: $('form').serialize(),
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                if (response['status']=='success') {
                     $("#examView").empty();

                    for (var i = 0; i < response['ids'].length; i++) {
                        var checked = "";
                        var modalString = "";
                        var num = "";
                        randArray = response['randomA'];
                        num = response['randomA'][i];
                        if (i == 0) {
                           modalString += "<div id=\""+response['ids'][num]+"\">";
                        }
                        else{
                            modalString += "<div id=\""+response['ids'][num]+"\" style=\"display: none;\">";
                        }

                         modalString += "<div class=\"row\" style=\"margin: 0px 5px 0px 5px;\"><h3 style=\"display: flex;\"><span class=\"lead\" style=\"margin-right: 30px;\"><b>"+(i+1)+".</b></span><span class=\"lead\"><b>"+response['questions'][num]+"</b></span></h3></div><div class=\"row\" style=\"margin: 0px 5px 10px 55px;\"><label style=\"font-size: 18px;\" class=\"radio-inline\"><input name=\"studAns_"+response['ids'][num]+"\" id=\"studAns_"+response['ids'][num]+"\" type=\"radio\" value=\""+response['a1s'][num]+"\">a. "+response['a1s'][num]+"</label></div><div class=\"row\" style=\"margin: 10px 5px 10px 55px;\"><label style=\"font-size: 18px;\" class=\"radio-inline\"><input name=\"studAns_"+response['ids'][num]+"\" id=\"studAns_"+response['ids'][num]+"\" type=\"radio\" value=\""+response['a2s'][num]+"\">b. "+response['a2s'][num]+"</label></div>";

                        if (response['a3s'][num] != "") {
                            modalString += "<div class=\"row\" style=\"margin: 10px 5px 10px 55px;\"><label style=\"font-size: 18px;\" class=\"radio-inline\"><input name=\"studAns_"+response['ids'][num]+"\" id=\"studAns_"+response['ids'][num]+"\" type=\"radio\" value=\""+response['a3s'][num]+"\">b. "+response['a3s'][num]+"</label></div>";
                        };

                        if (response['a4s'][num] != "") {
                            modalString += "<div class=\"row\" style=\"margin: 10px 5px 10px 55px;\"><label style=\"font-size: 18px;\" class=\"radio-inline\"><input name=\"studAns_"+response['ids'][num]+"\" id=\"studAns_"+response['ids'][num]+"\" type=\"radio\" value=\""+response['a4s'][num]+"\">b. "+response['a4s'][num]+"</label></div>";
                        };

                        if (response['a5s'][num] != "") {
                            modalString += "<div class=\"row\" style=\"margin: 10px 5px 10px 55px;\"><label style=\"font-size: 18px;\" class=\"radio-inline\"><input name=\"studAns_"+response['ids'][num]+"\" id=\"studAns_"+response['ids'][num]+"\" type=\"radio\" value=\""+response['a5s'][num]+"\">b. "+response['a5s'][num]+"</label></div>";
                        };

                        if (i == response['ids'].length-1) {
                            modalString += "<button style=\"margin: 10px 5px 10px 55px; width:200px;\" type=\"button\" id=\"submitQFinal_"+response['ids'][num]+"\" class=\"btn btn-primary submitQues\" disabled=\"disabled\">Submit</button></div>";
                            $('body').append("<script> $(document).on(\'change\', \'#studAns_"+response['ids'][num]+"\' ,function() {$(\"#submitQFinal_"+response['ids'][num]+"\").prop(\"disabled\", false); var action = $(this).attr(\'value\'); document.cookie='myAns='+action+';path=/student/sessions/questions;';});</script>");
                        }
                        else{
                            modalString += "<button style=\"margin: 10px 5px 10px 55px; width:200px;\" type=\"button\" id=\"submitQ_"+response['ids'][num]+"\" class=\"btn btn-primary submitQues\" disabled=\"disabled\">Submit</button></div>";
                            $('body').append("<script> $(document).on(\'change\', \'#studAns_"+response['ids'][num]+"\' ,function() {$(\"#submitQ_"+response['ids'][num]+"\").prop(\"disabled\", false); var action = $(this).attr(\'value\'); document.cookie='myAns='+action+';path=/student/sessions/questions;'; });</script>");

                        }

                        $("#examView").append(modalString);

                        var encodedString = Base64.encode(response['rightAnss'][num]);
                        arrayAnsw.push(encodedString);

                    }
                }
                else if(response['status']=='error_questions_null'){
                    console.log("No questions");
                    $("#examView").empty();
                    location.href='/student/sessions';
                }
                else{
                    $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Access Denied!</strong> Try logging in again.</div>");
                }
            },
            error: function(error) {
                $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Could not reach the server.</div>");
            }
        });
    }


    $(document).on('click', '.submitQues', function() {
        getCookie();
        var action = $(this).attr('id');
        var data = action.split("_");
        var questionId = $(this).closest("div").attr("id");
        var currentIndex = jQuery.inArray(parseInt(data[1])-1, randArray);
        var decodedString = Base64.decode(arrayAnsw[currentIndex]);
        var answerFlag;

        if (myAns == decodedString) {
            answerFlag = "true";
            grade += 1;
        }
        else{
            answerFlag = "false";
        }
        var dataObject = {'answer': myAns, 'correct': answerFlag, 'questionID': questionId}
        $.ajax({
            url: "/accounts/"+username+"/courses/"+courseID+"/"+sessionNum+"/submitAnswer",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dataObject),
            dataType: 'json',
            success: function(data) {
                if (data["status"]=="success") {
                    console.log("success");
                }
                else if(response["status"]=="error_exists"){
                    $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Oh snap!</strong> Sever Error! Sorry about that.</div>")
                }
                else{
                    $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Access Denied!</strong> Try logging in again.</div>");
                }
            },
            error: function () {
                $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Could not reach the server.</div>");
            }
        });

        if (data[0] == "submitQFinal") {
            var gradef = grade/randArray.length;
            gradef = gradef*100;
            var dataObject = {'grade': gradef}
            $.ajax({
                url: "/accounts/"+username+"/courses/"+courseID+"/"+sessionNum+"/setDone",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(dataObject),
                dataType: 'json',
                success: function(data) {
                    if (data["status"]=="success") {
                        location.href='/student/sessions';
                    }
                    else{
                        $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Access Denied!</strong> Try logging in again.</div>");
                    }
                },
                error: function () {
                    $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Could not reach the server.</div>");
                }
            });
        }
        else{
            $("#"+data[1]).hide();

            var nextIndex = currentIndex+1;
            var next = randArray[nextIndex];
            next = parseInt(next)+1;
            $("#"+next).show();
        }
    });

    if(url.pathname == '/student/grades'){
        getGrades();
    }

    function getGrades(){
        getCookie();
        $(".page-header").empty();
        $(".page-header").append("<i class=\"fa fa-book fa-fw\"></i>"+courseName +"");
        $.ajax({
            url: "/accounts/"+username+"/courses/"+courseID+"/grades",
            data: $('form').serialize(),
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                if (data["status"]=="success") {
                    for (var i = 0; i < data["weeks"].length; i++) {
                        var grade = data['grades'][i];
                        if (grade % 1 == 0) {
                            grade = parseInt(grade);
                        };
                       $("#stud_grades").append("<tr><td>"+data["weeks"][i]+"</td><td>"+grade+"%</td></tr>");
                    };
                }
                else{
                    $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Access Denied!</strong> Try logging in again.</div>");
                }
            },
            error: function () {
                $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Could not reach the server.</div>");
            }
        });
    }

    $(".stud_profile").click(function() {
        getCookie();
        $.ajax({
            url: "/accounts/"+username+"/getDetails",
            data: $('form').serialize(),
            type: 'GET',
            dataType: 'json',
            success: function(response) {

            },
            error: function(error) {
                console.log(error);
            }
        });
    });

});


function getCookie(){
    var cookieVarList = document.cookie.split(";");
    var currentVar;
    var splitCurrentVar;
    var i;

    for(i = 0; i < cookieVarList.length; i++){
        currentVar = cookieVarList[i];
        splitCurrentVar = currentVar.split("=");
        /*splitCurrentVar: Index 0 holds the name, index 1 holds the value*/
        if(splitCurrentVar[0] == " username"){
            username = splitCurrentVar[1];
        }
        if(splitCurrentVar[0] == " courseID"){
            courseID = splitCurrentVar[1];
        }
        if(splitCurrentVar[0] == "courseID"){
            courseID = splitCurrentVar[1];
        }
        if(splitCurrentVar[0] == " courseName"){
            courseName = splitCurrentVar[1];
        }
        if(splitCurrentVar[0] == " sess"){
            sessionNum = splitCurrentVar[1];
        }
        if(splitCurrentVar[0] == "sess"){
            sessionNum = splitCurrentVar[1];
        }
        if(splitCurrentVar[0] == "myAns"){
            myAns = splitCurrentVar[1];
        }
        if(splitCurrentVar[0] == " myAns"){
            myAns = splitCurrentVar[1];
        }


    }
}