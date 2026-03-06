import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.VITE_API_URL = 'http://localhost:3000/api/matches';
process.env.VITE_API_USERNAME = 'testuser';

// Mock fetch if needed
global.fetch = vi.fn();
