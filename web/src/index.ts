import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import activityRoutes from "./routes/activity";
import balanceRoutes from "./routes/balance";
import userRoutes from "./routes/users"
import connectDatabase from "./config/database";
import configureCloudinary from "./config/cloudinary";

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (curl/postman) where Origin header is absent.
    if (!origin) {
      callback(null, true);
      return;
    }

    if (FRONTEND_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
  maxAge: 600,
};



// Middleware
app.use(
  cors(corsOptions)
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/activity", activityRoutes);
app.use("/balance", balanceRoutes);
app.use("/user", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Start server after DB is ready


const startServer = async () => {
  try {
    await connectDatabase();
    configureCloudinary();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();