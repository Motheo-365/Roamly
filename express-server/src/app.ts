// Configures the application

import cors from "cors";
import express from "express";

//Routes
import tripRoutes from "./routes/tripRoutes.js"
import activityRoutes from "./routes/activityRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import activityLogRoutes from "./routes/activityLogRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

//Event Observers
import "./events/tripObservers.js"

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Roamly API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/images", imageRoutes);

/*
    * 404 Not Found Handler

    * Handles requests that do not match any registered route
*/
app.use((_req, res) => {
    return res.status(404).json({
        status: "error",
        message: "Route not found"
    })
});

export default app;