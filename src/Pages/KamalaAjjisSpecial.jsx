// import Navbar_Menu from "../Component/Navbar_Menu";
import { Container, Button, Form , Badge} from "react-bootstrap";
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
import agase from "/media/agase.png";
import powerstarblendcoffeepowder from "/media/powerstarblendcoffeepowder.png";
import hunasethokku from "/media/hunasethokku.png";
import blendcoffeepowder from "/media/blendcoffeepowder.png";
import groundnutchatneypudi from "/media/groundnutchatneypudi.png";
import cocnutchatneypudi from "/media/cocnutchatneypudi.png";

export default function KamalaAjjisSpecial() {
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
      id: 1,
      name: "Ravanduru Special Groundnut Chutney Pudi",
      image: groundnutchatneypudi,
      originalPrice: 105,
      discountedPrice: 100,
    },
    {
      id: 2,
      name: "Ravanduru Special Coconut Chutney Podi",
      image: cocnutchatneypudi,
      originalPrice: 105,
      discountedPrice: 100,
    },
    {
      id: 3,
      name: "Ravanduru Special Agase Chutney Podi or Pudi",
      image: agase,
      originalPrice: 105,
      discountedPrice: 100,
    },
    {
      id: 4,
      name: "Ravanduru Secret Blend Coffee Powder (70/30 Blend)",
      image: blendcoffeepowder,
      originalPrice: 105,
      discountedPrice: 100,
    },
    {
      id: 5,
      name: "Ravanduru Special Power Star Blend Coffee Powder (80/20)",
      image: powerstarblendcoffeepowder,
      originalPrice: 105,
      discountedPrice: 100,
    },
     {
                         id: 13,
                         name: "Ravanduru Special Hunase Thokku",
                         image: hunasethokku,
                         originalPrice: 105,
                         discountedPrice: 100,
                         description:
                           "RAVANDURU SPECIALS TO YOUR PLATE  — tradition, spice, and everything nice. HUNASE THOKKU----Tangy, spicy, and irresistibly flavorful, the Authentic Ravanduru Special Hunase Thokku is a traditional tamarind Thokku made with love and care in the village of Ravanduru. Using handpicked tamarind, slow-cooked with aromatic spices and a hint of jaggery, this thokku strikes the perfect balance between sourness, heat, and a touch of sweetness. Prepared in small batches with no preservatives, it’s the ideal accompaniment for rice, dosa, chapati, or curd rice. Every spoonful delivers a burst of bold, authentic South Indian flavor.A timeless village recipe, packed with punch — only from Ravanduru.",
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
            fontFamily: "poppins, sans-serif",
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
        {/*}  <div style={{ position: "absolute", top: "65%" }}>
            <img
              src={ChutneyPodi}
              alt="Banana Leaf"
              style={{ width: "20%", height: "auto", objectFit: "cover" }}
            />
          </div>*/}
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
                  fontSize: "35px",
                }}
                className="mobile-font"
              >
                Kamala Ajji's Special
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
                     // border: "2px solid #00614A",
                     // boxShadow: "1px 1px 6px #00614A",
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
                        height: "250px",
                        objectFit: "contain",
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
                          fontSize: "22px",
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
                            fontSize: "24px",
                            margin: 0,
                            letterSpacing: "1px",
                            fontWeight:"bold"
                          }}
                        >
                         &#8377; {item.discountedPrice}
                        </p>
                        <Badge
                                                bg="success"
                                                className="discount-badge"
                                                style={{marginLeft:"10px"}}
                                              >
                                                {Math.max(
                                                  0,
                                                  Math.round(
                                                    ((item.originalPrice -
                                                      item.discountedPrice) /
                                                      item.originalPrice) *
                                                      100
                                                  )
                                                )}
                                                % OFF
                                              </Badge>
                      </div>

                      <Button
                        onClick={() => handleCardClick(item.id)}
                        variant="none"
                        className="view-button"
                        style={{
                          fontWeight: "bold",
                          color: "#00614A",
                          backgroundColor:"#97d7c6",
                          //backgroundImage: "url('/media/AddCart.png')",
                          backgroundSize: "contain",
                          backgroundPosition: "left",
                          backgroundRepeat: "no-repeat",
                          border: "none",
                          padding: "10px 14px",
                          fontSize: "16px",
                          letterSpacing: "1px",
                          textAlign:"left",
                          width:"fit-content"
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
            fontFamily: "poppins, sans-serif",
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
                  Yummy Snacks
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
