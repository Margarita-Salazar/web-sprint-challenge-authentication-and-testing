const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
});

afterAll(async () => {
  await db.destroy();
});

test('sanity', () => {
  expect(true).not.toBe(false);
});


describe('server.js', () => {
  describe('[POST] /api/auth/register', () => {
    test('respond with status 400 due to missing info from the request body ', async () => {
      let res = await request(server).post('/api/auth/register').send({ username: '', password: '' });
      expect(res.status).toBe(400);
      res = await request(server).post('/api/auth/register').send({ username: 'Joe', });
      expect(res.status).toBe(400);
      res = await request(server).post('/api/auth/register').send({ password: "1234" });
      expect(res.status).toBe(400);
    });
    test('responds with created user', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: "Billy", password: "1234" });
      expect(res.body).toMatchObject({ id: 1, username: "Billy" });
    });
  });
  describe('[POST] /api/auth/login', () => {
    test('responds with the correct message on valid credentials', async () => {
      await request(server).post('/api/auth/register').send({ username: "Joe", password: "1234" });
      const res = await request(server).post('/api/auth/login').send({ username: "Joe", password: "1234" });
      expect(res.body.message).toMatch("welcome, Joe");
    });
    test('responds with the correct status and message on invalid credentials', async () => {
      await request(server).post('/api/auth/register').send({ username: "Joe", password: "1234" });
      let res = await request(server).post('/api/auth/login').send({ username: 'notJoe', password: '1234' });
      expect(res.body.message).toMatch("Invalid credentials");
      expect(res.status).toBe(401);
      res = await request(server).post('/api/auth/login').send({ username: 'Joe', password: '12345' });
      expect(res.body.message).toMatch("Invalid credentials");
      expect(res.status).toBe(401);
    });

  });
});
