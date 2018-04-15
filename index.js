import express from 'express';
import bodyParser from 'body-parser';

import { path as usersPath, router as usersRouter } from './routes/users';
import { STATUS } from './constants';

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

// NOTE: error-handling middleware is defined in the same way as other functions
// except that error-handling functions have 4 arguments (the first one being the error)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(STATUS.INTERNAL_SERVER_ERROR).send('Something broke!');
});

// NOTE: express has it's own built-in error-handling middleware which returns the exact error and a 500 HTTP status
// this feature of express is only available in non-production environments
// because it might contain server-specific data (such as folder structure)

const server = app.listen(3000, () => console.log(`Server running at localhost:${server.address().port}`));
