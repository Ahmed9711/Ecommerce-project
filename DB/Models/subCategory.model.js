import { Schema, model } from "mongoose"

const subCategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    image:{
        path:{
            type: String,
            required: true
        },
        public_id:{
            type: String,
            required: true
        }
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true       
    },
    slug:{
        type: String,
        required: true
    },
    customId: String,
    categoryId:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true      
    }
},{
    timestamps: true
})

const subCategoryModel = model.subCategory || model("subCategory", subCategorySchema);
export default subCategoryModel;