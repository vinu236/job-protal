// Import  modules
import express from "express";
import { json, urlencoded } from "express";
import { config } from "dotenv";
import dbConnect from "./utils/dbConnect";
import { userRouter } from "./routes/user";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth";
import { companyRouter } from "./routes/company";
// Initialize express app
const app = express();

// Load environment variables
config();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// routes
app.use("/api/jobSeeker", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/company", companyRouter);

// err handler middleware
app.use(errorHandler);

// Define port
const port = process.env.PORT || 8000;

// Start server
app.listen(port, async () => {
  console.log(`Data pool server running on http://localhost:${port}`);
  // calling db for connecting the data base
  await dbConnect();
});
