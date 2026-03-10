// index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import empresaRoutes from "./routes/empresa.js";


const PORT = process.env.PORT || 4000;


const allowedOrigins = [
    "http://localhost:5173",
    "https://drive-front-ced3yhihl-sebaskazes-projects.vercel.app",
    "https://www.cmbdrive.com",
    "https://cmbdrive.com"
];


const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/empresa", empresaRoutes);

app.listen(PORT, () =>
    console.log(`🚀 API corriendo en puerto ${PORT}`)
);
