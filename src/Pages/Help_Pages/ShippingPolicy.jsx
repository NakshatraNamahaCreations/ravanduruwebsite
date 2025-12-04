import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import ScrollToTop from "../../Component/ScrollToTop";
import SearchBar from "../../Component/SearchBar";

export default function ShippingPolicy(){
      const [isVisible, setIsVisible] = useState(false);
    
      useEffect(() => {
        const timeout = setTimeout(() => {
          setIsVisible(true);
        }, 100);
    
        return () => clearTimeout(timeout);
      }, []);
    
      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return(
        <>
              <div
        className="page-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {/* NAVBAR MENU */}
        {/* <Navbar_Menu /> */}

        {/* SEARCH BAR */}
      {/*}  <SearchBar />*/}

        {/* SHIPPING POLICY */}
        <Container>
        <div style={{ margin: "0% 10% 10% 10%",
              fontFamily: "oswald, sans-serif", }} className="terms-section">
          <h1
            style={{
              lineHeight: "1.5",
              letterSpacing: "2px",
              fontSize: "75px",
              maxWidth: "100%",
              fontWeight: "bold",
              fontFamily: "oswald, sans-serif",
              textAlign: "center",
              marginBottom:'5%',
              color:'#00614A'
            }} className="mobile-font"
          >
            SHIPPING POLICY
          </h1>
          <div className="div-p-ul">
            <p style={{textAlign:'right', marginBottom:'5%'}} className="date-terms">Last Updated: <span style={{fontFamily:'oswald, sans-serif'}} >October 12, 2024</span></p>
            <p>Thank you for choosing Ravanduru Stores!</p>
            <p>
              Below are the details of our shipping process to ensure a seamless
              experience. Processing Time Orders are processed within 5-7
              business days after purchase. During peak times (e.g., holidays,
              sales), processing times may be slightly extended.
            </p>
            <p>Shipping Methods & Delivery Times We offer the following</p>
            <ul>
              <p>Shipping Options:</p>
              <li>Standard Shipping: <span style={{fontSize:'18px', marginLeft:'5px', fontFamily:'oswald, sans-serif', letterSpacing:'1.5px'}}>Delivery in 4-7 days.</span></li>
              <li>Expedited Shipping: <span style={{fontSize:'18px', marginLeft:'5px', fontFamily:'oswald, sans-serif', letterSpacing:'1.5px'}}>Delivery in 4-7 days.</span></li>
              <li>
                International Shipping (if applicable): <span style={{fontSize:'18px', marginLeft:'5px', fontFamily:'oswald, sans-serif', letterSpacing:'1.5px'}}>Delivery in 10-14 days.</span>
              </li>
              <li>
                Note: <span style={{fontSize:'18px', marginLeft:'5px', fontFamily:'oswald, sans-serif', letterSpacing:'1.5px'}}> Delivery times may vary depending on your location,
                carrier delays, or external factors.</span>
              </li>
              <li>
                Shipping Rates Free Shipping: <span style={{fontSize:'18px', marginLeft:'5px', fontFamily:'oswald, sans-serif', letterSpacing:'1.5px'}}>For orders over ₹5,000.</span> 
                
              </li>
              <li>Flat-Rate Shipping: <span style={{fontSize:'18px', marginLeft:'5px', fontFamily:'oswald, sans-serif', letterSpacing:'1.5px'}}>₹40-60.</span></li>
              <li>
                Real-Time Rates: <span style={{fontSize:'18px', marginLeft:'5px', fontFamily:'oswald, sans-serif', letterSpacing:'1.5px'}}>Displayed at checkout based on your location.</span>
              </li>
            </ul>
            <p>
              Order Tracking Once shipped, you will receive a tracking number
              via email. Track your order on our website or directly with the
              carrier. International Shipping Customs, duties, and taxes may
              apply and are the responsibility of the customer.
            </p>
            <p>
              Check your local customs policies before placing an order. Lost or
              Delayed Packages For delayed or lost packages, contact us at <span style={{fontFamily:'oswald, sans-serif', letterSpacing:'1px', fontSize:'20px'}}>
              av.kitchens1532@gmail.com</span>. We will coordinate with the carrier to
              resolve the issue. Address Errors Please double-check your
              shipping address at checkout. Orders sent to an incorrect address
              may incur additional shipping fees.
            </p>
            <ul>
              <p>Contact Us For any questions, feel free to reach out: </p>
              <li>Email: <span style={{fontSize:'18px', marginLeft:'5px', fontFamily:'oswald, sans-serif', letterSpacing:'1.5px'}}>av.kitchens1532@gmail.com</span></li>
              <li>Phone: <span style={{fontSize:'18px', marginLeft:'5px', fontFamily:'oswald, sans-serif', letterSpacing:'1.5px'}}>+91 7899830366</span></li>
            </ul>
            <p> Thank you for shopping with Ravanduru Stores!</p>
          </div>
        </div>
      </Container>

      <ScrollToTop />

      {/* FOOTER */}
      {/* <Footer /> */}
      </div>
        </>
    )
}