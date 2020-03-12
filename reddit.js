// contains code from a learnscraping.com tutorial by https://twitter.com/grohsfabian
const puppeteer = require('puppeteer');

// S e t   S u b r e d d i t   f r o m   i n d e x . j s 
const SUBREDDIT_URL = (reddit) => `https://old.reddit.com/r/${reddit}/`;

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

    // Go to subreddit
    await self.page.goto(SUBREDDIT_URL(reddit), {waitUntil: 'networkidle0'});
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