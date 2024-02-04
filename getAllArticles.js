import fs from 'fs';
import puppeteer from 'puppeteer';

const filename = 'articles.json';
const maxPages = 20;

const getIndexPage = async (page, pageNumber = 1) => {
    const fileContents = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }));
    await page.goto(`https://www.theguardian.com/food/series/jay-rayner-on-restaurants${pageNumber !== 1 ? '?page=' + pageNumber : ''}`);
    await page.waitForSelector('h1');

    const stories = await page.$$eval('h3 > [data-link-name="article"]', anchors => { 
        return anchors.map(anchor => anchor.getAttribute('href'))
    });
    const fileContents2 = [...fileContents, ...stories];
    fs.writeFileSync(filename, JSON.stringify(fileContents2, null, 4));
    pageNumber++;
    if (pageNumber <= maxPages) {
        await getIndexPage(page, pageNumber);
    }
    return fileContents2;
}

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  const stories = await getIndexPage(page, 1);
  console.log(stories)

  await browser.close();
})();