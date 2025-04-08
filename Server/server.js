import express from "express"; 
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import axios from "axios";

import { connectMongoDB } from "./database/connection.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const PORT = process.env.SERVER_PORT || 5050;
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use("/lifeflow/api", authRoutes);

app.post("/api/extract-hemoglobin", async (req, res) => {
  try {
    const { extractedText } = req.body;
    const API_URL = process.env.OPEN_AI_KEY || "";

    const prompt = `Check if the report belongs to the same person mentioned in the userDetails at the bottom of the text. If yes, extract the following from the blood report:

    - Hemoglobin (g/dL)
    - Total WBC count
    - Neutrophils
    - Lymphocytes
    - Eosinophils
    - Platelet count
    
    Return a JSON object where keys are the parameter names and values are either the extracted number or null if not found.
    
    Text: ${extractedText}`;

    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error processing request", error });
  }
});


app.listen(PORT, async () => {
  await connectMongoDB();
  console.table({
    "Server Status": "Active",
    "Server Port": PORT,
    "MongoDB": "Connected",
  });
});