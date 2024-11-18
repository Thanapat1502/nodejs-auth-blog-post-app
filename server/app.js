import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postRouter from "./apps/posts.js";
import authRouter from "./apps/auth.js";
import { client } from "./utils/db.js";
import dotenv from "dotenv";

dotenv.config();

async function init() {
  const app = express();
  const port = process.env.PORT || 4000; 

  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);  
  }

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/posts", postRouter);
  app.use("/auth", authRouter);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("*", (req, res) => {
    res.status(404).send("Not found");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

init();
