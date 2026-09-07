import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppProviders from "./context/AppProviders.jsx";
import AnnouncementBar from "./components/layout/AnnouncementBar.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";
import CustomCursor from "./components/layout/CustomCursor.jsx";
import SearchOverlay from "./components/search/SearchOverlay.jsx";
import CartDrawer from "./components/cart/CartDrawer.jsx";
import ShikigamiChatbot from "./components/chatbot/ShikigamiChatbot.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AccountLayout from "./components/account/AccountLayout.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Drops from "./pages/Drops.jsx";
import Lookbook from "./pages/Lookbook.jsx";
import Story from "./pages/Story.jsx";
import Community from "./pages/Community.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Dashboard from "./pages/account/Dashboard.jsx";
import Orders from "./pages/account/Orders.jsx";
import OrderDetails from "./pages/account/OrderDetails.jsx";
import Profile from "./pages/account/Profile.jsx";
import Addresses from "./pages/account/Addresses.jsx";
import RecentlyViewed from "./pages/account/RecentlyViewed.jsx";
import NotFound from "./pages/NotFound.jsx";

function Shell() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/drops" element={<Drops />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/community" element={<Community />} />
          <Route path="/story" element={<Story />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/order-success/:id"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="recently-viewed" element={<RecentlyViewed />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <SearchOverlay />
      <CartDrawer />
      <ShikigamiChatbot />
      <CustomCursor />
      <ScrollToTop />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Shell />
      </AppProviders>
    </BrowserRouter>
  );
}
