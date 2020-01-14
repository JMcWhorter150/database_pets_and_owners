const bcrypt = require('bcryptjs');

function createHash(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}


//create
function create(username, password) {
    const hash = createHash(password);
    const newUser = {
        username,
        hash
    }
    console.log(newUser);
}
// retrieve
function login(username, password) {
    // const userObj = userDb.find(userObj => userObj.username == username);
    const userObj = getByUsername(username);
    return bcrypt.compareSync(password, userObj.hash)
}

function getByUsername(username) {

}

function getById(id) {

}

// update

// delete
module.exports = {
    create,
    login
};