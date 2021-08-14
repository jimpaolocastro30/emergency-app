const mongoose = require('mongoose');
const crypto = require('crypto');

const emergencyReportingSchema = new mongoose.Schema(
    { 
      reportNumber: {
      type: String,
    },
      emergencyCategory: {
      type: String,
    },
      citizenDetails: {
        type: {},
        min: 200,
        max: 2000000
    },
      dateTime: {
      type: String,
    },
    status: {
      type: String,
      default: "On progress"
    },
    },
    { timestamp: true }
);

module.exports = mongoose.model('emergencyReporting', emergencyReportingSchema);
