import { customAlphabet } from 'nanoid';
import userModel from '../../../DB/Models/user.model.js'
import { sendEmail } from "../../services/sendEmail.js";
import { decodeToken, generateToken } from "../../utils/tokenFunction.js";
import bcrypt from 'bcryptjs'

const nanoId = customAlphabet('123456789',6)

export const signup = async (req, res, next) => {
    const {userName, email, phone, password} = req.body;
    const userCheck = await userModel.findOne({email}).select("email");
    if(userCheck){
        return next(new Error("Email already exists", {cause: 409}))
    }
    const user = new userModel({userName, email, phone, password});
    const token = generateToken({payload: {user}})
    if(!token){
        return next(new Error("Token generation failed"))
    }
    const confirmtionLink = `${req.protocol}://${req.headers.host}/ecommerce/auth/confirmEmail/${token}`;
    const message = `<a href=${confirmtionLink}>Click here to confirm</a>`
    const emailCheck = sendEmail({
        to: email,
        subject: "Confirm your account",
        message 
    })
    if(!emailCheck){
        return next(new Error("Fail to send confirmation email", {cause: 400}));
    }
    res.status(200).json({message:"Confirmation Email sent, Check your email"});
}

export const confirmEmail = async (req, res, next) => {
    const {token} = req.params;
    const decode = decodeToken({payload: token});
    if(!decode?.user){
        return next(new Error("Decode token failed"))
    }
    decode.user.isConfirmed = true;
    const confirmUser = new userModel({...decode.user});
    const savedUser = await confirmUser.save();
    if(savedUser){
        res.status(201).json({message:"Sign Up done, try to login", savedUser});
    }
    else{
        next(new Error("Sign Up failed"))
    }
}

export const login = async (req, res, next) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return next(new Error("Wrong credientials", {cause: 400}))
    }
    const match = bcrypt.compareSync(password, user.password);
    if(match){
        const updateUser = await userModel.findByIdAndUpdate(
            user._id,
            {isLoggedIn: true}
        )
        const token = generateToken({payload: {_id: user._id, email: email}})
        res.status(201).json({message:"Login Done", token});
    }
    else{
        next(new Error("Wrong credientials", {cause: 400}))
    }
}

export const logOut = async (req, res, next) => {
    const {_id} = req.user;
    const updated = await userModel.updateOne({_id}, {isLoggedIn: false});
    if(updated.modifiedCount){
        res.status(200).json({message: "Log out done"})
    }
    else{
        next(new Error("Unknown error, try again"))
    }
}

export const forgotPassword = async (req, res, next) => {
    const {email} = req.body;
    const user = await userModel.findOne({email, isConfirmed: true});
    if(!user){
        next(new Error("In-Valid Email", {cause: 401}))
    }
    const code = nanoId();
    const message = `<a>Reset Code: ${code}</a>`
    const emailCheck = sendEmail({
        to: email,
        subject: "Reset Password",
        message 
    })
    if(!emailCheck){
        return next(new Error("Fail to send reset password email"));
    }
    const saved = await userModel.findOneAndUpdate(
        {email},
        {forgetCode: code},
        {new: true}
    )
    res.status(200).json({message:"Reset password Email sent, Check your email", saved});
}

export const resetPassord = async (req,res,next) => {
    const {code, email, password} = req.body;
    const emailCheck = await userModel.findOne({email, isConfirmed: true});
    if(!emailCheck){
        next(new Error("In-Valid Email", {cause: 401}))
    }
    if(code !== emailCheck.forgetCode){
        return next(new Error("Reset code is In-valid"))
    }
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
    const user = await userModel.findOneAndUpdate(
        {email},
        {password: hashedPassword, forgetCode: null, changePassword: Date.now()},
        {new: true}
    )
    if(user){
        res.status(200).json({message: "Reset Password done, try to login", user});
    }
    else{
        next(new Error("Reset Password failed"));
    }
}

export const changePassword = async (req,res, next) => {
    const {oldPassword, password} = req.body;
    const {_id} = req.user;
    const match = bcrypt.compareSync(oldPassword, req.user.password);
    if(!match){
        return next(new Error("Old password is incorrect", {cause: 400}));
    }
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
    const updateUser = await userModel.findByIdAndUpdate(
        _id,
        {password: hashedPassword},
        {new: true}
    )
    if(updateUser){
        res.status(200).json({message: "Password updated", updateUser});
    }else{
        next(new Error("Change Password failed"));
    }
}