$(function() {
    $('#tagsInput').tagsInput();
    displayOrderQuantity();
    localStorage.clear();

    const userButton = document.getElementById("userDropdown");
    const logButton = document.getElementById("log");
    const profileButton = document.getElementById("profile");
    const cookie = Storage.get("username");

    if (!cookie) {
        if (profileButton) profileButton.remove();
        userButton.innerHTML = '<i class="bi-person-fill me-1"></i>User';
        logButton.innerText = "Log in";
        logButton.setAttribute("href","login.html")
    }
    else {
        userButton.innerText = cookie;
        logButton.innerText = "Log out";
        logButton.setAttribute("onclick", "logout()");
        logButton.setAttribute("href","index.html")
    }
})

// You can give this function an onclick event to check if the user is logged in.
function isLogin() {
    if (!Storage.get("username")) {
        alert("Please login first!");
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
            Storage.remove("username");
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

function openDetail(element) {
    let petId = $(element).parent().parent()[0].id;
    let petName = $(element).children().children("h5")[0].innerText;
    let petTags = $(element).children().children("span")[0].innerText;
    let petCategory = $(element).parent().parent().children("p")[0].innerText;
    let petStatus = $("#navbarDropdown")[0].innerText.toLowerCase();
    window.location = "detail.html?id=" + petId.toString() + '&name=' + petName
        + '&tags=' + petTags + '&category=' + petCategory + '&status=' + petStatus;
}

function openOrdersCenter() {
    window.location = "orders.html";
}

function displayOrderQuantity() {
    let user = Storage.get("username");
    if (user) {
        let orderNum = 0;
        if (user === "admin") {
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (key !== "username") {
                    let orders = Storage.get(key);
                    if (orders) {
                        let orderArr = Storage.get(key);
                        orderNum += orderArr.length;
                    }
                }
            }
        }
        else {
            let orders = Storage.get(user);
            if (orders) {
                let orderArr = Storage.get(user);
                orderNum = orderArr.length;
            }
        }
        document.getElementById("orderQuantity").innerText = orderNum.toString();
    }
    else
        document.getElementById("orderQuantity").innerText = '0';
}

function queryStatusQuantity() {
    $.ajax({
        url: "https://petstore.swagger.io/v2/store/inventory",
        type: "GET",
        success: function (data){
            console.log(data);
            document.getElementById("availableQuantity").innerText = data["available"];
            document.getElementById("pendingQuantity").innerText = data["pending"];
            document.getElementById("soldQuantity").innerText = data["sold"];
        },
        error: function (error) {
            console.log(error.responseJSON);
        }
    });
}

function isAdminLogin() {
    let user = Storage.get("username")
    if (user) {
        return user === "admin";
    }
    else return false;
}
