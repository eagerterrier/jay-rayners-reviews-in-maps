This code gets data from the guardian topic page with the `getAllArticles.js` script and stores them in JSON format as a [list of articles](https://github.com/eagerterrier/jay-rayners-reviews-in-maps/blob/main/articles.json)

We then use `index.js` to loop through that data to get more specific restaurant details, such as title of review, address etc. We use [@node-postcodes.io](https://www.npmjs.com/package/node-postcodes.io) to get the lat/long details. This gets stored in [articleData.json](https://github.com/eagerterrier/jay-rayners-reviews-in-maps/blob/main/articleData.json)

Finally, there is a script to put that into CSV format - `toCsv.js` - which is stored in [articleData.csv](https://github.com/eagerterrier/jay-rayners-reviews-in-maps/blob/main/articleData.csv) then uploaded _manually_ to google maps.

## To Do
I will make the map a bit prettier with carriage returns (google didn't like `<br>` to add new lines) and add some more details of the restuarants.

After that, I'll change colours of the restaurants that are sadly no more. And look into automating some of this (fetching new articles, uploading to google maps etc)

Any other requests, please add in the `issues` tab above or email me
