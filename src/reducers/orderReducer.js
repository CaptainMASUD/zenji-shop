export const initialOrderState = { orders: [], lastOrder: null };
export function orderReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': return { ...state, orders: Array.isArray(action.payload) ? action.payload : [] };
    case 'PLACE_ORDER': return { orders: [action.payload, ...state.orders], lastOrder: action.payload };
    case 'CANCEL_ORDER': return { ...state, orders: state.orders.map((o) => o.id === action.payload ? { ...o, status: 'Cancelled' } : o) };
    default: return state;
  }
}
