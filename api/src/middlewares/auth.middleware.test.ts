import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import env from '../config/env';
import { authMiddleware } from './auth.middleware';

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('authMiddleware', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it('accepts a valid bearer token and attaches the user id', () => {
    const token = jwt.sign({ sub: 'user-123' }, env.secret);
    const req = { headers: { authorization: `Bearer ${token}` }, query: {} } as unknown as Request;
    const res = mockResponse();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 'user-123' });
  });

  it('rejects a request with no token', () => {
    const req = { headers: {}, query: {} } as unknown as Request;
    const res = mockResponse();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects a token passed in the query string', () => {
    // Query-string tokens leak into access logs and Referer headers, so they
    // are no longer accepted even when otherwise valid.
    const token = jwt.sign({ sub: 'user-123' }, env.secret);
    const req = { headers: {}, query: { token } } as unknown as Request;
    const res = mockResponse();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects a token signed with the wrong secret', () => {
    const token = jwt.sign({ sub: 'user-123' }, 'some-other-secret-that-is-long-enough');
    const req = { headers: { authorization: `Bearer ${token}` }, query: {} } as unknown as Request;
    const res = mockResponse();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
