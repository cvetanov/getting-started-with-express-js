import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();

let users = [];
fs.readFile('users.json', (err, data) => {
  if (err) {
    throw err;
  }

  const readUsers = JSON.parse(data);
  users = readUsers.reduce((acc, curr) => ({
    ...acc,
    [curr.username]: curr
  }), {});
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

// NOTE: render view templates
// to specify in which folders will the views exist
// you can use `app.set('views', './views');`
// which is the same as the default value `process.cwd() + '/views'`
// view resolution can be done via either a default 'view engine' config
// or via concrete extension when specifying the view (e.g. res.render('users.pug'))
app.set('view engine', 'pug');

// NOTE: serve static files via `express.static` middleware
// serve the 'images' folder and its contents on the '/images' url
app.use('/images', express.static('images'));

// NOTE: use a body parser to be able to access the request's body
// in post/put operations
app.use(bodyParser.json());

app.get('/users', (req, res) => {
  res.render('users', { users });
});

// NOTE: request mapping can be done using regular expressions as well
// the order of defining the routes is important
app.get(/big.*/, function (req, res, next) {
  console.log('BIG USER ACCESS');
  // `next()` forwards to the next route handler (if found)
  next();
});

// NOTE: we can add verification by creating another handler which we can use on a given route
const verifyUser = ({ params: { username }}, res, next) => {
  const user = !!users[username];
  if (user) {
    next()
  } else {
    res.redirect(`/users/invalid/${username}`);
  }
};

// NOTE: colon signifies a path variable (in this case `:username`)
// path variables can be accessed from the req.params.<variableName>
app.get('/users/:username', verifyUser, ({ params: { username }}, res) => {
  const user = users[username];
  res.render('user', { user });
});

// NOTE: we can send a file to the user by using the response's `download` method
app.get('/data/users', (req, res) => {
  res.download('./users.json');
});


const STATUS_NOT_FOUND = 404;
app.get('/users/invalid/:username', ({ params: { username }}, res) => {
  res.status(STATUS_NOT_FOUND).send(`User '${username}' not found`);
});

// NOTE: mutating the objects directly is not good practice
// state management is not the main topic of the course
const STATUS_OK = 200;

// NOTE: for POST requests, juts use the `post` method on the express instance
app.post('/users', ({ body }, res) => {
  const { username } = body;
  users[username] = body;
  res.sendStatus(STATUS_OK);
});

// NOTE: for PUT requests, juts use the `put` method on the express instance
app.put('/users/:username', ({ params: { username }, body }, res) => {
  const userToUpdate = users[username];
  users[username] = {
    ...userToUpdate,
    ...body
  };
  res.sendStatus(STATUS_OK);
});

// NOTE: for DELETE requests, juts use the `delete` method on the express instance
app.delete('/users/:username', ({ params: { username }}, res) => {
  delete users[username];
  res.sendStatus(STATUS_OK);
});

const server = app.listen(3000, () => console.log(`Server running at localhost:${server.address().port}`));
