import express from "express"; 
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import os from "node:os";
import cluster from "node:cluster";
import path from "path"; 
import { fileURLToPath } from "url"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { connectMongoDB } from "./database/connection.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const PORT = process.env.SERVER_PORT || 5050;

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve static files (for example, if you have uploads directory)
app.use('/uploads', express.static('uploads'));

app.use("/lifeflow/auth", authRoutes);
app.listen(PORT, async () => {
  await connectMongoDB();
  console.table({
    "Server Status": "Active",
    "Server Port": PORT,
    "MongoDB": "Connected",
  });
});



// const app = express();

// const numCPUs = os.availableParallelism() || 1;

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);

//   // Fork workers
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
//     cluster.fork();
//   });
// } else {