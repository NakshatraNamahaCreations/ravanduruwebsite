import Navbar_Menu from "../Component/Navbar_Menu";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button } from "react-bootstrap";
import Footer from "../Component/Footer";
import ChutneyPodi from "/media/ChutneyPodi.png";
import BannaleafRd from "/media/BannaleafRd.png";
import BannaleafRU from "/media/BannaleafRU.png";
import Chakaliimagereverse from "/media/Chakaliimage-reverse.png";
import { useState, useEffect } from "react";
import ScrollToTop from "../Component/ScrollToTop";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneCode: yup
    .string()
    .matches(/^\+\d{1,4}$/, "Invalid phone code (e.g. +1)")
    .required("Phone code is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d{7,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  message: yup
    .string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

export default function Contact() {
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form Submitted", data);
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
        {/* NAVBAR MENU */}
        {/* <Navbar_Menu /> */}

        <div style={{ position: "relative" }} className="login-background">
          <div
            style={{
              position: "absolute",
              top: "-3%",
              pointerEvents: "none",
              zIndex: 1,
            }}
            className="ChutneyPodi-contact"
          >
            <img
              src={ChutneyPodi}
              alt="Banana Leaf"
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
              top: "50%",
              pointerEvents: "none",
              zIndex: 1,
            }}
            className="banana-left-contact"
          >
            <img
              src={BannaleafRd}
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
              right: "-45%",
              top: "-50px",
              pointerEvents: "none",
              zIndex: 1,
            }}
            className="banana-right-contact"
          >
            <img
              src={BannaleafRU}
              alt="Plate"
              style={{
                width: "20%",
                height: "auto",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "45%",
              right: "-42%",
              pointerEvents: "none",
              zIndex: 1,
            }}
            className="chakli-plate-contact"
          >
            <img
              src={Chakaliimagereverse}
              alt="Banana Leaf"
              style={{
                width: "25%",
                height: "auto",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
          </div>
          <div className="mt-5" style={{ fontFamily: "oswald, sans-serif" }}>
            <h1
              style={{
                color: "#00614A",
                textAlign: "center",
                fontSize: "45px",
                letterSpacing: "1px",
                fontFamily:'oswald, sans-serif'
              }}
              className="mobile-font"
            >
              CONTACT US
            </h1>
          </div>
          
          <Container
            className="mt-5"
            style={{ fontFamily: "oswald, sans-serif" }}
          >
            <Row>
              <Col sm={4} className="d-flex contact-col">
                <div
                  className="contact-col-box d-flex flex-column justify-content-center align-items-center"
                  style={{
                    border: "2px solid #00614A",
                    padding: "20px",
                    borderRadius: "10px",
                    textAlign: "center",
                    color: "#00614A",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="fa-icon"
                    style={{
                      color: "#00614a",
                      width: "50px",
                      height: "50px",
                      marginBottom: "10px",
                    }}
                  />
                  <h3 style={{ letterSpacing: "1px" }}>ADDRESS</h3>
                  <p style={{ letterSpacing: "1px" }}>
                    #1881/3A, WESLEY ROAD, MYSORE, KARNATAKA 570001
                  </p>
                </div>
              </Col>

              <Col sm={4} className="d-flex contact-col">
                <div
                  className="contact-col-box d-flex flex-column justify-content-center align-items-center"
                  style={{
                    border: "2px solid #00614A",
                    padding: "25px",
                    borderRadius: "10px",
                    textAlign: "center",
                    color: "#00614A",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="fa-icon"
                    style={{
                      color: "#00614a",
                      width: "50px",
                      height: "50px",
                      marginBottom: "10px",
                    }}
                  />
                  <h3 style={{ letterSpacing: "1px" }}>CALL US</h3>
                  <p style={{ letterSpacing: "1px" }}>07899830366</p>
                </div>
              </Col>

              <Col sm={4} className="d-flex contact-col">
                <div
                  className="contact-col-box d-flex flex-column justify-content-center align-items-center"
                  style={{
                    border: "2px solid #00614A",
                    padding: "25px",
                    borderRadius: "10px",
                    textAlign: "center",
                    color: "#00614A",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="fa-icon"
                    style={{
                      color: "#00614a",
                      width: "50px",
                      height: "50px",
                      marginBottom: "10px",
                    }}
                  />
                  <h3 style={{ letterSpacing: "1px" }}>EMAIL US</h3>
                  <p style={{ letterSpacing: "1px" }}>
                    av.kitchens1532@gmail.com
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
          {/* CONTACT FORM */}
          <Container
            style={{ margin: "5% auto", fontFamily: "oswald, sans-serif" }}
          >
            <Row className="justify-content-md-center">
              <Col md={6}>
                <div
                  className="p-4 contact-form"
                  style={{
                    backgroundColor: "#00614A",
                    borderRadius: "10px",
                    color: "white",
                  }}
                >
                  <Form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ padding: "10px" }}
                  >
                    {/* First Name */}
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="First Name"
                        {...register("firstName")}
                        isInvalid={!!errors.firstName}
                        style={{ height: "75px", fontSize: "20px" }}
                        className="input-account-forms search-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Last Name */}
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Last Name"
                        {...register("lastName")}
                        isInvalid={!!errors.lastName}
                        style={{ height: "75px", fontSize: "20px" }}
                        className="input-account-forms search-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Email */}
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        isInvalid={!!errors.email}
                        style={{ height: "75px", fontSize: "20px" }}
                        className="input-account-forms search-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Phone Code & Number */}
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="+91"
                            {...register("phoneCode")}
                            isInvalid={!!errors.phoneCode}
                            style={{ height: "75px", fontSize: "20px" }}
                            className="input-account-forms search-input"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phoneCode?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={8}>
                        <Form.Group className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Phone Number"
                            {...register("phoneNumber")}
                            isInvalid={!!errors.phoneNumber}
                            style={{ height: "75px", fontSize: "20px" }}
                            className="input-account-forms search-input"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phoneNumber?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Message */}
                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Send Message"
                        {...register("message")}
                        isInvalid={!!errors.message}
                        style={{ height: "200px", fontSize: "20px" }}
                        className="input-account-forms search-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.message?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Submit Button */}
                    <Button
                      variant="none"
                      type="submit"
                      className="w-50 mt-2"
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
                      SUBMIT
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <ScrollToTop />

        {/* FOOTER */}
        {/* <Footer /> */}
      </div>
    </>
  );
}
