/********************************************************************************
* WEB422 - Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Mohit Solanki Student ID: 1331874232 Date: 26/11/2025
*
* Published URL: https://web-assignemnt-3.vercel.app/api/user
*
********************************************************************************/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const userService = require('./user-service.js');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await userService.getUser(jwtPayload.userName);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err);
    }
  })
);

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.json({ message: 'User API is running' });
});

app.post('/api/user/register', (req, res) => {
  userService.registerUser(req.body)
    .then(() => res.status(200).json({ message: 'user registered' }))
    .catch((err) => res.status(400).json({ message: err }));
});

app.post('/api/user/login', (req, res) => {
  userService.checkUser(req.body)
    .then((user) => {
      const payload = { _id: user._id, userName: user.userName };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ message: 'login successful', token });
    })
    .catch((err) => res.status(400).json({ message: err }));
});

app.get('/api/user/favourites',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    userService.getFavourites(req.user.userName)
      .then((favourites) => res.json(favourites))
      .catch((err) => res.status(400).json({ message: err }));
  }
);

app.put('/api/user/favourites/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    userService.addFavourite(req.user.userName, req.params.id)
      .then((favourites) => res.json(favourites))
      .catch((err) => res.status(400).json({ message: err }));
  }
);

app.delete('/api/user/favourites/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    userService.removeFavourite(req.user.userName, req.params.id)
      .then((favourites) => res.json(favourites))
      .catch((err) => res.status(400).json({ message: err }));
  }
);

userService.connect()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error(`Failed to connect to MongoDB: ${err}`);
  });

module.exports = app;
