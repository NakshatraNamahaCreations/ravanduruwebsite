// import Navbar_Menu from "../../Component/Navbar_Menu";
import { Container, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
// import Footer from "../../Component/Footer";
import { Link } from "react-router-dom";
import BannaleafRd from "/media/BannaleafRd.png";
import Rectangle from "/media/Rectangle.png";
import plate from "/media/Layer_20.png";
import BannaleafRU from "/media/BannaleafRU.png";
import Loginpageline from "/media/Loginpageline.png";
import { useState, useEffect } from "react";
import ScrollToTop from "../../Component/ScrollToTop";

export default function Forget_Password() {
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
  return (
    <>
      <div
        className="page-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <div
          style={{
            backgroundColor: "#FBF9F4",
            fontFamily: "oswald, sans-serif",
            position: "relative",
          }}
        >
          {/* <Navbar_Menu /> */}
          <div
            style={{ position: "relative", margin: "10% 0" }}
            className="login-background"
          >
            <div
              style={{
                position: "absolute",
                top: "-25%",
                pointerEvents: "none",
                zIndex: 1,
              }}
              className="banana-left"
            >
              <img
                src={BannaleafRd}
                alt="Banana Leaf"
                style={{
                  width: "30%",
                  height: "auto",
                  objectFit: "cover",
                  pointerEvents: "none",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                top: "70%",
                pointerEvents: "none",
                zIndex: 1,
              }}
              className="rectangle-left"
            >
              <img
                src={Rectangle}
                alt="Rectangle"
                style={{
                  width: "25%",
                  height: "auto",
                  objectFit: "cover",
                  pointerEvents: "none",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                right: "-50%",
                pointerEvents: "none",
                zIndex: 1,
              }}
              className="chakli-plate"
            >
              <img
                src={plate}
                alt="Plate"
                style={{
                  width: "25%",
                  height: "auto",
                  objectFit: "cover",
                  pointerEvents: "none",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                top: "70%",
                right: "-42%",
                pointerEvents: "none",
                zIndex: 1,
              }}
              className="banana-right-login"
            >
              <img
                src={BannaleafRU}
                alt="Banana Leaf"
                style={{
                  width: "25%",
                  height: "auto",
                  objectFit: "cover",
                  pointerEvents: "none",
                }}
              />
            </div>
            <Container
              style={{
                margin: "5% auto",
                display: "flex",
                justifyContent: "center",
                fontFamily: "oswald, sans-serif",
                position: "relative",
                zIndex: 10,
              }}
            >
              <div
                className="p-4 form"
                style={{
                  borderRadius: "10px",
                  padding: "25px",
                  maxWidth: "600px",
                  width: "100%",
                  border: "2px solid #00614A",
                  boxShadow: "1px 1px 10px #00614A",
                  backgroundColor: "#fff",
                }}
              >
                <h2
                  className="text-center mb-4 mobile-font"
                  style={{
                    fontWeight: "bold",
                    fontSize: "64px",
                    letterSpacing: "2px",
                    color: "#00614A",
                  }}
                >
                  UPDATE PASSWORD
                </h2>

                <Form>
                  {/* New Password */}
                  <Form.Group className="mb-4">
                    <Form.Control
                      type="text"
                      placeholder="Create New Password"
                      style={{
                        height: "50px",
                        border: "1.5px solid #00614A",
                        fontFamily: "oswaldMedium, sans-serif",
                        fontSize: "20px",
                      }}
                      className="input-account-forms search-input"
                    />
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-4">
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      style={{
                        height: "50px",
                        border: "1.5px solid #00614A",
                        fontFamily: "oswaldMedium, sans-serif",
                        fontSize: "20px",
                      }}
                      className="input-account-forms search-input"
                    />
                  </Form.Group>

                  {/* Resend Link */}
                  <Link
                    to="/forget_password"
                    style={{
                      letterSpacing: "1px",
                      margin: "10px 0",
                      display: "block",
                      fontFamily: "oswaldMedium, sans-serif",
                    }}
                  >
                    Resend Link
                  </Link>

                  {/* Submit Button */}
                  <Button
                    variant="none"
                    type="submit"
                    className="w-50 mt-2 login-buttons"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "280px",
                      height: "80px",
                      fontWeight: "bold",
                      color: "#00614A",
                      backgroundImage: "url('/media/AddCart.png')",
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      fontSize: "24px",
                      letterSpacing: "1px",
                      textAlign: "center",
                      textDecoration: "none",
                      fontFamily: "oswald, sans-serif",
                      position: "relative",
                      zIndex: 1000,
                      pointerEvents: "auto",
                      border: "none",
                      margin: "20px auto",
                    }}
                  >
                    UPDATE PASSWORD
                  </Button>
                </Form>

                {/* Line */}
                <div>
                  <img
                    src={Loginpageline}
                    alt="Chakali Line"
                    style={{
                      width: "50%",
                      height: "auto",
                      objectFit: "cover",
                      display: "block",
                      justifySelf: "center",
                      margin: "0 auto",
                    }}
                  />
                </div>

                {/* Create Account */}
                <p
                  style={{
                    fontSize: "20px",
                    letterSpacing: "1px",
                    textAlign: "center",
                    color: "#00614A",
                    margin: "0",
                  }}
                >
                  Don't have an account?
                </p>
                <Link
                  to="/create_account"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "280px",
                    height: "80px",
                    fontWeight: "bold",
                    color: "#00614A",
                    backgroundImage: "url('/media/AddCart.png')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    fontSize: "24px",
                    letterSpacing: "1px",
                    textAlign: "center",
                    textDecoration: "none",
                    fontFamily: "oswald, sans-serif",
                    position: "relative",
                    zIndex: 1000,
                    pointerEvents: "auto",
                    border: "none",
                    margin: "20px auto",
                  }}
                  className="login-buttons"
                >
                  CREATE ACCOUNT
                </Link>
              </div>
            </Container>
          </div>

          <ScrollToTop />

          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
}
