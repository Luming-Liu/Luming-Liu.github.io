const postPetUrl = 'https://petstore.swagger.io/v2/pet'

const messageTemplate = `<p class="CLASS_WILL_GO_HERE">MESSAGE_WILL_GO_HERE</p>`;

function handleSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('nameInput').value;
  let message = '';
  let isSuccess = true;
  if(name === ''){
    message = 'The name is required!';
    message = false;
    return;
  }
  fetch(postPetUrl, {
    headers: { 'Content-Type': 'application/json'},
    method: 'POST',
    body: JSON.stringify({
      name: name
    })
  }).then((response) => response.json())
    .then((createdPet) => {
    message = `Pet has been created with id: ${createdPet.id}!`;
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