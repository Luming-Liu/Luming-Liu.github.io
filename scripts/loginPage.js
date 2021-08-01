$(function () {
    $('#form').on('submit', function (e) {
        e.preventDefault();

        if (userCheck() && pwdCheck()) {
            if (!isPwdRight()) {
                alert("Password is not correct!");
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
                    localStorage.setItem("username", username);
                    alert("Success!");
                    window.location.replace("index.html");
                },
                error: function (error) {
                    console.log(error.responseJSON);
                    alert("Failed!")
                }
            });
        }
    });
});

function isPwdRight() {
    const username = $("#exampleInputUsername").val();
    const password = $("#exampleInputPassword").val();
    let flag = null;
    $.ajax({
        url: "https://petstore.swagger.io/v2/user/" + username,
        type: "GET",
        async: false,
        cache: false,
        success: function (data){
            flag = data["password"] === password;
        },
        error: function (error) {
            flag = false;
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
        $.ajax({
            url: "https://petstore.swagger.io/v2/user/" + username,
            type: "GET",
            async: false,
            cache: false,
            success: function (data){
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
