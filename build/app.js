'use strict';

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _syncRequest = require('sync-request');

var _syncRequest2 = _interopRequireDefault(_syncRequest);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var author = 'dadaturtle';
var authorURL = 'https://www.flickr.com/photos/' + author;
console.log(('' + authorURL).yellow);
var authorHTML = (0, _syncRequest2.default)('GET', authorURL).getBody().toString();

var findURL = /timingCache\[\'\d+\'\]/g;
var picturesSTRING = authorHTML.match(findURL).toString();
var picturesURL = picturesSTRING.match(/\d+/g);

console.log(('Find Images ' + picturesURL.length).yellow);
if (!_fs2.default.existsSync('download/' + author)) {
  _fs2.default.mkdir('download/' + author);
}

var imageSN = 1;

picturesURL.map(function (url) {
  var imageURL = authorURL + '/' + url;
  var imageHTML = (0, _syncRequest2.default)('GET', imageURL).getBody().toString();
  var findImage = /(\w+\d+\.staticflickr\.com)(\\\/\d+\\\/\d+\\\/)(\w+\.jpg)/g;
  var findDatas = imageHTML.match(findImage);
  console.log(('find image ' + imageSN++).yellow);

  findDatas.map(function (url) {
    var spliceURL = /(\w+\d+\.staticflickr\.com)(\\.+\/)(\w+\.jpg)/;
    var spliceData = url.match(spliceURL);
    var origingHost = spliceData[1];
    var origingPath = spliceData[2].match(/[^\\]/g).join('') + spliceData[3];
    var origingName = spliceData[3];
    var options = {
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
    console.log(('' + origingHost + origingPath).green);
    _https2.default.get(options, function (res) {
      res.pipe(_fs2.default.createWriteStream('./download/' + author + '/' + origingName, { flags: 'w' }));
    });
  });
});