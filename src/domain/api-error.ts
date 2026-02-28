export class ApiError extends Error {
    readonly status?: number;
    readonly statusText?: string;
    readonly url?: string;
  
    constructor(message: string, opts?: { status?: number; statusText?: string; url?: string }) {
      super(message);
      this.name = 'ApiError';
      this.status = opts?.status;
      this.statusText = opts?.statusText;
      this.url = opts?.url;
    }
  }