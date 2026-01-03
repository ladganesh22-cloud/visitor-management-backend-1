const qrcode = require('qrcode');

const generateQRCode = async (text) => {

  try {

    const qrCodeDataURL = await qrcode.toDataURL(text);

    return qrCodeDataURL;

  } catch (error) {
    throw new Error('Failed to generate QR Code: ' + error.message);
  }
};

module.exports = generateQRCode;
