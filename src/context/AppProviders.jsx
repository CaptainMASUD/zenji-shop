import { AuthProvider } from "./AuthContext.jsx";
import { CartProvider } from "./CartContext.jsx";
import { WishlistProvider } from "./WishlistContext.jsx";
import { OrderProvider } from "./OrderContext.jsx";
import { ShopProvider } from "./ShopContext.jsx";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <ShopProvider>{children}</ShopProvider>
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
