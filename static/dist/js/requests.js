var username;
var courseID;
var courseName;
var selText;
var sessionNum;
$(function() {
    var url = window.location;

    if(url.pathname == '/instructor/home'){
        getCookie();
        $.ajax({
            url: "/accounts/"+username+"/myCourses",
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
        document.cookie='courseID='+courseID+';path=/instructor/;';
        document.cookie='courseName='+courseName+';path=/instructor/;';
        location.href='/instructor/course';
    });

    if (url.pathname == '/instructor/course') {
        getCookie();
        $(".page-header").append(courseName);
    };

    if(url.pathname == '/instructor/sessions'){
        getSessions();
    }

    $(".dropdown-menu li a").click(function(){
        selText = $(this).text();
        $(this).parents('.dropdown').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
    });

    $( "#submit_session" ).click(function() {
        if (selText != null){
            var password = $("#sessPass").val();
            var dataObject = {'password': password}
            $.ajax({
                url: "/accounts/"+username+"/myCourses/"+courseID+"/"+selText,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(dataObject),
                dataType: 'json',
                success: function(response) {
                    if (response["status"]=="success") {
                       getSessions();
                    }
                    else if(response["status"]=="error_exists"){
                        $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Oh snap!</strong> Session for week "+selText+" already created.</div>")
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
            $("#alert_div").append("<div class=\"alert alert-danger fade in\" style=\"font-size: 15px;\" ><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Error!</strong> Choose a week.</div>");

        }
    });

    $(document).on('click', '.power', function() {
        var action = $(this).attr('id');
        var data = action.split("_");
        if (data[0] == "activate"){
            /*if (!navigator.geolocation){
                $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Geolocation is not supported by your browser. That is a problem...</div>");
                return;
            }

            function success(position) {
                var latitude  = position.coords.latitude;
                var longitude = position.coords.longitude;
                var dataObject = {'latitude': latitude, 'longitude': longitude}
                $.ajax({
                    url: "/accounts/"+username+"/myCourses/"+courseID+"/"+data[0]+"/"+data[1],
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(dataObject),
                    dataType: 'json',
                    success: function(response) {
                        if (response["status"]=="activate" || response["status"]=="deactivate") {
                            getSessions();
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

            navigator.geolocation.getCurrentPosition(success, error, options);
            */
            var latitude  = 43.531317576;
            var longitude = -80.233732993;
            var dataObject = {'latitude': latitude, 'longitude': longitude}
            $.ajax({
                url: "/accounts/"+username+"/myCourses/"+courseID+"/"+data[0]+"/"+data[1],
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(dataObject),
                dataType: 'json',
                success: function(response) {
                    if (response["status"]=="activate" || response["status"]=="deactivate") {
                        getSessions();
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
            $.ajax({
                url: "/accounts/"+username+"/myCourses/"+courseID+"/"+data[0]+"/"+data[1],
                data: $('form').serialize(),
                type: 'POST',
                dataType: 'json',
                success: function(response) {
                    if (response["status"]=="activate" || response["status"]=="deactivate") {
                        getSessions();
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

    });

    $(document).on('click', '.options', function() {
        var action = $(this).attr('id');
        var data = action.split("_");
        if (data[0] == "view") {
            document.cookie='sess='+data[1]+';path=/instructor/sessions/questions;';
            location.href='/instructor/sessions/questions';
        }
        else if (data[0] == "mark1" || data[0] == "mark2" || data[0] == "delete"){
            $.ajax({
                url: "/accounts/"+username+"/myCourses/"+courseID+"/"+data[0]+"/"+data[1],
                data: $('form').serialize(),
                type: 'POST',
                dataType: 'json',
                success: function(response) {
                    if (response["status"]=="mark1" || response["status"]=="mark2" || response["status"]=="delete") {
                        getSessions();
                    }
                    else{
                        $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Access Denied!</strong> Try logging in again.</div>");
                    }
                },
                error: function () {
                    $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Could not reach the server.</div>");
                }
            });

            $('.modal-backdrop').remove();
            $( "body" ).removeClass( "modal-open" );

        }
    });

    function getSessions(){
        getCookie();
        $(".page-header").empty();
        $(".page-header").append("<i class=\"fa fa-book fa-fw\"></i>"+courseName);
        $.ajax({
            url: "/accounts/"+username+"/myCourses/"+courseID,
            data: $('form').serialize(),
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                if (response['status']=='success') {
                     $("#active_sessions").empty();
                     $("#past_sessions").empty();
                     $("#modals").empty();

                    for (var i = 0; i < response['weeks'].length; i++) {
                        var res = response['dateAdded'][i].split(" ",4);
                        date =res.join(" ");
                        if (response['isDone'][i] == 0) {
                            if (response['isActive'][i] == '0') {
                                $("#active_sessions").append("<a class=\"list-group-item\"><div class=\"row\"><div class=\"col-xs-5\"><h4 class=\"list-group-item-heading\">Session "+response['weeks'][i]+"</h4><p class=\"list-group-item-text\">Date Created: "+date+"</p></div><div class=\"col-xs-7 text-right\"><button data-toggle=\"modal\" data-target=\"#edit_session_"+response['weeks'][i]+"\" type=\"button\" class=\"btn btn-warning edit\"><i class=\"fa fa-edit\"></i></button><button id=\"activate_"+response['weeks'][i]+"\" type=\"button\" class=\"btn btn-offline power\"><i class=\"fa fa-power-off\"></i></button></div></div></a>");
                            }
                            else{
                                $("#active_sessions").append("<a class=\"list-group-item\"><div class=\"row\"><div class=\"col-xs-5\"><h4 class=\"list-group-item-heading\">Session "+response['weeks'][i]+"</h4><p class=\"list-group-item-text\">Date Created: "+date+"</p></div><div class=\"col-xs-7 text-right\"><button data-toggle=\"modal\" data-target=\"#edit_session_"+response['weeks'][i]+"\" type=\"button\" class=\"btn btn-warning edit\"><i class=\"fa fa-edit\"></i></button><button id=\"deactivate_"+response['weeks'][i]+"\" type=\"button\" class=\"btn btn-online power\"><i class=\"fa fa-power-off\"></i></button></div></div></a>");
                            }
                            $("#modals").append("<div class=\"modal fade\" id=\"edit_session_"+response['weeks'][i]+"\"tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" style=\"display: none; color:#000;\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button><h2 class=\"modal-title text-center\" id=\"myModalLabel\">Edit Session</h2></div><div class=\"modal-body\"><div class=\"row\"><div class=\"col-xs-12 col-sm-6 col-md-6 text-center\"><button id=\"view_"+response['weeks'][i]+"\" style=\"margin:5px;\" type=\"button\" data-dismiss=\"modal\" class=\"btn btn-primary options\">View/Edit Questions</button></div><div class=\"col-xs-12 col-sm-6 col-md-6 text-center\"><button id=\"mark1_"+response['weeks'][i]+"\" style=\"margin:5px;\" type=\"button\" data-dismiss=\"modal\" class=\"btn btn-warning options\">Mark as Completed</button></div></div><div class=\"row\"><div class=\"col-xs-12 col-md-12 text-center\"><button id=\"delete_"+response['weeks'][i]+"\" style=\"margin-top:5px;\" type=\"button\" data-dismiss=\"modal\" class=\"btn btn-danger btn-block options\">Delete Session</button></div></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div></div>");

                        }else{
                        //past sessions
                            $("#past_sessions").append("<a class=\"list-group-item\"><div class=\"row\"><div class=\"col-xs-5\"><h4 class=\"list-group-item-heading\">Session "+response['weeks'][i]+"</h4><p class=\"list-group-item-text\">Date Created: "+date+"</p></div><div class=\"col-xs-7 text-right\"><button data-toggle=\"modal\" data-target=\"#edit_session_"+response['weeks'][i]+"\" type=\"button\" class=\"btn btn-warning edit\"><i class=\"fa fa-edit\"></i></button></div></div></a>");
                            $("#modals").append("<div class=\"modal fade\" id=\"edit_session_"+response['weeks'][i]+"\"tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" style=\"display: none; color:#000;\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button><h2 class=\"modal-title text-center\" id=\"myModalLabel\">Edit Session</h2></div><div class=\"modal-body\"><div class=\"row\"><div class=\"col-xs-12 col-sm-6 col-md-6 text-center\"><button id=\"view_"+response['weeks'][i]+"\" style=\"margin:5px;\" type=\"button\" data-dismiss=\"modal\" class=\"btn btn-primary options\">View/Edit Questions</button></div><div class=\"col-xs-12 col-sm-6 col-md-6 text-center\"><button id=\"mark2_"+response['weeks'][i]+"\" style=\"margin:5px;\" type=\"button\" data-dismiss=\"modal\" class=\"btn btn-warning options\">Mark as Upcoming</button></div></div><div class=\"row\"><div class=\"col-xs-12 col-md-12 text-center\"><button id=\"delete_"+response['weeks'][i]+"\" style=\"margin-top:5px;\" type=\"button\" data-dismiss=\"modal\" class=\"btn btn-danger btn-block options\">Delete Session</button></div></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div></div>");
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
            },
            error: function(error) {
                $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Could not reach the server.</div>");
            }
        });
    }

    if(url.pathname == '/instructor/sessions/questions'){
        getQuestions();
    }

    $('#show_more').click(function() {
        if(!$('#ansC').is(':visible'))
        {
            $('#ansC').show();
        }
        else if(!$('#ansD').is(':visible')){
            $('#ansD').show();
        }
        else{
            $('#ansE').show();
        }
    });

    $('#show_less').click(function() {
        if($('#ansE').is(':visible'))
        {
            $('#ansE').hide();
        }
        else if($('#ansD').is(':visible'))
        {
            $('#ansD').hide();
        }
        else if($('#ansC').is(':visible'))
        {
            $('#ansC').hide();
        }
    });

    $( "#submit_question" ).click(function() {
        getCookie();
        console.log(courseID);
        var check = 0;
        var qTitle = $('#question_title').val();
        var question = $('#question').val();
        var ansA = $('#question_ansA').val();
        var ansB = $('#question_ansB').val();
        var ansC = $('#question_ansC').val();
        var ansD = $('#question_ansD').val();
        var ansE = $('#question_ansE').val();
        var rightAnsr = $('input[name="optionsRadiosInline"]:checked').val();

        if (!$.trim(qTitle)) {
            $("#title_error").addClass("has-error");
            check = 1;
        }
        if (!$.trim(question)) {
            $("#question_error").addClass("has-error");
            check = 1;
        }
        if (!$.trim(ansA)) {
            $("#ansA_error").addClass("has-error");
            check = 1;
        }
        if (!$.trim(ansB)) {
            $("#ansB_error").addClass("has-error");
            check = 1;
        }
        if (!$.trim(rightAnsr)) {
            $("#radio_error").empty();
            $("#radio_error").append("<div class=\"alert alert-danger fade in\" style=\"font-size: 15px;\" ><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Error!</strong> Choose right answer using radio buttons.</div>");
            check = 1;
        }
        if(check == 0){
            $('#add_question').modal('hide');
            $.ajax({
                url: "/accounts/"+username+"/myCourses/"+courseID+"/"+sessionNum+"/postQs",
                type: 'POST',
                data: $('form').serialize(),
                success: function(data) {
                    if (data["status"]=="success") {
                        getQuestions();
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
        }
    });
    $('#add_question').on('hidden.bs.modal', function () {
        $("#title_error").removeClass("has-error");
        $("#question_error").removeClass("has-error");
        $("#ansA_error").removeClass("has-error");
        $("#ansB_error").removeClass("has-error");
        $("#radio_error").empty();
        $("#question_title").val('').end();
        $(this).find("textarea").val('').end();
        $(this).find('[type="radio"]').prop('checked', false);
    });

    function getQuestions(){
        getCookie();
        $(".page-header").empty();
        $(".page-header").append("<i class=\"fa fa-book fa-fw\"></i>"+courseName +"   <small>  Session "+sessionNum+"</small>");

        $.ajax({
            url: "/accounts/"+username+"/myCourses/"+courseID+"/"+sessionNum+"/getQs",
            data: $('form').serialize(),
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                if (response['status']=='success') {
                     $("#session_questions").empty();
                     $("#modals").empty();

                    for (var i = 0; i < response['ids'].length; i++) {
                        var checked = "";
                        var modalString = "";
                        $("#session_questions").append("<a class=\"list-group-item\"><div class=\"row\"><div class=\"col-xs-5\"><h4 class=\"list-group-item-heading\">Question "+response['ids'][i]+"</h4><p class=\"list-group-item-text\">Title: "+response['titles'][i]+"</p></div><div class=\"col-xs-7 text-right\"><button data-toggle=\"modal\" data-target=\"#edit_question_"+response['ids'][i]+"\" type=\"button\" class=\"btn btn-warning edit\"><i class=\"fa fa-edit\"></i></button><button data-toggle=\"modal\" data-target=\"#preview_"+response['ids'][i]+"\" type=\"button\" class=\"btn btn-preview preview\"><i class=\"fa fa-search\"></i></button></div></div></a>");
                        //$("#modals").append("<div class=\"modal fade\" id=\"preview_"+response['ids'][i]+"\"tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" style=\"display: none; color:#000;\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button><h2 class=\"modal-title text-center\" id=\"myModalLabel\">Preview Question</h2></div><div class=\"modal-body\"><div class=\"row\" style=\"margin: 0px 5px 0px 5px;\"><label style=\"font-size: 18px;\">Question</label><p>"+response['questions'][i]+"</p></div><div class=\"row\" style=\"margin: 0px 5px 0px 5px;\"><p>a: "+response['a1s'][i]+"</p></div><div class=\"row\" style=\"margin: 0px 5px 0px 5px;\"><p>b: "+response['a2s'][i]+"</p></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div></div>");
                        modalString += "<div class=\"modal fade\" id=\"preview_"+response['ids'][i]+"\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" style=\"display: none; color:#000;\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button><h2 class=\"modal-title text-center\" id=\"myModalLabel\">Question Preview</h2></div><div class=\"modal-body\"><fieldset disabled><div class=\"row\" style=\"margin: 0px 5px 0px 5px;\"><label style=\"font-size: 20px;\">Question:</label><p style=\"font-size: 18px;\">"+response['questions'][i]+"<p></div>";
                        if (response['a1s'][i] == response['rightAnss'][i]) {
                            checked = "checked=\"\""
                        }
                        modalString += "<div class=\"form-group row\" style=\"margin: 10px 5px 10px 5px;\"><label style=\"font-size: 18px;\" class=\"radio-inline\"><input type=\"radio\" "+checked+">A)  "+response['a1s'][i]+"</label></div>";
                        checked = "";
                        if (response['a2s'][i] == response['rightAnss'][i]) {
                            checked = "checked=\"\""
                        }
                        modalString += "<div class=\"form-group row\" style=\"margin: 10px 5px 10px 5px;\"><label style=\"font-size: 18px;\" class=\"radio-inline\"><input type=\"radio\" "+checked+">B)  "+response['a2s'][i]+"</label></div>";
                        checked = "";

                        if (response['a3s'][i] != "") {
                            if (response['a3s'][i] == response['rightAnss'][i]) {
                                checked = "checked=\"\""
                            }
                            modalString += "<div class=\"form-group row\" style=\"margin: 10px 5px 10px 5px;\"><label style=\"font-size: 18px;\" class=\"radio-inline\"><input type=\"radio\" "+checked+">C)  "+response['a3s'][i]+"</label></div>";
                            checked = "";
                        };

                        if (response['a4s'][i] != "") {
                            if (response['a4s'][i] == response['rightAnss'][i]) {
                                checked = "checked=\"\""
                            }
                            modalString += "<div class=\"form-group row\" style=\"margin: 10px 5px 10px 5px;\"><label style=\"font-size: 18px;\" class=\"radio-inline\"><input type=\"radio\" "+checked+">D)  "+response['a4s'][i]+"</label></div>";
                            checked = "";
                        };

                        if (response['a5s'][i] != "") {
                            if (response['a5s'][i] == response['rightAnss'][i]) {
                                checked = "checked=\"\""
                            }
                            modalString += "<div class=\"form-group row\" style=\"margin: 10px 5px 10px 5px;\"><label style=\"font-size: 18px;\" class=\"radio-inline\"><input type=\"radio\" "+checked+">E)  "+response['a5s'][i]+"</label></div>";
                            checked = "";
                        };

                        modalString += "</fieldset></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div></div>";
                        $("#modals").append(modalString);
                    }
                }
                else if(response['status']=='error_questions_null'){
                    console.log("No questions");
                    $("#session_questions").empty();
                    $("#modals").empty();
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

    if(url.pathname == '/instructor/grades'){
        getGrades();
    }

    function getGrades(){
        getCookie();
        $(".page-header").empty();
        $(".page-header").append("<i class=\"fa fa-book fa-fw\"></i>"+courseName +"");
        $.ajax({
            url: "/accounts/"+username+"/myCourses/"+courseID+"/grades",
            data: $('form').serialize(),
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                if (data["status"]=="success") {
                    $("#stud_grades").empty();
                    for (var i = 0; i < data["studentsIDs"].length; i++) {
                        var average =data['averageMark'][i];
                        if (average % 1 == 0) {
                            average = parseInt(average);
                        }
                        else{
                            average = Math.round(average * 100) / 100
                        }
                       $("#stud_grades").append("<tr><td>"+data["studentsIDs"][i]+"</td><td>"+data["lastNames"][i]+", "+data["firstName"][i]+"</td><td>"+data["sessionPart"][i]+"/"+data["weeksCount"]+"</td><td>"+average+"%</td></tr>");
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
        if(splitCurrentVar[0] == "sess"){
            sessionNum = splitCurrentVar[1];
        }

    }
}


