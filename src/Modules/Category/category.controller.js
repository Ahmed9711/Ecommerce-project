import slugify from "slugify";
import cloundinary from "../../utils/cloundinary.js";
import { nanoid } from "nanoid";
import categoryModel from "../../../DB/Models/category.model.js";


export const createCategory = async (req, res, next) => {
    const {name} = req.body;
    const isExist = await categoryModel.findOne({name})
    if(isExist){
        return next(new Error("Name already exists", {cause: 400}))
    }
    const slug = slugify(name);
    // if(!req.file){
    //     return next(new Error("Select the image first before submitting the form", {cause: 400}))
    // }
    const customId = nanoid(5)
    const {secure_url, public_id} = await cloundinary.uploader.upload(req.file.path, {
        folder: `${process.env.CLOUD_FOLDER}/Categories/${customId}`
    })
    const category = await categoryModel.create({
        name,
        slug,
        image:{
            path: secure_url,
            public_id
        },
        createdBy: req.user._id,
        customId
    })
    if(!category){
        await cloundinary.uploader.destroy(public_id);
        return next(new Error("Failed to create category, try again"))
    }

    res.status(201).json({message: "Category created", category})
}

export const getCategories = async (req, res, next) => {
    const categories = await categoryModel.find({}).select('name').populate({
        path: "subCategories",
        select: '-_id name'
    })
    if(categories.length){
        return res.status(200).json({message: "Done", categories})
    }
    else{
        next(new Error("Failed to get categories, try again"))
    }
}

export const updateCategory = async (req, res, next) => {
    const {categoryId} = req.params;
    const category = await categoryModel.findById(categoryId)
    if(!category){
        return next(new Error("Failed to find category for update, try again"))
    }
    if(req.body.name){
        if(req.body.name === category.name){
            return next(new Error("Please enter a different name", {cause: 400}))
        }
        const {name} = req.body;
        if(await categoryModel.findOne({name})){
            return next(new Error("Name already exists, enter a different name", {cause: 400}))
        }
        const slug = slugify(name);
        category.name = name;
        category.slug = slug;
    }
    if(req.file){
        const {secure_url, public_id} = await cloundinary.uploader.upload(req.file.path, {
            folder: `${process.env.CLOUD_FOLDER}/Categories/${category.customId}`
        })
        if(category.image?.public_id){
            await cloundinary.uploader.destroy(category.image.public_id);
        }
        category.image.path = secure_url;
        category.image.public_id = public_id;
    }

    if(!Object.keys(req.body).length){
        return next(new Error("Enter the update fields", {cause: 400}))
    }

    category.updatedBy = req.user._id
    const saved = await category.save();
    res.status(200).json({message: "Category updated", saved})
}