import { describe, it, expect } from 'vitest';
import { ApiError } from '../domain/api-error';

describe('ApiError', () => {
  it('should create an error with only a message', () => {
    const error = new ApiError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('ApiError');
    expect(error.status).toBeUndefined();
    expect(error.statusText).toBeUndefined();
    expect(error.url).toBeUndefined();
  });

  it('should create an error with message and status code', () => {
    const error = new ApiError('Request failed', { status: 404 });
    expect(error.message).toBe('Request failed');
    expect(error.status).toBe(404);
  });

  it('should create an error with message and status text', () => {
    const error = new ApiError('Request failed', { statusText: 'Not Found' });
    expect(error.message).toBe('Request failed');
    expect(error.statusText).toBe('Not Found');
  });

  it('should create an error with message, status, statusText, and url', () => {
    const error = new ApiError('Request failed', {
      status: 500,
      statusText: 'Internal Server Error',
      url: 'http://api.example.com/matches',
    });
    expect(error.message).toBe('Request failed');
    expect(error.status).toBe(500);
    expect(error.statusText).toBe('Internal Server Error');
    expect(error.url).toBe('http://api.example.com/matches');
  });

  it('should be instanceof Error', () => {
    const error = new ApiError('Test');
    expect(error instanceof Error).toBe(true);
  });

  it('should be instanceof ApiError', () => {
    const error = new ApiError('Test');
    expect(error instanceof ApiError).toBe(true);
  });

  it('should handle various status codes', () => {
    const statusCodes = [400, 401, 403, 404, 429, 500, 502, 503];
    statusCodes.forEach(code => {
      const error = new ApiError('Error', { status: code });
      expect(error.status).toBe(code);
    });
  });
});
