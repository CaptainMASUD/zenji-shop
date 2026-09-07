export const initialWishlistState = { items: [] };
export function wishlistReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { items: Array.isArray(action.payload) ? action.payload : [] };
    case "TOGGLE": {
      const exists = state.items.some((item) => item.id === action.payload.id);
      return {
        items: exists
          ? state.items.filter((item) => item.id !== action.payload.id)
          : [...state.items, action.payload],
      };
    }
    case "REMOVE":
      return {
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "CLEAR":
      return initialWishlistState;
    default:
      return state;
  }
}
