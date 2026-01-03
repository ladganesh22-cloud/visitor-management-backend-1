const mongoose = require('mongoose');

const schema = mongoose.Schema;

const passSchema = new schema({
  passId: {
    type: String,
    required: true,
    unique: true
  },
  visitorId: {
    type: mongoose.Schema.Types.ObjectId, ref: "Visitor",
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId, ref: "Appointment",
    required: true,
  },
  qrcode: {
    type: String,
    required: false,
  },
  pdfPath: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'checked-in', 'checked-out'],
    default: 'active'
  },
  validFrom: {
    type: Date,
    required: false,
  },
  validTo: {
    type: Date,
    required: false,
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId, ref: "User"
  },
}, { timestamps: true });

const pass = mongoose.model('Pass', passSchema);

module.exports = pass;
