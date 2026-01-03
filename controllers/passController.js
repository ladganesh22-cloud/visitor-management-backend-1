const passModle = require('../models/pass-model');

// create issue pass
const generateQRCode = require('../utility/generateQRCode');
const generateVisitorPDF = require('../utility/generateVisitorPDF');
const { Jimp } = require("jimp");
const QrCode = require("qrcode-reader");

exports.getIssuePass = async (req, res) => {
  try {
    const pass = await passModle.find();

    res.status(200).json(pass);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

exports.verifyQrImage = async (req, res) => {
  try {
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        valid: false,
        message: "QR image is required",
      });
    }

    const image = await Jimp.read(req.file.buffer);

    const qr = new QrCode();

    qr.callback = async (err, value) => {
      if (err || !value) {
        console.error("QR decode error:", err);
        return res.status(400).json({
          valid: false,
          message: "QR code not detected",
        });
      }

      const passId = value.result;

      const pass = await passModle.findOne({ passId });

      if (!pass) {
        return res.status(404).json({
          valid: false,
          message: "Invalid pass",
        });
      }

      const now = new Date();

      if (now < pass.validFrom || now > pass.validTo) {
        return res.status(403).json({
          valid: false,
          message: "Pass expired",
        });
      }

      return res.json({
        valid: true,
        passId,
        message: "Pass is valid",
      });
    };

    qr.decode(image.bitmap);
  } catch (error) {
    console.error("QR verification fatal error:", error);
    return res.status(500).json({
      valid: false,
      message: "Internal server error",
    });
  }
};


exports.issuePass = async (req, res) => {
  const { passId, validFrom, validTo, visitorId, appointmentId, issuedBy } = req.body;

  if (!passId || !validFrom || !validTo) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const visitorId = req.user.visitorId;

    const appointmentId = req.user.appointmentId;

    const issuedBy = req.user.id;

    const { filePath, url } = await generateVisitorPDF(visitorId);

    const newPass = new passModle({ passId, visitorId, appointmentId, pdfPath, validFrom, validTo, issuedBy });

    newPass.qrcode = generateQRCode(passId);

    newPass.pdfPath = filePath;

    await newPass.save();

    res.status(201).json(newPass);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get pass by ID
exports.getPass = async (req, res) => {
  const pass = await passModle.findById(req.params.id).populate('visitorId');
  res.status(201).json(pass);
};
