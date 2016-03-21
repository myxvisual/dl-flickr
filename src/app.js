import https from 'https';
import syncRequest from 'sync-request';
import fs from 'fs';
import colors from 'colors';

const author = 'dadaturtle';
const authorURL = `https://www.flickr.com/photos/${author}`;
console.log(`${authorURL}`.yellow);
const authorHTML = syncRequest('GET', authorURL).getBody().toString();

const findURL = /timingCache\[\'\d+\'\]/g;
const picturesSTRING = authorHTML.match(findURL).toString();
const picturesURL = picturesSTRING.match(/\d+/g);

console.log(`Find Images ${picturesURL.length}`.yellow);
if (!fs.existsSync(`download/${author}`)) {
  fs.mkdir(`download/${author}`);
}

let imageSN = 1;

picturesURL.map((url) => {
  const imageURL = `${authorURL}\/${url}`;
  const imageHTML = syncRequest('GET', imageURL).getBody().toString();
  const findImage = /(\w+\d+\.staticflickr\.com)(\\\/\d+\\\/\d+\\\/)(\w+\.jpg)/g;
  const findDatas = imageHTML.match(findImage);
  console.log(`find image ${imageSN++}`.yellow);

  findDatas.map((url) => {
    const spliceURL = /(\w+\d+\.staticflickr\.com)(\\.+\/)(\w+\.jpg)/;
    const spliceData = url.match(spliceURL);
    const origingHost = spliceData[1];
    const origingPath = (spliceData[2]).match(/[^\\]/g).join('') + spliceData[3];
    const origingName = spliceData[3];
    const options = {
      hostname: origingHost,
      path: origingPath,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Host': origingHost,
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
      }
    };
    console.log(`${origingHost}${origingPath}`.green);
    https.get(options, (res) => {
      res.pipe(fs.createWriteStream((`./download/${author}/${origingName}`), { flags: 'w' }));
    });
  });

});
