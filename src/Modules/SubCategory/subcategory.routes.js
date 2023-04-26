import { Router } from "express";
import { fileUpload } from "../../services/multer.js";
import * as subCategoryController from './subcategory.controller.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../Middlewares/validation.js";
import { createSubCategoryValidation, updateSubCategoryValidation } from "./subcategory.validation.js";
import { auth } from "../../Middlewares/auth.js";
import { endPoint } from "./subcategory.endpoints.js";
const router = Router({mergeParams: true});

router.post('/', auth(endPoint.CREATE_SUB_CATEGORY), fileUpload().single("image"), validation(createSubCategoryValidation),asyncHandler(subCategoryController.createSubCategory));
router.put("/:subCategoryId", auth(endPoint.UPDATE_SUB_CATEGORY) , fileUpload().single("image"), validation(updateSubCategoryValidation), asyncHandler(subCategoryController.updateSubCategory))


export default router