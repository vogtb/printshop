var request = require("request");
var cheerio = require('cheerio');
var moment = require('moment');
var Twit = require('twit');
var env = (function(){
  var Habitat = require('habitat');
  Habitat.load();
  return new Habitat();
} ());
var T = new Twit({
  consumer_key: env.get('consumer_key'),
  consumer_secret: env.get('consumer_secret'),
  access_token: env.get('access_token'),
  access_token_secret: env.get('access_token_secret')
});




T.post('statuses/update', { status: 'test' }, function(err, reply) {
  console.log(err);
  console.log(reply);
});


// var options = {
//   encoding: 'utf8',
//   headers: {
//     'content-type': 'text/html',
//     'connection': 'keep-alive',
//     'accept': '*/*' },
//   uri: 'http://stuboard.beloit.edu/stumail/',
//   method: "GET",
//   timeout: 60000
// };
// request(options, function(error, response, body) {
//   $ = cheerio.load(body);
//   $('div.messages-list').find('li').each(function(i, elem) {
//     //If this posting is about the print shop.
//     if ($(this).find('a').text().toLowerCase().search('print') >= 1) {
//       var date = $(this).find('em').slice(1).text().replace(')', '').replace('(', '');
//       date = moment(date, 'ddd MMM DD YYYY - HH:mm:ss CDT').format('YYYY-MM-DD');
//       //moment('Thu Aug 01 2013 - 07:58:31 CDT', 'ddd MMM DD YYYY - HH:mm:ss CDT');
//       var title;
//       $(this).find('a').each(function(e, elem) {
//         if ($(this).attr('href')) {
//           title = $(this).text();
//         }
//       });
//       console.log(date + title);
//     }
//     
//   });
// });



