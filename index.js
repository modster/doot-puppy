// contains code from a learnscraping.com tutorial by https://twitter.com/grohsfabian
require('dotenv').config();
const reddit = require('./reddit');

(async () => {

  // S e t  S u b R e d d i t  H e r e 
  await reddit.initialize('node');

  // L o g i n   t o   R e d d i t  
  await reddit.login( process.env.REDDIT_USERNAME, process.env.REDDIT_PASSWORD);

  // P o s t  t o  S u b R e d d i t
  await reddit.post('node', {
    type: 'text',
    title: 'Just a test',
    text: 'Hello Werld!'
  })
  // C a l l   g e t R e s u l t s ( )
  //let results = await reddit.getResults(70);

  //await reddit.vote('node', 'upvote', 1)
  // B r e a k p o i n t
  debugger;

})();