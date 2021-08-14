const User = require('../models/dispatcherRespondentUser');
const dpReporting = require('../models/dispatcherReporting');
const eReporting = require('../models/emergencyReporting');
const rReporting = require('../models/respondentReporting');
const citizenUser = require('../models/citizenUser');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    // console.log(req.body);
    User.findOne({ username: req.body.email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                err: 'Email is taken'
            });
        }

        const { username, firstName, lastName, mobileNumber, email, password,role,about } = req.body;
        let username = shortId.generate();
        let DateCreated = new Date();
        console.log(DateCreated)
        let newUser = new User({ username, firstName, lastName, mobileNumber, email, password,role,about,DateCreated});
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            // res.json({
            //     user: success
            // });
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
      const { _id, username, firstName, lastName, email, mobileNumber, role} = user;
      return res.json({
          token,
          user: {_id, username,firstName, lastName, email, mobileNumber, role}
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

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({ _id: adminUserId }).exec((err, user) => {
      if (err || !user) {
          return res.status(400).json({
              error: 'User not found'
          });
      }

      if (user.role !== 0) {
          return res.status(400).json({
              error: 'Admin resource. Access denied'
          });
      }
      
      req.profile = user;
      next();
  });
};

exports.dispatcherMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({ _id: adminUserId }).exec((err, user) => {
      if (err || !user) {
          return res.status(400).json({
              error: 'User not found'
          });
      }

      if (user.role !== 1) {
          return res.status(400).json({
              error: 'Dispatcher resource. Access denied'
          });
      }
      
      req.profile = user;
      next();
  });
};


exports.respondentMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({ _id: adminUserId }).exec((err, user) => {
      if (err || !user) {
          return res.status(400).json({
              error: 'User not found'
          });
      }

      if (user.role !== 2) {
          return res.status(400).json({
              error: 'Respondent resource. Access denied'
          });
      }
      
      req.profile = user;
      next();
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


exports.emergencyReport = (req, res) => {
    const { reportNumber, emergencyCategory, citizenDetails, dateTime, status} = req.body;
   
    let emergencyId = new eReporting({ reportNumber, emergencyCategory, citizenDetails, dateTime, status });
  
  
    emergencyId.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: err.errmsg
            });
        }
        
        res.json('Success : Added emergency!'); // dont do this res.json({ tag: data });
    });
  };

  exports.getEmergencyReportList = (req, res) => {

    const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    eReporting.count({}).exec((err, total) => {
        eReporting.find({}).skip((page - 1) * pagination).limit(pagination).exec((err, tag) => {
            if (err) {
                return res.status(400).json({
                    error: 'completed item not found'
                });
            }
            res.json({
                "identifier": "get all Completed order list", tag,
                pagination, page, total
            });
        });
    });
};

exports.getEmergencyReport = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    eReporting.findOne({ _id: slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'product not found'
            });
        }
        res.json(tag);
    });
};

exports.respondentReport = (req, res) => {
  const { dispatcherDetails, emergencyReportDetails, citizenDetails, dispatcherUserId, respondentId, remarks, status} = req.body;
  let repondentReportId = new rReporting({ dispatcherDetails, emergencyReportDetails, citizenDetails, dispatcherUserId, respondentId, remarks, status });


  repondentReportId.save((err, data) => {
      if (err) {
          return res.status(400).json({
              error: err.errmsg
          });
      }

      res.json('Success : Added respondent report!'); // dont do this res.json({ tag: data });
  });
};

exports.getRespondentReportList = (req, res) => {

    const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    rReporting.count({}).exec((err, total) => {
        rReporting.find({}).skip((page - 1) * pagination).limit(pagination).exec((err, tag) => {
            if (err) {
                return res.status(400).json({
                    error: 'completed item not found'
                });
            }
            res.json({
                "identifier": "get all Completed order list", tag,
                pagination, page, total
            });
        });
    });
};

exports.getRespondentReport = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    rReporting.findOne({ _id: slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'product not found'
            });
        }
        res.json(tag);
    });
};

exports.dispatcherReport = (req, res) => {
    const { emergencyReportDetails, citizenDetails, dateTimeReported, dateTimeResolved, dispatched, priorityLevel, quadrant, editedAddress, long, lat, remarks, status } = req.body;
    let dispatcherReportId = new s({ emergencyReportDetails, citizenDetails, dateTimeReported, dateTimeResolved, dispatched, priorityLevel, quadrant, editedAddress, long, lat, remarks, status });
  
  
    dispatcherReportId.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: err.errmsg
            });
        }
  
        res.json('Success : Added dispatcher report!'); // dont do this res.json({ tag: data });
    });
  };

  exports.getDispatcherReportList = (req, res) => {

    const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    dpReporting.count({}).exec((err, total) => {
        dpReporting.find({}).skip((page - 1) * pagination).limit(pagination).exec((err, tag) => {
            if (err) {
                return res.status(400).json({
                    error: 'dispatcher item not found'
                });
            }
            res.json({
                "identifier": "get all Completed order list", tag,
                pagination, page, total
            });
        });
    });
};

exports.getDispatcherReportItem = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    dpReporting.findOne({ reportNumber: slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'dispatcher not found'
            });
        }
        res.json(tag);
    });
};