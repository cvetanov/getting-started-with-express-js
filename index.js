import express from 'express';
import fs from 'fs';

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

app.get('/users', (req, res) => {
  const usersMarkup = Object.values(users).reduce(
    (acc, curr) => `${acc}<a href="/users/${curr.username}">${curr.name.first} ${curr.name.last}</a><br>`,
    ''
  );
  res.send(usersMarkup);
});

// NOTE: request mapping can be done using regular expressions as well
// the order of defining the routes is important
app.get(/big.*/, function (req, res, next) {
  console.log('BIG USER ACCESS');
  // `next()` forwards to the next route handler (if found)
  next();
});

// NOTE: colon signifies a path variable (in this case `:username`)
// path variables can be accessed from the req.params.<variableName>
app.get('/users/:username', ({ params: { username }}, res) => {
  res.send(users[username]);
});

const server = app.listen(3000, () => console.log(`Server running at localhost:${server.address().port}`));
