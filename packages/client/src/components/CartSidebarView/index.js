import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import { useUI } from 'hooks'
import { useProvideCart, useRouter } from 'hooks'
import { CartList, CartSummary, CheckoutBox } from 'components'
import './CartSidebarView.scss'
import axios from 'axios'


const CartSidebarView = () => {
  const { closeSidebar, displaySidebar } = useUI()
  const { state } = useProvideCart()
  const { push } = useRouter()
  const [couponText, setCouponText] = useState('')
  const { disCoupon } = useProvideCart()

  const handleClose = () => closeSidebar()

  const handleCheckout = () => {
    closeSidebar()
    push('/checkout')
  }

  const handleChange = (e) => {
    setCouponText(e.target.value)
  }

  const couponSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.get(`http://localhost:3001/api/coupon/create/verify?code=${couponText}`)
      if (state.couponName !== couponText) {
        disCoupon(res.data, couponText)
      }

    } catch (error) {
      console.log(error, 'errorerrorerrorerrorerror')
    }
  }

  return (
    <div className='cart'>
      <header className='cart-header'>
        {displaySidebar && (
          <Button
            onClick={handleClose}
            aria-label='Close panel'
            className='hover:text-gray-500 transition ease-in-out duration-150'
          >
            <FontAwesomeIcon size='xs' icon={faTimes} />
          </Button>
        )}
      </header>

      {state.cart.length > 0 ? (
        <div className='cart-body'>
          <CartList cartItems={state.cart} />
        </div>
      ) : (
        <div className='empty-cart'>
          <FontAwesomeIcon size='xs' icon={faShoppingBag} />
          <p>Your shopping cart is empty</p>
        </div>
      )}

      {state.cart.length > 0 && (
        <div className='cart-checkout'>
          <div className="coupons">
            <input type="text" onChange={handleChange} placeholder='coupon discount code' />
            <button onClick={couponSubmit}>Dis</button>
            <p>CouponName : {
              state.couponName && state.couponName
            }</p>
            <p>
              couponDiscount : {
                `${state.couponDiscount ? state.couponDiscount : 0}%`
              }
            </p>
          </div>
          <CartSummary cartTotal={state.cartTotal} />
          <CheckoutBox
            handleShopping={handleClose}
            handleCheckout={handleCheckout}
          />
        </div>
      )}
    </div>
  )
}

export default CartSidebarView
