const pdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');
const { pdfPath, pdfFolder } = require('./pdfPath');
const generateQRCode = require('./generateQRCode');
const visitorModel = require('../models/visitor-model');

const fonts = {
  Roboto: {
    normal: path.join(__dirname, '../fonts/static/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '../fonts/static/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '../fonts/static/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, '../fonts/static/Roboto-MediumItalic.ttf')
  }
};

const printer = new pdfPrinter(fonts);

const generateVisitorPDF = async (visitorId) => {
  try {
    const visitor = await visitorModel.findById(visitorId);

    if (!visitor) {
      throw new Error('Visitor not found');
    }

    const qrCodeDataURL = await generateQRCode(`Visitor ID: ${visitor._id}\nName: ${visitor.name}`);
    // const fileName = `visitor_pass_${visitor._id}.pdf`;
    const fileName = `visitor_${visitor._id}.pdf`;
    const filePath = pdfPath(fileName);

    const docDefinition = {
      content: [
        { text: 'Visitor Pass', style: 'header' },

        {
          image: visitor.photo,
          width: 120,
          alignment: "left",
          margin: [0, 10, 0, 10],
        },

        { text: `Name: ${visitor.name}`, style: 'subheader' },
        { text: `Email: ${visitor.email}` },
        { text: `Phone: ${visitor.phone}` },
        { text: `Address: ${visitor.address}` },

        { image: qrCodeDataURL, width: 150, margin: [0, 20, 0, 0] }
      ],

      styles: {
        header: { fontSize: 22, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 18, bold: true, margin: [0, 10, 0, 5] }
      }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    if (!fs.existsSync(pdfFolder)) {
      fs.mkdirSync(pdfFolder);
    }

    const pdfFilePath = path.join(pdfFolder, fileName);
    console.log(pdfFilePath, 'pdfFilePath');
    const writeStream = fs.createWriteStream(pdfFilePath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(
        {
          fileName,
          pdfFilePath,
          url: `/pdf/${fileName}`
        }
      ));
      writeStream.on('error', reject);
    });

  } catch (error) {
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

module.exports = generateVisitorPDF;
