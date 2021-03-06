$(function () {
    $("#getTrouble").click(function () {
        let element = $("#collapseExample");
        if (element.hasClass('show'))
            element.removeClass('show');
        else
            element.addClass('show');
    })

    document.getElementById("exampleInputUsername").value = Storage.get("username");
    document.getElementById("exampleInputPassword").value = Storage.get("password");
    Storage.remove("username");
    Storage.remove("password");

    $('#form').on('submit', function (e) {
        e.preventDefault();

        if (userCheck() && pwdCheck()) {
            if (isPwdRight() === 3) {
                alert("Server exception!");
                return;
            }
            else if (isPwdRight() === 2) {
                alert("Password is not correct!");
                return;
            } else if (isPwdRight() === 0) {
                alert("Server not response!");
                return;
            }
            const username = $("#exampleInputUsername").val()
            const password = $("#exampleInputPassword").val()
            $.ajax({
                url: "https://petstore.swagger.io/v2/user/login?username=" + username
                    + '&' + "password=" + password,
                type: "GET",
                async: false,
                cache: false,
                success: function (data) {
                    console.log(data);
                    Storage.set("username", username, 21600);
                    bs4pop.notice('Login success!', {type: 'success'});
                    setTimeout('window.location.replace("index.html")',1000);
                },
                error: function (error) {
                    console.log(error.responseJSON);
                    alert("Login failed!")
                }
            });
        }
    });
});

function getAdminPassword() {
    let element = $("#pwdHint");
    if (element) element.remove();
    $.ajax({
        url: "https://petstore.swagger.io/v2/user/admin",
        type: "GET",
        async: false,
        cache: false,
        success: function (data){
            $("#passwordHint").after("<p id='pwdHint'>The <b>admin</b>'s password is " +
                "<b style='color: red'>" + data.password + "</b></p>")
        },
        error: function (error) {
            $("#passwordHint").after("<p><b id='pwdHint' style='color: red'>" +
                error.responseJSON.message + ".</b></p>")
        }
    });
}

function isPwdRight() {
    const username = $("#exampleInputUsername").val();
    const password = $("#exampleInputPassword").val();
    let flag = 0;
    $.ajax({
        url: "https://petstore.swagger.io/v2/user/" + username,
        type: "GET",
        async: false,
        cache: false,
        success: function (data){
            if (data["password"] === password) {
                flag = 1;
            }
            else flag = 2;
        },
        error: function (error) {
            flag = 3;
        }
    });
    return flag;
}

function pwdCheck() {
    const password = $("#exampleInputPassword").val();
    if (!password){
        $("#error2").remove();
        $("#pwd_check").append(
            '<ul class="errorlist" id="error2"><li style="color: red; font-size: 13px">' +
            'Password can not be empty.</li></ul>'
        );
        return false;
    }
    return true;
}

function userCheck() {
    const username = $("#exampleInputUsername").val();
    if (!username){
        $("#error1").remove();
        $("#usercheck").append(
            '<ul class="errorlist" id="error1"><li style="color: red; font-size: 13px">' +
            'Username can not be empty.</li></ul>'
        );
        return false;
    }
    else {
        let flag = null;
        if (username === "username") {
            $("#error1").remove();
            $("#usercheck").append(
                '<ul class="errorlist" id="error1"><li style="color: red; font-size: 13px">' +
                'Username is invalid.</li></ul>'
            );
            flag = false;
        } else {
            $.ajax({
                url: "https://petstore.swagger.io/v2/user/" + username,
                type: "GET",
                async: false,
                cache: false,
                success: function (data) {
                    flag = true;
                },
                error: function (error) {
                    $("#error1").remove();
                    $("#usercheck").append(
                        '<ul class="errorlist" id="error1"><li style="color: red; font-size: 13px">' +
                        "User is not found.</li></ul>"
                    );
                    flag = false;
                }
            });
        }
        return flag;
    }
}

$(function() {
    $("#exampleInputUsername").focus(
        function () {
            $("#error1").remove();
        }
    )
    $("#exampleInputPassword").focus(
        function () {
            $("#error2").remove();
        }
    )}
);
