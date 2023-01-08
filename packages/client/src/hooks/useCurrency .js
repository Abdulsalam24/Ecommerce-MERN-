import React, { createContext, useContext, useReducer, useMemo } from 'react'

const initialState = {
    currency: "$",
    multiplier: 0.8
}

export const currencyContext = createContext(initialState)

currencyContext.displayName = 'currencyContext'

function currencyReducer(state, action) {
    switch (action.type) {
        case 'SET_CURRENCY': {
            return {
                ...state,
                currency: state.currency === "$" ? "€" : "$",
            }
        }
        default:
            return state
    }
}

export const UseCurrencyProvider = (props) => {
    const [state, dispatch] = useReducer(currencyReducer, initialState)

    const toggleCurrency = () => {
        dispatch({
            type: "SET_CURRENCY"
        })
    }

    const getPrice = (amount) => {
        const euro = state.currency === "$" ? amount * state.multiplier : amount
        return `${state.currency}${euro}`
    }

    const value = useMemo(
        () => ({
            ...state,
            getPrice,
            toggleCurrency,
        }),
        [state]
    )

    return <currencyContext.Provider value={value} {...props} />
}


const UseCurrency = () => {
    const context = useContext(currencyContext)
    if (context === undefined) {
        throw new Error(`UseCurrency must be used within a UseCurrencyProvider`)
    }
    return context
}

export const ManagedCurrencyContext = ({ children }) => (
    <UseCurrencyProvider>{children}</UseCurrencyProvider>
)

export default UseCurrency
