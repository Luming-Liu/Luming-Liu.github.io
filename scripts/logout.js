function logout() {
    $.ajax({
        url: "https://petstore.swagger.io/v2/user/logout",
        type: "GET",
        async: false,
        cache: false,
        success: function (data){
            console.log(data);
            alert("You are logged out!")
        },
        error: function (error) {
            console.log(error.responseJSON);
            alert("Crashed!")
        }
    });
}
