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
adminMiddleware,dispatcherMiddleware,dispatcherReport,getDispatcherReportItem,getDispatcherReportList,
getEmergencyReportList, getRespondentReport, getRespondentReportList, respondentMiddleware, respondentReport, updateEmergencyReport,
getDispatcherList, getOneDispatcher, getRespondentEmergency, getOneRespondentEmergency} = require('../controllers/emergencyuser');


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
router.get('/emergency/user/dispatcher/emergencyrespReport/dispatcher/all', requireSigninUser, dispatcherMiddleware, getEmergencyReportList);
router.get('/emergency/user/dispatcher/emergencyrespReport/dispatcher/one/:slug', requireSigninUser, dispatcherMiddleware, getOneEmergency);
router.get('/respondent/list', requireSigninUser, dispatcherMiddleware, getDispatcherList)
router.get('/respondent/all/:slug', requireSigninUser, dispatcherMiddleware, getOneDispatcher)
router.get('/respondent/one/:slug', requireSigninUser, dispatcherMiddleware, getOneRespondentEmergency)
router.put('/dispatcher/dispatch/:slug', requireSigninUser, dispatcherMiddleware, updateEmergencyReport)

//Respondent API
router.get('/emergency/user/respondent/respondentReport/all', requireSigninUser, respondentMiddleware, getRespondentEmergency);
router.get('/responend/assigned/:slug', requireSigninUser, respondentMiddleware, getRespondentEmergency);
router.put('/respondent/dispatch/:slug', requireSigninUser, respondentMiddleware, updateEmergencyReport)


module.exports = router;