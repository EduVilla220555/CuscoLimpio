const request = require('supertest');
const app = require('../src/app');

describe('Health and basic routes', () => {
  test('GET /health should return status 200 and JSON', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  test('Unknown route returns 404', async () => {
    const res = await request(app).get('/no-existe-ruta');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('success', false);
  });
});
