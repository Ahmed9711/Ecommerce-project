import userModel from "../../DB/Models/user.model.js";
import { systemRoles } from "../utils/systemRoles.js";
import { decodeToken } from "../utils/tokenFunction.js";

// const authFunction = async (req,res,next) => {
//     const {authorization}  = req.headers;
//     if(!authorization){
//         // return res.status(400).json({message: "Req headers does not have a token"})
//         return next(new Error("Req headers does not have a token"), {cause: 400})
//     }
//     if(!authorization.startsWith(process.env.TOKEN_PREFIX)){
//         // return res.status(400).json({message: "In-Valid token"})
//         return next(new Error("In-Valid token"), {cause: 400})
//     }
//     const token = authorization.split(process.env.TOKEN_PREFIX)[1];
//     const decode = decodeToken({payload: token});
//     if(!decode?._id){
//         // return res.status(400).json({message: "In-Valid token payload"})
//         return next(new Error("In-Valid token payload"), {cause: 400})
//     }
//     const user = await userModel.findById(decode._id).select('userName email role');
//     if(!user){
//         // return res.status(400).json({message: "This user does not exist"})
//         return next(new Error("This user does not exist"), {cause: 400})
//     }
//     req.user = user;
//     next();
// }

export const auth = (accessRoles = [systemRoles.USER, systemRoles.ADMIN]) => {
    return  async (req, res, next) => {
        try {
            const {authorization}  = req.headers;
            // if(!authorization){
            //     // return res.status(400).json({message: "Req headers does not have a token"})
            //     return next(new Error("Req headers does not have a token"), {cause: 400})
            // }
            if(!authorization.startsWith(process.env.TOKEN_PREFIX)){
                // return res.status(400).json({message: "In-Valid token"})
                return next(new Error("In-Valid token"), {cause: 400})
            }
            const token = authorization.split(process.env.TOKEN_PREFIX)[1];
            const decode = decodeToken({payload: token});
            if(!decode?._id){
                // return res.status(400).json({message: "In-Valid token payload"})
                return next(new Error("In-Valid token payload"), {cause: 400})
            }
            const user = await userModel.findById(decode._id).select('userName email role');
            if(!user){
                // return res.status(400).json({message: "This user does not exist"})
                return next(new Error("This user does not exist"), {cause: 400})
            }
            if(decode.iat < user.changePassword){
                return next(new Error("Token expired, try to login again"), {cause: 400})
            }
            // console.log(user.role);
            if(!accessRoles.includes(user.role)){
                return next(new Error("Un-authorized", {cause: 403}))
            }
            req.user = user;
            next();
        } catch (error) {
            return next(new Error(error?.message))
        }
    }
}

// Authorization
// export const authorization = (accessRoles) => {
//     return (req, res, next) => {
//         const {role} = req.user;
//         if(!accessRoles.includes(role)){
//             return next(new Error("Un-authorized", {cause: 403}))
//         }
//         next();
//     }
// }