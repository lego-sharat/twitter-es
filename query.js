var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
client.search({
  q: 'javascript',
  index: 'twitter'
}).then(function (body) {
  var hits = body.hits.hits;
  console.log(JSON.stringify(body));
}, function (error) {
  console.trace(error.message);
});