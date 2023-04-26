import couponModel from "../../../DB/Models/coupon.model.js";
import moment from "moment";
import userModel from "../../../DB/Models/user.model.js";

export const createCoupon = async (req, res, next) => {
    const {code, amount, fromDate, toDate, usagePerUser} = req.body;
    if(amount > 100){
        return next(new Error("amount is in-valid (must be from 1 to 100)", {cause: 400}))
    }
    if(await couponModel.findOne({code: code.toLowerCase()})){
        return next(new Error("Enter a different code", {cause: 400}))
    }
    let userIds = [];
    for (const user of usagePerUser) {
        if(!userIds.includes(user.userId)){
            userIds.push(user.userId)
        }
    }
    const users = await userModel.find({_id: {$in: userIds}})
    if(users.length !== userIds.length){
        return next(new Error("Invalid users Ids", {cause: 400}))
    }
    const fromDateMoment = moment(new Date(fromDate)).format('YYYY-MM-DD HH:mm')
    const toDateMoment = moment(new Date(toDate)).format('YYYY-MM-DD HH:mm')
    if(fromDate === toDate || fromDate > toDate){
        return next(new Error("Enter a valid interval", {cause: 400}))
    }

    const coupon = await couponModel.create({
        code: code.toLowerCase(),
        amount,
        fromDate: fromDateMoment,
        toDate: toDateMoment,
        createdBy: req.user._id,
        usagePerUser
    })
    if(coupon){
        res.status(201).json({message: "Coupon created", coupon})
    }
    else{
        next(new Error("Failed to create coupon, try again"))
    }

}

export const updateCoupon = async (req, res, next) => {
    const {couponId} = req.params;
    const coupon = await couponModel.findById(couponId);
    if(!coupon){
        return next(new Error("Coupon not found", {cause: 400}))
    }
    //Code
    if(req.body.code){
        if(req.body.code.toLowerCase() === coupon.code){
            return next(new Error("Please enter a different code", {cause: 400}))
        }
        const {code} = req.body;
        if(await couponModel.findOne({code: code.toLowerCase()})){
            return next(new Error("Code already exists, enter a different code", {cause: 400}))
        }
        coupon.code = code.toLowerCase();
    }
    //Amount
    if(req.body.amount){
        if(req.body.amount > 100 || req.body.amount < 1){
            return next(new Error("amount is in-valid (must be from 1 to 100)", {cause: 400}))
        }
        coupon.amount = req.body.amount
    }
    //fromDate
    if(req.body.fromDate){
        if(moment(new Date(req.body.fromDate)).isBefore(moment())){
            return next(new Error("Enter valid date after tomorrow", {cause: 400}))
        }
        if(moment(new Date(req.body.fromDate)).isSameOrAfter(moment(new Date(coupon.toDate)))){
            return next(new Error("Coupon start date cannot be same or after expire date", {cause: 400}))
        }
        coupon.fromDate = moment(new Date(req.body.fromDate)).format('YYYY-MM-DD HH:mm')
    }
    //toDate
    if(req.body.toDate){
        if(moment(new Date(req.body.toDate)).isBefore(moment())){
            return next(new Error("Enter valid date after tomorrow", {cause: 400}))
        }
        if(moment(new Date(req.body.toDate)).isSameOrBefore(moment(new Date(coupon.fromDate)))){
            return next(new Error("Coupon expired date cannot be before start date", {cause: 400}))
        }
        coupon.toDate = moment(new Date(req.body.toDate)).format('YYYY-MM-DD HH:mm')
    }

    if(!Object.keys(req.body).length){
        return next(new Error("Enter the update fields", {cause: 400}))
    }

    coupon.updatedBy = req.user._id
    const saved = await coupon.save();
    if(saved){
        res.status(200).json({message: "Update coupon done", saved})
    }
    else{
        next(new Error("Failed to update coupon, try again"))
    }

}


export const validateCoupon = (coupon, userId) => {
    let expired = false;
    let matched = false;
    let exceed = true;
    //expired
    if(coupon.status == 'expired' || moment(coupon.toDate).isBefore(moment())){
        expired = true
    }
    //user is not assigned
    for (const user of coupon.usagePerUser) {
        if(user.userId.toString() == userId){
            matched = true
            if(user.usageCount < user.maxUsage){
                exceed = false;
            }
        }
    }

    return{
        expired,
        matched,
        exceed
    }
}