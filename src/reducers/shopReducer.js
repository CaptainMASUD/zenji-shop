export const initialShopState = {
  search: "",
  filters: {
    categories: [],
    sizes: [],
    colors: [],
    inStockOnly: false,
    maxPrice: 200,
  },
  sort: "featured",
  quickView: null,
  recentlyViewed: [],
  searchOpen: false,
};
export function shopReducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "RESET_FILTERS":
      return { ...state, filters: initialShopState.filters };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "SET_QUICK_VIEW":
      return { ...state, quickView: action.payload };
    case "SET_SEARCH_OPEN":
      return { ...state, searchOpen: action.payload };
    case "HYDRATE_RECENT":
      return {
        ...state,
        recentlyViewed: Array.isArray(action.payload) ? action.payload : [],
      };
    case "ADD_RECENT":
      return {
        ...state,
        recentlyViewed: [
          action.payload,
          ...state.recentlyViewed.filter((id) => id !== action.payload),
        ].slice(0, 8),
      };
    default:
      return state;
  }
}
