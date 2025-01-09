export interface Client {
    updateAuthHeaders(csrfToken: string, encodedCookies: string): void
  }