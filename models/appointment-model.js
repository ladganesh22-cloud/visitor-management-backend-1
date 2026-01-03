const mongoose = require('mongoose');

const schema = mongoose.Schema;

const appointmentSchema = new schema({
  purpose: {
    type: String,
    required: false,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  visitorId: {
    type: mongoose.Schema.Types.ObjectId, ref: "Visitor",
    required: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId, ref: "User",
    required: true,
  },
  approvalBy: {
    type: mongoose.Schema.Types.ObjectId, ref: "User"
  },
  notificationSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
