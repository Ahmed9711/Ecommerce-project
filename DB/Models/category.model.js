import { Schema, model } from "mongoose"

const categorySchema = new Schema({
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
    updatedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User'      
    },
    slug:{
        type: String,
        required: true
    },
    customId: String
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps: true
})

categorySchema.virtual('subCategories',{
    ref: 'subCategory',
    localField: '_id',
    foreignField: 'categoryId'
})

//categorySchema.set('toObject', {virtuals: true})
// categorySchema.set('toJSON', {virtuals: true})

const categoryModel = model.Category || model("Category", categorySchema);
export default categoryModel;