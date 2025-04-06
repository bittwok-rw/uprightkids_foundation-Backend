import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import mediaRoutes from "./routes/mediaRoutes";
import projectRoutes from "./routes/projectRoutes";
import teamRoutes from "./routes/teamRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import newsletterRoutes from "./routes/newsletterRoutes";
import dotenv from "dotenv";
import formidable, { Files, File } from "formidable";
import { IncomingMessage } from "http";

dotenv.config();

// Extend Express Request type to include formidable files
declare global {
  namespace Express {
    interface Request {
      files?: Files;
    }
  }
}

const app = express();

// Configure large body size limits
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS middleware
app.use(cors());

// Formidable file upload middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.headers['content-type']?.startsWith('multipart/form-data')) {
    return next();
  }

  const form = formidable({
    maxFileSize: 50 * 1024 * 1024, // 50MB
    multiples: false,
    keepExtensions: true,
    uploadDir: "./uploads",
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ error: "File upload error", details: err.message });
    }

    // Convert formidable files to expected format
    const convertedFiles: { [key: string]: File[] } = {};
    for (const [key, value] of Object.entries(files)) {
      convertedFiles[key] = Array.isArray(value) ? value : [value];
    }

    req.body = fields;
    req.files = convertedFiles;
    next();
  });
});

// Define routes
app.use("/api/media", mediaRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/newsletter", newsletterRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

export default app;