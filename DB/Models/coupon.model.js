import { Schema, model } from "mongoose"

const couponSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    amount:{
        type: Number,
        default: 1,
        required: true
    },
    status:{
        type: String,
        default: "valid",
        enum: ['valid', 'expired']
    },
    fromDate:{
        type: String,
        required: [true, 'Please enter the start date']
    },
    toDate:{
        type: String,
        required: [true, 'Please enter the end date']
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
    usagePerUser:[{
        userId:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        maxUsage:{
            type: Number,
            required: true
        },
        usageCount:{
            type: Number,
            default: 0
        }
    }]
},{
    timestamps: true
})


const couponModel = model.Coupon || model("Coupon", couponSchema);
export default couponModel;