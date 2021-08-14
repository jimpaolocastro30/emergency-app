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





const {emergencyReport, getAllEmergency, getOneEmergency, requireSigninUser, signin, signout, signup,
adminMiddleware,dispatcherMiddleware,dispatcherReport,getDispatcherReportItem,getDispatcherReportList,getEmergencyReport,
getEmergencyReportList, getRespondentReport, getRespondentReportList, respondentMiddleware, respondentReport} = require('../controllers/emergencyuser');


// validators
const { runValidation } = require('../validators');


router.post('/emergency/user/signup', runValidation, signup);
router.post('/emergency/user/signin', signin);
router.get('/emergency/user/signout', signout);


// Admin API
router.post('/emergency/user/admin/emergencyReport', requireSigninUser, adminMiddleware, emergencyReport);
router.get('/emergency/user/admin/emergencyReport/all', requireSigninUser, adminMiddleware, getEmergencyReportList);
router.get('/emergency/user/admin/emergencyReport/one/:slug', requireSigninUser, adminMiddleware, getOneEmergency);

// Dispatcher API
router.get('/emergency/user/dispatcher/emergencyReport/all', requireSigninUser, dispatcherMiddleware, getAllEmergency);
router.get('/emergency/user/dispatcher/emergencyReport/one/:slug', requireSigninUser, dispatcherMiddleware, getOneEmergency);
router.post('/emergency/user/dispatcher/dispatcherReport', requireSigninUser, dispatcherMiddleware, dispatcherReport);
router.get('/emergency/user/dispatcher/emergencyReport/all', requireSigninUser, dispatcherMiddleware, getDispatcherReportList);
router.get('/emergency/user/dispatcher/emergencyReport/one/:slug', requireSigninUser, dispatcherMiddleware, getDispatcherReportItem);

//Respondent API
router.post('/emergency/user/respondent/dispatcherReport', requireSigninUser, respondentMiddleware, respondentReport);
router.get('/emergency/user/respondent/dispatcherReport/all', requireSigninUser, respondentMiddleware, getRespondentReportList);
router.get('/emergency/user/respondent/dispatcherReport/one/:slug', requireSigninUser, respondentMiddleware, getRespondentReport);


module.exports = router;