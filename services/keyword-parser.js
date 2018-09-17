module.exports = function(keywordString) {
  //running match test
  const specialtyEvaluation = [',','.','?','!','&']
  //const splitted = keywordString.match(/(['"])((?:\\\1|.)+?)\1|([^\s,"']+)/g);
  const splitted = keywordString.match(/\w+|["'](?:\\["']|[^"'])+['"]/g);
  //sort to handle keywords within keywords correctly
  splitted.sort((a, b) => b.length - a.length)
  //replacing quotes with empty string for evaluation
  let spaceLocation = 0;
  let pipeLocation = 0;
  for (let i = 0; i < splitted.length; i++) {
    splitted[i] = splitted[i].replace(/['"]+/g, '')
    //creating copy of keyword for newline check
    if (splitted[i].indexOf('|') != -1 && splitted[i].indexOf('|') < spaceLocation) {
      splitted.push(splitted[i].replace('|', ' '))
    }
    if (splitted[i].indexOf(' ', spaceLocation) != -1 && splitted[i].indexOf(' ', spaceLocation) > spaceLocation) {
      spaceLocation = splitted[i].indexOf(' ', spaceLocation);
      splitted.push(splitted[i].replace(' ', '|'))
    }
    specialtyEvaluation.forEach((character) => {
      if (splitted[i].endsWith(character)) {
        splitted[i] += ' ';
      };
    });
  }
  return splitted;
}
