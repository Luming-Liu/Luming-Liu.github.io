const input = document.querySelector("#exampleInputPhone");
window.intlTelInput(input, {});

document.querySelector(".iti--allow-dropdown").className += " col-sm-12";
document.querySelector(".iti__selected-flag").setAttribute("style", "padding-left: 25px");

$(function () {
    $('#form').on('submit', function (e) {
        e.preventDefault();

        if (pwdCheck()) {
            let username = Storage.get("username");
            let dataJson = {
                "id": 0,
                "username": username,
                "firstName": $("#exampleFirstName").val(),
                "lastName": $("#exampleLastName").val(),
                "email": $("#exampleInputEmail").val(),
                "password": $("#exampleInputPassword").val(),
                "phone": $("#exampleInputPhone").val(),
                "userStatus": 0
            };

            $.ajax({
                url: "https://petstore.swagger.io/v2/user/" + username,
                type: "PUT",
                async: false,
                cache: false,
                dataType: "json",
                contentType: "application/json",
                traditional: true,
                data: JSON.stringify(dataJson),
                success: function (data) {
                    console.log(data);
                    alert("You have successfully updated!");
                    window.location.reload();
                },
                error: function (error) {
                    console.log(error.responseJSON);
                    alert("Update failed!")
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

$(function() {
    $(".pwdcheck").focus(
        function () {
            $("#error2").remove();
        }
    )}
);
