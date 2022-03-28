require('dotenv').config();

// General Dependencies
const Discord = require('discord.js');
const {google} = require('googleapis');
const PORT = process.env.PORT || 5000;


const {
    Client,
    Intents,
    MessageEmbed
} = require('discord.js');

const Twit = require('twit');

// Discord Bot Prefix
let prefix = '$';

// Google Calendar Config
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google Cal API Settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version: "v3"})

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);




// Establish Discord Client and Twitter Dependencies 
const client = new Discord.Client();

// Discord Client Login
client.login(process.env.DISCORD_TOKEN);

var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60*1000,
    strictSSL: true,
})

// Automatic Twitter Search 
client.once('ready', () =>{

    client.on('message', message =>{
        if (message.content === `${prefix}setfeed`){
    
            let tweetCache = {}

            async function getRequest() {

                // Function to Send Tweets
                function sendTweet(tweetData){

                    
                        for (var i = 0; i < tweetData.statuses?.length ; i++){
                            
                            // Tweet Variabels
                            let userName = tweetData.statuses[i]?.user.screen_name
                            let tweetId = tweetData.statuses[i]?.id_str
                            let tweetUrl = `https://www.twitter.com/${userName}/status/${tweetId}`
                            let tweetTime = tweetData.statuses[i]?.created_at
                            let tweetTimeShort = tweetTime?.substring(0,19)
                            let tweetText = tweetData.statuses[i]?.text
                            let tweetPfp = tweetData.statuses[i]?.user.profile_image_url
                            let tweetPfpBig = tweetPfp?.replace("normal", "400x400")
                            
                            if (tweetCache[tweetData.statuses[i]?.id_str]){
                                continue;
                            }


                                const embedTweet = new Discord.MessageEmbed()
                                    .setColor(`#1b95e6`)
                                    .setAuthor(`${userName}`,`${tweetPfpBig}`, `${tweetUrl}`)
                                    //.setTitle(`${userName}`)
                                    .setURL(`${tweetUrl}`)
                                    .setDescription(`${tweetText}`)
                                    //.setThumbnail(`${tweetPfpBig}`)
                                    .setFooter(`${tweetTimeShort}`)
                                    //.setTimestamp(`${tweetTime}`)

                                tweetCache[tweetData.statuses[i]?.id_str] = true;
                                
                                message.channel.send(embedTweet)
                        
                    }
                }


                // #callforscores
                T.get('search/tweets', { q: '#callforscores', count: 5 }, function(err, data, response) {
                    let callForScoreData = data;
                    sendTweet(callForScoreData);
                })

                // #compositioncompetition
                T.get('search/tweets', { q: '#compositioncompetition', count: 5 }, function(err, data, response) {
                    let compositionCompetitionData = data;
                    sendTweet(compositionCompetitionData);
                })

                // #filmscoringcompetition
                T.get('search/tweets', { q: '#filmscoringcompetition', count: 5 }, function(err, data, response) {
                    let filmScoringCompetitionData = data;
                    sendTweet(filmScoringCompetitionData);
                })

                // #scoringcompetition
                T.get('search/tweets', { q: '#scoringcompetition', count: 5 }, function(err, data, response) {
                    let scoringCompetitionData = data;
                    sendTweet(scoringCompetitionData);
                })

                // #scoringcontest
                T.get('search/tweets', { q: '#scoringcontest', count: 5 }, function(err, data, response) {
                    let scoringContestData = data;
                    sendTweet(scoringContestData);
                })

                // #filmscoringcontest
                T.get('search/tweets', { q: '#filmscoringcontest', count: 5 }, function(err, data, response) {
                    let filmScoringContestData = data;
                    sendTweet(filmScoringContestData);
                })

                // #compositioncontest
                T.get('search/tweets', { q: '#compositioncontest', count: 5 }, function(err, data, response) {
                    let compositionContestData = data;
                    sendTweet(compositionContestData);
                })

                // Search Every 12 Hours
                setInterval(function(){
                    getRequest();
                }, 100*43200);
            }
            getRequest();
        }
    });

    client.on('message', message =>{
        if(message.content === `${prefix}setcal`){

            let calCache = {}

            async function gcalRequest() {

                let gCalTodaysDate = new Date();
                let gCalYear = gCalTodaysDate.getFullYear();
                let gCalDay = gCalTodaysDate.getDate();
                let gCalMonthNum = gCalTodaysDate.getMonth();
                let gCalMonths = [`01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`, `09`, `10`, `11`, `12`]
                let gCalMonth = gCalMonths[gCalMonthNum];
                let gCalStart = `${gCalYear}-${gCalMonth}-${gCalDay}T00:00:00+00:00`
                let gCalEndDay = gCalDay+7;
                let gCalEndDayOutput;
                let gCalMonthEnd;
                let gCalYearEnd = gCalYear;

                // If Month is February And A Leap Year 
                if (gCalMonth === '02' && gCalYear % 4 === 0 && gCalEndDay > 29){
                    gCalEndDayOutput = gCalEndDay - 29
                    gCalMonthEnd = gCalMonths[gCalMonthNum + 1]
                } else
                // If Month is February And Not A Leap Year 
                if (gCalMonth === '02' && gCalYear % 4 === 1 && gCalEndDay > 28){
                    gCalEndDayOutput = gCalEndDay - 28
                    gCalMonthEnd = gCalMonths[gCalMonthNum + 1]
                } else
                // If Month Has 31 Days
                if (gCalMonthNum === 0 || gCalMonthNum % 2 === 0 && gCalEndDay > 31){
                    gCalEndDayOutput = gCalEndDay - 31
                    gCalMonthEnd = gCalMonths[gCalMonthNum + 1]
                } else
                // If Month Has 30 Days
                if (gCalMonthNum !== 0 && gCalMonthNum % 2 === 1 && gCalEndDay > 30){
                    gCalEndDayOutput = gCalEndDay - 30
                    gCalMonthEnd = gCalMonths[gCalMonthNum + 1]
                };

                // If Month is December and week extends beyond 31 days
                if (gCalMonth === 12 && gCalEndDay > 31 ){
                    gCalYearEnd = gCalYear + 1;
                };
                
                let gCalEnd =`${gCalYearEnd}-${gCalMonthEnd}-${gCalEndDayOutput}T00:00:00+00:00`
                
               
                // Calendar | Get Events
                const getEvents = async (dateTimeStart, dateTimeEnd) => {

                    try {
                        let response = await calendar.events.list({
                            auth: auth,
                            calendarId: calendarId,
                            timeMin: dateTimeStart,
                            timeMax: dateTimeEnd,
                            timeZone: 'CST/CDT'
                        });
                    
                        items = response['data']['items'];
                        return items;
                    } catch (error) {
                        console.log(`Error at getEvents --> ${error}`);
                        return 0;
                    }
                };

                getEvents(gCalStart, gCalEnd)
                    .then((res) => {
                        for (var i = 0; i < res.length; i++){
                            let eventTitle = res[i]['summary']
                            let eventDescription = res[i]['description']
                            let eventLink = res[i]['htmlLink']
                            let googleCalIcon = 'https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_22_2x.png'
                           
                            let eventStartDate = res[i]['start']['date']
                            let eventStartString = eventStartDate.toString();
                            let eventStartYear = eventStartString.slice(0,4)
                            let eventStartMonth = eventStartString.slice(5,7)
                            let eventStartDay = eventStartString.slice(8)
                            let eventDateString = `${eventStartMonth}-${eventStartDay}-${eventStartYear}`;

                            const embedTweet = new Discord.MessageEmbed()
                                .setColor(`#1b95e6`)
                                .setAuthor(eventTitle, googleCalIcon, eventLink)
                                .setDescription(eventDescription)
                                .setFooter(`Date: ${eventDateString}`)
                            
                            calCache[res[i]['id']] = true;
                            message.channel.send(embedTweet)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                



             // Search Every 24 Hours
             setInterval(function(){
                gcalRequest();
            }, 200*43200);
        }
        gcalRequest();
        }
    })
});



// Twitter Search From User Input
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

            client.channels.fetch(process.env.DISCORD_CHANNEL_ID).then(channel =>{
                for (var i = 0; i < tweetData.statuses?.length ; i++){
                   
                    if (tweetData.statuses[i] === undefined){
                        i = 0;
                    }

                    // Tweet Variabels
                    let userName = tweetData.statuses[i]?.user.screen_name
                    let tweetId = tweetData.statuses[i]?.id_str
                    let tweetUrl = `https://www.twitter.com/${userName}/status/${tweetId}`
                    let tweetTime = tweetData.statuses[i]?.created_at
                    let tweetTimeShort = tweetTime?.substring(0,19)
                    let tweetText = tweetData.statuses[i]?.text
                    let tweetPfp = tweetData.statuses[i]?.user.profile_image_url
                    let tweetPfpBig = tweetPfp?.replace("normal", "400x400")
                    
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