import fs from 'fs';
import puppeteer from 'puppeteer';
import postcodes from 'node-postcodes.io';

const articlesFilename = 'articles.json';
const articleDataFilename = 'articleData.json';
const maxPages = 20;
const postcodeRegex = /([A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1} [A-Z0-9]+)/gm;

const getIndexPage = async (page, pageNumber = 1) => {
    const articleDataFromFile = JSON.parse(fs.readFileSync(articleDataFilename, { encoding: 'utf8' }));
    const articles = JSON.parse(fs.readFileSync(articlesFilename, { encoding: 'utf8' }));
    const article = articles.slice(pageNumber - 1, pageNumber);
    const articleData = {
        url: article[0]
    };
    console.log(`page ${pageNumber} parsing ${article[0]}`);
    await page.goto(article[0]);
    await page.waitForSelector('h1');
    const restaurantDetailElement = await page.$('#maincontent > div > p > strong');
    if (restaurantDetailElement) {
        const restaurantDetail = await page.evaluate(el => el.textContent, restaurantDetailElement);
        articleData.details = restaurantDetail;
        const postCode = restaurantDetail.match(postcodeRegex); 
        if (postCode && postCode[0]){
            articleData.postcode = postCode[0];
            const postCodeDetails = await postcodes.lookup(postCode[0].replace(' ', ''));
            if (postCodeDetails.status == 200) {
                articleData.location = {
                    "long": postCodeDetails.result.longitude,
                    lat: postCodeDetails.result.latitude,
                    area: postCodeDetails.result.admin_district,
                    region: postCodeDetails.result.region,
                    country: postCodeDetails.result.country,
                }
            }
        }
    }
    const restaurantHeadlineElement = await page.$('h1');
    const restaurantHeadline = await page.evaluate(el => el.textContent, restaurantHeadlineElement);
    articleData.title = restaurantHeadline;
    
    const fileContents2 = [...articleDataFromFile, articleData];

    fs.writeFileSync(articleDataFilename, JSON.stringify(fileContents2, null, 4));
    pageNumber++;
    if (pageNumber < articles.length) {
        await getIndexPage(page, pageNumber);
    }
    return;
//     await page.waitForSelector('h1');
// 
//     const stories = await page.$$eval('h3 > [data-link-name="article"]', anchors => { 
//         return anchors.map(anchor => anchor.getAttribute('href'))
//     });
//     const fileContents2 = [...fileContents, ...stories];
//     fs.writeFileSync(filename, JSON.stringify(fileContents2, null, 4));
//     pageNumber++;
//     if (pageNumber <= maxPages) {
//         await getIndexPage(page, pageNumber);
//     }
//     return fileContents2;
}

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  const stories = await getIndexPage(page, 34);
  console.log(stories)

  await browser.close();
})();