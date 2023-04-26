import { nanoid } from "nanoid";
import brandModel from "../../../DB/Models/brand.model.js";
import subCategoryModel from "../../../DB/Models/subCategory.model.js";
import cloundinary from "../../utils/cloundinary.js";

export const addBrand = async (req,res,next) => {
    const {name} = req.body;
    if(await brandModel.findOne({name})){
        return next(new Error("Brand Entry already exists", {cause: 400}))
    }
    const customId = nanoid(5);
    const {secure_url, public_id} = await cloundinary.uploader.upload(req.file.path, {
        folder: `${process.env.CLOUD_FOLDER}/Brand/${customId}`
    })

    const brand = await brandModel.create({
        name,
        logo:{
            path: secure_url,
            public_id
        },
        createdBy: req.user._id,
        customId
    })
    if(!brand){
        await cloundinary.uploader.destroy(public_id);
        return next(new Error("Failed to create brand, try again"))
    }

    res.status(201).json({message: "Brand created", brand})
}