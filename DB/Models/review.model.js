import mongoose, { model } from "mongoose";

const reviewSchema = mongoose.Schema({
    rate: {
        type: Number,
        required: [true, 'Rate is required'],
        min: 1,
        max: 5
    },
    comment: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }

},{
    timestamps: true,
})

const reviewModel = model.Review || model("Review", reviewSchema)
export default reviewModel