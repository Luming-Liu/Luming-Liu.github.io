$(function () {
    requestStatus('available');
});

function requestStatus(status) {
    const petListObjectTemplate = `
      <div class="col mb-5" id="PET_ID_WILL_GO_HERE">
        <div class="card h-100">
          <!-- Product image-->
          <img class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
          <button class="btn" style="position: absolute" onClick="handleDelete(PET_ID_WILL_GO_HERE)">
            <i class="bi-trash-fill me-1"></i>
          </button>
          <!-- Product details-->
          <div class="card-body p-4">
            <div class="text-center">
            <!-- Product name-->
            <h5 class="fw-bolder">PET_NAME_WILL_GO_HERE</h5>
            <!-- Product price-->
            PET_TAGS_WILL_GO_HERE
            </div>
          </div>
          <!-- Product actions-->
          <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center">BUY_BUTTON_STATUS</div>
          </div>
        </div>
      </div>
    `;

    const petListObjectTagTemplate = `
      <span class="tag">PET_TAG_WILL_GO_HERE</span>
    `
    const getPetsUrl = 'https://petstore.swagger.io/v2/pet/findByStatus?status=' + status;

    fetch(getPetsUrl, {headers: {'Content-Type': 'application/json'}})
        .then((response) => response.json())
        .then((pets) => {
            let petsHTML = '';

            pets.forEach((pet) => {
                let petTags = '';
                let buttonHTML = '';

                if (status === "available")
                    buttonHTML += '<a class="btn btn-outline-success mt-auto" href="#">BUY</a>';
                else if (status === "pending")
                    buttonHTML += '<a class="btn btn-warning mt-auto disabled" href="#">PENDING</a>';
                else
                    buttonHTML += '<a class="btn btn-danger mt-auto disabled" href="#">SOLD</a>';

                if (Array.isArray(pet.tags)) {
                    pet.tags.forEach((tag) => {
                        if (
                            typeof tag === 'object' &&
                            tag !== null &&
                            Object.prototype.hasOwnProperty.call(tag, 'name') &&
                            typeof tag.name === 'string') {
                            petTags += petListObjectTagTemplate.replace('PET_TAG_WILL_GO_HERE', tag.name)
                        }
                    });
                }

                let petHTML = petListObjectTemplate;
                // We use the regular expression in this case to cover multiple occurrences in text.
                petHTML = petHTML.replace(/PET_ID_WILL_GO_HERE/g, pet.id)
                petHTML = petHTML.replace('PET_NAME_WILL_GO_HERE', pet.name)
                petHTML = petHTML.replace('PET_TAGS_WILL_GO_HERE', petTags)
                petHTML = petHTML.replace('BUY_BUTTON_STATUS', buttonHTML)

                petsHTML += petHTML;

            })

            document.getElementById('viewPage').innerHTML = petsHTML;
        })
        .catch((error) => {
            console.error(error);
        });
}

const deletePetUrl = 'https://petstore.swagger.io/v2/pet/';

function handleDelete(id) {
  const pathForDeleteRequest = deletePetUrl + id;
  fetch(pathForDeleteRequest, {
    headers: {'Content-Type': 'application/json'},
    method: 'DELETE'
  })
    .then(response => {
      if(response.status === 404){
        alert('The pet could not be found!')
      } else {
        response.json()
          .then(() => {
            alert('Pet deleted!')
            document.getElementById(id).remove();
          });
      }
    })
    .catch((error) => {
      if(error.message){
        alert(error.message);
      }
    })
}
