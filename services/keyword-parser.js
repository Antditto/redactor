module.exports = function(keywordString) {
  //running match test
  const splitted = keywordString.match(/\w+|["'](?:\\["']|[^"'])+['"]/g);
  //sort to handle keywords within keywords correctly
  splitted.sort((a, b) => b.length - a.length)
  //replacing quotes with empty string for evaluation
  for (let i = 0; i < splitted.length; i++) {
      splitted[i] = splitted[i].replace(/['"]+/g, '')
  //creating copy of keyword for newline check
      if (splitted[i].indexOf(' ') != -1) {
        splitted.push(splitted[i].replace(' ', '|' ))
      }
  }
  return splitted;
}
