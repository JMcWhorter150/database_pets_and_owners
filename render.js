function postData(obj) {
    let result = `
    <h1>${obj.id}</h1>
    <li><a href="/pets/${obj.id}">${obj.name}</a></li>
    <li>${obj.species}</li>
    <li>${obj.birthdate}</li>
    <li>${obj.owner_id}</li>`
    return result;
}

module.exports = postData;