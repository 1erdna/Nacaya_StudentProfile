const express = require("express");

const { pool } = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================================
// POST /api/records
// CREATE a controlled test record
// ============================================================

router.post("/", authenticateToken, async (req, res) => {

    try {

        const userId = req.user.userId;

        const {
            title,
            description
        } = req.body;


        // Validate required information
        if (!title || !title.trim()) {

            return res.status(400).json({
                success: false,
                message: "Record title is required."
            });
        }


        const [result] = await pool.execute(
            `
            INSERT INTO profile_test_records
            (
                user_id,
                title,
                description
            )
            VALUES (?, ?, ?)
            `,
            [
                userId,
                title.trim(),
                typeof description === "string"
                    ? description.trim()
                    : ""
            ]
        );


        return res.status(201).json({

            success: true,

            message:
                "Test record created successfully.",

            record: {
                recordId: result.insertId,
                userId: userId,
                title: title.trim(),
                description:
                    typeof description === "string"
                        ? description.trim()
                        : ""
            }
        });


    } catch (error) {

        console.error(
            "Create record error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to create test record."
        });
    }
});


// ============================================================
// GET /api/records
// READ test records belonging to authenticated user
// ============================================================

router.get("/", authenticateToken, async (req, res) => {

    try {

        const userId = req.user.userId;


        const [records] = await pool.execute(
            `
            SELECT
                record_id,
                user_id,
                title,
                description,
                created_at

            FROM profile_test_records

            WHERE user_id = ?

            ORDER BY record_id DESC
            `,
            [userId]
        );


        const formattedRecords = records.map(
            record => ({
                recordId:
                    record.record_id,

                userId:
                    record.user_id,

                title:
                    record.title,

                description:
                    record.description,

                createdAt:
                    record.created_at
            })
        );


        return res.status(200).json({

            success: true,

            message:
                "Test records retrieved successfully.",

            records:
                formattedRecords
        });


    } catch (error) {

        console.error(
            "Read records error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to retrieve test records."
        });
    }
});


// ============================================================
// DELETE /api/records/:recordId
// DELETE a controlled test record
// ============================================================

router.delete(
    "/:recordId",
    authenticateToken,
    async (req, res) => {

        try {

            const userId =
                req.user.userId;

            const recordId =
                Number(req.params.recordId);


            if (
                !Number.isInteger(recordId) ||
                recordId <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid record ID."
                });
            }


            /*
             * user_id is included in the DELETE condition.
             *
             * Therefore, an authenticated user cannot delete
             * another user's test record simply by changing
             * the record ID.
             */

            const [result] = await pool.execute(
                `
                DELETE FROM profile_test_records

                WHERE record_id = ?
                AND user_id = ?
                `,
                [
                    recordId,
                    userId
                ]
            );


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Test record not found."
                });
            }


            return res.status(200).json({

                success: true,

                message:
                    "Test record deleted successfully."
            });


        } catch (error) {

            console.error(
                "Delete record error:",
                error
            );


            return res.status(500).json({
                success: false,
                message:
                    "Unable to delete test record."
            });
        }
    }
);


module.exports = router;