const mongoose = require('mongoose');
const crypto = require('crypto');

const dispatcherRepSchema = new mongoose.Schema(
    { 
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
    dateTimeReported: {
      type: String,
    },
    dateTimeResolved: {
      type: String,
    },
    dispatched: {
      type: String,
    },
    priorityLevel: {
      type: String,
    },
    quadrant: {
      type: String,
    },
    editedAddress: {
      type: String,
    },
    long: {
      type: String,
    },
    lat: {
      type: String,
    },
    remarks: {
      type: String,
    },
    status: {
      type: String,
      default: "In progress"
    },
    },
    { timestamp: true }
);

module.exports = mongoose.model('dispatcherReport', dispatcherRepSchema);
