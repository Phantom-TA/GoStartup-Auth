import { ApiResponse } from "../utils/api-response.js";

const authMiddleware = async(req,res,next)=>{

  const token = req.cookies['accessToken'];
  if (!token) 
    return res.status(401).json(
        new ApiResponse(401,{message:"accessToken does not exist"}));
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(401).json(
        new ApiResponse(401,{message:"Unauthorized access"}));
  }
}
export {authMiddleware}