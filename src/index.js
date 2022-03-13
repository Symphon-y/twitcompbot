require('dotenv').config();

// General Dependencies
const Discord = require('discord.js');

let prefix = '$';

const {
    Client,
    Intents,
    MessageEmbed
} = require('discord.js');

const Twit = require('twit');

// Establish Discord Client and Twitter Dependencies 
const client = new Discord.Client();

var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60*1000,
    strictSSL: true,
})

// Discord client 
client.once('ready', () =>{

    async function getRequest() {

        // Function to Send Tweets
        function sendTweet(tweetData){
            let tweetDataLength = Number(tweetData['statuses'].length);

            client.channels.fetch(process.env.DISCORD_CHANNEL_ID).then(channel =>{
                for (var i = 0; i < tweetDataLength ; i++){
            
                     // Tweet Variabels
                    let userName = tweetData.statuses[i].user.screen_name
                    let tweetId = tweetData.statuses[i].id_str
                    let tweetUrl = `https://www.twitter.com/${userName}/status/${tweetId}`
                    let tweetTime = tweetData.statuses[i].created_at
                    let tweetTimeShort = tweetTime.substring(0,19)
                    let tweetText = tweetData.statuses[i].text
                    let tweetPfp = tweetData.statuses[i].user.profile_image_url
                    let tweetPfpBig = tweetPfp.replace("normal", "400x400")
                    
                            const embedTweet = new Discord.MessageEmbed()
                            .setColor(`#1b95e6`)
                            .setAuthor(`${userName}`,`${tweetPfpBig}`, `${tweetUrl}`)
                            //.setTitle(`${userName}`)
                            .setURL(`${tweetUrl}`)
                            .setDescription(`${tweetText}`)
                            //.setThumbnail(`${tweetPfpBig}`)
                            .setFooter(`${tweetTimeShort}`)
                            //.setTimestamp(`${tweetTime}`)

                    channel.send(embedTweet)
                }
            })
        }

        // #callforscores
        T.get('search/tweets', { q: '#callforscores', count: 10 }, function(err, data, response) {
            let callForScoreData = data;
            sendTweet(callForScoreData);
        })

        // #compositioncompetition
        T.get('search/tweets', { q: '#compositioncompetition', count: 10 }, function(err, data, response) {
            let compositionCompetitionData = data;
            sendTweet(compositionCompetitionData);
        })

        // #filmscoringcompetition
        T.get('search/tweets', { q: '#filmscoringcompetition', count: 10 }, function(err, data, response) {
            let filmScoringCompetitionData = data;
            sendTweet(filmScoringCompetitionData);
        })

        // #scoringcompetition
        T.get('search/tweets', { q: '#scoringcompetition', count: 10 }, function(err, data, response) {
            let scoringCompetitionData = data;
            sendTweet(scoringCompetitionData);
        })

        // Search Every 12 Hours
        setTimeout(function(){
            getRequest();
        }, 100*43200);
    }
    getRequest();
});

client.on('message', (message) => {

    if (!message.content.startsWith(prefix) || message.author.bot){
        return;
    }

    // Custom Search From User Input
    let searchString = `search`

    if (message.content.startsWith(`${prefix}${searchString}`)){
    const args = message.content.slice(prefix.length + searchString.length).trim().split(' ');
    const command = args.join(' ').toLowerCase();
        
        // Function to Send Tweets
        function sendTweet(tweetData){
            let tweetDataLength = Number(tweetData['statuses'].length);

            client.channels.fetch(process.env.DISCORD_CHANNEL_ID).then(channel =>{
                for (var i = 0; i < tweetDataLength ; i++){
                   

                    // Tweet Variabels
                    let userName = tweetData.statuses[i].user.screen_name
                    let tweetId = tweetData.statuses[i].id_str
                    let tweetUrl = `https://www.twitter.com/${userName}/status/${tweetId}`
                    let tweetTime = tweetData.statuses[i].created_at
                    let tweetTimeShort = tweetTime.substring(0,19)
                    let tweetText = tweetData.statuses[i].text
                    let tweetPfp = tweetData.statuses[i].user.profile_image_url
                    let tweetPfpBig = tweetPfp.replace("normal", "400x400")
                    
                    const embedTweet = new Discord.MessageEmbed()
                        .setColor(`#1b95e6`)
                        .setAuthor(`${userName}`,`${tweetPfpBig}`, `${tweetUrl}`)
                        //.setTitle(`${userName}`)
                        .setURL(`${tweetUrl}`)
                        .setDescription(`${tweetText}`)
                        //.setThumbnail(`${tweetPfpBig}`)
                        .setFooter(`${tweetTimeShort}`)
                        //.setTimestamp(`${tweetTime}`)

                    channel.send(embedTweet)

                }
            })
        }

        // Custom Search
        T.get('search/tweets', { q: `${command}`, count: 10 }, function(err, data, response) {
            let callForScoreData = data;
            sendTweet(callForScoreData);
        })
    };

    
});

// Discord Client Login
client.login(process.env.DISCORD_TOKEN);



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
  

// *** Example User Object *** 
// id: 51831670,
//   id_str: '51831670',
//   name: 'Travis Redden',
//   screen_name: 'Travis_Redden',
//   location: 'The Woodlands, Texas',
//   description: 'SHSU Alumni • Graduate Student • Composer',
//   url: null,
//   entities: { description: { urls: [] } },
//   protected: false,
//   followers_count: 68,
//   friends_count: 61,
//   listed_count: 3,
//   created_at: 'Sun Jun 28 20:21:36 +0000 2009',
//   favourites_count: 65,
//   utc_offset: null,
//   time_zone: null,
//   geo_enabled: true,
//   verified: false,
//   statuses_count: 10,
//   lang: null,
//   contributors_enabled: false,
//   is_translator: false,
//   is_translation_enabled: false,
//   profile_background_color: '352726',
//   profile_background_image_url: 'http://abs.twimg.com/images/themes/theme5/bg.gif',
//   profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme5/bg.gif',
//   profile_background_tile: false,
//   profile_image_url: 'http://pbs.twimg.com/profile_images/1439432769277399048/IxXlV4Bl_400x400.jpg',
//   profile_image_url_https: 'https://pbs.twimg.com/profile_images/1439432769277399048/IxXlV4Bl_normal.jpg',
//   profile_banner_url: 'https://pbs.twimg.com/profile_banners/51831670/1359937552',
//   profile_link_color: '917A83',
//   profile_sidebar_border_color: 'FFFFFF',
//   profile_sidebar_fill_color: '000000',
//   profile_text_color: 'EB0E0E',
//   profile_use_background_image: true,
//   has_extended_profile: false,
//   default_profile: false,
//   default_profile_image: false,
//   following: false,
//   follow_request_sent: false,
//   notifications: false,
//   translator_type: 'none',
//   withheld_in_countries: []
// }