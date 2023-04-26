import slugify from "slugify";
import cloundinary from "../../utils/cloundinary.js";
import { nanoid } from "nanoid";
import categoryModel from "../../../DB/Models/category.model.js";
import subCategoryModel from "../../../DB/Models/subCategory.model.js";


export const createSubCategory = async (req, res, next) => {
    const {name} = req.body;
    const {categoryId} = req.params;
    const isExist = await subCategoryModel.findOne({name})
    if(isExist){
        return next(new Error("Sub Category name already exists", {cause: 400}))
    }
    if(! await categoryModel.findById(categoryId)){
        return next(new Error("In-Valid Category Id", {cause: 404}))
    }
    const slug = slugify(name);
    // if(!req.file){
    //     return next(new Error("Select the image first before submitting the form", {cause: 400}))
    // }
    const customId = nanoid(5)
    const {secure_url, public_id} = await cloundinary.uploader.upload(req.file.path, {
        folder: `${process.env.CLOUD_FOLDER}/Subcategories/${customId}`
    })
    const subCategory = await subCategoryModel.create({
        name,
        slug,
        image:{
            path: secure_url,
            public_id
        },
        createdBy: req.user._id,
        customId,
        categoryId
    })
    if(!subCategory){
        await cloundinary.uploader.destroy(public_id);
        return next(new Error("Failed to create sub category, try again"))
    }

    res.status(201).json({message: "Sub Category created", subCategory})
}

export const updateSubCategory = async (req, res, next) => {
    const {subCategoryId} = req.params;
    const subCategory = await subCategoryModel.findById(subCategoryId)
    if(!subCategory){
        return next(new Error("Failed to find subCategory for update, try again"))
    }
    if(req.body.name){
        if(req.body.name === subCategory.name){
            return next(new Error("Please enter a different name", {cause: 400}))
        }

        const {name} = req.body;
        if(await subCategoryModel.findOne({name})){
            return next(new Error("Name already exists, enter a different name", {cause: 400}))
        }
        const slug = slugify(name);
        subCategory.name = name;
        subCategory.slug = slug;
    }
    if(req.file){
        const {secure_url, public_id} = await cloundinary.uploader.upload(req.file.path, {
            folder: `${process.env.CLOUD_FOLDER}/Subcategories/${subCategory.customId}`
        })
        if(subCategory.image?.public_id){
            await cloundinary.uploader.destroy(subCategory.image.public_id);
        }
        subCategory.image.path = secure_url;
        subCategory.image.public_id = public_id;
    }
    subCategory.updatedBy = req.user._id
    const saved = await subCategory.save();
    res.status(200).json({message: "subCategory updated", saved})
}