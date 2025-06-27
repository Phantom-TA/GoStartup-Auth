import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/api-response.js"
import crypto from "crypto"
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'


const registerUser = async(req,res) => {
    console.log("started registration")
    const { name , email , password } = req.body;
    if(!name || !email || !password )
    {
        return res.status(400).json(
            new ApiResponse(400,{message:"Please fill all the required fields"})
        )
    }
    try{
        const existingUser = await User.findOne({email})
        if(existingUser)
            return res.status(400).json(
                new ApiResponse(400,{message:"User already exists"})
        )
        const user = await User.create({
            name , 
            email,
            password
        })
       
        if(!user)
            return res.status(404).json(
                new ApiResponse(404,{message:"User not registered"})
        )
        const token = crypto.randomBytes(32).toString('hex')
        user.emailVerificationToken = token;
        user.emailVerificationExpiry = Date.now() + 15*60*1000
        await user.save();
        
        const createdUser = user.toObject();
        delete createdUser.password;
        delete createdUser.emailVerificationToken;
        delete createdUser.emailVerificationExpiry;
        delete createdUser.refreshToken;

         const transporter = nodemailer.createTransport({
           host : process.env.EMAIL_HOST,
           port : process.env.EMAIL_PORT,
           secure:false,
           auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
           }
        });

        const mailOption ={
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking on the following link:
               ${process.env.BASE_URL}/api/verify-email/${token}`
        }

        await transporter.sendMail(mailOption)


        res.status(201).json(
            new ApiResponse(201,{message:"User registered successfully.Please verify your email" , createdUser })
        )

    }
    catch(error)
    {
        return res.status(500).json(
            new ApiResponse(500,{message:"Error in registering the user", error})
        )
    }
}

const loginUser = async(req,res) => { 
   
    const { email , password } =req.body;
    if(!email || !password)
        return res.status(400).json(
            new ApiResponse(400,{message:"Please fill all the required fields"})
        )
    try{

     
    const user =await  User.findOne({email})
    if(!user)
    {
        return res.status(404).json(
            new ApiResponse(404,{message:"User does not exist"})
        )
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect)
        return res.status(400).json(
            new ApiResponse(400,{message:"Incorrect password"})
    )
    
    if(!user.isEmailVerified)
        return res.status(404).json(
            new ApiResponse(404,{message:"Email not verified"})
        )
    
    console.log("done")
    const accessToken = user.generateAccessToken();
    console.log("accesstokendone")
    const refreshToken = user.generateRefreshToken();
   
    user.refreshToken  = refreshToken
    await user.save();

    res.cookie('accessToken' , accessToken ,{ httpOnly:true , secure: process.env.NODE_ENV === "production" , maxAge : 24*60*60*1000 }  )
    
    res.cookie('refreshToken' , refreshToken ,{ httpOnly:true , secure: process.env.NODE_ENV === "production" , maxAge : 7*24*60*60*1000 }  )

    res.status(201).json(
        new ApiResponse(201,{message : "User logged in successfully" , user :{
             id:user._id,
             email:user.email,
             name:user.name
        }})
    )
    }
    catch(error){

         
          res.status(500).json(
            new ApiResponse(500,{message:"Cannot login user" , error})
          )
    }

}

const verifyEmail = async(req,res) => {
    const { token } = req.params;
    if(!token)
        return res.status(400).json(
            new ApiResponse(400,{message:"Invalid url"})
    )
    try{
    const user = await User.findOne({emailVerificationToken:token , emailVerificationExpiry: { $gt: Date.now() }})
    if(!user)
        return res.status(404).json(
            new ApiResponse(404,{message:"User does not exist or verification link has expired"})
        )
    user.isEmailVerified=true;
    user.emailVerificationToken=undefined;
    user.emailVerificationExpiry=undefined;

    await user.save();

    res.status(201).json(
        new ApiResponse(201,{message:"Email verified successfully"})
    )
    }
    catch(error){
        res.status(500).json(
             new ApiResponse(500,{message:"Error in verifying email",error})
        )
    }

}

const logoutUser = async(req, res) => {
    
    const id = req.user._id;
    if(!id)
    {
        return res.status(400).json(
            new ApiResponse(400,{message:"User not logged in "})
        )
    }
    try{
    const user =  await User.findById(id);
    if(!user)
    {
        return res.status(404).json(
           new ApiResponse(404,{message:"User does not exist"})
        )
    }
    user.refreshToken=null
    await user.save();
    res.clearCookie('accessToken',{httpOnly:true , secure: process.env.NODE_ENV === "production"})
    res.clearCookie('refreshToken',{httpOnly:true,secure: process.env.NODE_ENV === "production"})

    res.status(201).json(
        new ApiResponse(201,{message:"User logged out successfully"})
    )
}
catch(error){
    res.status(500).json(
        new ApiResponse(500,{message:"Error in logging out the user " , error})
    )
}
    
}

const getUser = async(req,res) =>{
    res.status(200).json(
        new ApiResponse(200,{message:"User fetched successfully" ,user: req.user})
    )
}

const refresh = async(req,res) =>{
    const token = req.cookies['refreshToken'];
    if(!token)
        return res.status(401).json(
            new ApiResponse(401,{message:"Refresh token does not exist" })
        )

    try{
        const decoded = jwt.verify(token  , process.env.REFRESH_TOKEN_SECRET)
        const userData = await User.findById(decoded._id)
        if (!userData || userData.refreshToken !== token) {
      return res.status(403).json(
        new ApiResponse(403, { message: "Invalid or revoked refresh token" })
      );
    }

        const accessToken = userData.generateAccessToken()
        res.cookie('accessToken', accessToken,{ httpOnly:true , secure: process.env.NODE_ENV === "production" , maxAge : 24*60*60*1000 })
        res.status(201).json(
            new ApiResponse(201,{message:"Access token refreshed successfully"})
        )
    }
    catch{
        res.status(401).json(
            new ApiResponse(401,{message:"Error in refreshing token"})
        )
    }
}





export {registerUser , loginUser , verifyEmail , logoutUser,refresh}