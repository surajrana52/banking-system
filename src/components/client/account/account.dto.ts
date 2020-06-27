export default interface IGetAccountDTO {
    authUserId: number
}

export interface IWithdrawal extends IGetAccountDTO{
    amount: number
}

export interface IDeposit extends IWithdrawal{

}
