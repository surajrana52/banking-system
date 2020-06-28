import {Request, Response} from "express";
import {getManager, getRepository} from "typeorm";
import Clients from "../../../entity/Clients";
import {IMakeDepositDTO} from "./account.dto";
import Accounts from "../../../entity/Accounts";
import Transactions, {DebitCredit} from "../../../entity/Transactions";
import sendEmail from "../../../utils/sendEmail";
import {redis} from "../../../config/redis";

export const getNewRegistrations = async (req: Request, res: Response) => {

    try {

        let newRegistrations = await getRepository(Clients)
            .createQueryBuilder("client")
            .select([
                "client.id",
                "client.fullName",
                "client.email",
                "client.emailVerified",
                "client.accepted",
                "client.createdAt"
            ])
            .where("accepted = 0")
            .getMany();

        return res.json({
            data: newRegistrations
        })

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

}

export const acceptApplication = async (req: Request, res: Response) => {

    try {

        const { status, userId } = req.params;

        await getRepository(Clients)
            .createQueryBuilder()
            .update()
            .set({
                accepted: !!status
            })
            .where("id = :id", {id: userId})
            .execute();

        return res.json({
            message: "Application accepted successfully."
        });

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

}

export const getAccountByUserId = async (req: Request, res: Response) => {

    try {

        const { userId } = req.params;

        let getAccountDetails = await getRepository(Clients)
            .createQueryBuilder("client")
            .innerJoin("client.account", "account")
            .innerJoin("account.accountStatus", "accountStatus")
            .select([
                "client.id",
                "client.fullName",
                "client.email",
                "account.accNumber",
                "account.balance",
                "accountStatus.status"
            ])
            .where("client.id = :id", {id: userId})
            .getOne();

        return res.json({
            data: getAccountDetails
        });


    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

}

export const getAccountByNumber = async (req: Request, res: Response) => {

    try {

        const { accountNo } = req.params;

        let getAccountDetails = await getRepository(Clients)
            .createQueryBuilder("client")
            .innerJoin("client.account", "account")
            .innerJoin("account.accountStatus", "accountStatus")
            .select([
                "client.id",
                "client.fullName",
                "client.email",
                "account.accNumber",
                "account.balance",
                "accountStatus.status"
            ])
            .where("account.accNumber = :accNumber", {accNumber: accountNo})
            .getOne();

        return res.json({
            data: getAccountDetails
        });


    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

}

export const getAccounts = async (req: Request, res: Response) => {

    try {

        const { sort } = req.query;

        let getAccountDetails = await getRepository(Clients)
            .createQueryBuilder("client")
            .innerJoin("client.account", "account")
            .innerJoin("account.accountStatus", "accountStatus")
            .select([
                "client.id",
                "client.fullName",
                "client.email",
                "account.accNumber",
                "account.balance",
                "accountStatus.status"
            ])
            .where(sort ? `accountStatus.status = :sort` : '1=1', { sort: sort.toString().toUpperCase() })
            .getMany();

        return res.json({
            data: getAccountDetails
        });

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

}

export const deleteAccount = async (req: Request, res: Response) => {

    try {

        const { userId } = req.params;

        let getAccountDetails = await getRepository(Clients)
            .createQueryBuilder("client")
            .select([
                "client.id",
                "client.email"
            ])
            .where("client.id = :id", {id: userId})
            .getOne();

        let getDeleteAccountDetails = await getRepository(Clients)
            .createQueryBuilder()
            .update()
            .set({
                accountDeleted: true
            })
            .where("id = :id", {id: userId})
            .execute();

        await redis.lpush("user_blocked", userId);

        let sendAccDeleteEmail = await sendEmail({
            to: getAccountDetails.email,
            from: 'account@abcbank.com',
            subject: 'Withdrawal from your account',
            body: `Your account has been deleted.`
        });

        return res.json({
            message: "Account deleted successfully.",
            developmentHint: sendAccDeleteEmail
        });


    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

}

export const makeDeposit = async (req: Request, res: Response) => {

    try {

        const { amount, userId } = <IMakeDepositDTO>req.body;

        await getManager().transaction(async transactionalEntityManager => {

            let getAccountId = await transactionalEntityManager.getRepository(Clients)
                .createQueryBuilder("client")
                .innerJoin("client.account", "account")
                .select([
                    "client.id",
                    "account.id",
                ])
                .setLock("pessimistic_write")
                .where("client.id = :id", {id: userId})
                .getOne();

            await transactionalEntityManager.getRepository(Accounts)
                .createQueryBuilder()
                .update()
                .set({ balance: () => `balance + ${amount}` })
                .where("id = :id", {id: getAccountId.account.id})
                .execute();

            await transactionalEntityManager.getRepository(Transactions)
                .createQueryBuilder()
                .insert()
                .values({
                    amount: amount,
                    creditDebit: DebitCredit.CREDIT,
                    accountId: getAccountId.account.id,
                    transactionTypeId: 3
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

export const getTransactions = async (req: Request, res: Response) => {

    try {

        const { pageNo } = req.params;

        let page: any = !pageNo ? 1 : pageNo;

        console.log("page no is" + page);

        let offset = (page - 1) * 10;

        let transactions = await getRepository(Transactions)
            .createQueryBuilder("transactions")
            .innerJoin("transactions.transactionType", "transactionType")
            .innerJoin("transactions.account", "account")
            .innerJoin("account.client", "client")
            .select([
                "transactions.id",
                "transactions.amount",
                "transactions.creditDebit",
                "transactions.createdAt",
                "transactionType.type",
                "transactionType.description",
                "account.id",
                "account.accNumber",
                "account.balance",
                "client.fullName",
                "client.email"
            ])
            .limit(10)
            .offset(offset)
            .getMany();

        return res.json({
            data: transactions
        })


    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }


}
