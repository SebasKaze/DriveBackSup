// index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import empresaRoutes from "./routes/empresa.js";



const app = express();

app.use(cors());
app.use(express.json());

app.use("/empresa", empresaRoutes);

app.listen(4000, () =>
    console.log("🚀 API corriendo en http://localhost:4000")
);
