export const initialCartState = { items: [] };

const lineKey = (item) =>
  `${item.id}-${item.size || "NA"}-${item.color || "Default"}`;

export function cartReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { items: Array.isArray(action.payload) ? action.payload : [] };
    case "ADD_ITEM": {
      const incoming = {
        ...action.payload,
        quantity: action.payload.quantity || 1,
      };
      const key = lineKey(incoming);
      const existing = state.items.find((item) => lineKey(item) === key);
      if (!existing) return { ...state, items: [...state.items, incoming] };
      return {
        ...state,
        items: state.items.map((item) =>
          lineKey(item) === key
            ? { ...item, quantity: item.quantity + incoming.quantity }
            : item,
        ),
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => lineKey(item) !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            lineKey(item) === action.payload.key
              ? { ...item, quantity: action.payload.quantity }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    case "UPDATE_VARIANT": {
      const { key, size, color } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          lineKey(item) === key
            ? { ...item, size: size ?? item.size, color: color ?? item.color }
            : item,
        ),
      };
    }
    case "CLEAR_CART":
      return initialCartState;
    default:
      return state;
  }
}

export { lineKey };
