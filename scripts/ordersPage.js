const ordersTableTemplate = `
        <tr id="ORDER_ID">
            <th scope="row">SERIAL_NUM</th>
            <td>ORDER_ID</td>
            <td>USER_NAME</td>
            <td>PET_NAME</td>
            <td>QUANTITY</td>
            <td>SHIP_DATE</td>
            <td>STATUS</td>
            <td><button class="btn BUTTON_STYLE IS_DISABLED" onClick="ORDER_PROCESS(ORDER_ID)">BUTTON_COLOR</button>
                <button class="btn btn-outline-danger" onClick="cancelOrder(ORDER_ID)">Cancel order</button>
            </td>
        </tr>
    `;

$(function () {
    if (isAdminLogin()) {
        adminRenderTable(ordersTableTemplate);
    }
    else {
        if (isExistOrdersForUser()) {
            let username = localStorage.getItem("username");
            let ordersData = JSON.parse(localStorage.getItem(username));
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
                    orderHTML = orderHTML.replace(/BUTTON_COLOR/g, "Wait for Shipping")
                    orderHTML = orderHTML.replace(/BUTTON_STYLE/g, "btn-outline-primary")
                    orderHTML = orderHTML.replace(/IS_DISABLED/g, "disabled")
                }
                else {
                    orderHTML = orderHTML.replace(/BUTTON_COLOR/g, "Confirm receipt")
                    orderHTML = orderHTML.replace(/BUTTON_STYLE/g, "btn-outline-success")
                    orderHTML = orderHTML.replace(/IS_DISABLED/g, '')
                }

                count++;
                ordersHTML += orderHTML;
            })

            document.getElementById("orderTable").innerHTML = ordersHTML;
        }
    }
});

function adminRenderTable(templete) {
    for (let i=0; i<localStorage.length; i++) {
        let key = localStorage.key(i);
        let count = 1;
        if (key !== "username") {
            let ordersData = JSON.parse(localStorage.getItem(key));
            let ordersHTML = '';

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
                    orderHTML = orderHTML.replace(/BUTTON_COLOR/g, "Confirm Shipping")
                    orderHTML = orderHTML.replace(/BUTTON_STYLE/g, "btn-outline-success")
                    orderHTML = orderHTML.replace(/IS_DISABLED/g, '')
                }
                else {
                    orderHTML = orderHTML.replace(/BUTTON_COLOR/g, "Product is shipping")
                    orderHTML = orderHTML.replace(/BUTTON_STYLE/g, "btn-outline-primary")
                    orderHTML = orderHTML.replace(/IS_DISABLED/g, 'disabled')
                }

                count++;
                ordersHTML += orderHTML;
            })

            document.getElementById("orderTable").innerHTML = ordersHTML;

        }
    }
}

function isExistOrdersForUser() {
    let user = localStorage.getItem("username");
    if (user) {
        let orders = localStorage.getItem(user);
        return !!orders;
    } else return false;
}

function shipOrder(id) {
    for (let i=0; i<localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key !== "username") {
            let ordersData = JSON.parse(localStorage.getItem(key));
            for (let j=0; j<ordersData.length; j++) {
                if (id === ordersData[j].id) {
                    ordersData[j].status = "shipping";
                    break;
                }
            }
            localStorage.setItem(key, JSON.stringify(ordersData));
            break;
        }
    }
    adminRenderTable(ordersTableTemplate);
}

function completeOrder(id) {
    if (isExistOrdersForUser()) {
        let user = localStorage.getItem("username");
        let ordersData = JSON.parse(localStorage.getItem(user));
        ordersData = ordersData.filter((item)=>{
            return item.id !== id;
        });
        localStorage.setItem(user, JSON.stringify(ordersData));
        alert('Order ' + id + ' completed!')
        document.getElementById(id).remove();
        displayOrderQuantity();
    }
}

function cancelOrder(id) {
    if (isExistOrdersForUser()) {
        let user = localStorage.getItem("username");
        let ordersData = JSON.parse(localStorage.getItem(user));
        ordersData = ordersData.filter((item)=>{
            return item.id !== id;
        });
        localStorage.setItem(user, JSON.stringify(ordersData));
        alert('Order ' + id + ' deleted!')
        document.getElementById(id).remove();
        displayOrderQuantity();
    }
}
