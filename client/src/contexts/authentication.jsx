import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; //<<<<<<< npm i jwt-decode

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });
  const navigate = useNavigate();

  const login = async (data) => {
    // 🐨 Todo: Exercise #4
    //  ให้เขียน Logic ของ Function `login` ตรงนี้
    //  Function `login` ทำหน้าที่สร้าง Request ไปที่ API POST /login
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
    try {
      //1.ส่ง credential ไป sever
      const result = await axios.post("http://localhost:4000/auth/login", data);
      //2.รับ token มาจาก res
      const token = result.data.token;
      //3.ตั้งค่า token ใน local storage
      localStorage.setItem("token", token);
      //4.รับ user data จาก token โดยใช้ jwtDecode(token)
      const userDataFromToken = jwtDecode(token);
      //5.ตั้ง state ให้มีค่าเป็น state เดิม (...state) + ข้อมูล user จาก token
      setState({ ...state, user: userDataFromToken });
      //6.นาวิเกต user กลับหน้าหลัก
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const register = async (data) => {
    // 🐨 Todo: Exercise #2
    //  ให้เขียน Logic ของ Function `register` ตรงนี้
    //  Function register ทำหน้าที่สร้าง Request ไปที่ API POST /register
    //  ที่สร้างไว้ด้านบนพร้อมกับ Body ที่กำหนดไว้ในตารางที่ออกแบบไว้
    await axios.post("http://localhost:4000/auth/register", data);
    navigate("/login");
  };

  const logout = () => {
    // 🐨 Todo: Exercise #7
    //  ให้เขียน Logic ของ Function `logout` ตรงนี้
    //  Function logout ทำหน้าที่ในการลบ JWT Token ออกจาก Local Storage

    //1.localStorage.removeItem ลบ token
    //2.setState user เป็น null
    const logout = () => {
      localStorage.removeItem("token");
      setState({ ...state, user: null });
    };
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}>
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
