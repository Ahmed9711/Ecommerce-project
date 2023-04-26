import { Router } from "express";
import * as productController from './product.controller.js'
import { auth } from "../../Middlewares/auth.js";
import { fileUpload } from "../../services/multer.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { endPoint } from "./product.endpoints.js";
import { validation } from "../../Middlewares/validation.js";
import { addProductValidation, authHeaderValidation, updateProductValidation } from "./product.validation.js";
const router = Router()

router.post("/add", validation(authHeaderValidation, true) ,auth(endPoint.CREATE_PRODUCT), 
    fileUpload().fields([{name: 'mainImage', maxCount: 1},{name: 'subImages', maxCount: 2}]),
    validation(addProductValidation),
    asyncHandler(productController.addProduct))

router.put("/update/:productId", validation(authHeaderValidation, true) ,auth(endPoint.UPDATE_PRODUCT), 
    fileUpload().fields([{name: 'mainImage', maxCount: 1},{name: 'subImages', maxCount: 2}]),
    validation(updateProductValidation),
    asyncHandler(productController.updateProduct))

router.get('/', asyncHandler(productController.getProductList))

export default router;