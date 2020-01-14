function postPet(obj) {
    let result = `
    <h1>${obj.id}</h1>
    <li><a href="/pets/${obj.id}">${obj.name}</a></li>
    <li>${obj.species}</li>
    <li>${obj.birthdate}</li>
    <li>${obj.owner_id}</li>`
    return result;
}

function postPetPage(obj) {
    let result = `
    <h1>${obj.id}</h1>
    <li>${obj.name}</li>
    <li>${obj.species}</li>
    <li>${obj.birthdate}</li>
    <li>${obj.owner_id}</li>
    <li><a href="/pets/${obj.id}/delete">Delete Pet</a></li>
    <li><a href="/pets/${obj.id}/edit">Rename Pet</a></li>`
    return result;
}

module.exports = {
    postPet,
    postPetPage
};