const path = require('path');

const pdfFolder = path.join(__dirname, '../public/pdf');

const pdfPath = (fileName) => {
  return path.join(pdfFolder, fileName);
};

module.exports = {
  pdfPath,
  pdfFolder
};
