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
  consumer_key: env.get('CONSUMER_KEY'),
  consumer_secret: env.get('CONSUMER_SECRET'),
  access_token: env.get('ACCESS_TOKEN'),
  access_token_secret: env.get('ACCESS_TOKEN_SECRET')
});

//Options for connecting to the server.
var options = {
  encoding: 'utf8',
  headers: {
    'content-type': 'text/html',
    'connection': 'keep-alive',
    'accept': '*/*' },
  uri: 'http://stuboard.beloit.edu/stumail/',
  method: "GET"
};

//Find the latest tweet on start up.
T.get('statuses/user_timeline', {screen_name: 'BCPrintShop'}, function(err, reply) {
  for (var i = 0; i <= reply.length; i++) {
    //If it doesn't have an exclaimation point.
    if (reply[i].text.search('!') == -1) {
      var latestTweet = moment(reply[i].created_at.replace('+0000 ', ''), 'ddd MMM DD HH:mm:ss YYYY');
      break;
    }
  }

  //Every 10 seconds make the call
  setInterval(function () {
    console.log('Checking-----------------------------------------------------------');
    
    //If it's not the weekend
    if (moment().day() != 6 && moment().day() != 0) {
      console.log('Weekday. Making call');
      
      request(options, function (error, response, body) {
        $ = cheerio.load(body);
        $('div.messages-list').find('li').each(function(i, elem) {
          //If this posting is about the print shop.
          if ($(this).find('a').text().toLowerCase().search('print') >= 1 && $(this).find('a').text().toLowerCase().search('shop') >= 1) {
            var date = $(this).find('em').slice(1).text().replace(')', '').replace('(', '');
            date = moment(date, 'ddd MMM DD YYYY - HH:mm:ss CDT');

            //Getting the title
            var title, href;
            $(this).find('a').each(function(e, elem) {
              if ($(this).attr('href')) {
                href = 'http://stuboard.beloit.edu/stumail/' + $(this).attr('href');
                title = $(this).text().toLowerCase();
              }
            });

            //Check to see if these posts are recent enough.
            if (date.isAfter(latestTweet)) {
              var post;
              //Post Closing
              if (title.search('clos') >= 1) {
                console.log('PS Closing tweet fired.');
                post = 'THE PRINT SHOP CLOSING. ' + href;
                T.post('statuses/update', { status: post }, function(err, reply) {
                  console.log(err);
                  latestTweet = moment();
                });
              } else
              //Post Hours
              if (title.search('hour') >= 1) {
                console.log('PS Closing tweet fired.');
                post = 'THE PRINT SHOP HOURS HAVE CHANGED. ' + href;
                T.post('statuses/update', { status: post }, function(err, reply) {
                  console.log(err);
                  latestTweet = moment();
                });
              }
            }

            var eightAMOne = moment().hour(8).minute(0).second(0);
            var eightAMTwo = moment().hour(8).minute(0).second(20);
            var fourPMOne = moment().hour(16).minute(30).second(0);
            var fourPMTwo = moment().hour(16).minute(30).second(20);
            var now = moment();
            //Goodmorning sunshine
            if (now.isAfter(eightAMOne) && now.isBefore(eightAMTwo)) {
              console.log('Goodmorning tweet fired.');
              post = 'GOOD MORNING! THE PRINT SHOP IS NOW OPEN!';
              T.post('statuses/update', { status: post }, function(err, reply) {console.log(err);});
            }

            //Goodnight sunshine
            if (now.isAfter(fourPMOne) && now.isBefore(fourPMTwo)) {
              console.log('Goodnight tweet fired.');
              post = 'GOOD NIGHT! PRINT SHOP IS NOW CLOSED.';
              T.post('statuses/update', { status: post }, function(err, reply) {console.log(err);});
            }
          
          }
        });
      });
    
    } else {
      console.log("Weekend!");
      var noonOne = moment().hour(12).minute(0).second(0);
      var noonTwo = moment().hour(12).minute(0).second(20);
      var now = moment();
      if (now.isAfter(noonOne) && now.isBefore(noonTwo)) {
        var day;
        if (moment().day() == 6) {
          day = 'SATURDAY';
        } else {
          day = 'SUNDAY';
        }
        post = 'HAVE A LOVLEY '  + day + '. THE PRINT SHOP IS STILL CLOSED.';
        console.log('Goodmorning weekend tweet fired.');
        T.post('statuses/update', { status: post }, function(err, reply) {console.log(err);});
      }
    }
  }, 20000);

});


