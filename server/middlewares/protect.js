import jwt from "jsonwebtoken";
// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`
// เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่
export const protect = async (req, res, next) => {
  //1.เข้าถึง tokent ใน req.header
  const token = req.headers.authorization;

  //2.ถ้าไม่มี token หรือไม่ได้ขึ้นต้นด้วย Bearer_ จะรีเทิร์น 401 ออกไปเลย
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token has invalid format" });
  }

  //3.ตัด Bearer ออกจาก token
  const tokenWithoutBearer = token.split(" ")[1];

  //4.verify ว่า token ถูกต้องตาม SECRET_KEY หรือไม่ && หมดอายุหรือยัง
  jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, payload) => {
    //5.กรณีที่เกิด error จะรีเทิร์น 401 กลับไป
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }

    //6.เมื่อผ่านแล้ว จะแปลงข้อมูล payload กลับเป็น json แล้วใส่กลับเข้าไปใน req.user
    req.user = payload;

    //7.ส่ง req ที่ verify และ decripted แล้ว ไปยังทำงานต่อยัง controller function
    next();
  });
};
