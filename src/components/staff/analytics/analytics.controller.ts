import { Request, Response } from "express";
import { getConnection } from "typeorm";

export const getTopSpender = async (req: Request, res: Response) => {

    try {

        let getData = await getConnection().query(`
        SELECT c.fullName, c.email, SUM(amount) AS amount FROM transactions t
        INNER JOIN accounts ac ON ac.id = t.accounts_id
        INNER JOIN clients c ON c.accounts_id = ac.id
        GROUP BY t.accounts_id ORDER BY amount DESC LIMIT 1;
        `);

        return res.json({
            data: getData
        });

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

}


export const getReceivable = async (req: Request, res: Response) => {

    try {

        const { groupBy } = req.params;

        let groupByQuery = ``;
        let selectQuery = ``;

        switch (groupBy) {
            case 'day':
                selectQuery = 'DATE_FORMAT(createdAt,\'%D\') as day';
                groupByQuery = 'GROUP BY DAY(createdAt)';
                break;
            case 'week':
                selectQuery = 'DATE_FORMAT(createdAt,\'%W\') as week';
                groupByQuery = 'GROUP BY WEEK(createdAt)';
                break;
            case 'month':
                selectQuery = 'DATE_FORMAT(createdAt,\'%M\') as month';
                groupByQuery = 'GROUP BY MONTH(createdAt)';
                break;
        }

        let getData = await getConnection().query(`
            SELECT SUM(amount) AS receivedAmount, ${selectQuery} FROM transactions WHERE
            creditDebit = 'CREDIT' ${groupByQuery}
        `);

        return res.json({
            data: getData
        });

    } catch (e) {

        console.log(e);

        return res.status(500).json({ message: "Internal server error." });
    }

}
