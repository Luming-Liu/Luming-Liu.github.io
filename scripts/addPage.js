const postPetUrl = 'https://petstore.swagger.io/v2/pet'

const messageTemplate = `<p id="msg" style="color: red;font-size: small" class="CLASS_WILL_GO_HERE">MESSAGE_WILL_GO_HERE</p>`;

function deleteMsg() {
  let msg = document.getElementById('msg');
  if (msg) {
    msg.remove();
  }
}

function handleSubmit(event) {
  if (isAdminLogin()) {
    event.preventDefault();
    const name = document.getElementById('nameInput').value;
    const category = document.getElementById("categoryInput").value;
    const tags = document.getElementById('tagsInput').value;
    let statusElement = document.getElementById('statusInput');
    let status = "available";

    if (statusElement) {
      status = statusElement.value;
    }

    let tagsList = tags.split(',');
    let tagsArr = [];
    for (let i = 0; i < tagsList.length; i++) {
      tagsArr.push({"id": 0, "name": tagsList[i]});
    }

    let message = '';
    let isSuccess = true;

    if (name === '') {
      message = 'The name is required!';
      isSuccess = false;
      let messageHTML = messageTemplate;
      messageHTML = messageHTML.replace('MESSAGE_WILL_GO_HERE', message);
      messageHTML = messageHTML.replace('CLASS_WILL_GO_HERE', `message ${isSuccess ? 'success' : 'error'}`);
      document.getElementById('messageBox').innerHTML = messageHTML;
      return;
    }
    if (category === '') {
      message = 'The category is required!';
      isSuccess = false;
      let messageHTML = messageTemplate;
      messageHTML = messageHTML.replace('MESSAGE_WILL_GO_HERE', message);
      messageHTML = messageHTML.replace('CLASS_WILL_GO_HERE', `message ${isSuccess ? 'success' : 'error'}`);
      document.getElementById('messageBox').innerHTML = messageHTML;
      return;
    }
    if (tags === '') {
      message = 'The tags is required!';
      isSuccess = false;
      let messageHTML = messageTemplate;
      messageHTML = messageHTML.replace('MESSAGE_WILL_GO_HERE', message);
      messageHTML = messageHTML.replace('CLASS_WILL_GO_HERE', `message ${isSuccess ? 'success' : 'error'}`);
      document.getElementById('messageBox').innerHTML = messageHTML;
      return;
    }

    fetch(postPetUrl, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({
        "id": new Date().getTime(),
        "name": name,
        "category": {
          "id": 0,
          "name": category
        },
        "tags": tagsArr,
        "status": status
      })
    }).then((response) => response.json())
        .then((createdPet) => {
          message = `Pet has been created with id: ${createdPet.id}`;
          isSuccess = true;
        }).catch((e) => {
      message = 'Something went wrong! Could not add the pet.';
      isSuccess = false;
      console.error(e);
    }).finally(() => {
      let messageHTML = messageTemplate;
      messageHTML = messageHTML.replace('MESSAGE_WILL_GO_HERE', message);
      messageHTML = messageHTML.replace('CLASS_WILL_GO_HERE', `message ${isSuccess ? 'success' : 'error'}`);

      document.getElementById('messageBox').innerHTML = messageHTML;
    });
  }
  else {
    alert("No permission! Please login as admin.");
    event.preventDefault();
    return;
  }
}

document.getElementById('addPetForm').addEventListener('submit', handleSubmit, true);
