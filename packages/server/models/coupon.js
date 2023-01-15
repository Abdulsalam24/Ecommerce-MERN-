import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema.Types

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    }
},
    { timestamps: true }
);


const Coupon = mongoose.model('Coupon', couponSchema)

export default Coupon
