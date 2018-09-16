const fs = require('fs')
const readline = require('readline')
const keywordParser = require('services/keyword-parser')

// TODO: add keywordString for parsing
module.exports = function(req, res, file, keywordString) {

  const outputFile = fs.createWriteStream('./output-file.txt')
  //create read stream interface
  const rl = readline.createInterface({
    input: fs.createReadStream(file.path)
  })
  //return keyword array from service
  const keywordArray = keywordParser(keywordString);

  let editString = '';
  let first = true;

  // Replace function for each stream
  function replaceAll(str, keyword, replace) {
    return str.replace(new RegExp('\\b' + escapeRegExp(keyword) + '\\b', 'gi'), replace);
  }

  //Replace function loop for each keyword in array
  function replaceAllLoop(str, keywordArray) {
    for (let i = 0; i < keywordArray.length; i++) {
      let replace ='';
      let testKeyword = keywordArray[i]
      //Check for new lines or spaces in each keyword
      for (let j = 0; j < testKeyword.length; j++) {
        if (testKeyword[j] != '|' && testKeyword[j] != ' ') {
          replace += 'X';
        } else {
          replace += testKeyword[j];
        }
      }

      str = replaceAll(str, keywordArray[i], replace);
    }
    return str;
  }

  function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  // Handle any error that occurs on the write stream
  outputFile.on('err', err => {
    // handle error
    console.log(err)
    first = true;
  })

  // Once done writing, rename the output to be the input file name
  outputFile.on('close', () => {
    editString = '';
    first = true;
    console.log('done writing')

    fs.rename('./output-file.txt', file.path, err => {
      if (err) {
        // handle error
        console.log(err)
      } else {
        console.log('redacted file')
        res.end();
      }
    })
  })

  // Read the file and replace any text that matches
  rl.on('line', line => {
    rl.pause()
    if (line == '') {
      line = ' ';
    }

    line = line.replace('|', '');

    if (editString) {
      first = false;
      editString = editString + '|' + line;
    } else {
      editString = line;
    }
    // Do some evaluation to determine if the text matches
    editString = replaceAllLoop(editString, keywordArray);
    console.log(editString);

    let editedArray = [];

    if (editString.indexOf("|") !== -1) {
      editedArray = editString.split("|");
    } else {
      editedArray.push(editString);
    }

    let text = editedArray[0];
    editString = (editedArray[1]? editedArray[1]: editedArray[0]);

    // write text to the output file stream with new line character
    if (!first) {
      //outputFile.write(`${text}\n`)
      res.write(`${text}\n`)
    }
    rl.resume()
  })

  // Done reading the input, call end() on the write stream
  rl.on('close', () => {
    //outputFile.write(`${editString}\n`)
    res.write(`${editString}\n`)
    outputFile.end()
  })

};
