import { describe, expect, it } from 'vitest';
import { redactMongoUri } from './env';

describe('redactMongoUri', () => {
  it('strips the username and password from a connection string', () => {
    const redacted = redactMongoUri('mongodb://dbuser:password123@database:27017/contact_db?authSource=admin');

    expect(redacted).not.toContain('password123');
    expect(redacted).not.toContain('dbuser');
    expect(redacted).toContain('database:27017');
    expect(redacted).toContain('contact_db');
  });

  it('does not leak the input when it cannot be parsed', () => {
    expect(redactMongoUri('not-a-uri')).toBe('mongodb://<unparseable-uri>');
  });
});
