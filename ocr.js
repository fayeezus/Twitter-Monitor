// Library Import
const fetch = require('node-fetch');
const Tesseract = require('tesseract.js');
const config = require('./config');

// OCR Function
const sendOCR = (image_data) => {

  // Embed Fields
  const contentField = [];

  // OCR Recogonition
  Tesseract.recognize(
    image_data,
    'eng',
  ).then(({
    data: {
      text
    }
  }) => {

    // Add OCR Result To Embed
    contentField.push({
      name: 'OCR Result',
      value: text,
      inline: false
    });

    // OCR Embed
    const embedMessage = {
      "username": 'OCR Image Recogonition',
      "embeds": [{
        "color": 255,
        "fields": contentField,
        "footer": {
          "text": 'OCR • Image Recogonition',
        }
      }]
    };

    // Send OCR Embed
    fetch(config.webhook, {
      method: 'post',
      body: JSON.stringify(embedMessage),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  })
};

// Export OCR Module
module.exports.sendOCR = sendOCR;