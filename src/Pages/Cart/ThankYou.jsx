import Footer from "../../Component/Footer";
import Navbar_Menu from "../../Component/Navbar_Menu";
import ScrollToTop from "../../Component/ScrollToTop";
import Products_Sliders from "../Products_Sliders";
import thankyou from "/media/Thankyou.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Thankyou() {
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

     const redirectTimeout = setTimeout(() => {
      navigate("/");
    }, 5000);

   return () => {
      clearTimeout(fadeInTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div
        className="page-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {/* <Navbar_Menu /> */}

        <div
          style={{
            textAlign: "center",
            color: "#00614A",
            fontWeight: "bold",
            fontFamily: "oswald, sans-serif",
            backgroundImage: "url('/media/Thankyoudecoration.png')",
            backgroundSize: "contain",
            backgroundRepeat: "repeat",
            backgroundPosition: "center",
            padding: "100px 20px",
            minHeight: "100vh",
          }}
        >
          <h1
            style={{
              fontWeight: "900",
              fontSize: "95px",
              letterSpacing: "3px",
              margin: "10% 0 0 0",
            }}
          >
            THANK YOU!
          </h1>
          <p style={{ fontSize: "26px", letterSpacing: "1px", opacity: "0.5" }}>
            Your Order Has Been Confirmed
          </p>
        </div>

        <div>
          <img
            src={thankyou}
            alt="Thank you"
            style={{
              width: "35%",
              height: "auto",
              objectFit: "cover",
              justifySelf: "center",
              display: "block",
            }}
          />
        </div>

     {/*}   <div
          style={{
            textAlign: "center",
            backgroundColor: "#FBF9F4",
            fontFamily: "oswald, sans-serif",
            color: "#00614A",
          }}
        >
          <div style={{ padding: "5%" }}>
            <h1 style={{ fontSize: "58px", letterSpacing: "1px" }}>
              SHOP OUR PRODUCTS
            </h1>
            <div>
              <Products_Sliders />
            </div>
          </div>
        </div>*/}

        {/* BOTTOM BANNER */}
       {/*} <div
          style={{
            backgroundImage: "url('/media/Nopreservatives.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h3
            style={{
              padding: "50px",
              textAlign: "center",
              color: "white",
              fontSize: "45px",
              letterSpacing: "2px",
              lineHeight: "1.7",
              margin: "0",
              fontFamily: "oswald, sans-serif",
            }}
          >
            NO PRESERVATIVES AND CHEMICALS <br />
            PURELY HOME MADE AND ORGANICALLY SOURCED INGREDIENTS
          </h3>
        </div>*/}

        <ScrollToTop />

        {/* FOOTER */}
        {/* <Footer /> */}
      </div>
    </>
  );
}
