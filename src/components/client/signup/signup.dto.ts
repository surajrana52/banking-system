export enum AccountType {
    SAVING = 1,
    CURRENT = 2
}

export default interface ISignupDTO {
    fullName: string,
    email: string,
    password: string,
    accountType: AccountType
}

export interface IVerifyEmail {
    email: string,
    otp: string
}
