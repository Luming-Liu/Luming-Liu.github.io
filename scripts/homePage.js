$(function() {
    const userButton = document.getElementById("userDropdown");
    const logButton = document.getElementById("log");
    const cookie = localStorage.getItem("username");
    if (!cookie) {
        userButton.innerHTML = '<i class="bi-person-fill me-1"></i>User';
        logButton.innerText = "Log in";
    }
    else {
        userButton.innerText = cookie;
        logButton.innerText = "Log out";
        logButton.setAttribute("onclick", "logout()");
    }
})

function logout() {
    $.ajax({
        url: "https://petstore.swagger.io/v2/user/logout",
        type: "GET",
        async: false,
        cache: false,
        success: function (data){
            console.log(data);
            localStorage.removeItem("username");
            alert("You are logged out!")
        },
        error: function (error) {
            console.log(error.responseJSON);
            alert("Crashed!")
        }
    });
}
