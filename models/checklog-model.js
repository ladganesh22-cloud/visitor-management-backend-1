const mongoose = require('mongoose');

const schema = mongoose.Schema;

const checkLogSchema = new schema({
  passId: {
    type: mongoose.Schema.Types.ObjectId, ref: "Pass",
    required: true,
  },
  visitorId: {
    type: mongoose.Schema.Types.ObjectId, ref: "Visitor",
    required: true,
  },
  checkDate: {
    type: Date,
    default: Date.now,
  },
  scanType: {
    type: String,
    enum: ['checkin', 'checkout'],
    default: 'checkin'
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId, ref: "User"
  },
}, { timestamps: true });

const checkLog = mongoose.model('CheckLog', checkLogSchema);

module.exports = checkLog;
