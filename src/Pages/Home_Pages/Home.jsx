import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container, Row, Col } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import Orange from "/media/Orange.png";
import logo from "/media/logo.png";
import village from "/media/village.png";
import momkids from "/media/MotherandKids.png";
import natural100 from "/media/natural100.png";
import lock from "/media/Silverlock.png";
import smile from "/media/Smile.png";
import linelock from "/media/whiteLine.png";
import productsthree_ from "/media/productsthree_.png";
import { useState, useEffect } from "react";
// import Navbar_Menu from "../../Component/Navbar_Menu";
import SocialSidebar from "./SocialSidebar";
import Products_Sliders from "../Products_Sliders";
import ChooseUs from "./ChooseUs";
import Reviews from "./Reviews";
// import Footer from "../../Component/Footer";

import ScrollToTop from "../../Component/ScrollToTop";
import SearchBar from "../../Component/SearchBar";
import ellipse from "/media/ellipse.svg"
import imgicon from "/media/imgicon.png";
//import Ajji_ from "/media/Ajji_.png";
import { useRef } from "react";
import frameajji from "/media/frameajji.png"
import Ravanduru from "/media/Ravanduru.png"

export default function Home() {
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

  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  useEffect(() => {
    let current = 1;
    const interval = setInterval(() => {
      if (current === 1) {
        video1Ref.current.style.display = "none";
        video2Ref.current.style.display = "block";
        video2Ref.current.play();
        video1Ref.current.pause();
        current = 2;
      } else {
        video2Ref.current.style.display = "none";
        video1Ref.current.style.display = "block";
        video1Ref.current.play();
        video2Ref.current.pause();
        current = 1;
      }
    }, 8000); // change every 8 seconds

    return () => clearInterval(interval);
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
        <div>
          {/* NAVBAR MENU */}
          {/* <Navbar_Menu /> */}

          {/* SEARCH */}
          <SearchBar />
          

          {/* BANNER */}
          <div className="hero-section">
            <video id="video1" className="background-video" autoPlay muted loop playsInline>
    <source src="/media/Gif-ravanduru.mp4" type="video/mp4" />
  </video>
  {/*<video id="video2" className="background-video" muted loop playsInline style={{display: "none"}}>
    <source src="/media/BannerGIF.mp4" type="video/mp4" />
 </video>*/}
      </div>
      <SocialSidebar/>
            
           {/*} <h1
              className="hero-heading"
              style={{ fontFamily: "oswaldMedium, sans-serif" }}
            >
              SERVING THE TASTE <br /> AND TRADITION OF <br />
              <span className="highlight">RAVANDURU</span> <br /> TO{" "}
              <span className="highlight">
                BHARATH <br /> AND BEYOND
              </span>
            </h1>*/}
      

            {/* Ads */}
            <div className="hero-ads" style={{ position: "relative", display: "inline-block", marginTop:"-70px"}}>
             
  <img src={Orange} alt="ads" className="ads-img" style={{ width: "100%", height: "auto" }} />
   
<div style={{ position: "relative", marginTop: "-15px" }}>
 
  <div
    className="iconbg"
    style={{
      position: "absolute",
      bottom: "12%", 
      right: "7.7%",
      zIndex: 99,
     transform: "translateY(-3px)"
    }}
  >
    <img
      src={imgicon}
      alt="icon"
      style={{
        width: "100%",
        height: "6.875rem",
        objectFit: "cover",
        marginTop: "0.5rem",
      }}
    />
  </div>

  
  
</div>

</div>


          {/* STORY OF RAVANDURU */}

          <Container
            style={{
              marginTop: "10%",
              fontFamily: "oswaldMedium, sans-serif",
              letterSpacing: "1px",
            }}
            className="story-ravanduru-container"
          >
            <Row>
              <Col sm={8} style={{ padding: "20px", color: "#00614A" }}>
                <img
                  src={logo}
                  alt="logo"
                  style={{
                    width: "25%",
                    height: "auto",
                    objectFit: "cover",
                    marginBottom: "20px",
                  }}
                  className="story-logo"
                />
                <h1
                  style={{
                    fontWeight: "900",
                    fontSize: "35px",
                    fontFamily: "oswald, sans-serif",
                    
                  }}
                  className="story-font-h1"
                >
                  Story Of Ravanduru Stores
                </h1>

                <div style={{ position: "relative", overflow: "hidden" }}>
                  {/* Background image with opacity */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage:
                        "url('/media/StoneSmasher_Watermark.png')",
                      backgroundSize: "50%",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      zIndex: 0,
                    }}
                  />

                  {/* Text content */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      padding: "20px 5px",
                      fontFamily: "poppins, sans-serif",
                      color: "#00614A",
                    }}
                  >
                    <p
                      style={{
                        lineHeight: "1.8",
                        fontSize: "18px",
                        maxWidth: "900px",
                        margin: "0 auto",
                      }}
                      className="story-para"
                    >
                      In the heart of the serene village of{" "}
                      <strong>RAVANDURU</strong>, nestled amidst rolling hills
                      and lush greenery, emerged a culinary gem –{" "}
                      <strong>"RAVANDURU STORES"</strong>. This savories brand,
                      born from tradition and crafted with passion, honors the
                      flavors and heritage of the village. Each savory delight
                      tells a tale of locally sourced ingredients, passed-down
                      recipes, and the warmth of community spirit. From crispy
                      snacks to aromatic Podis and more,
                      <strong>"RAVANDURU STORES"</strong> brings the essence of
                      the quaint village to every palate, inviting the world to
                      savor its rich, flavorful narratives from our home to{" "}
                      <strong>BHARATH & BEYOND...</strong>
                    </p>
                  </div>
                </div>
              </Col>
              <Col sm={4}>
                <img
                  className="story-image"
                  src={Ravanduru}
                  alt="Products"
                  style={{ width: "100%", height: "600px", objectFit: "cover" }}
                />
               {/*} <Button
                  variant="none"
                  style={{
                    fontWeight: "bold",
                    color: "#00614A",
                    backgroundImage: "url('/media/AddCart.png')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    border: "none",
                    padding: "25px 30px",
                    fontSize: "24px",
                    fontFamily: "oswald, sans-serif",
                    letterSpacing: "1px",
                    display: "block",
                    justifySelf: "center",
                    marginTop: "15px",
                  }}
                >
                  EXPLORE PRODUCTS
                </Button>*/}
              </Col>
            </Row>
          </Container>
          <div style={{ marginTop: "-5%" }}>
            <img
              src={village}
              alt="village"
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>

          {/* SHOP OUR PRODUCTS */}

          <div
            style={{
              textAlign: "center",
              backgroundColor: "#FBF9F4",
              fontFamily: "oswald, sans-serif",
              color: "#00614A",
            }}
          >
            <div style={{ paddingTop: "5%" }}>
              <h1
                style={{ fontSize: "35px", letterSpacing: "1px" , fontFamily:"oswald"}}
                className="mobile-font"
              >
                Shop Our Products
              </h1>
              <div>
                <Products_Sliders />
              </div>
            </div>
          </div>

          {/* 100% NATURAL */}

          <div
            className="no-preservatives-section"
            style={{
              backgroundImage: "url('/media/Nopreservatives.png')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",

              color: "white",
              fontFamily: "oswald, sans-serif",
            }}
          >
            <div
              className="no-preservatives-flex"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 40%" }}>
                <img
                  src={momkids}
                  alt="mom and kids"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              </div>

              <div
                style={{
                  flex: "1 1 55%",
                  padding: "10px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "50px",
                      letterSpacing: "1px",
                      margin: 0,
                    }}
                  >
                    NO PRESERVATIVES <br />
                    NO CHEMICALS
                  </h3>

                  <h3
                    style={{
                      fontSize: "50px",
                      letterSpacing: "1px",
                      margin: 0,
                    }}
                  >
                    PURELY HOME MADE AND <br /> ORGANICALLY SOURCED INGREDIENTS
                  </h3>
                </div>

                <div
                  className="natural-stamp"
                  style={{
                    position: "absolute",
                    bottom: "50%",
                    right: "-35%",
                  }}
                >
                  <img
                    src={natural100}
                    alt="natural-100%"
                    style={{
                      width: "35%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* WHY CHOOSE US */}
          <ChooseUs />

          {/* LOCK & SMILE */}

          <div
            style={{
              backgroundImage: "url('/media/Nopreservatives.png')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              padding: "20px 0 0 0",
              height: "auto",
              color: "white",
              fontFamily: "oswald, sans-serif",
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
          {/* REVIEW */}
          <Reviews />

          <ScrollToTop />

          {/* FOOTER */}
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
}
