const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.set('strictQuery', true);

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true
  },
  password: String,
  favourites: [String]
});

let UserModel;

const connect = () => new Promise((resolve, reject) => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    reject('MONGO_URL not set in environment');
    return;
  }

  mongoose.connect(mongoUrl)
    .then(() => {
      UserModel = mongoose.model('users', userSchema);
      resolve();
    })
    .catch((err) => reject(err));
});

const registerUser = (userData) => new Promise((resolve, reject) => {
  if (!userData?.userName || !userData?.password || !userData?.password2) {
    reject('Missing required user information');
    return;
  }

  if (userData.password !== userData.password2) {
    reject('Passwords do not match');
    return;
  }

  bcrypt.hash(userData.password, 10)
    .then((hash) => {
      const newUser = new UserModel({
        userName: userData.userName,
        password: hash,
        favourites: []
      });

      return newUser.save();
    })
    .then(() => resolve())
    .catch((err) => {
      if (err.code === 11000) {
        reject('User Name already taken');
      } else {
        reject(`There was an error creating the user: ${err}`);
      }
    });
});

const checkUser = (userData) => new Promise((resolve, reject) => {
  if (!userData?.userName || !userData?.password) {
    reject('Missing credentials');
    return;
  }

  UserModel.findOne({ userName: userData.userName }).exec()
    .then((user) => {
      if (!user) {
        reject(`Unable to find user: ${userData.userName}`);
        return null;
      }
      return bcrypt.compare(userData.password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            reject(`Incorrect Password for user: ${userData.userName}`);
            return null;
          }
          resolve(user);
          return null;
        });
    })
    .catch((err) => reject(`Unable to find user: ${err}`));
});

const getUser = (userName) => UserModel.findOne({ userName }).select('-password').exec();

const getFavourites = (userName) => new Promise((resolve, reject) => {
  UserModel.findOne({ userName }).select('favourites').lean().exec()
    .then((user) => {
      if (!user) {
        reject(`Unable to find user: ${userName}`);
        return;
      }
      resolve(user.favourites ?? []);
    })
    .catch((err) => reject(`Unable to fetch favourites: ${err}`));
});

const addFavourite = (userName, favouriteId) => new Promise((resolve, reject) => {
  if (!favouriteId) {
    reject('Missing favourite id');
    return;
  }

  UserModel.findOneAndUpdate(
    { userName },
    { $addToSet: { favourites: favouriteId } },
    { new: true }
  ).select('favourites').lean().exec()
    .then((user) => {
      if (!user) {
        reject(`Unable to find user: ${userName}`);
        return;
      }
      resolve(user.favourites ?? []);
    })
    .catch((err) => reject(`Unable to update favourites: ${err}`));
});

const removeFavourite = (userName, favouriteId) => new Promise((resolve, reject) => {
  if (!favouriteId) {
    reject('Missing favourite id');
    return;
  }

  UserModel.findOneAndUpdate(
    { userName },
    { $pull: { favourites: favouriteId } },
    { new: true }
  ).select('favourites').lean().exec()
    .then((user) => {
      if (!user) {
        reject(`Unable to find user: ${userName}`);
        return;
      }
      resolve(user.favourites ?? []);
    })
    .catch((err) => reject(`Unable to update favourites: ${err}`));
});

module.exports = {
  connect,
  registerUser,
  checkUser,
  getUser,
  getFavourites,
  addFavourite,
  removeFavourite
};
