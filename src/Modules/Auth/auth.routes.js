import { Router } from "express";
import * as authController from './auth.controller.js'
import {validation} from '../../Middlewares/validation.js'
import {auth} from '../../Middlewares/auth.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import { loginValidation, signUpValidation } from "./auth.validation.js";
const router = Router();

//Sign up and confirmation
router.post("/signup",validation(signUpValidation),asyncHandler(authController.signup));
router.get('/confirmEmail/:token',asyncHandler(authController.confirmEmail));

//Login and log out
router.post('/login',validation(loginValidation),asyncHandler(authController.login));
router.put("/logout", auth(), asyncHandler(authController.logOut));

//Forget password
router.get("/forgetPassword", asyncHandler(authController.forgotPassword))
router.put("/resetPassword", asyncHandler(authController.resetPassord))

export default router;