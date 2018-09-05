'use strict';

const Hapi = require('hapi');
const server = new Hapi.server({
  host: process.env.SERVER_URL || 'localhost',
  port: process.env.SERVER_PORT || 8080,
});

const options = {
  reporters: {
    myConsoleReporter: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ logs: '*', args: '*' }]
    }, {
      module: 'good-console',
    }, 'stdout']
  }
}

async function start() {
  try {
    await server.register([{
      plugin: require('good'),
      options
    },
    {
      plugin: require('blipp')
    }]);
    await server.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
