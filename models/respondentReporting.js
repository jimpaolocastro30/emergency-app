const mongoose = require('mongoose');
const crypto = require('crypto');

const respondentReportingSchema = new mongoose.Schema(
    { 
      dispatcherDetails: {
        type: {},
        min: 200,
        max: 2000000
    },
      emergencyReportDetails: {
        type: {},
        min: 200,
        max: 2000000
    },
    citizenDetails: {
      type: {},
      min: 200,
      max: 2000000
  },
  dispatcherUserId: {
    type: String,
  },
  respondentId: {
    type: String,
  },   
    remarks: {
      type: String,
    },
    status: {
      type: String,
      default: "On progress"
    },
    },
    { timestamp: true }
);

module.exports = mongoose.model('respondentReporting', respondentReportingSchema);
