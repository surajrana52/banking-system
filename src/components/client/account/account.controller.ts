import {Request, Response} from "express";
import {getManager, getRepository} from "typeorm";
import Clients from "../../../entity/Clients";
import IGetAccountDTO, {IWithdrawal, IDeposit} from "./account.dto";
import Accounts from "../../../entity/Accounts";
import Transactions, {DebitCredit} from "../../../entity/Transactions";
import sendEmail from "../../../utils/sendEmail";

export const makeDeposit = async (req: Request, res: Response) => {

    try {

        const { amount, authUserId } = <IDeposit>req.body;

        await getManager().transaction(async transactionalEntityManager => {

            let getCurrentBalance = await transactionalEntityManager.getRepository(Clients)
                .createQueryBuilder("client")
                .innerJoin("client.account", "account")
                .select([
                    "client.id",
                    "account.id",
                ])
                .setLock("pessimistic_write")
                .where("client.id = :id", {id: authUserId})
                .getOne();

            await transactionalEntityManager.getRepository(Accounts)
                .createQueryBuilder()
                .update()
                .set({ balance: () => `balance + ${amount}` })
                .where("id = :id", {id: getCurrentBalance.account.id})
                .execute();

            await transactionalEntityManager.getRepository(Transactions)
                .createQueryBuilder()
                .insert()
                .values({
                    amount: amount,
                    creditDebit: DebitCredit.CREDIT,
                    accountId: getCurrentBalance.account.id,
                    transactionTypeId: 2
                })
                .execute();

            return res.json({
                message: "Deposit successfully."
            });

        });

        return true;


    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }


}


export const makeWithdrawal = async (req: Request, res: Response) => {

    try {

        const { amount, authUserId } = <IWithdrawal>req.body;

        await getManager().transaction(async transactionalEntityManager => {

            let getCurrentBalance = await transactionalEntityManager.getRepository(Clients)
                .createQueryBuilder("client")
                .innerJoin("client.account", "account")
                .select([
                    "client.id",
                    "client.email",
                    "account.id",
                    "account.balance",
                ])
                .setLock("pessimistic_write")
                .where("client.id = :id", {id: authUserId})
                .getOne();

           if (getCurrentBalance.account.balance >= amount){

               await transactionalEntityManager.getRepository(Accounts)
                   .createQueryBuilder()
                   .update()
                   .set({ balance: () => `balance - ${amount}` })
                   .where("id = :id", {id: getCurrentBalance.account.id})
                   .execute();

               await transactionalEntityManager.getRepository(Transactions)
                   .createQueryBuilder()
                   .insert()
                   .values({
                       amount: amount,
                       creditDebit: DebitCredit.DEBIT,
                       accountId: getCurrentBalance.account.id,
                       transactionTypeId: 1
                   })
                   .execute();


               let sendWithdrawalEmail = await sendEmail({
                   to: getCurrentBalance.email,
                   from: 'withdrawal@abcbank.com',
                   subject: 'Withdrawal from your account',
                   body: `Amount of Rs. ${amount} has been deducted from your account.`
               });

               return res.json({
                   message: "Withdrawal successful.",
                   developmentHint: sendWithdrawalEmail
               });

           }else {

               return res.status(400).json({
                   message: "Insufficient balance."
               });

           }

        });

        return true;

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

}


export const getAccountDetails = async (req: Request, res: Response) => {

    try {

        const { authUserId } = <IGetAccountDTO>req.body;

        let getAccountDetails = await getRepository(Clients)
            .createQueryBuilder("client")
            .innerJoin("client.account", "account")
            .innerJoin("account.accountStatus", "accountStatus")
            .select([
                "client.id",
                "client.email",
                "account.accNumber",
                "account.balance",
                "accountStatus.status"
            ])
            .where("client.id = :id", {id: authUserId})
            .getOne();

        return res.json({
            data: getAccountDetails
        });

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

}

export const getAccountTransactions = async (req: Request, res: Response) => {

    try {

        const { authUserId } = <IGetAccountDTO>req.body;

        let getAccountTransactions = await getRepository(Clients)
            .createQueryBuilder("client")
            .innerJoin("client.account", "account")
            .leftJoin("account.transactions", "transactions")
            .leftJoin("transactions.transactionType", "transactionType")
            .select([
                "client.id",
                "account.id",
                "transactions",
                "transactionType.type",
                "transactionType.description"
            ])
            .where("client.id = :id", {id: authUserId})
            .orderBy("transactions.createdAt", "DESC")
            .getOne();

        return res.json({
            data: getAccountTransactions.account.transactions
        });

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }
}
