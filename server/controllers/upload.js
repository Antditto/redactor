const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const editor = require('services/file-editor');
let filePath;
let fileName;

module.exports = function upload(req, res) {
  var form = new IncomingForm();
  let readStream;
  let keywordString;
  form.on('fileBegin', (field, file) => {
    console.log(file.type);
    if (file.name.endsWith('.txt')) {
      console.log('Text File');
    } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      res.json(err)
    }
  })
  form.on('field', (field, value) => {
    value.replace('|', '');
    value.replace(',', ' ');
    keywordString = value;
  });
  form.on('file', (field, file) => {
    editor(req, res, file, keywordString);
  });
  form.on('err', () => {
    res.json(err)
  });
  form.parse(req);
};
