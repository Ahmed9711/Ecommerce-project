import { Router } from "express";
import * as couponController from './coupon.controller.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../Middlewares/validation.js";
import { createCouponValidation, updateCouponValidation } from "./coupon.validation.js";
import { auth } from "../../Middlewares/auth.js";
import { endPoint } from "./coupon.endpoints.js";
const router = Router();

router.post('/', auth(endPoint.CREATE_COUPON), validation(createCouponValidation) , asyncHandler(couponController.createCoupon))
router.put('/:couponId', auth(endPoint.UPDATE_COUPON), validation(updateCouponValidation), asyncHandler(couponController.updateCoupon))

export default router;