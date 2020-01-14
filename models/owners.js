const bcrypt = require('bcryptjs');
const db = require('./connection');

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
async function login(username, password) {
    // const userObj = userDb.find(userObj => userObj.username == username);
    const userObj = await getByUsername(username);
    return bcrypt.compareSync(password, userObj.hash)
}

async function getByUsername(username) {
    const theUser = await db.one(`select * from owners where name=$1;`, [username])
    return theUser;
}

function getById(id) {

}

// update

// delete
module.exports = {
    create,
    login
};