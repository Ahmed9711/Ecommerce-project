import { Router } from "express";
import * as reviewController from './review.controller.js'
import { auth } from "../../Middlewares/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()

router.post('/:productId', auth(), asyncHandler(reviewController.addReview));

export default router