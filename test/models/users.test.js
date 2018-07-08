const loopback = require('../../server/server.js');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const factory = require('../factory.js');
const faker = require('faker/locale/en_IND');

const app = loopback.dataSources.postgres.models;

describe('Users', () => {
  describe('POST /api/Users/register', () => {
    it('create a new user based on unique inputs', async () => {
      const user = await factory.build('User', { mobile_no: '9876543255', email: 'user3@gmail.com'});
      request(loopback)
        .post('/api/Users/register')
        .set('Accept', 'application/json')
        .send(user)
        .expect(200)
        .end((err, res) => {
          expect(res.body.user.mobile_no).to.equal(user.mobile_no);
        });
    });
  });
  describe('POST /api/Users/login', () => {
    it('successfull userl login', async () => {
      const user = await factory.create('User', { mobile_no: '9876543211', email: 'user2@gmail.com'});
      request(loopback)
        .post('/api/Users/register')
        .set('Accept', 'application/json')
        .send({email: 'user2@gmail.com', password:'test1234'})
        .expect(200)
        .end((err, res) => {
          expect(res.body.user.mobile_no).to.equal(user.mobile_no);
        });
    });
  });
});
