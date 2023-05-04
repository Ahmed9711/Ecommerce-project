import { Router } from "express";
import * as orderController from './order.controller.js'
import { auth } from "../../Middlewares/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../Middlewares/validation.js";
import { cancelOrder, createOrderValidation } from "./order.validation.js";
const router = Router()

router.post('/', auth(),validation(createOrderValidation) , asyncHandler(orderController.createOrder))
router.put('/:orderId', auth(), validation(cancelOrder) , asyncHandler(orderController.cancelOrder))
router.post('/webhook',express.raw({ type: 'application/json' }),asyncHandler(orderController.webHook))

export default router;