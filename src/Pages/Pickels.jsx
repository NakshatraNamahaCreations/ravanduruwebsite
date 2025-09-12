// import Navbar_Menu from "../Component/Navbar_Menu";
import { Container, Button, Form } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import product from "/media/products.png";
import visiblestar from "/media/Star-visible.png";
import hiddenstar from "/media/Star-hidden.png";
import lock from "/media/Silverlock.png";
import smile from "/media/Smile.png";
import linelock from "/media/whiteLine.png";
// import Footer from "../Component/Footer";
import ChutneyPodi from "/media/ChutneyPodi.png";
import ChutneyPodireverse from "/media/ChutneyPodi-reverse.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Reviews from "./Home_Pages/Reviews";
import ScrollToTop from "../Component/ScrollToTop";
import SearchBar from "../Component/SearchBar";

export default function Pickels() {
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
  const navigate = useNavigate();

  const products = [
    {
      id: 13,
      name: "HUNASE THOKKU",
      image: product,
      originalPrice: 120,
      discountedPrice: 100,
      
    }, 
    
  ];

  const handleCardClick = (id) => {
    navigate(`/productsdetails/${id}`);
  };
  return (
    <>
      <div
        className="page-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {/* NAVBAR */}
        {/* <Navbar_Menu /> */}

        {/* SEARCH */}
        <SearchBar />
        {/* PRODUCTS */}
        <div
          style={{
            backgroundColor: "#FBF9F4",
            fontFamily: "kapraneue, sans-serif",
            position: "relative",
          }}
          className="login-background"
        >
          <div style={{ position: "absolute", top: "2%" }}>
            <img
              src={ChutneyPodi}
              alt="Banana Leaf"
              style={{ width: "20%", height: "auto", objectFit: "cover" }}
            />
          </div>
          <div style={{ position: "absolute", top: "65%" }}>
            <img
              src={ChutneyPodi}
              alt="Banana Leaf"
              style={{ width: "20%", height: "auto", objectFit: "cover" }}
            />
          </div>
          <div style={{ position: "absolute", right: "-33%", top: "40%" }}>
            <img
              src={ChutneyPodireverse}
              alt="Banana Leaf"
              style={{ width: "24%", height: "auto", objectFit: "cover" }}
            />
          </div>
          <Container>
            <div style={{ padding: "30px", marginTop: "3%" }}>
              <h1
                style={{
                  fontWeight: "bold",
                  color: "#00614A",
                  textAlign: "center",
                  fontSize: "64px",
                  letterSpacing: "2px",
                }}
                className="mobile-font"
              >
                PICKELS
              </h1>

              <div
                className="product-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "30px",
                  padding: "10px",
                  margin: "3% 0",
                  justifySelf: "center",
                }}
              >
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="product-card"
                    style={{
                      border: "2px solid #00614A",
                      boxShadow: "1px 1px 6px #00614A",
                      borderTopRightRadius: "20px",
                      borderBottomRightRadius: "20px",
                      width: "100%",
                      maxWidth: "800px",
                      display: "flex",
                      margin: "16px auto",
                      overflow: "hidden",
                    }}
                  >
                    {/* Reduced image size */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="product-image"
                      style={{
                        width: "40%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />

                    <div
                      className="product-info"
                      style={{
                        padding: "15px 20px",
                        color: "#00614A",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "44px",
                          fontWeight: "700",
                          marginBottom: "8px",
                          textAlign: "left",
                        }}
                      >
                        {item.name}
                      </h4>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          gap: "5px",
                          marginBottom: "10px",
                        }}
                      >
                        {[
                          visiblestar,
                          visiblestar,
                          visiblestar,
                          visiblestar,
                          hiddenstar,
                        ].map((star, i) => (
                          <img
                            key={i}
                            src={star}
                            alt="star"
                            style={{ width: "16px", height: "16px" }}
                          />
                        ))}
                      </div>

                      <div
                        className="product-price"
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "flex-start",
                          gap: "5px",
                        }}
                      >
                        <p
                          style={{
                            opacity: 0.5,
                            textDecoration: "line-through",
                            textDecorationColor: "red",
                            textDecorationThickness: "2px",
                            fontSize: "26px",
                            marginRight: "8px",
                            letterSpacing: "1px",
                            fontFamily: "KapraNeueMedium, sans-serif",
                          }}
                        >
                         &#8377; {item.originalPrice}
                        </p>
                        <p
                          style={{
                            fontSize: "34px",
                            margin: 0,
                            letterSpacing: "1px",
                          }}
                        >
                         &#8377; {item.discountedPrice}
                        </p>
                      </div>

                      <Button
                        onClick={() => handleCardClick(item.id)}
                        variant="none"
                        className="view-button"
                        style={{
                          fontWeight: "bold",
                          cursor:'pointer',
                          color: "#00614A",
                          backgroundImage: "url('/media/AddCart.png')",
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          border: "none",
                          padding: "10px 14px",
                          fontSize: "22px",
                          letterSpacing: "1px",
                        }}
                      >
                        VIEW PRODUCT
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>

        {/* LOCK & SMILE */}

        <div
          style={{
            backgroundImage: "url('/media/Nopreservatives.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            padding: "20px 0 0 0",
            height: "auto",
            color: "white",
            fontFamily: "kapraneue, sans-serif",
          }}
          className="lock-smile-background"
        >
          <div style={{ position: "relative" }}>
            <div
              className="lock-section"
              style={{
                padding: "70px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <img
                src={lock}
                alt="Silver Lock"
                className="lock-image"
                style={{
                  width: "25%",
                  height: "auto",
                  objectFit: "cover",
                  zIndex: "999999",
                }}
              />
              <h3
                style={{
                  fontSize: "40px",
                  marginLeft: "-17%",
                  letterSpacing: "1px",
                }}
              >
                Unlock the path to <br />
                <span style={{ fontWeight: "900", fontSize: "65px" }}>
                  Healthy Snacks
                </span>{" "}
                <br /> with a smile
              </h3>
              <img
                src={smile}
                alt="smile"
                className="smile-image"
                style={{
                  width: "25%",
                  height: "auto",
                  objectFit: "cover",
                  zIndex: "999999",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "20%",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <img
                src={linelock}
                alt="lines"
                className="line-image"
                style={{ width: "55%", height: "auto", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
        {/* REVIEWS */}
        <Reviews />

        <ScrollToTop />

        {/* FOOTER */}
        {/* <Footer /> */}
      </div>
    </>
  );
}
