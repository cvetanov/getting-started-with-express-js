import express from 'express';
import fs from 'fs';
import {
  renderUsers,
  downloadUsers
} from "./handlers";
import { STATUS } from '../../constants';

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

// NOTE: mergeParams means that the express instance should in some way forward all params to this router
// the routes defined on the router will be prefixed
// with the string defined when configuring this router on the express instance
const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => renderUsers(req, res, users));

// NOTE: we can send a file to the user by using the response's `download` method
router.get('/data', downloadUsers);

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
router.get('/:username', verifyUser, ({ params: { username }}, res) => {
  const user = users[username];
  res.render('user', { user });
});

router.get('/invalid/:username', ({ params: { username }}, res) => {
  res.status(STATUS.NOT_FOUND).send(`User '${username}' not found`);
});

// NOTE: mutating the objects directly is not good practice
// state management is not the main topic of the course

// NOTE: for POST requests, juts use the `post` method on the express instance
router.post('/', ({ body }, res) => {
  const { username } = body;
  users[username] = body;
  res.sendStatus(STATUS.OK);
});

// NOTE: for PUT requests, juts use the `put` method on the express instance
router.put('/:username', ({ params: { username }, body }, res) => {
  const userToUpdate = users[username];
  users[username] = {
    ...userToUpdate,
    ...body
  };
  res.sendStatus(STATUS.OK);
});

// NOTE: for DELETE requests, juts use the `delete` method on the express instance
router.delete('/:username', ({ params: { username }}, res) => {
  delete users[username];
  res.sendStatus(STATUS.OK);
});

const path = '/users';
export {
  path,
  router
}
