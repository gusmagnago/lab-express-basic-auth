'use strict';

const {
  Router
} = require('express');
const router = Router();
const User = require('./../models/user');
const bcrypt = require('bcryptjs');

const routeGuardMiddleware = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/authentication/sign-in'); 
  } else {
    next();
  }
};

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up')
});

router.post('/sign-up', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;


bcrypt.hash(password, 10)
  .then(hash => {
    return User.create({
      username,
      passwordHash: hash
    });
  })
  .then(user => {
    req.session.user = {
      _id: user._id
    };
    res.redirect('/private');
  })
  .catch(error => {
    console.log('There was an error in the sign-up process.', error);
  });
});

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post('sing-in', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  let auxiliaryUser;

  User.findOne({ username })
  .then(user => {
    if (!user) {
      throw new Error ('USER_NOT_FOUND');
    } else {
      auxiliaryUser = user;
      return bcrypt.compare(password, user.passwordHash);
    }
  })
  .then (matches => {
    if (!matches) {
      throw new Error ('PASSWORD_IS_INCORRECT!_-_TRY_AGAIN')
    } else {
      req.session.user = {
        _id: auxiliaryUser._id
      };
      res.redirect('private');
    }
  })
  .catch(error => {
    console.log('There was an error trying to go inside :C', error);
    next (error);
  });
});


router.get('/private', routeGuardMiddleware, (req, res, next) => {
  res.render('private');
});

module.exports = router;
