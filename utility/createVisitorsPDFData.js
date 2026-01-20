const pdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');
const { pdfPath, pdfFolder } = require('./pdfPath');
const generateQRCode = require('./generateQRCode');
const visitorModel = require('../models/visitor-model');

// get Opensans fonts from googel fonts platform for rendering pdf data
const fonts = {
  Roboto: {
    normal: path.join(__dirname, '../fonts/Roboto/static/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '../fonts/Roboto/static/Roboto-Medium.ttf'),
  },
  OpenSans: {
    normal: path.join(__dirname, '../fonts/static/OpenSans-Regular.ttf'),
    bold: path.join(__dirname, '../fonts/static/OpenSans-Medium.ttf'),
  }
};


// to create the printer instance from pdfPrinter plugin to print data
const printer = new pdfPrinter(fonts);

const createVisitorsPDFData = async (visitorId) => {
  try {
    // get -visitor id from visitor Model to find visitor id base on triggering data
    const visitor = await visitorModel.findById(visitorId);
    // if we get visitor data then load visitor idd and visitor name for generate QR code
    const visitorrCodeDataURL = await generateQRCode(`Visitor ID: ${visitor._id}\n Name: ${visitor.name}`);
    // change file name of the pdf
    const visitorsfilename = `GBLVisitor_${visitor._id}.pdf`;
    // const visitorsDoccuDefinition = {
    //   content: [
    //     { text: 'Visitor Pass', style: 'header' },  { text: `Phone: ${visitor.phone}` }, { text: `Address: ${visitor.address}` },
    //     { image: visitor.photo, width: 120, alignment: "left", margin: [0, 10, 0, 10] },
    //     { image: visitorrCodeDataURL, width: 150, margin: [0, 20, 0, 0] }
    //   ],
    // };
    //declare all visitors details like namee email, phone numnber, address and photo
    // initialising the document definition to render html content like header, main content and image of the visitors
    const visitorContentData = [
      { text: 'Visitor Pass', style: 'header' },
      { text: `Name: ${visitor.name}`, style: 'subheader' },
      { text: `Email: ${visitor.email}` },
      { text: `Phone: ${visitor.phone}` },
      { text: `Address: ${visitor.address}` },
      { image: visitor.photo, width: 120, alignment: 'left', margin: [0, 10, 0, 10] },
      { image: visitorrCodeDataURL, width: 150, margin: [0, 20, 0, 0] },
    ];

    const visitorsDoccuDefinition = {
      content: visitorContentData,
    };
    console.log(visitorsDoccuDefinition, 'visitorsDoccuDefinition');
    // to initializes the pdfDoc to create printer document definition
    const vistitorsPdfDocuments = printer.createPdfKitDocument(visitorsDoccuDefinition);
    console.log(vistitorsPdfDocuments, 'vistitorsPdfDocuments');

    const visitorsPdfFilePath = path.join(pdfFolder, visitorsfilename);
    console.log(visitorsPdfFilePath, 'visitorsPdfFilePath');

    // to code write file in tin the pdf path
    const visitorsWriteContnet = fs.createWriteStream(visitorsPdfFilePath);
    console.log('hhhhhhhhhiiiiiii')

    // pipe to pdf to write visitors write content for file
    vistitorsPdfDocuments.pipe(visitorsWriteContnet);
    // finalise the pdf response no pdf section will complete here .
    vistitorsPdfDocuments.end();

    // add promise to check to wait for  write file for pdf path completed or not
    return new Promise((resolve, reject) => {
      visitorsWriteContnet.on('finish', () => resolve({ visitorsfilename, visitorsPdfFilePath, url: `/pdf/${visitorsfilename}` }));
      visitorsWriteContnet.on('error', reject);
    });

  } catch (error) {
    throw new Error(`Failed to generate or create GBLvisitor PDF: ${error.message}`);
  }
};

module.exports = createVisitorsPDFData;
