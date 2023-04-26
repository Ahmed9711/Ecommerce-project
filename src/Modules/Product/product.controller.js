import slugify from "slugify";
import brandModel from "../../../DB/Models/brand.model.js";
import categoryModel from "../../../DB/Models/category.model.js";
import subCategoryModel from "../../../DB/Models/subCategory.model.js";
import { nanoid } from "nanoid";
import cloundinary from "../../utils/cloundinary.js";
import productModel from "../../../DB/Models/product.model.js";
import { pagination } from "../../services/pagination.js";
import ApiFeatures from "../../services/apiFeatures.js";

export const addProduct = async (req, res, next) => {
    //IDs
    const {categoryId, subCategoryId, brandId, name, price, discount} = req.body;
    const category = await categoryModel.findById(categoryId);
    const subCategory = await subCategoryModel.findOne({_id: subCategoryId, categoryId})
    const brand = await brandModel.findById(brandId)
    if(!category || !subCategory || !brand){
        return next(new Error("In-valid Ids", {cause: 400}))
    }
    //User Id
    req.body.createdBy = req.user._id
    //name
    req.body.slug = slugify(name,{
        replacement: '-',
        lower: true
    })
    //price
    req.body.priceAfterDiscount = price * (1 - ((discount || 0) / 100))

    //Images
    //mainImage
    const customId = nanoid(5)
    req.body.customId = customId;
    const {secure_url, public_id} = await cloundinary.uploader.upload(req.files.mainImage[0].path, {
        folder: `${process.env.CLOUD_FOLDER}/Products/${customId}`
    })
    req.body.mainImage = {
        path: secure_url,
        public_id
    }

    //subImages
    if(req.files.subImages){
        req.body.subImages = []
        for (const file of req.files.subImages) {
            const {secure_url, public_id} = await cloundinary.uploader.upload(file.path, {
                folder: `${process.env.CLOUD_FOLDER}/Products/${customId}`
            })
            req.body.subImages.push({path: secure_url, public_id})
        }
    }

    const product = await productModel.create(req.body);
    if(!product){
        // destory
        await cloundinary.uploader.destroy(req.body.mainImage.public_id)
        let subImages_ids = []
        for (const subImage of req.body.subImages) {
            subImages_ids.push(subImage.public_id)
        }
        await cloundinary.api.delete_resources(subImages_ids)
        return next(new Error('Failed to create product, try again'))
    }
    return res.status(201).json({ message: "Product created", product })
}

export const updateProduct = async (req, res, next) => {
    const {productId} = req.params;
    const product = await productModel.findById(productId)
    if(!product){
        return next(new Error("In-valid product Id", {cause: 400}))
    }
    const {name, price, discount} = req.body;
    //name
    if(name){
        req.body.slug = slugify(name,{
            replacement: '-',
            lower: true
        })
    }
    //price and discount
    if(price && discount){
        req.body.priceAfterDiscount = price * (1 - ((discount)/100))
    }
    else if(price){
        req.body.priceAfterDiscount = price * (1 - ((product.discount)/100))
    }
    else if(discount){
        req.body.priceAfterDiscount = product.price * (1 - ((discount)/100))
    }
    //mainImage
    if(req.files?.mainImage?.length){
        await cloundinary.uploader.destroy(product.mainImage.public_id)
        const {secure_url, public_id} = await cloundinary.uploader.upload(req.files.mainImage[0].path, {
            folder: `${process.env.CLOUD_FOLDER}/Products/${product.customId}`
        })
        req.body.mainImage = {
            path: secure_url,
            public_id
        }
    }
    //subImages
    if(req.files?.subImages?.length){
        let subImages_ids = []
        for (const subImage of product.subImages) {
            subImages_ids.push(subImage.public_id)
        }
        await cloundinary.api.delete_resources(subImages_ids)
        req.body.subImages = []
        for (const file of req.files.subImages) {
            const {secure_url, public_id} = await cloundinary.uploader.upload(file.path, {
                folder: `${process.env.CLOUD_FOLDER}/Products/${product.customId}`
            })
            req.body.subImages.push({path: secure_url, public_id})
        }
    }
    req.updatedBy = req.user._id
    const saved = await productModel.findByIdAndUpdate(productId, req.body, {new: true})
    if(!saved){
        return next(new Error('Failed to update product, try again'))
    }
    res.status(200).json({message:"Product updated", saved})
}


export const getProductList = async (req, res, next) => {
    //ApiFeature Class
    const apiFeature = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    const products = await apiFeature.mongooseQuery
    //find with Pagination
    // const {page, size} = req.query;
    // const {limit, skip} = pagination({page, size})
    // const mongooseQuery = productModel.find().limit(limit).skip(skip)

    //sort
    // const mongooseQuery = productModel.find().sort(req.query.sort?.replaceAll(',',' '))

    //select
    // const mongooseQuery = productModel.find().select(req.query.fields?.replaceAll(',',' '))

    //search
    // const mongooseQuery = productModel.find({
    //     $or:[
    //         {name: {$regex: req.query.search, $options: 'i'}},
    //         {description: {$regex: req.query.search, $options: 'i'}}
    //     ]
    // })

    //filter
    // const queryData = { ...req.query }
    // const execludeParams = ['page', 'size', 'sort', 'search', 'fields']
    // execludeParams.forEach((param) => delete queryData[param])
    // const queryFilters = JSON.parse(JSON.stringify(queryData).replace(/(lt|lte|gt|gte|in|nin|eq|neq)/g,
    //     (match) => `$${match}`,
    //   ),
    // )
    // console.log(queryFilters);
    // const mongooseQuery = productModel.find(queryFilters)

    // const products = await mongooseQuery
    res.status(200).json({ message: 'Done', products})
}