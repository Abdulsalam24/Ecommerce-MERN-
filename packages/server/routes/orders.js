import express from 'express'
import Order from '../models/order.js'

const router = express.Router()

router
  .route('/')
  .all((req, res, next) => {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
    next()
  })
  .get(async (req, res, next) => {
    const orders = await Order.find()
    res.send(orders)
  })
  .post(async (req, res, next) => {
    const {
      customerDetails: { firstName, lastName, email, address1, address2 },
      items,
      orderTotal,
    } = req.body


    const itemIdList = items.map((i) => i._id)

    const orderData = {
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      customerAddress1: address1,
      customerAddress2: address2,
      items: itemIdList,
      orderTotal,
    }


    try {
      /* create new order using Order model
        and return order ID
      */
      const newOrder = new Order({
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerAddress1: orderData.customerAddress1,
        customerAddress2: orderData.customerAddress2,
        items: orderData.items,
        orderTotal: orderData.orderTotal,
      })

      const order = await newOrder.save()
      res.json(order._id)
    } catch (error) {
      next(new Error('Error Placing Order'))
    }

  })
  .delete((req, res, next) => {
    next(new Error('not implemented'))
  })

export default router

