import { Router } from "express";
import * as userController from './user.controller.js'
import {validation} from '../../Middlewares/validation.js'
import {auth} from '../../Middlewares/auth.js'
import {asyncHandler} from "../../utils/errorHanding.js"
import {fileUpload} from '../../services/multer.js'
import { updateUserValidation } from "./user.validation.js";
const router = Router();

//Update user (firstname - lastname)
router.put("/update",auth(), validation(updateUserValidation), asyncHandler(userController.updateUser));

//Upload Profile pic
router.put('/uploadProfile', auth(), fileUpload().single('profile'), asyncHandler(userController.uploadProfilePic))

//Get User info (Profile)
router.get('/', auth(),  asyncHandler(userController.getUserInfo));

export default router;