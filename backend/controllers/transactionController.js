import db from "../config/db.js";
export const getCreditBalance = async (req, res) => {
    try {
        const userId = req.user.userId;

        const balance = await db.one(
            `SELECT 
                COALESCE(SUM(
                    CASE 
                        WHEN receiver_id = $1 AND mode = 'credit' THEN credits_exchanged
                        WHEN sender_id = $1 AND mode = 'debit' THEN -credits_exchanged
                        ELSE 0
                    END
                ),0) AS credits
            FROM transactions`
            , [userId]
        )

        if (!balance) {
            return res.status(404).json(
                { status: "failed", message: "Balance not found" }
            );
        }

        res.status(200).json(
            { status: "success",
                message: "Credit balance fetched successfully",
                data: { credits: balance.credits } 
            }
        );
    } catch (error) {
        res.status(500).json(
            { status: "failed", message: error.message }
        );  
    }
};

//this are the credits that are to be used for barter system
export const transferCredits = async (req, res) => {
    try {
        const sender_id = req.user.userId;
        const {receiver_id, gig_id,credits} = req.body;

        if(!receiver_id || !gig_id || !credits){
            return res.status(400).json(
                { status: "failed", message: "receiver_id, gig_id and credits are required" }
            );
        }

        //checking sender balance
        const balance = await db.one(
            
            `SELECT 
                COALESCE(SUM(
                    CASE
                        WHEN receiver_id = $1 THEN credits_exchanged
                        WHEN sender_id = $2 THEN -credits_exchanged
                        ELSE 0
                    END
                ),0) AS credits
                 FROM transactions
                 WHERE mode = 'credit'
                 `,
            [receiver_id,sender_id]
        );

        // if (!balance) {
        //     return res.status(404).json(
        //         { status: "failed", message: "Balance not found" }
        //     );
        // }

        if(balance.credits < credits){
            return res.status(400).json(
                { status: "failed", message: "Insufficient balance" }
            );
        }

        const transaction = await db.one(
                `INSERT INTO transactions 
                    (gig_id,sender_id,receiver_id,credits_exchanged,mode,status)
                VALUES
                    ($1,$2,$3,$4,'credit','completed')
                RETURNING transaction_id,credits_exchanged, created_at`,
                [gig_id,sender_id,receiver_id,credits]
        );
        res.status(201).json(
            { status: "success",
              message: "Credits transferred successfully",
              data: transaction 
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json(
            { status: "failed", message: error.message }
        );  
    }
};

//this is for recording paid transactions made via payment gateway
export const recordPaidTransaction = async (req, res) => {
    try {
        const sender_id = req.user.userId;
        const {receiver_id,gig_id,amount_paid} = req.body;

        if(!receiver_id || !gig_id || !amount_paid){
            return res.status(400).json(
                { status: "failed", message: "receiver_id, gig and amount_paid are required" }
            );
        }

        const transaction = await db.one(
            `INSERT INTO transactions
                (gig_id,sender_id,receiver_id,amount_paid,mode,status)
                VALUES 
                ($1,$2,$3,$4,'paid','completed')
                RETURNING transaction_id,amount_paid, created_at`,
            [gig_id,sender_id,receiver_id,amount_paid]
        )

        res.status(201).json(
            { status: "success",
              message: "Payment recorded successfully",
              data: transaction 
            }
        );
    } catch (error) {
        res.status(500).json(
            { status: "failed", message: error.message }
        );
    }
}
export const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.userId;

        const transactions = await db.any(
            `SELECT 
            t.transaction_id,
            t.mode,
            t.amount_paid,
            t.credits_exchanged,
            t.status,
            t.created_at,
            g.title as gig_title,
            u1.name as sender_username,
            u2.name as receiver_username
        FROM transactions t
        JOIN gigs g ON t.gig_id = g.gig_id
        JOIN users u1 ON t.sender_id = u1.user_id
        JOIN users u2 ON t.receiver_id = u2.user_id
        WHERE t.sender_id = $1 OR t.receiver_id = $1
        ORDER BY t.created_at DESC`,
            [userId]
        );
        res.status(200).json(
            { status: "success",
              message: "Transaction history fetched successfully",
              data: transactions 
            }
        );
    } catch (error) {
        res.status(500).json(
            { status: "failed", message: error.message }
        );  
    }
};