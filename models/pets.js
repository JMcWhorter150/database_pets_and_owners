const db = require(`./connection`);

// Create
function create() {

}

// Retrieve

// promise chain version
function one(id) {
    // use .one() when there should be exactly one result.
    // this works but is unsafe
    // return db.one(`select * from pets where id=${id}`)
    // $1 is syntax specific to pg-promise. It means interpolate the first value from the array
    // in this case, that's the `id` we received as an argument
    return db.one(`select * from pets where id=$1`, [id])
        .catch(err => {
            console.log(err);
            return [];
        });
}

// async version

async function all() {
    try {
        // .query and .any are the same function
        const allPets = await db.query(`select * from pets;`)
                console.log(allPets);
                return allPets;
    } catch (err) {
        console.log(err);
        return [];
    }
}

// Update
function update() {

}
// Delete

function del() {

}

module.exports = {
    create,
    one,
    all,
    update,
    del
}