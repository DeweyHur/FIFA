let _ = require('lodash');
let User = require('../models/user');

exports.getMe = (req, res) => {
  const user = _.get(req, 'session.passport.user');
  if (user) {
    res.send(user).status(200);
  } else {
    res.sendStatus(401);
  }
};

exports.getUser = async (req, res) => {
  try {
    const userid = _.get(req, 'params.userid');
    const user = await User.findById(userid).lean();
    res.send(user).status(200);
  } catch (e) {
    res.sendStatus(404);
  }
}

exports.createUser = (email, name) => {
  return User.find({ _id: email })
    .then((users) => {
      let user = users && users.length > 0 ? users[0] : null;
      if (user) {
        console.log(`User Signed in: ${user.name}(${user._id})`);
        return user;
      } else {
        user = new User({ _id: email, name });
        return user.save()
          .then(createdUser => {
            console.log(`User Created: ${createdUser.name}(${createdUser._id})`);
            return user;
          })
          .catch(err => {
            console.error(`User Creation Failed: ${name}(${email})`, err);
            throw err;
          });
      }
    })
    .catch(err => {
      console.error(`Bad email: ${email}`);
      throw err;
    });
}