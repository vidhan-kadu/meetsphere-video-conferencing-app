import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusCodes } from "http-status-codes";

 
export const AuthContext = createContext({});

const client = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/users`,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext);

  const [userData, setUserData] = useState(authContext);

   const router = useNavigate();
   
  const handleRegister = async (name, username, password) => {
    try {
      let request = await client.post("/register", {
        name: name,
        username: username,
        password: password,
      });
      if (request.status === StatusCodes.CREATED) {
        return request.data.message;
      }
    } catch (err) {
      throw err;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      let request = await client.post("/login", {
        username: username,
        password: password,
      });

      if (request.status === StatusCodes.OK) {
        localStorage.setItem("token", request.data.token);
        router("/home")
      }
      return request.data;
    } catch (err) {
      throw err;
      // if(err.response){
      //    throw err.response;
      // }else{
      //     throw { data: { message: "Server not reachable" } };
      // }
    }
  };
  const getHistoryOfUser = async () =>{
    try{
        let request = await client.get("/get_all_activity",{
            params:{
                token: localStorage.getItem("token")
            }
        });
        return request.data 
       } catch (err){
        throw err;
       }
}

const addToUserHistory = async (meetingCode) =>{
  try{
    let request = await client.post("/add_to_activity",{
      token:localStorage.getItem("token"),
      meeting_code: meetingCode
    });
    return request
  }catch(e){
    throw e;
  }
}



  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
