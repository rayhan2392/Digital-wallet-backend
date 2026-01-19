/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;
let isConnected = false;

// Connect to MongoDB with connection caching for serverless
const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log("Using existing database connection");
        return;
    }

    try {
        await mongoose.connect(envVars.DB_URL);
        isConnected = true;
        console.log("Connected to DB!!");
        
        // Seed super admin only once
        if (process.env.VERCEL) {
            await seedSuperAdmin();
        }
    } catch (error) {
        console.log("DB Connection Error:", error);
        isConnected = false;
        throw error;
    }
};

const startServer = async () => {
    try {
        await connectDB();

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listening to port ${envVars.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

// Only run server locally, not in Vercel
if (!process.env.VERCEL) {
    (async () => {
        await startServer();
        await seedSuperAdmin();
    })();
} else {
    // For Vercel: Ensure DB connection before handling requests
    connectDB().catch(err => console.error("Initial DB connection failed:", err));
}

process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

// Unhandler rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// Uncaught Exception Error
// throw new Error("I forgot to handle this local erro")


/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */
