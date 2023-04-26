import userModel from '../../../DB/Models/user.model.js'
import cloudinary from '../../utils/cloudinary.js'

//Update user (firstname - lastname)
export const updateUser = async (req, res, next) => {
    const {firstname, lastname} = req.body;
    const {_id} = req.user;
    const updateUser = await userModel.findByIdAndUpdate(
        _id,
        {firstname, lastname},
        {new: true}
    )
    if(updateUser){
        res.status(200).json({message: "Update done", updateUser})
    }
    else{
        next(new Error("Unknown error, try again"))
    }
}

export const uploadProfilePic = async (req,res, next) => {
    if(!req.file){
        return next(new Error("Attach your picture", {cause: 400}))
    }
    const {_id} = req.user;
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder: `Exam/user/profile/${_id}`
    })
    const user = await userModel.findByIdAndUpdate(
        _id,
        {profile_pic: secure_url, profile_public_id: public_id}
    )
    if(user){
        if(user.profile_public_id){
            const deleted = await cloudinary.uploader.destroy(user.profile_public_id);
        }
        res.status(201).json({message: "Upload Profile picture done"})
    }
    else{
        next(new Error("Unknown error, try again"))
    }
    
}

export const getUserInfo = async (req, res, next) => {
    const {_id} = req.user;
    const user = await userModel.findById(_id);
    if(user){
        res.status(200).json({message: "Done", user})
    }
    else{
        next(new Error("Unknown error, try again"))
    }
}