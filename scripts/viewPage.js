$(function () {
    requestStatus('available');
});

function requestStatus(status) {
    document.getElementById("categoryDropdown").innerText = "All pets";
    document.getElementById("navbarDropdown").innerText = status[0].toUpperCase() + status.slice(1);

    const petListObjectTemplate = `
      <div class="col mb-5 pet-display" id="PET_ID_WILL_GO_HERE">PET_CATEGORY_WILL_GO_HERE
        <div class="card h-100">
          <!-- Product image-->
          <img class="card-img-top" src="img/pet_exampleIMAGE_NUM.jpeg" alt="..." />
          <button class="btn" style="position: absolute" onClick="handleDelete(PET_ID_WILL_GO_HERE)">
            <i class="bi-trash-fill me-1"></i>
          </button>
          <!-- Product details-->
          <div class="card-body p-4" onclick="openDetail(this)" style="cursor: pointer">
            <div class="text-center">
            <!-- Product name-->
            <h5 class="fw-bolder">PET_NAME_WILL_GO_HERE</h5>
            <!-- Product price-->
            PET_TAGS_WILL_GO_HERE
            </div>
          </div>
          <!-- Product actions-->
            BUY_BUTTON_STATUS
        </div>
      </div>
    `;

    const petListObjectTagTemplate = `
      <span class="badge rounded-pill bg-PET_TAG_STYLE">PET_TAG_WILL_GO_HERE</span>
    `
    const getPetsUrl = 'https://petstore.swagger.io/v2/pet/findByStatus?status=' + status;

    const badgeList = ["primary","success","danger","warning","info","dark"]

    fetch(getPetsUrl, {headers: {'Content-Type': 'application/json'}})
        .then((response) => response.json())
        .then((pets) => {
            let petsHTML = '';

            pets.forEach((pet) => {
                if (pet.hasOwnProperty("category")) {
                    if (pet.category.hasOwnProperty("name")) {

                        let petTags = '';
                        let buttonHTML = '';

                        if (status === "pending")
                            buttonHTML += '<a class="btn btn-warning mt-auto disabled" href="#">PENDING</a>';
                        else if (status === "sold")
                            buttonHTML += '<a class="btn btn-danger mt-auto disabled" href="#">SOLD</a>';

                        if (Array.isArray(pet.tags)) {
                            let index = 0;
                            pet.tags.forEach((tag) => {
                                if (
                                    typeof tag === 'object' &&
                                    tag !== null &&
                                    Object.prototype.hasOwnProperty.call(tag, 'name') &&
                                    typeof tag.name === 'string') {
                                    petTags += petListObjectTagTemplate.replace('PET_TAG_WILL_GO_HERE', tag.name)
                                    petTags = petTags.replace('PET_TAG_STYLE', badgeList[index])
                                    if (index < (badgeList.length - 1))
                                        index++;
                                    else
                                        index = 0;
                                }
                            });
                        }

                        let petHTML = petListObjectTemplate;
                        let categoryHTML = '<p hidden>' + pet.category.name + '</p>'
                        // We use the regular expression in this case to cover multiple occurrences in text.
                        petHTML = petHTML.replace(/PET_ID_WILL_GO_HERE/g, pet.id)
                        petHTML = petHTML.replace('PET_NAME_WILL_GO_HERE', pet.name)
                        petHTML = petHTML.replace('PET_TAGS_WILL_GO_HERE', petTags)
                        petHTML = petHTML.replace('BUY_BUTTON_STATUS', buttonHTML)
                        petHTML = petHTML.replace('PET_CATEGORY_WILL_GO_HERE', categoryHTML)
                        // Random images
                        let imageNum = Math.floor(Math.random()*10).toString();
                        petHTML = petHTML.replace('IMAGE_NUM', imageNum)

                        petsHTML += petHTML;
                    }
                }
            })

            document.getElementById('viewPage').innerHTML = petsHTML;
        })
        .catch((error) => {
            console.error(error);
        });
}

const deletePetUrl = 'https://petstore.swagger.io/v2/pet/';

function handleDelete(id) {
    if (isAdminLogin()) {
        const pathForDeleteRequest = deletePetUrl + id;
        fetch(pathForDeleteRequest, {
            headers: {'Content-Type': 'application/json'},
            method: 'DELETE'
        })
            .then(response => {
                if (response.status === 404) {
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
                if (error.message) {
                    alert(error.message);
                }
            })
    }
    else
        alert("No permission! Please login as admin.");
}
