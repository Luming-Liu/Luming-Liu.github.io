const postPetUrl = 'https://petstore.swagger.io/v2/pet'

const messageTemplate = `<p id="msg" style="color: red;font-size: small" class="CLASS_WILL_GO_HERE">MESSAGE_WILL_GO_HERE</p>`;

function deleteMsg() {
  let msg = document.getElementById('msg');
  if (msg) {
    msg.remove();
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('nameInput').value;
  const category = document.getElementById("categoryInput").value;
  const tags = document.getElementById('tagsInput').value;
  const status = document.getElementById("statusInput").value;

  let tagsList = tags.split(',');
  let tagsArr = [];
  for (let i=0; i < tagsList.length; i++) {
    tagsArr.push({"id":0, "name":tagsList[i]});
  }

  let message = '';
  let isSuccess = true;

  if(name === ''){
    message = 'The name is required!';
    message = false;
    return;
  }
  if(category === ''){
    message = 'The category is required!';
    message = false;
    return;
  }
  if(tags === ''){
    message = 'The tags is required!';
    message = false;
    return;
  }
  if(status === ''){
    message = 'The status is required!';
    message = false;
    return;
  }
  fetch(postPetUrl, {
    headers: { 'Content-Type': 'application/json'},
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
    message = false;
    console.error(e);
  }).finally(() => {
    let messageHTML = messageTemplate;
    messageHTML = messageHTML.replace('MESSAGE_WILL_GO_HERE', message);
    messageHTML = messageHTML.replace('CLASS_WILL_GO_HERE', `message ${isSuccess ? 'success' : 'error'}`);

    document.getElementById('messageBox').innerHTML = messageHTML;
  });
}

document.getElementById('addPetForm').addEventListener('submit', handleSubmit, true);
