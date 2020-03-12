// contains code from a learnscraping.com tutorial by https://twitter.com/grohsfabian

const reddit = require('./reddit');

(async () => {

  // S e t  S u b R e d d i t  H e r e 
  await reddit.initialize('node');

  // C a l l  g e t R e s u l t s ( )
  let results = await reddit.getResults(70);

  // B r e a k p o i n t
  debugger;

})();