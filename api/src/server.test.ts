import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from './server';

describe('app', () => {
  it('serves the root route', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Contact API is running');
  });

  it('reports unhealthy while MongoDB is disconnected', async () => {
    // No database connection is opened in tests, so /health must fail closed
    // rather than reporting a container that cannot serve traffic as ready.
    const response = await request(app).get('/health');

    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({ status: 'degraded', database: 'disconnected' });
  });

  it('sets security headers', async () => {
    const response = await request(app).get('/');

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['content-security-policy']).toBeDefined();
  });

  it('answers unknown routes with the shared JSON error shape', async () => {
    const response = await request(app).get('/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('error');
  });

  it('rejects unauthenticated API calls', async () => {
    const response = await request(app).get('/api/contacts');

    expect(response.status).toBe(401);
  });
});
