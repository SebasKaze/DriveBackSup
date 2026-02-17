// index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import empresaRoutes from "./routes/empresa.js";


const PORT = process.env.PORT || 4000;


const allowedOrigins = [
    "http://localhost:5173",
    "https://drive-front-ced3yhihl-sebaskazes-projects.vercel.app"
];


const app = express();

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // permitir Postman/curl

        if (allowedOrigins.includes(origin)) {
        callback(null, true);
        } else {
        callback(new Error("No permitido por CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 👇 IMPORTANTE: manejar preflight explícitamente
app.options("*", cors());


app.use(express.json());

app.use("/empresa", empresaRoutes);

app.listen(4000, () =>
    console.log(`🚀 API corriendo en puerto ${PORT}`)
);
