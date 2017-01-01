var Twitter = require('twitter');


var es = require('./es');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

es.initIndex('politico').then(
    function(response){
        console.log('initialized');
        maybeProceedToCrawling(response);
    }
);



var maybeProceedToCrawling = function (response){
    if(response){
        // var stream = client.stream('statuses/filter', {track: '#UCL, UCL, Arsenal, PSG, Paris Saint Germain, Atletico, Atletico Madrid, Manchester City, MCFC, Man City, AFC, #AFCvPSG, Barcelona, Barca, PSV, Napoli, Dynamo Kyiv, Dynamo, Celtic'});
        var stream = client.stream('statuses/filter', {track: 'Modi, BHIM, narendramodi, pmoindia, #BHIM', follow:'18839785, 1447949844, 1346439824, 141208596, 219617448, 138822469, 405427035, 30417501, 3171712086, 56304605, 19929890, 24705126, 347035710, 97217966, 2526794479, 120965579, 143409075, 754667570288992256, 50943008, 59983585, 47595335, 1153045459, 2183816041, 130104041, 60937837, 207809313'});
        stream.on('data', onGetTweet);
        stream.on('error', onTweetStreamError);
    }
    
};

var flag = false;

var onGetTweet = function(event){
    // if(event.lang === 'en'){
        var time = new Date(event.created_at).getTime();
        // if(!flag){
        //     console.log(JSON.stringify(event));
        //     flag = true;            
        // }
        var tweet = {
            tweet_id :event.id_str,
            text : event.text,
            tweet_time : time,
            time_offset : event.user.utc_offset,
            user_id : event.user.id_str,
            user_followers_count : event.user.followers_count,
            user_status_count : event.user.statuses_count,
            lang : event.lang,
            name : event.user.name,
            screen_name : event.user.screen_name
        };
            
        var user_location = event.user.location;
        if(user_location != null)
            tweet.user_location = user_location; 
        
        if(event.entities.urls.length > 0){
            tweet.urls = []; 
            for(var i=0; i<event.entities.urls.length; i++){
                tweet.urls.push(event.entities.urls[i].expanded_url);
            }
        }
        if(event.entities.hashtags.length > 0){
            tweet.hashtags = [];
            for(var i=0; i<event.entities.hashtags.length; i++){
                tweet.hashtags.push(event.entities.hashtags[i].text);
            }
        }

        if(event.retweeted_status){
            tweet.retweet_id = event.retweeted_status.id_str;
            tweet.retweet_user_id = event.retweeted_status.user.id_str;
            tweet.retweet_screen_name = event.retweeted_status.user.screen_name;
        }
        // console.log(tweet);
    // }
    es.writeTweet(tweet);
  
    // console.log(JSON.stringify(event));
};

var onTweetStreamError = function (error){
    throw error;
};

// maybeProceedToCrawling(true);

// var stream = client.stream('statuses/filter', {track: 'javascript, python'});
// stream.on('data', function(event) {
//             if(event.lang === 'en'){
//                 var time = new Date(event.created_at).getTime();
//         var tweet = {
//             tweet_id :event.id_str,
//             text : event.text,
//             tweet_time : time,
//             time_offset : event.user.utc_offset,
//             user_id : event.user.id_str,
//             user_followers_count : event.user.followers_count,
//             user_status_count : event.user.statuses_count
//         };
            
//         var user_location = event.user.location;
//         if(user_location != null)
//             tweet.user_location = user_location; 
        
//         if(event.entities.urls.length > 0){
//             tweet.urls = []; 
//             for(var i=0; i<event.entities.urls.length; i++){
//                 tweet.urls.push(event.entities.urls[i].expanded_url);
//             }
//         }
//         if(event.entities.hashtags.length > 0){
//             tweet.hashtags = [];
//             for(var i=0; i<event.entities.hashtags.length; i++){
//                 tweet.hashtags.push(event.entities.hashtags[i].text);
//             }
//         }
//         console.log(tweet);
//     }
  
//     // console.log(JSON.stringify(event));
// });

// stream.on('error', function(error) {
//   throw error;
// });