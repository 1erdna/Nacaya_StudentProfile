require("dotenv").config();

const bcrypt = require("bcryptjs");
const { pool } = require("./db");

async function seedDatabase() {
    try {
        console.log("----------------------------------------");
        console.log("Creating Activity 7 test student...");
        console.log("----------------------------------------");

        // Test account details
        const username = "andrei";
        const email = "andrei@nacaya.student";
        const password = "andrei123";

        // Securely hash the password
        const passwordHash = await bcrypt.hash(password, 12);

        // Check whether the test user already exists
        const [existingUsers] = await pool.execute(
            "SELECT user_id FROM users WHERE username = ? OR email = ?",
            [username, email]
        );

        if (existingUsers.length > 0) {
            console.log("Test student already exists.");
            console.log("No duplicate account was created.");
            return;
        }

        // Create user
        const [userResult] = await pool.execute(
            `INSERT INTO users (username, email, password_hash)
             VALUES (?, ?, ?)`,
            [username, email, passwordHash]
        );

        const userId = userResult.insertId;

        // Create profile linked to this user
        await pool.execute(
            `INSERT INTO student_profiles
            (
                user_id,
                full_name,
                course,
                year_level,
                bio,
                skills,
                profile_image
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                "Andrei Jullian Nacaya",
                "BS in Information Technology",
                "3rd Year",
                "I am an IT student interested in software development, responsive web applications, mobile development, and modern technology.",
                "HTML5,CSS3,JavaScript,Git,GitHub,Apache Cordova",
                null
            ]
        );

        console.log("Test student created successfully!");
        console.log("");
        console.log("LOGIN CREDENTIALS");
        console.log("-----------------");
        console.log("Username: andrei");
        console.log("Password: andrei123");
        console.log("");
        console.log("The password stored in MySQL is HASHED.");
        console.log("----------------------------------------");
    } catch (error) {
        console.error("----------------------------------------");
        console.error("Database seed FAILED.");
        console.error("Error:", error.message);
        console.error("----------------------------------------");
    } finally {
        await pool.end();
    }
}

seedDatabase();