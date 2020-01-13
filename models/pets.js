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
async function updateName(id, name) {
    const result = await db.result(`update pets set name=$1 where id=$2;`, [name, id]);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
}

async function updateBirthdate(id, dateObject) {
    // Postgres wants this `2020-01-13`
    const year = dateObject.getFullYear(); // YYYY
    let month = dateObject.getMonth() + 1; // MM
    if (month < 10) {
        month = `0${month}`;
    }
    let day = dateObject.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    const dateString = `${year}-${month}-${day}`;
    const result = await db.result(`update pets set birthdate=$1 where id=$2`, [dateString, id]);
    return result;
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
    updateName,
    updateBirthdate,
    del
}