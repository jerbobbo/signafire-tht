'use strict';
const Sequelize = require('sequelize');
const dbSeed = require('./seed');

const dbName = process.env.DB_NAME || 'database';
const dbUser = process.env.DB_USER || 'username';
const dbPass = process.env.DB_PASS || 'password';
const dbHost = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(
  dbName, 
  dbUser, 
  dbPass, {
  host: dbHost,
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  storage: './database.sqlite',
  operatorsAliases: false
});

// Model Definitions
const User = sequelize.define('user', {
  name: Sequelize.STRING
});

const Index = sequelize.define('index', {
  name: Sequelize.STRING
})

const Access = sequelize.define('access', {
  read: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  modify: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  delete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
})

// Model Associations
Access.belongsTo(User);
Access.belongsTo(Index);
User.hasMany(Access);

const db = {User, Index, Access};

exports.plugin = {
  name: 'databasePlugin',
  version: '1.0.0',
  register: async (server, options) => {
    // add 'db' to server object so that models are accessible from any route
    server.decorate('server', 'db', db);

    await sequelize.sync({force: true});
    console.log(`Connected to database '${dbName}' at ${dbHost}`);
    await dbSeed(db);
    console.log('Database seeded');
  }
};
