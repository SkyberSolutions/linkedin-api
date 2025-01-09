export interface Auth {
    ensureAuthenticated(): Promise<boolean>
    reAuthenticate(): Promise<{ 'csrf-token': string, 'cookie': string } | null>
}