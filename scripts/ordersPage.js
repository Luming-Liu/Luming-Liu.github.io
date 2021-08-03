$(function () {
    const ordersTableTemplate = `
        <tr id="ORDER_ID">
            <th scope="row">SERIAL_NUM</th>
            <td>ORDER_ID</td>
            <td>PET_NAME</td>
            <td>QUANTITY</td>
            <td>SHIP_DATE</td>
            <td>STATUS</td>
            <td><button class="btn btn-outline-success" onClick="completeOrder(ORDER_ID)">Confirm receipt</button>
                <button class="btn btn-outline-danger" onClick="deleteOrder(ORDER_ID)">Delete order</button>
            </td>
        </tr>
    `;
    if (isExistOrders()) {
        let ordersData = JSON.parse(localStorage.getItem(localStorage.getItem("username")));
        let count = 1;
        let ordersHTML = '';

        ordersData.forEach((order) => {
            let orderHTML = ordersTableTemplate;
            orderHTML = orderHTML.replace(/SERIAL_NUM/g, count)
            orderHTML = orderHTML.replace(/ORDER_ID/g, order.id)
            orderHTML = orderHTML.replace(/PET_NAME/g, order.petName)
            orderHTML = orderHTML.replace(/QUANTITY/g, order.petQuantity)
            orderHTML = orderHTML.replace(/SHIP_DATE/g, order.shipDate)
            orderHTML = orderHTML.replace(/STATUS/g, order.status)

            count++;
            ordersHTML += orderHTML;
        })

        document.getElementById("orderTable").innerHTML = ordersHTML;
    }
});

function goBack() {
    history.go(-1);
}

function isExistOrders() {
    let user = localStorage.getItem("username");
    if (user) {
        let orders = localStorage.getItem(user);
        return !!orders;
    } else return false;
}

function completeOrder(id) {
    if (isExistOrders()) {
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

function deleteOrder(id) {
    if (isExistOrders()) {
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
