import { Router } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { db } from "../utils/db.js";
import bcrypt from "bcrypt";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
  //1.สร้างก้อนข้อมูล user
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  //2.เข้ารหัสด้วย salt
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  console.log(user);

  //3.ยัด user เข้า collection
  const collection = db.collection("users");
  await collection.insertOne(user);
  //4.รีเทิร์น res
  return res.status(201).json({ message: "User has been created" });
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
  const collection = db.collection("users");
  //1.validate username

  const user = await collection.findOne({ username: req.body.username });
  if (!user) {
    return res.status(404).json({ messgae: "User not found." });
  }

  //2.validate password
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) {
    return res.status(400).json({ meassge: "Password is not valid" });
  }
  //3.สร้างโทเคน โดยใช้ jwt.sign(payload, key, time)

  const token = jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.SECRET_KEY,
    { expiresIn: 900000 }
  );

  //4.return แนบ token

  return res.status(200).json({ message: "Login Succesfully" });
});

export default authRouter;
