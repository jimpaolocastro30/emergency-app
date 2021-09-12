const express = require('express');
const router = express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, '-');
    cb(null, date + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});





const { signin, signout, signup, citizenMiddleware, 
  emergencyReport, requireSigninUser,getUserProfile, updateUser } = require('../controllers/citizen');

// validators
const { runValidation } = require('../validators');

// Registration Citizen
router.post('/citizen/user/signup', runValidation, signup);
router.post('/citizen/user/signin', signin);
router.get('/citizen/user/signout', signout);


// Citizen report
router.post('/citizen/user/er', requireSigninUser,  emergencyReport);
router.get('/citizen/profile/:slug', requireSigninUser,  getUserProfile);
router.put('/citizen/update-profile/:slug', requireSigninUser, updateUser);

module.exports = router;