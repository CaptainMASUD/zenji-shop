import { createContext, useContext, useEffect, useReducer } from 'react';
import { wishlistReducer, initialWishlistState } from '../reducers/wishlistReducer.js';
import { readStorage, writeStorage } from '../utils/storage.js';

const WishlistContext = createContext(null);
export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialWishlistState, () => ({ items: readStorage('zenji_wishlist', []) }));
  useEffect(() => {
    writeStorage('zenji_wishlist', state.items);
  }, [state.items]);
  const value = {
    items: state.items,
    wishlistCount: state.items.length,
    toggleWishlist: (product) => dispatch({ type: 'TOGGLE', payload: product }),
    removeFromWishlist: (id) => dispatch({ type: 'REMOVE', payload: id }),
    isWishlisted: (id) => state.items.some((item) => item.id === id),
  };
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
export const useWishlist = () => useContext(WishlistContext);
