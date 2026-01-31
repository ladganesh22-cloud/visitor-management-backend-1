const appointmentModel = require('../models/appointment-model');
const sendEmail = require('../utility/sendEmail');
const sendSMS = require('../utility/sendSMS');
const createVisitorsPDFData = require('../utility/createVisitorsPDFData');
const passModel = require("../models/pass-model");
const jwt = require('jsonwebtoken')
const userModel = require('../models/user-model');
const generateQRCode = require('../utility/generateQRCode');


exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find();

    res.status(201).json(appointments);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.getAppointmentById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const appointment = await appointmentModel.findById(id);

//     if (!appointment) {
//       return res.status(404).json({ error: 'Appointment not found' });
//     }

//     res.status(200).json(appointment);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.createAppointment = async (req, res) => {

  const { purpose, appointmentDate, hostId, status, visitorId, notificationSent, approvalBy } = req.body;

  if (!appointmentDate || !visitorId || !hostId) {
    return res.status(400).json({
      error: 'Appointment Date, Visitor ID and Host ID are required'
    });
  }

  try {

    const newAppointment = new appointmentModel({ purpose, appointmentDate, visitorId, hostId, approvalBy, status, notificationSent, approvalBy });

    await newAppointment.save();

    res.status(201).json(newAppointment);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.updateAppointment = async (req, res) => {
//   const { id } = req.params;

//   const updates = req.body;
//   try {
//     const updatedAppointment = await appointmentModel.findByIdAndUpdate(id, updates, { new: true });

//     if (!updatedAppointment) {
//       return res.status(404).json({ error: 'Appointment not found' });
//     }

//     res.status(200).json(updatedAppointment);

//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.deleteAppointment = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedAppointment = await appointmentModel.findByIdAndDelete(id);

//     if (!deletedAppointment) {
//       return res.status(404).json({ error: 'Appointment not found' });
//     }

//     res.status(200).json({ message: 'Appointment deleted successfully' });

//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };



exports.approveAppointment = async (req, res) => {
  try {
    console.log(req);
    console.log(res);
    const { id } = req.params;
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    const { userId } = jwt.verify(token, process.env.SECRET_KEY)
    const user = await userModel.findOne({ userId }).select('_id')

    const appointment = await appointmentModel
      .findById(id)
      .populate("visitorId", "name email phone");
    console.log(appointment, 'appointment');
    appointment.status = "approved";
    appointment.notificationSent = true;

    // save appointment
    await appointment.save();

    const passId = "PASS-" + Date.now();
    const validFrom = new Date();
    const validTo = new Date(
      new Date(appointment.appointmentDate).getTime() + (4 * 60 * 60 * 1000)
    );
    console.log(appointment, 'appointment');
    console.log(appointment.visitorId, 'visistorid');
    console.log(appointment.visitorId.name, 'visistoridname');
    console.log(appointment.appointmentDate, 'appidate');
    // EMAIL
    const date_ac = appointment.appointmentDate
    const pdf = await createVisitorsPDFData(appointment.visitorId._id);
    const qrCodeDataURL = await generateQRCode(passId);
    const newPass = new passModel({
      passId,
      visitorId: appointment.visitorId._id,
      appointmentId: appointment._id,
      validFrom,
      validTo,
      issuedBy: userId,
      pdfPath: pdf.filePath,
      qrcode: qrCodeDataURL
    });

    await newPass.save();

    console.log(pdf, 'pdfff');
    const qrBase64 = qrCodeDataURL.split(',')[1];
    await sendEmail({
      to: appointment.visitorId.email,
      // to: 'ladganesh22@gmail.com',
      subject: "Your GBLPASS Visitor Access Has Been Approved",
      html: `
    <p>Hello <b>${appointment.visitorId.name}</b>,</p>

    <p>We’re pleased to inform you that your visitor request submitted through the <b>GBLPASS Visitor App</b> has been approved by your host.</p>

    <p>
      <b>Pass ID:</b> ${passId}<br>
      <b>Date:</b> ${date_ac}
    </p>

      <p>Please present the QR code below at the security desk:</p>
      <div style="margin: 20px 0; text-align: left;">
        <img
          src="cid:visitorqr"
          alt="Visitor QR Code"
          style="width: 220px; height: 220px; border: 1px solid #ddd;"
        />
      </div>
      <p>
       <a href="cid:visitorpdf">Click here to download your GBL Visitor Badge with PDF Format to get with Visiting Site</a>
     </p>
    <p>
      Please ensure you carry a valid government-issued ID and show your digital visitor pass at the security desk upon arrival.
    </p>

    <p>
      If you have any questions or need assistance, feel free to contact your host directly.
    </p>

    <p>
      We look forward to welcoming you.
    </p>

    <p>
      Warm regards,<br>
      <b>GBLPASS Team</b>
    </p>`,
      attachments: [
        {
          filename: pdf.visitorsfilename,
          path: pdf.visitorsPdfFilePath,
          contentType: "application/pdf",
          cid: "visitorpdf"
        },
        {
          filename: 'visitor-qr.png',
          content: qrBase64,
          encoding: 'base64',
          contentType: 'image/png',
          cid: 'visitorqr',
        }
      ]
    });

    // SMS
    await sendSMS(
      appointment.visitorId.phone,
      // '8828457968',
      `Welcome!! Hello ${appointment.visitorId.name}, your appointment has been APPROVED by the host.`
    );

    res.json({ success: true, message: "Appointment approved" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // const updates = { "notificationSent": FALSE, "status": 'rejected' };

    // const updatedAppointment = await appointmentModel.findByIdAndUpdate(id, updates, { new: true });

    const appointment = await appointmentModel
      .findById(id)
      .populate("visitorId", "name email phone");

    appointment.status = "rejected";
    appointment.notificationSent = true;
    await appointment.save();

    // EMAIL
    await sendEmail({
      to: appointment.visitorId.email,
      // to: 'ladganesh22@gmail.com',
      subject: "Appointment Rejected",
      html: `
      <p>Hello <b>${appointment.visitorId.name}</b>,</p>

      <p>Thank you for submitting your visitor request through the GBLPASS Visitor App.After review, we regret to inform you that your visit request has been declined by the host at this time.</p>

    <p>This decision may be due to scheduling constraints or other internal considerations.</p>

    <p>You may contact your host directly for further clarification or submit a new request for a different date.</p>

    <p>Thank you for your understanding.</p>

     <p>
      Warm regards,<br>
      <b>GBLPASS Team</b>
    </p>`,
    });

    // SMS
    const smsRes = await sendSMS(
      appointment.visitorId.phone,
      // '8828457968',
      `Welcome!! Hello ${appointment.visitorId.name}, your appointment has been REJECTED by the host.`
    );
    console.log(smsRes, "smsRes")
    res.json({ success: true, message: "Appointment rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
