import {Request, Response} from "express";
import {getRepository} from "typeorm";
import Clients from "../../../entity/Clients";
import IGetAccountDTO from "./account.dto";

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
