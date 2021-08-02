$(function() {
    $('#tagsInput').tagsInput();

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

// You can give this function an onclick event to check if the user is logged in.
function isLogin() {
    if (!localStorage.getItem("username")) {
        window.location.replace("login.html");
    }
}

function logout() {
    $.ajax({
        url: "https://petstore.swagger.io/v2/user/logout",
        type: "GET",
        async: false,
        cache: false,
        success: function (data){
            console.log(data);
            localStorage.removeItem("username");
            alert("You have logged out!")
        },
        error: function (error) {
            console.log(error.responseJSON);
            alert("Crashed!")
        }
    });
}

function changeCategory(category) {
    document.getElementById("categoryDropdown").innerText = category;
    let allPets = $(".pet-display");
    allPets.show();
    allPets.each(function () {
        let categoryName = $(this).children("p")[0].innerText;
        if (category !== categoryName && category !== "All pets") {
            $(this).hide()
        }
    });
}
