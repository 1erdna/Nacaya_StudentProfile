require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { testDatabaseConnection } = require("./db");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const recordRoutes = require("./routes/records");

const app = express();


// ============================================================
// Middleware
// ============================================================

app.use(cors());

// Allow larger JSON requests because captured profile pictures
// may be sent as Base64 image data.
app.use(express.json({
    limit: "10mb"
}));


// ============================================================
// API Routes
// ============================================================

// Login / authentication
app.use("/api/auth", authRoutes);

// Student profile retrieval and update
app.use("/api/profile", profileRoutes);

// Controlled CRUD demonstration records
app.use("/api/records", recordRoutes);


// ============================================================
// Basic Test Routes
// ============================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Nacaya Student Profile API is running!"
    });

});


app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        status: "OK",
        message: "Activity 7 backend is working."
    });

});


// ============================================================
// 404 Handler
// ============================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });

});


// ============================================================
// Server Configuration
// ============================================================

const PORT = process.env.PORT || 3000;


async function startServer() {

    console.log("----------------------------------------");
    console.log("Starting Nacaya Student Profile API...");
    console.log("----------------------------------------");

    const databaseConnected =
        await testDatabaseConnection();


    if (!databaseConnected) {

        console.error(
            "Server was not started because MySQL connection failed."
        );

        console.error(
            "Check the database settings in backend/.env."
        );

        process.exit(1);
    }


    app.listen(PORT, () => {

        console.log("Nacaya Student Profile API");

        console.log(
            `Server running on http://localhost:${PORT}`
        );

        console.log("----------------------------------------");

        console.log("Available endpoints:");

        console.log("GET    /");
        console.log("GET    /api/health");

        console.log("POST   /api/auth/login");

        console.log("GET    /api/profile");
        console.log("PUT    /api/profile");

        console.log("POST   /api/records");
        console.log("GET    /api/records");
        console.log("DELETE /api/records/:recordId");

        console.log("----------------------------------------");
    });
}


startServer();