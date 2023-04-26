import { Router } from "express";
import * as brandController from './brand.controller.js'
import { fileUpload } from "../../services/multer.js";
import { validation } from "../../Middlewares/validation.js";
import { addBrandValidation } from "./brand.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../Middlewares/auth.js";
import { endPoint } from "./brand.endpoints.js";
const router = Router();

router.post("/", auth(endPoint.CREATE_BRAND), fileUpload().single("logo"), validation(addBrandValidation), asyncHandler(brandController.addBrand))

export default router;