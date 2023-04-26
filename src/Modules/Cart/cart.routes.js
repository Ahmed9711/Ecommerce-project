import { Router } from "express";
import * as cartController from './cart.controller.js'
import { validation } from "../../Middlewares/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../Middlewares/auth.js";
const router = Router();

router.post("/add", auth(), asyncHandler(cartController.addToCart))

export default router;