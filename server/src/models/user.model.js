import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    emailVerificationToken:{
        type:String
    },
    emailVerificationExpiry:{
        type:Date
    },
    forgotPasswordToken:{
        type:String
    },
    forgotPasswordExpiry:{
        type:Date
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
     if(!this.isModified("password")) 
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function(){
    console.log(this)
    const user = {
        _id:this._id,
        email:this.email
         }
    
    return jwt.sign(user,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
}
userSchema.methods.generateRefreshToken = function(){
   
    const user = {
        _id:this._id,
        email:this.email,
      
         }
    return jwt.sign( user ,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );
}


export const User = mongoose.model('User',userSchema)


