import { Router } from "express";
import { fileUpload } from "../../services/multer.js";
import * as categoryController from './category.controller.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../Middlewares/validation.js";
import { createCategoryValidation, updateCategoryValidation } from "./category.validation.js";
import subCategoryRouter from '../SubCategory/subcategory.routes.js'
import { auth } from "../../Middlewares/auth.js";
import { endPoint } from "./category.endpoints.js";
const router = Router({caseSensitive: true});

router.use('/:categoryId/subCategory', subCategoryRouter)
router.get('/',asyncHandler(categoryController.getCategories));
router.post('/', auth(endPoint.CREATE_CATEGORY) , fileUpload().single("image"), validation(createCategoryValidation),asyncHandler(categoryController.createCategory));

router.put("/:categoryId", auth(endPoint.UPDATE_CATEGORY), fileUpload().single("image"), validation(updateCategoryValidation), asyncHandler(categoryController.updateCategory))

export default router