import { createContext, useContext, useEffect, useReducer } from 'react';
import { authReducer, initialAuthState } from '../reducers/authReducer.js';
import { readStorage, writeStorage } from '../utils/storage.js';
import { demoUser } from '../data/mockUsers.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState, () => readStorage('zenji_auth', initialAuthState));
  useEffect(() => {
    writeStorage('zenji_auth', state);
  }, [state]);

  const login = ({ email }) => {
    const stored = readStorage('zenji_registered_user', null);
    const user = stored?.email === email ? stored : { ...demoUser, email: email || demoUser.email };
    dispatch({ type: 'LOGIN', payload: user });
    return user;
  };
  const register = (payload) => {
    const user = { id: `user-${Date.now()}`, name: payload.name, email: payload.email, phone: payload.phone || '', dob: '' };
    writeStorage('zenji_registered_user', user);
    dispatch({ type: 'REGISTER', payload: user });
    return user;
  };
  const logout = () => dispatch({ type: 'LOGOUT' });
  const updateProfile = (patch) => dispatch({ type: 'UPDATE_PROFILE', payload: patch });
  const addAddress = (address) => dispatch({ type: 'ADD_ADDRESS', payload: { ...address, id: `addr-${Date.now()}` } });
  const updateAddress = (address) => dispatch({ type: 'UPDATE_ADDRESS', payload: address });
  const removeAddress = (id) => dispatch({ type: 'REMOVE_ADDRESS', payload: id });
  const setDefaultAddress = (id) => dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: id });

  return <AuthContext.Provider value={{ ...state, isAuthenticated: Boolean(state.user), login, register, logout, updateProfile, addAddress, updateAddress, removeAddress, setDefaultAddress }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
