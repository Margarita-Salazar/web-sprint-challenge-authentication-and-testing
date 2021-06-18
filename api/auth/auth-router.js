const router = require('express').Router();

const Users = require('../users/user-model');

const { checkPayload, checkCredentials, checkUsername } = require('../middleware/auth-middleware');

router.post('/register', checkPayload, checkUsername, (req, res, next) => {
  let { username, password } = req.body;

  password = req.hash;

  Users.add({ username, password })
    .then(user => {
      res.status(201).json(user);
    })
    .catch(next);
});

router.post('/login', checkPayload, checkCredentials, (req, res) => {
  const { username } = req.body;

  res.status(200).json({ message: `welcome, ${username}`, token: req.token });

});

module.exports = router;
