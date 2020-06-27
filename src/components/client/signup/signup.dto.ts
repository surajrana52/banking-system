export enum AccountType {
    SAVING = 1,
    CURRENT = 2
}

export default interface ISignupDTO {
    email: string,
    password: string,
    accountType: AccountType
}
