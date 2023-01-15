import express from 'express'
const router = express.Router()

import Coupons from '../models/coupon.js'


router.get('/create', async (req, res) => {
    const { code, discount } = req.query;

    const coupon = new Coupons({
        code,
        discount
    })

    try {
        await coupon.save()
        res.status(200).json(coupon)
    } catch (error) {
        res.status(404).json({ message: "no code" })
    }
})


router.get('/create/verify', async (req, res) => {
    const { code } = req.query;

    const coupon = await Coupons.findOne({ code })

    if (coupon) {
        res.status(200).json(coupon.discount)
        return;
    }

    res.status(404).json({ message: "Coupon not found" })
})



export default router
