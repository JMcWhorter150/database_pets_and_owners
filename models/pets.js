const db = require(`./connection`);
const {convertDateToString} = require('./utils');

// Create
async function create(name, species, birthdate, owner_id) {
    const result = await db.result(`insert into pets (name, species, birthdate, owner_id) values ($1, $2, $3, $4)`, [name, species, birthdate, owner_id]);
    return result;
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
        const allPets = await db.query(`select * from pets order by id;`)
                // console.log(allPets);
                return allPets;
    } catch (err) {
        console.log(err);
        return [];
    }
}

// Update
async function update(id, name, species, birthdate) {
    const result = await db.result(`update pets set name=$2, species=$3, birthdate=$4 where id=$1;`, [id, name, species, birthdate]);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
}
// Delete

async function del(id) {
    const result = await db.result(`delete from pets where id=$1`, [id]);
    console.log(result);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
}

module.exports = {
    create,
    one,
    all,
    update,
    del
}