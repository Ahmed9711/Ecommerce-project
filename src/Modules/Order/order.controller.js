import cartModel from "../../../DB/Models/cart.model.js";
import couponModel from "../../../DB/Models/coupon.model.js";
import orderModel from "../../../DB/Models/order.model.js";
import productModel from "../../../DB/Models/product.model.js";
import { validateCoupon } from "../Coupon/coupon.controller.js";

export const createOrder = async (req, res, next) => {
    const userId = req.user._id;
    const {products, couponCode, address, phone, paymentMethod} = req.body;
    //Coupon validation
    if(couponCode){
        const coupon = await couponModel.findOne({code: couponCode})
        if(!coupon){
            return next(new Error('In-valid coupon code', {cause: 400}))
        }
        const {matched, exceed, expired} = validateCoupon(coupon, userId)
        if(!matched){
            return next(new Error('Coupon code is not assigned to you', {cause: 400}))
        }
        if(exceed){
            return next(new Error('Coupon code is not avaliable', {cause: 400}))
        }
        if(expired){
            return next(new Error('Coupon code is expired', {cause: 400}))
        }
        req.body.coupon = coupon
    }
    //Products validation
    if(!products?.length){
        const cart = await cartModel.findOne({userId})
        if(!cart?.products?.length){
            return next(new Error('Empty cart', {cause: 400}))
        }
        req.body.isCart = true
        req.body.products = cart.products
    }

    let subTotal = 0;
    let finalProducts = [];
    let productIds = [];
    for (let product of req.body.products) {
        productIds.push(product.productId)
        const findProduct = await productModel.findOne({
            _id: product.productId,
            stock: {$gte: product.quantity},
            isDeleted: false
        })
        if(!findProduct){
            return next(new Error('In-valid product', {cause: 400}))
        }
        if(req.body.isCart){
            product = product.toObject()
        }
        product.name = findProduct.name;
        product.productPrice = findProduct.priceAfterDiscount
        product.finalPrice = Number.parseFloat(findProduct.priceAfterDiscount * product.quantity).toFixed(2)
        finalProducts.push(product)
        subTotal += parseInt(product.finalPrice)
    }

    paymentMethod == 'cash' ? req.body.orderStatus = 'placed' : req.body.orderStatus = 'pending'

    //Order
    const orderObject = {
        userId,
        products: finalProducts,
        address,
        phone,
        paymentMethod,
        orderStatus: req.body.orderStatus,
        subTotal,
        couponId: req.body.coupon?._id,
        totalPrice: parseFloat(subTotal * (1 - ((req.body.coupon?.amount || 0)/100))).toFixed(2)
    }
    const order = await orderModel.create(orderObject)
    if(order){
        //inc usageCount => 1
        if(req.body.coupon){
            for (const user of req.body.coupon.usagePerUser) {
                if(user.userId.toString() == userId){
                    user.usageCount += 1
                }
            }
            await req.body.coupon.save()
        }
        //dec stock => quantity
        for (const product of req.body.products) {
            await productModel.findByIdAndUpdate(product.productId,{
                $inc:{stock: - parseInt(product.quantity)}
            })
        }
        //remove products from cart
        await cartModel.updateOne({userId},{
            $pull: {products: {productId: {$in: productIds}}}
        })
        res.status(201).json({message: "Order created", order})
    }
    else{
        next(new Error("Unknown error, try again"))
    }
}

export const cancelOrder = async (req, res, next) => {
    const {orderId} = req.params
    const {reason} = req.body
    const order = await orderModel.findById(orderId)
    if ((order?.orderStatus != 'placed' && order?.paymentMethod == 'cash') || (!['confirmed', 'pending'].includes(order?.orderStatus) && order?.paymentMethod == 'card')) {
        return next(new Error(`you canot cancel this order with status ${order.orderStatus}`, { cause: 400 }))
    }
    order.orderStatus = 'canceled'
    order.reason = reason
    order.updatedBy = req.user._id
    const savedOrder = await order.save()
    if(savedOrder){
        if(order.couponId){
            const coupon = await couponModel.findById(order.couponId)
            for (const user of coupon?.usagePerUser) {
                if(user.userId.toString() == order.userId.toString()){
                    user.usageCount -= 1
                }
            }
            await coupon.save()
        }
        //inc stock => quantity
        for (const product of order.products) {
            await productModel.findByIdAndUpdate(product.productId,{
                $inc:{stock: parseInt(product.quantity)}
            })
        }
        res.status(200).json({message: "Order canceled"})
    }
    else{
        next(new Error("Unknown error, try again"))
    }
}