import cartModel from "../../../DB/Models/cart.model.js"
import productModel from "../../../DB/Models/product.model.js"


export const addToCart = async (req, res, next) => {
    const userId = req.user._id
    const {productId, quantity} = req.body
    const product = await productModel.findById(productId)
    if(!product){
        return next(new Error("Invalid product Id", {cause: 400}))
    }
    if(product.stock < quantity || product.isDeleted){
        await productModel.findByIdAndUpdate(productId, {
            $addToSet:{
                userAddToWishList: userId
            }
        })
        return next(new Error("not avaliable", {cause: 400}))
    }

    //cart
    const cart = await cartModel.findOne({userId})
    if(!cart){
        const newCart = await cartModel.create({
            userId,
            products: [{productId, quantity}]
        })
        return res.status(201).json({message:"Cart created", newCart})
    }
    //Update existing product
    let isProductExists = false
    for (const product of cart.products) {
        if(product.productId.toString() === productId){
            product.quantity = quantity
            isProductExists  = true
            break
        }
    }
    //add product to cart
    if(!isProductExists){
        cart.products.push({productId, quantity})
    }
    const saved = await cart.save();
    res.status(200).json({message: "Cart updated", saved})
}
