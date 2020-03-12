const puppeteer = require('puppeteer');
const SUBREDDIT_URL = (reddit) => `https://old.reddit.com/r/${reddit}/`;
const self = {
  browser: null,
  pages: null,

  initialize: async (reddit) => {
    self.browser = await puppeteer.launch({
      headless: false
    });
    self.page = await self.browser.newPage();
    // Go to subreddit
    await self.page.goto(SUBREDDIT_URL(reddit), {waitUntil: 'networkidle0'});
  },

  getResults: async (nr) => {

    let elements = await self.page.$$('#siteTable > div[class*="thing"]');
    let results = [];
    for(let element of elements) {

      let title = await element.$eval(('p[class="title"]'), node => node.innerText.trim());
      // let rank = await element.$eval(('span[class="rank"]'), node => node.innerText.trim());
      //let time = await element.$eval(('p[class="tagline "] > time'), node => node.getAttribute('title'));
      //let authorUrl = await element.$eval(('p[class="tagline "] > a[class*="author"]'), node => node.getAttribute('href'));
      //let authorName = await element.$eval(('p[class="tagline "] > a[class*="author"]'), node => node.innerText.trim());
      let score = await element.$eval(('div[class="score likes"]'), node => node.innerText.trim());
      //let comments = await element.$eval(('a[data-event-action="comments"]'), node => node.innerText.trim());
      //#thing_t3_fh7dpv > div.entry.unvoted > div > p.tagline > time
      ////*[@id="thing_t3_fh7dpv"]
      //document.querySelector("#thing_t3_fh7dpv")
      ///html/body/div[4]/div/div[1]/span#thing_t3_fh7dpv > span
      //#thing_t3_fh7dpv > span
      results.push({
        title,
        //rank,
        //time,
        //authorUrl,
        //authorName,
        score
        //comments
      })
    }
    return results;
  }
}
module.exports = self;