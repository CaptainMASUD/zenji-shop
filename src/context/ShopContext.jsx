import { createContext, useContext, useEffect, useReducer } from 'react';
import { shopReducer, initialShopState } from '../reducers/shopReducer.js';
import { readStorage, writeStorage } from '../utils/storage.js';

const ShopContext = createContext(null);
export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(shopReducer, initialShopState, (initial) => ({ ...initial, recentlyViewed: readStorage('zenji_recently_viewed', []) }));
  useEffect(() => {
    writeStorage('zenji_recently_viewed', state.recentlyViewed);
  }, [state.recentlyViewed]);
  return <ShopContext.Provider value={{ ...state,
    setSearch: (value) => dispatch({ type: 'SET_SEARCH', payload: value }),
    setFilters: (value) => dispatch({ type: 'SET_FILTERS', payload: value }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    setSort: (value) => dispatch({ type: 'SET_SORT', payload: value }),
    setQuickView: (value) => dispatch({ type: 'SET_QUICK_VIEW', payload: value }),
    setSearchOpen: (value) => dispatch({ type: 'SET_SEARCH_OPEN', payload: value }),
    addRecentlyViewed: (id) => dispatch({ type: 'ADD_RECENT', payload: id }),
  }}>{children}</ShopContext.Provider>;
}
export const useShop = () => useContext(ShopContext);
