import mongoose, { Schema, model } from "mongoose"

const cartSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true      
    },
    products:[{
        productId:{
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity:{
            type: Number,
            required: true
        }
    }]
},{
    timestamps: true
})

const cartModel = model.Cart || model("Cart", cartSchema);
export default cartModel;