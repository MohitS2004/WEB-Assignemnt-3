require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const userService = require('../user-service.js');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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
      const token = jwt.sign(payload, process.env.JWT_SECRET);
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

let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await userService.connect();
      isConnected = true;
    }
    return app(req, res);
  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: error.message });
  }
};
