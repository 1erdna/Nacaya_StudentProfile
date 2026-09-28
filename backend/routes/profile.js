const express = require("express");

const { pool } = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================================
// GET /api/profile
// Retrieve the profile of the authenticated student
// ============================================================

router.get("/", authenticateToken, async (req, res) => {

    try {

        const userId = req.user.userId;

        const [profiles] = await pool.execute(
            `
            SELECT
                u.user_id,
                u.username,
                u.email,
                sp.profile_id,
                sp.full_name,
                sp.course,
                sp.year_level,
                sp.bio,
                sp.skills,
                sp.profile_image,
                sp.created_at,
                sp.updated_at

            FROM users AS u

            INNER JOIN student_profiles AS sp
                ON u.user_id = sp.user_id

            WHERE u.user_id = ?

            LIMIT 1
            `,
            [userId]
        );

        if (profiles.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Student profile not found."
            });
        }

        const profile = profiles[0];

        const skillsArray = profile.skills
            ? profile.skills
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0)
            : [];

        return res.status(200).json({

            success: true,

            message:
                "Student profile retrieved successfully.",

            profile: {

                userId:
                    profile.user_id,

                profileId:
                    profile.profile_id,

                username:
                    profile.username,

                email:
                    profile.email,

                fullName:
                    profile.full_name,

                course:
                    profile.course,

                yearLevel:
                    profile.year_level,

                about:
                    profile.bio || "",

                skills:
                    skillsArray,

                profileImage:
                    profile.profile_image || null,

                createdAt:
                    profile.created_at,

                updatedAt:
                    profile.updated_at
            }
        });

    } catch (error) {

        console.error(
            "Profile retrieval error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to retrieve your profile. Please try again."
        });
    }
});


// ============================================================
// PUT /api/profile
// Update the profile of the authenticated student
// ============================================================

router.put("/", authenticateToken, async (req, res) => {

    try {

        const userId = req.user.userId;

        const {
            fullName,
            course,
            yearLevel,
            about,
            skills,
            profileImage
        } = req.body;


        // ----------------------------------------------------
        // Required field validation
        // ----------------------------------------------------

        if (
            !fullName ||
            !course ||
            !yearLevel
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Full name, course, and year level are required."
            });
        }


        // ----------------------------------------------------
        // Prepare skills for database storage
        // ----------------------------------------------------

        let skillsValue = "";

        if (Array.isArray(skills)) {

            skillsValue = skills
                .map(skill => String(skill).trim())
                .filter(skill => skill.length > 0)
                .join(",");

        } else if (typeof skills === "string") {

            skillsValue = skills.trim();
        }


        // ----------------------------------------------------
        // Confirm that this user's profile exists
        // ----------------------------------------------------

        const [existingProfiles] = await pool.execute(
            `
            SELECT profile_id
            FROM student_profiles
            WHERE user_id = ?
            LIMIT 1
            `,
            [userId]
        );


        if (existingProfiles.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Student profile not found."
            });
        }


        // ----------------------------------------------------
        // Update only the authenticated student's profile
        // ----------------------------------------------------

        await pool.execute(
            `
            UPDATE student_profiles

            SET
                full_name = ?,
                course = ?,
                year_level = ?,
                bio = ?,
                skills = ?,
                profile_image = ?

            WHERE user_id = ?
            `,
            [
                fullName.trim(),
                course.trim(),
                yearLevel.trim(),
                typeof about === "string"
                    ? about.trim()
                    : "",
                skillsValue,
                profileImage || null,
                userId
            ]
        );


        // ----------------------------------------------------
        // Return updated profile
        // ----------------------------------------------------

        const [updatedProfiles] = await pool.execute(
            `
            SELECT
                u.user_id,
                u.username,
                u.email,
                sp.profile_id,
                sp.full_name,
                sp.course,
                sp.year_level,
                sp.bio,
                sp.skills,
                sp.profile_image,
                sp.created_at,
                sp.updated_at

            FROM users AS u

            INNER JOIN student_profiles AS sp
                ON u.user_id = sp.user_id

            WHERE u.user_id = ?

            LIMIT 1
            `,
            [userId]
        );


        const profile = updatedProfiles[0];

        const skillsArray = profile.skills
            ? profile.skills
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0)
            : [];


        return res.status(200).json({

            success: true,

            message:
                "Profile updated successfully.",

            profile: {

                userId:
                    profile.user_id,

                profileId:
                    profile.profile_id,

                username:
                    profile.username,

                email:
                    profile.email,

                fullName:
                    profile.full_name,

                course:
                    profile.course,

                yearLevel:
                    profile.year_level,

                about:
                    profile.bio || "",

                skills:
                    skillsArray,

                profileImage:
                    profile.profile_image || null,

                createdAt:
                    profile.created_at,

                updatedAt:
                    profile.updated_at
            }
        });

    } catch (error) {

        console.error(
            "Profile update error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to update your profile. Please try again."
        });
    }
});


module.exports = router;