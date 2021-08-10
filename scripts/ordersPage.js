const ordersTableTemplate = `
        <tr id="ORDER_ID">
            <th scope="row">SERIAL_NUM</th>
            <td>ORDER_ID</td>
            <td>USER_NAME</td>
            <td>PET_NAME</td>
            <td>QUANTITY</td>
            <td>SHIP_DATE</td>
            <td>STATUS</td>
            <td><button class="btn CONFIRM_BUTTON_STYLE" onClick="ORDER_PROCESS(ORDER_ID)">CONFIRM_BUTTON_TEXT</button>
                <button class="btn DELETE_BUTTON_STYLE" onClick="cancelOrder(ORDER_ID)">Cancel order</button>
            </td>
        </tr>
    `;

$(function () {
    if (document.getElementById("orderTable")) {
        if (isAdminLogin()) {
            adminRenderTable(ordersTableTemplate);
        } else {
            if (isExistOrdersForUser()) {
                let username = Storage.get("username");
                let ordersData = Storage.get(username);
                let count = 1;
                let ordersHTML = '';

                ordersData.forEach((order) => {
                    let orderHTML = ordersTableTemplate;
                    orderHTML = orderHTML.replace(/SERIAL_NUM/g, count)
                    orderHTML = orderHTML.replace(/USER_NAME/g, username)
                    orderHTML = orderHTML.replace(/ORDER_PROCESS/g, "completeOrder")
                    orderHTML = orderHTML.replace(/ORDER_ID/g, order.id)
                    orderHTML = orderHTML.replace(/PET_NAME/g, order.petName)
                    orderHTML = orderHTML.replace(/QUANTITY/g, order.petQuantity)
                    orderHTML = orderHTML.replace(/SHIP_DATE/g, order.shipDate)
                    orderHTML = orderHTML.replace(/STATUS/g, order.status)
                    if (order.status === "placed") {
                        orderHTML = orderHTML.replace(/CONFIRM_BUTTON_TEXT/g, "Wait for Sending")
                        orderHTML = orderHTML.replace(/CONFIRM_BUTTON_STYLE/g, "btn-outline-primary disabled")
                        orderHTML = orderHTML.replace(/DELETE_BUTTON_STYLE/g, "btn-danger")
                    } else {
                        orderHTML = orderHTML.replace(/CONFIRM_BUTTON_TEXT/g, "Confirm receipt")
                        orderHTML = orderHTML.replace(/CONFIRM_BUTTON_STYLE/g, "btn-success")
                        orderHTML = orderHTML.replace(/DELETE_BUTTON_STYLE/g, "btn-outline-danger disabled")
                    }

                    count++;
                    ordersHTML += orderHTML;
                })

                document.getElementById("orderTable").innerHTML = ordersHTML;
            }
        }
    }
});

function adminRenderTable(templete) {
    let count = 1;
    let ordersHTML = '';
    for (let i=0; i<localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key !== "username") {
            let ordersData = Storage.get(key);

            ordersData.forEach((order) => {
                let orderHTML = templete;
                orderHTML = orderHTML.replace(/SERIAL_NUM/g, count)
                orderHTML = orderHTML.replace(/USER_NAME/g, key)
                orderHTML = orderHTML.replace(/ORDER_PROCESS/g, "shipOrder")
                orderHTML = orderHTML.replace(/ORDER_ID/g, order.id)
                orderHTML = orderHTML.replace(/PET_NAME/g, order.petName)
                orderHTML = orderHTML.replace(/QUANTITY/g, order.petQuantity)
                orderHTML = orderHTML.replace(/SHIP_DATE/g, order.shipDate)
                orderHTML = orderHTML.replace(/STATUS/g, order.status)
                if (order.status === "placed") {
                    orderHTML = orderHTML.replace(/CONFIRM_BUTTON_TEXT/g, "Confirm Sending")
                    orderHTML = orderHTML.replace(/CONFIRM_BUTTON_STYLE/g, "btn-success")
                    orderHTML = orderHTML.replace(/DELETE_BUTTON_STYLE/g, "btn-danger")
                }
                else {
                    orderHTML = orderHTML.replace(/CONFIRM_BUTTON_TEXT/g, "Pet is sending")
                    orderHTML = orderHTML.replace(/CONFIRM_BUTTON_STYLE/g, "btn-outline-primary disabled")
                    orderHTML = orderHTML.replace(/DELETE_BUTTON_STYLE/g, "btn-outline-danger disabled")
                }

                count++;
                ordersHTML += orderHTML;
            })

            document.getElementById("orderTable").innerHTML = ordersHTML;
        }
    }
}

function updatePetStatus(id, status) {
    let pet = getPet(id);
    let formData = new FormData();
    formData.append('name', pet[1]);
    formData.append('status', status);

    $.ajax({
        url: 'https://petstore.swagger.io/v2/pet/' + pet[0].toString(),
        type: 'POST',
        data: formData,
        processData: false,
        dataType: 'json',
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log(error.responseJSON);
        }
    })
}

function getPet(id) {
    let pet = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key !== "username") {
            let ordersData = Storage.get(key);
            ordersData.forEach((order) => {
                if (order.id === id) {
                    pet.push(order.petId);
                    pet.push(order.petName);
                }
            })
        }
    }
    return pet;
}

function isExistOrdersForUser() {
    let user = Storage.get("username");
    if (user) {
        let orders = Storage.get(user);
        return !!orders;
    } else return false;
}

function shipOrder(id) {
    if (confirm("Please confirm once again that you have packed and sent it successfully.")) {
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key !== "username") {
                let ordersData = Storage.get(key);
                for (let j = 0; j < ordersData.length; j++) {
                    if (id === ordersData[j].id) {
                        ordersData[j].status = "sending";
                    }
                }
                Storage.set(key, ordersData, 21600);
            }
        }
        updatePetStatus(id, "sold");
        adminRenderTable(ordersTableTemplate);
        bs4pop.notice('Order ' + id + ' sent successfully!',{type:'success'})
    }
}

function completeOrder(id) {
    if (confirm("Please confirm once again that you have received the package.")) {
        if (isExistOrdersForUser()) {
            let user = Storage.get("username");
            let ordersData = Storage.get(user);
            ordersData = ordersData.filter((item) => {
                return item.id !== id;
            });
            Storage.set(user, ordersData, 21600);
            document.getElementById(id).remove();
            displayOrderQuantity();
            bs4pop.notice('Order ' + id + ' completed successfully!',{type:'success'})
        }
    }
}

function cancelOrder(id) {
    if (confirm("Please confirm once again that you want to cancel the order.")) {
        updatePetStatus(id, "available");
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key !== "username") {
                let ordersData = Storage.get(key);
                ordersData = ordersData.filter((item) => {
                    return item.id !== id;
                });
                Storage.set(key, ordersData, 21600);
            }
        }
        document.getElementById(id).remove();
        displayOrderQuantity();
        bs4pop.notice('Order ' + id + ' cancelled successfully!',{type:'success'})
    }
}
