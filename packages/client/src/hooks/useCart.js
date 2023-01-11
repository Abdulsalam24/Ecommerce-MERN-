import React, { useReducer, useContext, createContext, useEffect } from 'react'

const initialState = {
  cart: [],
  itemCount: 0,
  cartTotal: 0,
}

const calculateCartTotal = (cartItems) => {
  let total = 0
  cartItems.map((item) => (total += item.price * item.quantity))
  return parseFloat(total.toFixed(2))
}

const reducer = (state, action) => {
  let nextCart = [...state.cart];

  const cart = localStorage.setItem("cart", JSON.stringify(state))

  switch (action.type) {
    case 'ADD_ITEM':
      const existingIndex = nextCart.findIndex(
        (item) => item._id === action.payload._id
      )

      const numItemsToAdd = action.payload.quantity;

      if (existingIndex >= 0) {
        const newQuantity = parseInt(
          nextCart[existingIndex].quantity + numItemsToAdd
        )

        nextCart[existingIndex] = {
          ...action.payload,
          quantity: newQuantity,
        }
      } else {
        nextCart.push(action.payload)
      }


      const addCart = {
        ...state,
        cart: nextCart,
        itemCount: state.itemCount + 1,
        cartTotal: calculateCartTotal(nextCart),
      }
      localStorage.setItem("cart", JSON.stringify(addCart))

      return {
        ...addCart
      }
    case 'REMOVE_ITEM':
      nextCart = nextCart
        .map((item) =>
          item._id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

      const removeCart = {
        ...state,
        cart: nextCart,
        itemCount: state.itemCount > 0 ? state.itemCount - 1 : 0,
        cartTotal: calculateCartTotal(nextCart),
      }

      localStorage.setItem("cart", JSON.stringify(removeCart))

      return {
        ...removeCart
      }
    case 'REMOVE_ALL_ITEMS':
      let quantity = state.cart.find((i) => i._id === action.payload).quantity
      const removeAllItem = {
        ...state,
        cart: state.cart.filter((item) => item._id !== action.payload),
        itemCount: state.itemCount > 0 ? state.itemCount - quantity : 0,
        cartTotal: 0,
      }

      localStorage.setItem("cart", JSON.stringify(removeAllItem))

      return {
        ...removeAllItem
      }
    case 'EDIT_ITEM':
      const existingIndex1 = nextCart.findIndex(
        (item) => item._id === action.payload.item._id
      )
      if (existingIndex1 >= 0) {
        const newQuantity = parseInt(
          nextCart[existingIndex1].quantity
        )

        nextCart[existingIndex1] = {
          ...action.payload.item,
          quantity: newQuantity,
        }
      } else {
        nextCart.push(action.payload.item)
      }

      const editItem = {
        ...state,
        cart: nextCart,
        itemCount: +action.payload.qtn,
        cartTotal: calculateCartTotal(nextCart),
      }

      localStorage.setItem("cart", JSON.stringify(editItem))

      return {
        ...editItem
      }
    case 'RESET_CART':
      const resetItem = {
        cart: [],
        itemCount: 0,
        cartTotal: 0,
      }
      localStorage.setItem("cart", JSON.stringify(resetItem))

      return { ...resetItem }
    default:
      return state
  }
}



const cartContext = createContext()

// Provider component that wraps your app and makes cart object ...
// ... available to any child component that calls useCart().
export function ProvideCart({ children }) {
  const inCart = JSON.parse(localStorage.getItem("cart"))
  const [state, dispatch] = useReducer(reducer, inCart)

  return (
    <cartContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </cartContext.Provider>
  )
}

// Hook for child components to get the cart object ...
// ... and re-render when it changes.
export const useCart = () => {
  return useContext(cartContext)
}



// Provider hook that creates cart object and handles state
const useProvideCart = () => {
  const { state, dispatch } = useCart()


  const addItem = (item) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: item,
    })
  }

  const editItem = (item, qtn) => {
    dispatch({
      type: 'EDIT_ITEM',
      payload: { item, qtn },
    })
  }

  const removeItem = (id) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: id,
    })
  }

  const removeAllItems = (id) => {
    dispatch({
      type: 'REMOVE_ALL_ITEMS',
      payload: id,
    })
  }

  const resetCart = () => {
    dispatch({
      type: 'RESET_CART',
    })
  }

  const isItemInCart = (id) => {
    return !!state.cart.find((item) => item._id === id)
  }

  /*  Check for saved local cart on load and dispatch to set initial state
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('KenzieCart')) || false
    if (savedCart) {
      dispatch({
        type: 'INIT_SAVED_CART',
        payload: savedCart,
      })
    }
  }, [dispatch]) */

  return {
    state,
    addItem,
    removeItem,
    removeAllItems,
    resetCart,
    isItemInCart,
    editItem,
  }
}

export default useProvideCart
