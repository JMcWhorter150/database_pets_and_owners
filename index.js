const http = require('http');
const express = require('express');
const app = express();
const PORT = 3000;
const render = require('./render')
const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({
    extended: true
});
// This is the session management middleware created by the Express.js team
const session = require('express-session');
// Give us a modified version of the express team's session management software
// We want one that can save session info to a file on the hard drive
const FileStore = require('session-file-store')(session);
const owners = require('./models/owners');
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

app.use(session({
    store: new FileStore({}),
    // we will move this to a secure location shortly
    secret: 'myfavoritebandisridiculous132murderbydeath'
}));

// when we app.use(session), the session middleware adds the property 'req.session'
// as the user browses from page to page, their browser shows us a 'cookie',
// and the session middleware attaches that user's session info to the req.

// Let's see what's in the session
app.use((req, res, next) => {
    console.log('********');
    console.log(req.session);
    console.log('********');
    next();
})

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
    const result =  pets.update(id, name, species, birthdate);
    if (result) {
        res.redirect(`/pets/${id}`);
    } else {
        res.redirect(`/pets/${id}/edit`);
    }
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


// Login!
app.get('/login', (req, res) => {
    res.render('owners/auth');
})
app.post('/login', parseForm, async (req, res) => {
    const {name, password} = req.body;
    const didLogin = await owners.login(name, password);
    if (didLogin) {
        // assuming users have unique names:
        const theUser = await owners.getByUsername(name);

        // add some info to the user's session
        req.session.user = {
            name,
            id: theUser.id
        };
        req.session.save();
        console.log('yay! you logged in!');
        res.redirect('/profile');
    } else {
        console.log('boo! That is not correct');
    }

})
// "Profile" - list pets for this owner
app.get('/profile', (req, res) => {
    res.send(`Welcome back ${req.session.user.name}`)
})

server.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`)
});

