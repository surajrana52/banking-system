export default interface ILoginDTO {
    email: string,
    password: string
}

export interface IRefreshToken {
    accessToken: string,
    refreshToken: string
}
