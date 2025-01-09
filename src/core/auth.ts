export interface Auth {
    ensureAuthenticated(): Promise<boolean>
    reAuthenticateAndSetHeaders(): Promise<{ 'csrf-token': string, 'cookie': string } | null>
}