$(function() {
    $('#side-menu').metisMenu();
});

$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset+30;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height+20) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }


    $(window).resize(function() {
        if ($(this).width() < 992) {
            
        }
    });

});

$(function() {
    var url = window.location;

    $( "#student" ).click(function() {
        location.href='/login/student';
    });
    $( "#instructor" ).click(function() {
        location.href='/login/instructor';
    }); 

    if(url.pathname == '/login'){
        $("body").css("background-image", "url(\"../static/dist/img/loginbg.jpg\")");
    };

    if(url.pathname == '/login/student'){
        $("body").css("background-image", "url(\"../static/dist/img/loginSbg.jpg\")");

        if (localStorage.chkbx1 && localStorage.chkbx1 != '') {
            $('#remember_me1').attr('checked', 'checked');
            $('#username1').val(localStorage.usrname1);
            $('#password1').val(localStorage.pass1);
        } else {
            $('#remember_me1').removeAttr('checked');
            $('#username1').val('');
            $('#password1').val('');
        };

        $('#remember_me1').click(function() {

            if ($('#remember_me1').is(':checked')) {
                // save username and password
                localStorage.usrname1 = $('#username1').val();
                localStorage.pass1 = $('#password1').val();
                localStorage.chkbx1 = $('#remember_me1').val();
            } else {
                localStorage.usrname1 = '';
                localStorage.pass1 = '';
                localStorage.chkbx1 = '';
            };
        });
    };


    if(url.pathname == '/login/instructor'){
        $("body").css("background-image", "url(\"../static/dist/img/loginTbg.jpg\")");

        if (localStorage.chkbx2 && localStorage.chkbx2 != '') {
            $('#remember_me2').attr('checked', 'checked');
            $('#username2').val(localStorage.usrname2);
            $('#password2').val(localStorage.pass2);
        } else {
            $('#remember_me2').removeAttr('checked');
            $('#username2').val('');
            $('#password2').val('');
        };

        $('#remember_me2').click(function() {

            if ($('#remember_me2').is(':checked')) {
                // save username and password
                localStorage.usrname2 = $('#username2').val();
                localStorage.pass2 = $('#password2').val();
                localStorage.chkbx2 = $('#remember_me2').val();
            } else {
                localStorage.usrname2 = '';
                localStorage.pass2 = '';
                localStorage.chkbx2 = '';
            };
        });
    };

    if(url.pathname.indexOf('/') == 0){
        $("body").css("background-repeat", "no-repeat");
        $("body").css("background-attachment" , "fixed");
        $("body").css("background-position" , "center");
        $("body").css("background-size" , "cover");
        $("body").css("width" , "100%");
        $("body").css("height" , "750px");

    };


    if(url.pathname.indexOf('/instructor/') == 0 || url.pathname.indexOf('/student/') == 0){
        var firstName = localStorage.getItem("firstName");
        $("#userIcon").prepend(firstName + "  ");
    };

    


    if(url.pathname == '/instructor/profile/' || url.pathname == '/student/profile/'){
        var panels = $('.user-infos');
        var panelsButton = $('.dropdown-user');
        panels.hide();

        //Click dropdown
        panelsButton.click(function() {
            //get data-for attribute
            var dataFor = $(this).attr('data-for');
            var idFor = $(dataFor);

            //current button
            var currentButton = $(this);
            idFor.slideToggle(400, function() {
                //Completed slidetoggle
                if(idFor.is(':visible'))
                {
                    currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
                }
                else
                {
                    currentButton.html('<i class="glyphicon glyphicon-chevron-down text-muted"></i>');
                }
            })
        });

        $("input[type=password]").keyup(function(){
            console.log("here");
            var ucase = new RegExp("[A-Z]+");
            var lcase = new RegExp("[a-z]+");
            var num = new RegExp("[0-9]+");
            
            if($("#chPassword1").val().length >= 8){
                $("#8char").removeClass("glyphicon-remove");
                $("#8char").addClass("glyphicon-ok");
                $("#8char").css("color","#00A41E");
            }else{
                $("#8char").removeClass("glyphicon-ok");
                $("#8char").addClass("glyphicon-remove");
                $("#8char").css("color","#FF0004");
            }
            
            if(ucase.test($("#chPassword1").val())){
                $("#ucase").removeClass("glyphicon-remove");
                $("#ucase").addClass("glyphicon-ok");
                $("#ucase").css("color","#00A41E");
            }else{
                $("#ucase").removeClass("glyphicon-ok");
                $("#ucase").addClass("glyphicon-remove");
                $("#ucase").css("color","#FF0004");
            }
            
            if(lcase.test($("#chPassword1").val())){
                $("#lcase").removeClass("glyphicon-remove");
                $("#lcase").addClass("glyphicon-ok");
                $("#lcase").css("color","#00A41E");
            }else{
                $("#lcase").removeClass("glyphicon-ok");
                $("#lcase").addClass("glyphicon-remove");
                $("#lcase").css("color","#FF0004");
            }
            
            if(num.test($("#chPassword1").val())){
                $("#num").removeClass("glyphicon-remove");
                $("#num").addClass("glyphicon-ok");
                $("#num").css("color","#00A41E");
            }else{
                $("#num").removeClass("glyphicon-ok");
                $("#num").addClass("glyphicon-remove");
                $("#num").css("color","#FF0004");
            }
            
            if($("#chPassword1").val() == $("#chPassword2").val()){
                $("#pwmatch").removeClass("glyphicon-remove");
                $("#pwmatch").addClass("glyphicon-ok");
                $("#pwmatch").css("color","#00A41E");
            }else{
                $("#pwmatch").removeClass("glyphicon-ok");
                $("#pwmatch").addClass("glyphicon-remove");
                $("#pwmatch").css("color","#FF0004");
            }
        });
    };

    $('#logout').click(function() {
        getCookie();
        $.ajax({
            url: "/accounts/logout/"+username,
            data: $('form').serialize(),
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                if (response["status"]!="success") {
                    $("#alert_div").append("<div class=\"alert alert-warning fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Something wrong happened.</div>");
                }
                localStorage.removeItem(firstName);
                document.cookie=username+'; expires=Thu, 01 Jan 1970 00:00:00 UTC';
                document.cookie='courseID; expires=Thu, 01 Jan 1970 00:00:00 UTC';
                document.cookie='courseName; expires=Thu, 01 Jan 1970 00:00:00 UTC';
                document.cookie="username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                document.cookie="sess=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                location.href='/login';
            },
            error: function () {
                $("#alert_div").append("<div class=\"alert alert-danger fade in\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Danger!</strong> Could not reach the server.</div>");
            }
        });
        
    });

    $( "#login1" ).click(function() {
        var username = $('#username1').val();
        var password = $('#password1').val();
        $.ajax({
            url: '/accounts/validateLoginS',
            type: 'POST',
            data: $('form').serialize(),
            success: function(data, status, xhr) {
                if (data["valid"]=="true") {
                    //console.log(xhr.getResponseHeader("Set-Cookie"));
                    event.preventDefault();
                    document.cookie='username='+username+';path=/;';
                    localStorage.setItem("firstName", data["name"]);
                    localStorage.usrname2 = '';
                    localStorage.pass2 = '';
                    localStorage.chkbx2 = '';
                    location.href='/student/home';
                }
                else{
                    $("#loginPanel" ).effect("shake");
                    $("#login_error").append("<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">×</button> Invalid username or password entered.</div>");
                    event.preventDefault();
                }
            },
            error: function () {
                $("#loginPanel").effect("shake");
            }
        });
    });

    $( "#login2" ).click(function() {
        var username = $('#username2').val();
        var password = $('#password2').val();
        $.ajax({
            url: '/accounts/validateLoginT',
            type: 'POST',
            data: $('form').serialize(),
            success: function(data, status, xhr) {
                if (data["valid"]=="true") {
                    //console.log(xhr.getResponseHeader("Set-Cookie"));
                    event.preventDefault();
                    document.cookie='username='+username+';path=/;';
                    localStorage.setItem("firstName", data["name"]);
                    localStorage.usrname1 = '';
                    localStorage.pass1 = '';
                    localStorage.chkbx1 = '';
                    location.href='/instructor/home';
                }
                else{
                    $("#loginPanel").effect("shake");
                    $("#login_error").append("<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">×</button> Invalid username or password entered.</div>");
                    event.preventDefault();
                }
            },
            error: function () {
                $("#loginPanel").effect("shake");
            }
        });
    });

    
});
