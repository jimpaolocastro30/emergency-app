const mongoose = require('mongoose');
const crypto = require('crypto');

const emergencyReportingOverAllSchema = new mongoose.Schema(
    { 
      reportNumber: {
      type: String,
    },
      firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    typeOfEmergency: {
      type: String,
    },
    emergencyAddress: {
      type: String,
    },
    userPhotoTaken: {
      type: String,
    },
    userDateTimeReport: {
      type: Date,
    },
    dispatchTo: {
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
        type: String
      },
      lat: {
        type: String
      },
      dateTimeStartReport: {
        type: String
      },
      dateTimeResolve: {
        type: String
      },
      remarksByDispatcher: {
        type: String
      },
      responderId: {
        type: String
      },
      adminId: {
        type: String
      },
    },
    { timestamp: true }
);

module.exports = mongoose.model('emergencyOverAllReporting', emergencyReportingOverAllSchema);
