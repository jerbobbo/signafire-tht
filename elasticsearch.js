const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST || 'localhost:9200',
  log: 'trace'
});


exports.plugin = {
  name: 'elasticSearchPlugin',
  version: '1.0.0',
  register: async (server, options) => {
    // add 'esClient' to server object so that the elasticsearch client 
    // is accessible from any route
    server.decorate('server', 'esClient', client);
  }
};
