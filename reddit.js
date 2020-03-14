// contains code from a learnscraping.com tutorial by https://twitter.com/grohsfabian
const puppeteer = require('puppeteer');

// S e t   S u b r e d d i t   f r o m   i n d e x . j s 
const REDDIT_URL = `https:old.reddit.com/`;
const SUBREDDIT_URL = (reddit) => `https://old.reddit.com/r/${reddit}/`;
const SUBREDDIT_SUBMIT_TEXT_URL = (reddit) => `https://old.reddit.com/r/${reddit}/submit?selftext=true`;
const SUBREDDIT_SUBMIT_LINK_URL = (reddit) => `https://old.reddit.com/r/${reddit}/submit`;

// A P I
const self = {

  browser: null,
  pages: null,

  // I n i t i a l i z e   t h e   B r o w s e r
  initialize: async (reddit) => {

    self.browser = await puppeteer.launch({
      headless: false
    });

    self.page = await self.browser.newPage();

    // G o  t o  s u b r e d d i t
    await self.page.goto(SUBREDDIT_URL(reddit), {waitUntil: 'networkidle0'});
  },

  login: async (username, password) => {

    await self.page.type('#login_login-main > input[name="user"]', username, {delay: 40})

    await self.page.type('#login_login-main > input[name="passwd"]', password, {delay: 40})

    butt = await self.page.$('#login_login-main > div.submit > button');
    await butt.click();

  },

  // L o g o u t
  logout: async () => {
    // '#login_login-main > div.submit > button[class="btn"'
  },

  // U p v o t e 
  vote: async (subreddit, type = 'upvote', nr = 1) => {

    // G o  t o  s u b r e d d i t
    await self.page.goto(SUBREDDIT_URL(subreddit), {waitUntil: 'networkidle0'});
    
    // I t e r a t e   o v e r   p o s t s
    let elements = await self.page.$$('#siteTable > div[class*="thing"]');
    // let results = [];
    let totalVotes = 0;

    for(let element of elements) {

      if(totalVotes > nr) break;
      
      let button = null;

      switch(type) {

        case 'upvote':
          
          button = await element.$('div.arrow.up.login-required.access-required');

        break;

        case 'downvote':

          button = await element.$('div.arrow.up.login-required.access-required');

        break;
          
      }

      await button.click();
      totalVotes++;

    }
  },

  // P o s t   t o   S u b R e d d i t
  post: async (subreddit, data = {}) => {

    switch(data.type) {

      case 'text':
        
        await self.page.goto(SUBREDDIT_SUBMIT_TEXT_URL(subreddit), {waitUntil: 'networkidle0'});
        
        // F i l l   I n p u t s
        await self.page.type('#title-field > div > textarea', data.title);
        await self.page.type('#title-field > div > textarea', data.text);

      break;

      case 'link':
        
        await self.page.goto(SUBREDDIT_SUBMIT_LINK_URL(subreddit), {waitUntil: 'networkidle0'});
        
        // F i l l   I n p u t s
        await self.page.type('#url, data.url');
        await self.page.type('textarea[name="title"], data.title');

      break;
    }
  },

  // S c r a p e  t h e  S u b R e d d i t
  getResults: async (nr) => {

    let results = [];

    do {

      let new_results = await self.parseResults();
      results = [...results, ...new_results ];

      if(results.length < nr) {

        let nextPageButton = await self.page.$('#siteTable > div.nav-buttons > span > span[class="next-button"] > a[rel="nofollow next"]');

        if(nextPageButton) {

          await nextPageButton.click();
          await self.page.waitForNavigation({ waitUntil: 'networkidle0'});

        } else {

          break;

        }

      }
    } while(results.length <= nr);

    return results.slice(0, nr);
  },

  // P a r s e   R e s u l t s
  parseResults: async () => {
    
    let elements = await self.page.$$('#siteTable > div[class*="thing"]');
    let results = [];

    for(let element of elements) {

      let title = await element.$eval(('p[class="title"]'), node => node.innerText.trim());
      //let rank = await element.$eval(('*[class="rank"]'), node => node.innerText.trim());
      //let time = await element.$eval(('p[class="tagline "] > time'), node => node.getAttribute('title'));
      //let authorUrl = await element.$eval(('p[class="tagline "] > a[class*="author"]'), node => node.getAttribute('href'));
      //let authorName = await element.$eval(('p[class="tagline "] > a[class*="author"]'), node => node.innerText.trim());
      let score = await element.$eval(('div[class="score likes"]'), node => node.innerText.trim());
      //let comments = await element.$eval(('a[data-event-action="comments"]'), node => node.innerText.trim());

      results.push({
        title,
        //rank,
        //time,
        //authorUrl,
        //authorName,
        score
        //comments

      });

    }

    return results;

  }

}

module.exports = self;