const http = require('http');
const express = require('express');
const app = express();
const PORT = 3000;
const render = require('./render')
const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({
    extended: true
});
const {convertDateToString} = require('./models/utils');
const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const server = http.createServer(app);

const pets = require('./models/pets');

const partials = {
    header: 'partials/header',
    footer: 'partials/footer',
    nav: 'partials/nav'
};

app.get('/', (req, res) => {
    let content = '<h1>Hello!</h1>';
    res.render('home', {
        locals: {
            content
        },
        partials
    })
})

app.get('/pets', async (req, res) => {
    const thePets = await pets.all();
    let content = thePets.map(render.postPet).join('');
    res.render('home', {
        locals: {
            content
        },
        partials
    })
})

// see all pets
app.get('/pets/json', async (req, res) => {
    const thePets = await pets.all();
    // res.send('you want /pets');
    res.json(thePets);
});

// create
app.get('/pets/create', (req, res) => {
    // const content = '/partials/form';
    res.render('home', {
        locals: {
            name: "",
            species: "",
            birthdate: "",
            owner_id: ""
        },
        partials: {
            header: 'partials/header',
            footer: 'partials/footer',
            content: 'partials/create',
            nav: 'partials/nav'
        }
    })
})
app.post('/pets/create', parseForm, async (req, res) => {
    const { name, species, birthdate, owner_id } = req.body;
    const createPet = await pets.create(name, species, birthdate, owner_id);
    res.redirect('/pets');
});

// retrieve
// be careful with ordering of browser location. If this was before /pets/:id, the id would be create
// if you can't order things properly, then use the below which requires the id to be a number
app.get('/pets/:id(\\d+)', (req, res) => { // not async function so .thening
    pets.one(req.params.id)
    .then(function (thePet) {
        let content = render.postPetPage(thePet);
        res.render('home', {
            locals: {
                content
            },
            partials: {
                header: 'partials/header',
                footer: 'partials/footer',
                nav: 'partials/nav'
            }
        });
    })
})

// update
app.get('/pets/:id/edit', async (req, res) => {
    const { id } = req.params;
    const thePet = await pets.one(id);
    res.render('home', {
        locals: {
            name: `${thePet.name}`,
            species: `${thePet.species}`,
            birthdate: `${convertDateToString(thePet.birthdate)}`,
            owner_id: `${thePet.owner_id}`
        },
        partials: {
            header: 'partials/header',
            footer: 'partials/footer',
            content: 'partials/create',
            nav: 'partials/nav'
        }
    })
});
// need to play around with this
app.post('/pets/:id/edit', parseForm, async (req, res) => {
    const {id} = req.params;
    const { name, birthdate, species, owner_id } = req.body;
    await pets.update(id, name, species, birthdate);
    res.redirect('/pets');
})

// delete
app.get('/pets/:id/delete', (req, res) => {
    res.render('home', {
        partials: {
            header: 'partials/header',
            footer: 'partials/footer',
            nav: 'partials/nav',
            content: 'partials/delete'
        }
    });
})
app.post('/pets/:id/delete', parseForm, async (req, res) => {
    await pets.del(req.params.id);
    res.redirect('/pets');
})

server.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`)
});

