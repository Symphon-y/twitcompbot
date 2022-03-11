require('dotenv').config();

// General Dependencies
const Discord = require('discord.js');
const client = new Discord.Client();
const Twit = require('twit');

// Twit Dependencies
var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60*1000,
    strictSSL: true,
})

// Discord Token
client.login(process.env.DISCORD_TOKEN);


// Discord Bot 
client.once('ready', () =>{

    async function getRequest() {

        // Function to Send Tweets
        function sendTweet(data){

            client.channels.fetch(process.env.DISCORD_CHANNEL_ID).then(channel =>{
                for (var i = 0; i < data.statuses.length ; i++){
            
                    // Tweet Variabels
                    let userName = data.statuses[i].user.screen_name
                    let tweetId = data.statuses[i].id_str
                    let tweetUrl = `https://www.twitter.com/${userName}/status/${tweetId}`

                    // Not Currently Using
                    // let tweetText = data.statuses[i].text
                    // let newTweet = `New tweet from ${userName}: link: ${tweetUrl}`
            
                    // Send Tweet
                    channel.send(tweetUrl)

                }
            })
        }

        // #callforscores
        T.get('search/tweets', { q: '#callforscores', count: 10 }, function(err, data, response) {
            sendTweet(data);
        })

        // #compositioncompetition
        T.get('search/tweets', { q: '#compositioncompetition', count: 10 }, function(err, data, response) {
            sendTweet(data);
        })

        // #filmscoringcompetition
        T.get('search/tweets', { q: '#filmscoringcompetition', count: 10 }, function(err, data, response) {
            sendTweet(data);
        })

        // #scoringcompetition
        T.get('search/tweets', { q: '#scoringcompetition', count: 10 }, function(err, data, response) {
            sendTweet(data);
        })

        // Search Every 12 Hours
        setTimeout(function(){
            getRequest();
        }, 60*43200);
    }
    getRequest();
});

// test change //
// *** Example Object *** 

// {
//     statuses: [
//       {
//         created_at: 'Wed Mar 09 07:24:00 +0000 2022',
//         id: 1501458768126787600,
//         id_str: '1501458768126787586',
//         text: 'RT @JoesKenya: Ruaka branch is open for delivery’s and take away only from 10am til 10pm daily\n' +
//           '\n' +
//           'Gigiri- Ruaka Town- Banana- wangige- kiambu…',
//         truncated: false,
//         entities: [Object],
//         metadata: [Object],
//         source: '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>',
//         in_reply_to_status_id: null,
//         in_reply_to_status_id_str: null,
//         in_reply_to_user_id: null,
//         in_reply_to_user_id_str: null,
//         in_reply_to_screen_name: null,
//         user: [Object],
//         geo: null,
//         coordinates: null,
//         place: null,
//         contributors: null,
//         retweeted_status: [Object],
//         is_quote_status: false,
//         retweet_count: 38,
//         favorite_count: 0,
//         favorited: false,
//         retweeted: false,
//         lang: 'en'
//       }
//     ],
//     search_metadata: {
//       completed_in: 0.043,
//       max_id: 1501458768126787600,
//       max_id_str: '1501458768126787586',
//       next_results: '?max_id=1501458768126787585&q=banana%20since%3A2011-07-11&count=1&include_entities=1',
//       query: 'banana+since%3A2011-07-11',
//       refresh_url: '?since_id=1501458768126787586&q=banana%20since%3A2011-07-11&include_entities=1',
//       count: 1,
//       since_id: 0,
//       since_id_str: '0'
//     }
//   }
  