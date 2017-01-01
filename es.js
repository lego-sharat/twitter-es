var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200'
});


function createIndex(indexName) {  
    return client.indices.create({
        index: indexName
    });
}

// function indexExists() {  
//     client.indices.exists({
//         index: indexName
//     }, onIndexExists);
// }

// function onIndexExists (exists) {  
//   if (exists) { 
//     console.log('index:'+indexName +'exists');l̥
//   }else{
//       initIndex();
//   } 
// }

// function onIndexCreated(){
//     addDummyDocument();
// }


// // indexExists();
// client.search({
//   q: 'test',
//   index: indexName
// }).then(function (body) {
//   var hits = body.hits.hits;
//   console.log(JSON.stringify(body));
// }, function (error) {
//   console.trace(error.message);
// });
module.exports.initIndex = function (indexName){
    var promise = new Promise(function(resolve, reject){
        client.indices.exists({
        index:indexName
        }).then(function(exists){
            if(exists){
                console.log('exists');
                initMapping(indexName);
            } else{
                console.log('doesn\'t exist');
                createIndex(indexName).initMapping(indexName).then(resolve(true));
            }
        }).then(resolve(true));    
    });
    return promise;
}

function initMapping(indexName) {
    // console.log('initMapping');
    return client.indices.putMapping({
        index: indexName,
        type: "tweet",
        body: {
            properties: {
                tweet: {
                    tweet_id: { type: "string" },
                    user_id: { type: "string" },
                    text: {type:'string'},
                    tweet_time: {type:"date"},
                    time_offset: {type:"long"},
                    user_followers_count : {type:"long"},
                    user_status_count: {type:"long"},
                    user_location:{type:"string"},
                    urls: {type:"string"},
                    lang: {type: 'string'},
                    hashtags: {type:"string"},
                    retweet_id :{type:"string"},
                    retweet_user_id: {type:"string"},
                    retweet_user_screen_name: {type:"string"}
                }
                
            }
        }
    });
}

module.exports.writeTweet = function(tweet){
    return client.index({
        index: 'politico',
        type: "tweet",
        body: {
            tweet
        }
    });
}