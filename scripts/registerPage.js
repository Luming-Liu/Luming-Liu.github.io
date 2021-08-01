const input = document.querySelector("#exampleInputPhone");
window.intlTelInput(input, {});

document.querySelector(".iti--allow-dropdown").className += " col-sm-12";
document.querySelector(".iti__selected-flag").setAttribute("style", "padding-left: 25px");

$(function () {
    $('#form').on('submit', function (e) {
        e.preventDefault();

        if (userCheck() && pwdCheck()) {
            const dataArray = [];
            const dataJson = {
                "username": $("#exampleInputUsername").val(),
                "firstName": $("#exampleFirstName").val(),
                "lastName": $("#exampleLastName").val(),
                "email": $("#exampleInputEmail").val(),
                "password": $("#exampleInputPassword").val(),
                "phone": $("#exampleInputPhone").val()
            };
            dataArray.push(dataJson);

            $.ajax({
                url: "https://petstore.swagger.io/v2/user/createWithArray",
                type: "POST",
                async: false,
                cache: false,
                dataType: "json",
                contentType: "application/json",
                traditional: true,
                data: JSON.stringify(dataArray),
                success: function (data) {
                    console.log(data);
                    alert("You have successfully registered!");
                    window.location.replace("login.html");
                },
                error: function (error) {
                    console.log(error.responseJSON);
                    alert("Registration failed!")
                }
            });
        }
    });
});

function pwdCheck() {
    const password = $("#exampleInputPassword").val()
    if (!password) {
        $("#error2").remove();
        $("#pwd_check").append(
            '<ul class="errorlist" id="error2"><li style="color: red; font-size: 13px">' +
            'Password can not be empty.</li></ul>'
        );
        return false;
    }
    else if (password!==$("#exampleRepeatPassword").val()) {
        $("#error2").remove();
        $("#pwd_check").append(
            '<ul class="errorlist" id="error2"><li style="color: red; font-size: 13px">' +
            'Two password inputs do not match.</li></ul>'
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
                $("#error1").remove();
                $("#usercheck").append(
                    '<ul class="errorlist" id="error1"><li style="color: red; font-size: 13px">' +
                    'This username has been used.</li></ul>'
                );
                flag = false;
            },
            error: function (error) {
                console.log(error.responseJSON);
                flag = true;
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
    $(".pwdcheck").focus(
        function () {
            $("#error2").remove();
        }
    )}
);
