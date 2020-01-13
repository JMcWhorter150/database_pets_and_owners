const http = require('http');
const express = require('express');
const app = express();
const PORT = 3000;

const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({
    extended: true
});

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const server = http.createServer(app);

const pets = require('./models/pets');

const partials = {
    header: 'partials/header',
    footer: 'partials/footer'
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

// see all pets
app.get('/pets', async (req, res) => {
    const thePets = await pets.all();
    // res.send('you want /pets');
    res.json(thePets);
});

// create
app.get('/pets/create', (req, res) => {
    // const content = '/partials/form';
    let content;
    res.render('home', {
        locals: {
            content
        },
        partials: {
            header: 'partials/header',
            footer: 'partials/footer',
            content: 'partials/form'
        }
    })
})
app.post('/pets/create', parseForm, async (req, res) => {
    const { name, species, birthdate, owner_id } = req.body;
    const createPet = await pets.create(name, species, birthdate, owner_id);
    res.redirect('/pets');
});

// retrieve
app.get('/pets/:id', (req, res) => { // not async function so .thening
    pets.one(req.params.id)
    .then(thePet => res.send(thePet));
})

// update
app.get('/pets/:id/edit')
app.post('/pets/:id/edit')

// delete
app.get('/pets/:id/delete')
app.post('/pets/:id/delete')

server.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`)
});

