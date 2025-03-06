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

    const response = await axios.post(API_URL, {
      contents: [
        {
          parts: [
            {
              text: `Extract the hemoglobin level from the following blood report text. Return only the numeric value in g/dL. If no hemoglobin level is found, return 'null'. text: ${extractedText}`
            }
          ]
        }
      ]
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