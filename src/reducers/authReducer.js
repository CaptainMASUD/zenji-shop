export const initialAuthState = { user: null, addresses: [] };
export function authReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': return { ...initialAuthState, ...action.payload };
    case 'LOGIN': return { ...state, user: action.payload };
    case 'REGISTER': return { ...state, user: action.payload };
    case 'LOGOUT': return initialAuthState;
    case 'UPDATE_PROFILE': return { ...state, user: { ...state.user, ...action.payload } };
    case 'ADD_ADDRESS': return { ...state, addresses: [...state.addresses, action.payload] };
    case 'UPDATE_ADDRESS': return { ...state, addresses: state.addresses.map((a) => a.id === action.payload.id ? action.payload : a) };
    case 'REMOVE_ADDRESS': return { ...state, addresses: state.addresses.filter((a) => a.id !== action.payload) };
    case 'SET_DEFAULT_ADDRESS': return { ...state, addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === action.payload })) };
    default: return state;
  }
}
