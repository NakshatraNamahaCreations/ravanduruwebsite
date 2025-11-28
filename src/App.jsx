import "./App.css";
import Best_Seller from "./Pages/Best_Seller";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Account_Forms from "./Pages/Account_Pages/Account_Forms";
import Thankyou from "./Pages/Cart/ThankYou";
import Yourcart from "./Pages/Cart/Yourcart";
import KamalaAjjisSpecial from "./Pages/KamalaAjjisSpecial";
import Wishlist from "./Pages/Cart/Wishlist";
import ProductsDetails from "./Pages/ProductsDetails";
import Login from "./Pages/Account_Pages/Login";
import Create_Account from "./Pages/Account_Pages/Create_Account";
import Forget_Password from "./Pages/Account_Pages/Forget_Password";
import Contact from "./Pages/Contact";
import Home from "./Pages/Home_Pages/Home";
import Checkout from "./Pages/Cart/Checkout";
import TermsConditions from "./Pages/Help_Pages/TermsConditions";
import Privacy_Policy from "./Pages/Help_Pages/Privacy_Policy";
import ShippingPolicy from "./Pages/Help_Pages/ShippingPolicy";
import RefundPolicy from "./Pages/Help_Pages/RefundPolicy";
import Navbar_Menu from "./Component/Navbar_Menu";
import Footer from "./Component/Footer";
import Karas from "./Pages/Karas";
import Sweets from "./Pages/Sweets";
import Pickels from "./Pages/Pickels";


import AddressForm from "./Pages/Account_Pages/AddressForm";
import ProfileDetails from "./Pages/Account_Pages/Profile-Details";
import CartToastProvider from "./Component/CartToastProvider";
import OrderDetails from "./Pages/Account_Pages/OrderDetails";
import Categories from "./Pages/Categories";
import PaymentFailed from "./Pages/Cart/FailurePage";

function App() {
  return (
    <>
    
      <Router>
        <CartToastProvider/>
        <Navbar_Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/best-seller" element={<Best_Seller />} />
          <Route path="/Kamala-Ajjs-Special" element={<KamalaAjjisSpecial />} />
          <Route path="/karas" element={<Karas />} />
          <Route path="/sweets" element={<Sweets />} />
          <Route path="/pickels" element={<Pickels />} />
          <Route path="/account" element={<Account_Forms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create_account" element={<Create_Account />} />
          <Route path="/forget_password" element={<Forget_Password />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/thankyou" element={<Thankyou />} />
          <Route path="/your-cart" element={<Yourcart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/productsdetails/:id" element={<ProductsDetails />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/privacy" element={<Privacy_Policy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/profile-details" element={<ProfileDetails/>}/>
          <Route path="/order-details" element={<OrderDetails/>}/>
          <Route path="/address-details" element={<AddressForm/>}/>
          <Route path="/categories" element={<Categories/>}/>
          <Route path="/payment-failed" element={<PaymentFailed/>}/>
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
