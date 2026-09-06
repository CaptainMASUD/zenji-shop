import { createContext, useContext, useEffect, useReducer } from 'react';
import { orderReducer, initialOrderState } from '../reducers/orderReducer.js';
import { demoOrders } from '../data/mockOrders.js';
import { generateOrderId } from '../utils/generateOrderId.js';
import { readStorage, writeStorage } from '../utils/storage.js';

const OrderContext = createContext(null);
export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialOrderState, () => ({ orders: readStorage('zenji_orders', demoOrders), lastOrder: null }));
  useEffect(() => {
    writeStorage('zenji_orders', state.orders);
  }, [state.orders]);

  const placeOrder = (payload) => {
    const order = { ...payload, id: generateOrderId(), date: new Date().toISOString().slice(0, 10), status: 'Processing' };
    dispatch({ type: 'PLACE_ORDER', payload: order });
    return order;
  };
  const getOrder = (id) => state.orders.find((order) => order.id === id);
  const cancelOrder = (id) => dispatch({ type: 'CANCEL_ORDER', payload: id });

  return <OrderContext.Provider value={{ ...state, placeOrder, getOrder, cancelOrder }}>{children}</OrderContext.Provider>;
}
export const useOrders = () => useContext(OrderContext);
