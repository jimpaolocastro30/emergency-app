const User = require('../models/citizenUser');
const Ereporting = require('../models/emergencyReporting')

const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    // console.log(req.body);
    User.findOne({ username: req.body.username }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                err: 'Email is taken'
            });
        }

        const { username, firstName, lastName, email,type,language,religion,yellowCardControlNumber,govtIdImage, mobileNumber, password  } = req.body;
        let DateCreated = new Date();
        console.log(DateCreated)
        let newUser = new User({ username, firstName, lastName, email,type,language,religion,yellowCardControlNumber,govtIdImage, mobileNumber, password});
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }

            res.json({
                message: 'Signup success! Please signin.'
            });
        });
    });
};

exports.signin = (req, res) => {
  const { username, password } = req.body;
  // check if user exist
  User.findOne({ username }).exec((err, user) => {
      console.log("dasda", user)
      if (err || !user) {
          return res.status(400).json({
              error: 'User with that mobile does not exist. Please signup.'
          });
      }
      // authenticate
      if (!user.authenticate(password)) {
          return res.status(400).json({
              error: 'mobile number and password do not match.'
          });
      }
      // generate a token and send to client
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.cookie('token', token, { expiresIn: '1d' });
      const { _id, username, firstName, lastName, email, mobileNumber, govtIdImage} = user;
      return res.json({
          token,
          user: { _id, username, firstName, lastName, email, mobileNumber, govtIdImage}
      });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
      message: 'Signout success'
  });
};

exports.requireSigninUser = expressJwt({
  secret: process.env.JWT_SECRET
});

exports.citizenMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId }).exec((err, user) => {
      if (err || !user) {
          return res.status(400).json({
              error: 'User not found'
          });
      }
      req.profile = user;
      next();
  });
};


exports.emergencyReport = (req, res) => {
  const { reportNumber, emergencyCategory, citizenDetails, dateTime} = req.body;
  let completeId = new Ereporting({ reportNumber, emergencyCategory, citizenDetails, dateTime });
    console.log("dasdada   :" + JSON.stringify(req.body))

  completeId.save((err, data) => {
      if (err) {
          return res.status(400).json({
              error: err.errmsg
          });
      }

      res.json('Success : Added emergency!'); // dont do this res.json({ tag: data });
  });
};


exports.getAllEmergency = (req, res) => {
    const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    Ereporting.count({}).exec((err, total) => {
    Ereporting.find({}).exec((err, allUser) => {
        if (err) {
            return res.status(400).json({
                error: 'inventory not found'
            });
        }
        res.json({
            "identifier": "get all user list", allUser,  pagination, page, total
        });
    });
});
};

exports.getOneEmergency = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Ereporting.findOne({ reportNumber: slug }).exec((err, players) => {
        if (err) {
            return res.status(400).json({
                error: 'USER not found'
            });
        }
        res.json(players);
    });
};


