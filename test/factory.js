
const factory = require('factory-girl').factory;
const LoopbackAdapter = require('./loopback-adapter.js');
const faker = require('faker/locale/en_IND');
const app = require('../server/server.js');

factory.setAdapter(new LoopbackAdapter());

factory.define('User', app.models.Users, {
  name:  () => faker.name.findName(),
  email: () => faker.internet.email(),
  gender: "male",
  age: 20,
  password: "test1234",
});

module.exports = factory;
