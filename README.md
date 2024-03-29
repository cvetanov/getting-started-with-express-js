# getting-started-with-express-js
Egghead course on Getting started with Express JS

Useful code snippets
- path variables
```
// NOTE: colon signifies a path variable (in this case `:username`)
// path variables can be accessed from the req.params.<variableName>
app.get('/users/:username', ({ params: { username }}, res) => {
  res.send(users[username]);
});
```

- regular expression matching routes
```
// NOTE: request mapping can be done using regular expressions as well
// the order of defining the routes is important
app.get(/big.*/, function (req, res, next) {
  console.log('BIG USER ACCESS');
  // `next()` forwards to the next route handler (if found)
  next();
});
```

- template engines
```
// NOTE: render view templates
// to specify in which folders will the views exist
// you can use `app.set('views', './views');`
// which is the same as the default value `process.cwd() + '/views'`
// view resolution can be done via either a default 'view engine' config
// or via concrete extension when specifying the view (e.g. res.render('users.pug'))
app.set('view engine', 'pug');

app.get('/users', (req, res) => {
  res.render('users', { users });
});
```

- Serving static files
```
// NOTE: serve static files via `express.static` middleware
// serve the 'images' folder and its contents on the '/images' url
app.use('/images', express.static('images'));
```

- Request Body parsing
```
// NOTE: use a body parser to be able to access the request's body
// in post/put operations
app.use(bodyParser.json());
```

- POST, PUT and DELETE methods
```
// NOTE: mutating the objects directly is not good practice
// state management is not the main topic of the course

// NOTE: for POST requests, juts use the `post` method on the express instance
app.post('/users', ({ body }, res) => {
  const { username } = body;
  users[username] = body;
  res.sendStatus(STATUS.OK);
});

// NOTE: for PUT requests, juts use the `put` method on the express instance
app.put('/users/:username', ({ params: { username }, body }, res) => {
  const userToUpdate = users[username];
  users[username] = {
    ...userToUpdate,
    ...body
  };
  res.sendStatus(STATUS.OK);
});

// NOTE: for DELETE requests, juts use the `delete` method on the express instance
app.delete('/users/:username', ({ params: { username }}, res) => {
  delete users[username];
  res.sendStatus(STATUS.OK);
});
```

- Add verification on a route
```
// NOTE: we can add verification by creating another handler which we can use on a given route
const verifyUser = ({ params: { username }}, res, next) => {
  const user = !!users[username];
  if (user) {
    next()
  } else {
    res.redirect(`/users/invalid/${username}`);
  }
};

app.get('/users/invalid/:username', ({ params: { username }}, res) => {
  res.status(STATUS.NOT_FOUND).send(`User '${username}' not found`);
});

app.get('/users/:username', verifyUser, getUserByUsername);
```

- Send a file to the user
```
// NOTE: we can send a file to the user by using the response's `download` method
app.get('/data/users', (req, res) => {
  res.download('./users.json');
});
```

- Define custom routers
```
// NOTE: `usersPath` will be a prefix for the routes defined in the `usersRouter` itself
app.use(usersPath, usersRouter);

// NOTE: mergeParams means that the express instance should in some way forward all params to this router
// the routes defined on the router will be prefixed
// with the string defined when configuring this router on the express instance
const router = express.Router({ mergeParams: true });
```

- Readable/Writable streams

The express response object is an enhanced version of Node's server response (from the native module `http`)
which in turn implements the `Writable Stream` interface, meaning we can pipe a readable stream to the express response
```
const readable = fs.createReadStream(sourceFileName);
const writable = fs.createWriteStream(destinationFileName);
// all data from file `sourceFileName` will be piped to the file `destinationFileName`
readable.pipe(writable); 

// NOTE: pipe data from a readable directly to the response
readable.pipe(res);
```

- Error-handling middleware
```

// NOTE: error-handling middleware is defined in the same way as other functions
// except that error-handling functions have 4 arguments (the first one being the error)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(STATUS.INTERNAL_SERVER_ERROR).send('Something broke!');
});

// NOTE: express has it's own built-in error-handling middleware which returns the exact error and a 500 HTTP status
// this feature of express is only available in non-production environments
// because it might contain server-specific data (such as folder structure)
```