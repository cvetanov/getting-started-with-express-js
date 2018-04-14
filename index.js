import express from 'express';
import bodyParser from 'body-parser';

import { path as usersPath, router as usersRouter } from './routes/users';

const app = express();

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

// NOTE: request mapping can be done using regular expressions as well
// the order of defining the routes is important
app.get(/big.*/, function (req, res, next) {
  console.log('BIG ACCESS');
  // `next()` forwards to the next route handler (if found)
  next();
});

// NOTE: `usersPath` will be a prefix for the routes defined in the `usersRouter` itself
app.use(usersPath, usersRouter);

const server = app.listen(3000, () => console.log(`Server running at localhost:${server.address().port}`));
