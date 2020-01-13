const pets = require('./models/pets');

function main() {
    pets.one(1)
    .then(data => {
        console.log(data);
    })
}

main();