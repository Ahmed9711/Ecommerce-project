import orderModel from "../../../DB/Models/order.model.js";
import productModel from "../../../DB/Models/product.model.js";
import reviewModel from "../../../DB/Models/review.model.js";


export const addReview = async (req, res, next) => {
    const {productId} = req.params;
    //Check product
    const product = await productModel.findById(productId)
    if(!product){
        return next(new Error("In-valid product id", {cause: 400}))
    }

    //Check user bought this product
    const order = await orderModel.find({
        userId: req.user._id,
        orderStatus: 'deliverd',
        'products.productId': productId
    })
    if(!order){
        return next(new Error('Cannot add review to unbought products', {cause: 400}))
    }
    
    const review = await reviewModel.create({
        rate: req.body.rate,
        comment: req.body.comment,
        userId: req.user._id,
        productId
    })
    res.status(201).json({message: "Review added", review})
}