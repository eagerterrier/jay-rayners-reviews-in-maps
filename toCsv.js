import fs from 'fs';

const articlesFilename = 'articleData.csv';
const articleDataFilename = 'articleData.json';
const maxPages = 20;
const postcodeRegex = /([A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1} [A-Z0-9]+)/gm;

const fileJson = JSON.parse(fs.readFileSync(articleDataFilename, 'utf-8'));
const csvHeader = 'title,latLong,placename,postcode,description';

const csvContents = fileJson.reduce((acc, restaurant) => {
    const restaurantName = restaurant.details ? restaurant.details.split(',')[0] : '';
    if (restaurant.location && restaurant.location.hasOwnProperty('lat')) acc = `${acc}\n"${restaurant.title}","${restaurant.location.lat},${restaurant.location.long}","${restaurantName}","${restaurant.postcode}","${restaurant.title}<br>${restaurant.url}"`;
    return acc;
}, '');
const fullCsvContents = csvHeader + "\n" + csvContents;
fs.writeFileSync(articlesFilename, fullCsvContents);