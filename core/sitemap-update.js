// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs"),
  convert = require("xml-js"),
  fetch = require("node-fetch"),
  moment = require("moment"),
  hostBlogBaseURL = "https://niyo-feed-sample-app-web.web.app/community/post",
  //   getBlogsListURL = `https://jsonplaceholder.typicode.com/posts`,
  //   hostBlogBaseURL = `https://niyo-feed-sample-app-web.web.app/community`,
  //   getBlogsListURL = `https://niyo-feed-sample-app-web.web.app/community`,
  untrackedUrlsList = [],
  options = { compact: true, ignoreComment: true, spaces: 4 };

/* 
    Method to Fetch dynamic List of URLs from Rest API/DB 
*/
const fetchBlogsList = () => {
  fetch(
    "https://betaauth.likeminds.community/feed/universal?page=1&page_size=100&topic_ids=[]",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiOW0vQXRrQ0hla2dsUUtDV0xMT2ltZ2JJZHBMcytrTGZ0cVV4TzNGdFlwWVdrYmdwbHA0NDloOGZkZVVIcElzazRmcHpTK1RqbTFFZ3dvWTMrVEdnREhaK0pSS2hOZ1MrdmxGcm1McnFEVlVWNU9HZG5HWWJsNkZGT1hlcVdNWTY4TE5NNVNKSXFiWU9ZUHQ1aHhJUEVNVlNNUTdHVGxHTTJiWllCTXBYSkdtM0ZGVG1TNDZkVUsrSGR0MG1CQ0NqUEloNEpWdmdCRnhJYnlJTHNNZEk4a0JJMFdhY0tCL1FnTXByZ2pYNExlRkxVYlQzUlAzRFhzVGJ6Z3JSVCtxWDBsbDJpby9hK0xPN2Zxb0JlL1lxUTdsZ1dsa09KRmtTR0NvanR3PT0ifQ.hwt553kjaX0Vw0KZm6KqUV4PAuoo-banISaFmpDavs8",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "x-platform-code": "rt",
        "x-sdk-source": "feed",
        "x-version-code": "2",
      },
      referrer: "https://niyo-feed-sample-app-web.web.app/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    },
  )
    .then((res) => res.json())
    .then((dataJSON) => {
      if (dataJSON) {
        dataJSON.data.posts.forEach((element) => {
          const modifiedURL = element.heading.replace(/ /g, "-");
          untrackedUrlsList.push(`${hostBlogBaseURL}/${modifiedURL}`);
        });
        filterUniqueURLs();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

/* 
    Method to Filter/Unique already existing URLs and new urls we fetched from DB
*/
const filterUniqueURLs = () => {
  fs.readFile("sitemap.xml", (err, data) => {
    if (data) {
      const existingSitemapList = JSON.parse(convert.xml2json(data, options));
      let existingSitemapURLStringList = [];
      if (
        existingSitemapList.urlset &&
        existingSitemapList.urlset.url &&
        existingSitemapList.urlset.url.length
      ) {
        existingSitemapURLStringList = existingSitemapList.urlset.url.map(
          (ele) => ele.loc._text,
        );
      }

      untrackedUrlsList.forEach((ele) => {
        if (existingSitemapURLStringList.indexOf(ele) == -1) {
          existingSitemapList.urlset.url.push({
            loc: {
              _text: ele,
            },
            changefreq: {
              _text: "monthly",
            },
            priority: {
              _text: 0.8,
            },
            lastmod: {
              _text: moment(new Date()).format("YYYY-MM-DD"),
            },
          });
        }
      });
      createSitemapFile(existingSitemapList);
    }
  });
};

/* 
    Method to convert JSON format data into XML format
*/
const createSitemapFile = (list) => {
  const finalXML = convert.json2xml(list, options); // to convert json text to xml text
  saveNewSitemap(finalXML);
};

/* 
    Method to Update sitemap.xml file content
*/
const saveNewSitemap = (xmltext) => {
  fs.writeFile("sitemap.xml", xmltext, (err) => {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
};

fetchBlogsList();
