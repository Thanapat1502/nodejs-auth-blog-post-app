import axios from "axios";

function jwtInterceptor() {
  // 🐨 Todo: Exercise #6
  //ฟังก์ชั่น MW ที่จะทำงานทุกครั้งที่มีการส่ง req
  //req จะผ่านเข้ามาทางนี้ก่อนเสมอ
  axios.interceptors.request.use((req) => {
    //ตรวจสอบว่ามี token หรือไม่ ด้วยการกำหนดตัวแปร hasToken
    //ซึ่งเป็นค่า boolean จากการถามถึง window.localStorage.getItem("token")
    const hasToken = Boolean(window.localStorage.getItem("token"));
    //ถ้ามี token จะทำการสร้าง header ใหม่ โดยโคลน header เดิม และเพิ่มคีย์ Authorization
    //ค่าของ Authorization จะเป็นการแนบ token กลับไปหาเซิร์ฟเวอร์ โดยใช้คีย์เวิร์ดตามด้านล่าง
    if (hasToken) {
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      };
    }
    //ส่ง req ที่แนบ token แล้วกลับไป ซึ่งจะวิ่งต่อไปยังเซิร์ฟเวอร์
    return req;
  });

  // 🐨 Todo: Exercise #6
  //  ให้เขียน Logic ในการรองรับเมื่อ Server ได้ Response กลับมาเป็น Error
  // โดยการ Redirect ผู้ใช้งานไปที่หน้า Login และลบ Token ออกจาก Local Storage
  // ภายใน Error Callback Function ของ axios.interceptors.response.use

  axios.interceptors.response.use(
    //ฟังก์ชั่นนี้จะทำให้ user logout เมื่อ token ไม่ถูกต้อง
    (req) => {
      return req;
    }, //พารามิเตอร์ตัวแรก ถ้า token ไม่มีปัญหาก็จะรีเทิร์น req กลับไป
    (error) => {
      //พารามิเตอร์ที่สอง เมื่อนเกิด error จะทำการตรวจสอบ
      if (
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized" //ถ้า res.status ส่ง error 401 และ Unauthorized
      ) {
        window.localStorage.removeItem("token"); //จะลบ token และพากลับไปยัง endpoint "/"
        window.location.replace("/");
      }
      // return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;
