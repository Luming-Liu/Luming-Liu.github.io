$(function () {
    // let petId = getUrlParam("id")
    let petName = getUrlParam("name");
    let petTags = getUrlParam("tags");
    let petCategory = getUrlParam("category");
    let petStatus = getUrlParam("status");
    document.getElementById("petName").innerText = petName;
    document.getElementById("petTags").innerText = petTags;
    document.getElementById("petCategory").innerText = petCategory;
    if (petStatus === "pending") {
        $("#petStatus").replaceWith('<button class="btn btn-warning disabled flex-shrink-0" type="button">' +
            '<i class="bi-cart-fill me-1"></i>Pending</button>');
    }
    else if (petStatus === "sold") {
        $("#petStatus").replaceWith('<button class="btn btn-danger disabled flex-shrink-0" type="button">' +
            '<i class="bi-cart-fill me-1"></i>Sold</button>');
    }
})

function imageUpload(option) {
    $('#imageUpload').modal(option);
}

function goBack() {
    history.go(-1);
}

function getPet(id) {
    $.ajax({
        url: "https://petstore.swagger.io/v2/pet/" + id,
        type: "GET",
        cache: false,
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log(error.responseJSON);
        }
    });
}

function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function checkQuantity(num) {
    let reg = /^((?!0)\d{1,9})$/;
    return num.match(reg) && num < 100;
}

function placeOrder() {
    let user = localStorage.getItem("username");
    if (user) {
        let date = new Date().getTime()
        let obj = {};
        obj = {
            id: date,
            petId: parseInt(getUrlParam("id")),
            petName: getUrlParam("name"),
            petQuantity: parseInt($("#inputQuantity").val()),
            // Delay for 7 days(432000000 milliseconds) as shipping time.
            shipDate: new Date(date + 432000000).Format('yy-MM-dd hh:mm:ss'),
            status: "placed"
        }
        let orders = localStorage.getItem(user);
        if (orders) {
            let orderArr = JSON.parse(orders);
            orderArr.push(obj);
            localStorage.setItem(user, JSON.stringify(orderArr));
        }
        else {
            let orderArr = [];
            orderArr.push(obj);
            localStorage.setItem(user, JSON.stringify(orderArr));
        }
        alert("Purchase success! The order id is " + obj.id + '.');
        displayOrderQuantity()
    }
    else isLogin()
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, // Month
        "d+": this.getDate(), // Day
        "h+": this.getHours(), // Hour
        "m+": this.getMinutes(), // Minute
        "s+": this.getSeconds(), // Second
        "q+": Math.floor((this.getMonth() + 3) / 3), // Season
        "S": this.getMilliseconds() // Millisecond
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
