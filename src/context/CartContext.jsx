import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { cartReducer, initialCartState, lineKey } from '../reducers/cartReducer.js';
import { readStorage, writeStorage } from '../utils/storage.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState, (initial) => ({ ...initial, items: readStorage('zenji_cart', []) }));
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    writeStorage('zenji_cart', state.items);
  }, [state.items]);

  const subtotal = useMemo(() => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0), [state.items]);
  const cartCount = useMemo(() => state.items.reduce((sum, item) => sum + item.quantity, 0), [state.items]);

  const value = {
    items: state.items,
    subtotal,
    cartCount,
    drawerOpen,
    setDrawerOpen,
    addToCart: (item) => { dispatch({ type: 'ADD_ITEM', payload: item }); setDrawerOpen(true); },
    removeFromCart: (key) => dispatch({ type: 'REMOVE_ITEM', payload: key }),
    updateQuantity: (key, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { key, quantity } }),
    updateVariant: (key, patch) => dispatch({ type: 'UPDATE_VARIANT', payload: { key, ...patch } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    lineKey,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
