export interface CredentialStore {
    get cookies(): string
    set cookies(value: string)
    get email(): string
    get password(): string
    deleteCookies(): void
}