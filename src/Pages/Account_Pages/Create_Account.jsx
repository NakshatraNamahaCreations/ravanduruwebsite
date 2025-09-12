import { Container, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
//import axios from "axios";

import BannaleafRd from "/media/BannaleafRd.png";
import Rectangle from "/media/Rectangle.png";
import plate from "/media/Layer_20.png";
import BannaleafRU from "/media/BannaleafRU.png";
import Loginpageline from "/media/Loginpageline.png";
import ScrollToTop from "../../Component/ScrollToTop";
const API_BASE = "https://api.ravandurustores.com"; 

export default function Create_Account() {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Controlled form state (UI uses camelCase)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // confirmPassword: "",
    mobileNumber: "",
    smsConsent: false,
  });

  const brand = "#00614A";

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  // minimal client validation …
  if (!formData.firstName.trim() || !formData.lastName.trim()) return alert("Enter name");
  if (!formData.email.trim()) return alert("Enter email");
  if (formData.password.length < 6) return alert("Password must be at least 6 chars");

  const payload = {
    firstname: formData.firstName.trim(),
    lastname: formData.lastName.trim(),
    email: formData.email.trim(),
    password: formData.password,
    mobilenumber: formData.mobileNumber.trim(),
  };

  try {
    const resp = await fetch(`${API_BASE}/api/customers/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // add this if your API sets auth cookies:
      // credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`HTTP ${resp.status} ${resp.statusText} ${text}`);
    }

    const data = await resp.json().catch(() => ({}));
    // success
    alert("Account created! Redirecting to login…");
    navigate("/login");
  } catch (err) {
    console.error("Register failed:", err);
    alert(err.message || "Something went wrong. Please try again.");
  }
};

  return (
    <>
      <div
        className="page-content"
        style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}
      >
        <div style={{ position: "relative", margin: 0 }} className="login-background">
          {/* Background decorations */}
          <div style={{ position: "absolute", top: "-25%", pointerEvents: "none", zIndex: 1 }}>
            <img src={BannaleafRd} alt="Banana Leaf" style={{ width: "30%", objectFit: "cover" }} />
          </div>

          <div style={{ position: "absolute", top: "70%", pointerEvents: "none", zIndex: 1 }}>
            <img src={Rectangle} alt="Rectangle" style={{ width: "25%", objectFit: "cover" }} />
          </div>

          <div style={{ position: "absolute", right: "-50%", pointerEvents: "none", zIndex: 1 }}>
            <img src={plate} alt="Plate" style={{ width: "25%", objectFit: "cover" }} />
          </div>

          <div style={{ position: "absolute", top: "70%", right: "-42%", pointerEvents: "none", zIndex: 1 }}>
            <img src={BannaleafRU} alt="Banana Leaf" style={{ width: "25%", objectFit: "cover" }} />
          </div>

          <Container
            style={{
              margin: "5% auto",
              display: "flex",
              justifyContent: "center",
              fontFamily: "poppins, sans-serif",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div
              className="p-4 form"
              style={{
                borderRadius: 10,
                padding: 25,
                maxWidth: 500,
                width: "100%",
                border: `2px solid ${brand}`,
                boxShadow: `1px 1px 10px ${brand}`,
                backgroundColor: "#fff",
              }}
            >
              <h2
                className="text-center mb-4 mobile-font"
                style={{ fontWeight: "bold", fontSize: 30, letterSpacing: "1px", color: brand }}
              >
                Create Account
              </h2>

              <Form onSubmit={handleSubmit}>
                {/* First Name */}
                <Form.Group className="mb-4">
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{
                      height: 40,
                      border: `1.5px solid ${brand}`,
                      fontFamily: "poppins, sans-serif",
                      fontSize: 18,
                    }}
                    className="input-account-forms search-input"
                    autoFocus
                    required
                  />
                </Form.Group>

                {/* Last Name */}
                <Form.Group className="mb-4">
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{
                      height: 40,
                      border: `1.5px solid ${brand}`,
                      fontFamily: "poppins, sans-serif",
                      fontSize: 18,
                    }}
                    className="input-account-forms search-input"
                    required
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-4">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email ID"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      height: 40,
                      border: `1.5px solid ${brand}`,
                      fontFamily: "poppins, sans-serif",
                      fontSize: 18,
                    }}
                    className="input-account-forms search-input"
                    required
                  />
                </Form.Group>

                {/* Mobile Number */}
                <Form.Group className="mb-4">
                  <Form.Control
                    type="tel"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    style={{
                      height: 40,
                      border: `1.5px solid ${brand}`,
                      fontFamily: "poppins, sans-serif",
                      fontSize: 18,
                    }}
                    className="input-account-forms search-input"
                  />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-4">
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      height: 40,
                      border: `1.5px solid ${brand}`,
                      fontFamily: "poppins, sans-serif",
                      fontSize: 18,
                    }}
                    className="input-account-forms search-input"
                    required
                  />
                </Form.Group>

                {/* Confirm Password */}
                {/* <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{
                      height: 40,
                      border: `1.5px solid ${brand}`,
                      fontFamily: "poppins, sans-serif",
                      fontSize: 18,
                    }}
                    className="input-account-forms search-input"
                    required
                  />
                </Form.Group> */}

                {/* SMS Consent */}
                {/* <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="smsConsent"
                    name="smsConsent"
                    label="I agree to receive order updates via SMS"
                    checked={formData.smsConsent}
                    onChange={handleChange}
                  />
                </Form.Group> */}

                {/* Submit */}
                <Button
                  variant="none"
                  type="submit"
                  className="w-50 mt-2 login-buttons"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 200,
                    height: 50,
                    fontWeight: "bold",
                    color: brand,
                    backgroundColor: "#97d7c6",
                    fontSize: 20,
                    letterSpacing: "1px",
                    fontFamily: "poppins, sans-serif",
                    border: "none",
                    margin: "20px auto",
                    borderRadius: 0,
                  }}
                >
                  Submit
                </Button>
              </Form>

              <a
                href="/login"
                style={{
                  display: "flex",
                  justifySelf: "center",
                  color: brand,
                  letterSpacing: "1px",
                  fontSize: 18,
                  textDecoration: "none",
                }}
              >
                Cancel
              </a>

              <div>
                <img
                  src={Loginpageline}
                  alt="Divider"
                  style={{
                    width: "50%",
                    objectFit: "cover",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>

              <p
                style={{
                  fontSize: 20,
                  letterSpacing: "1px",
                  textAlign: "center",
                  color: brand,
                  margin: 0,
                }}
              >
                Have an account?
              </p>

              <Link
                to="/login"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 200,
                  height: 50,
                  fontWeight: "bold",
                  color: brand,
                  backgroundColor: "#97d7c6",
                  fontSize: 20,
                  letterSpacing: "1px",
                  textDecoration: "none",
                  fontFamily: "poppins, sans-serif",
                  border: "none",
                  margin: "20px auto",
                }}
                className="login-buttons"
              >
                Sign In
              </Link>
            </div>
          </Container>
        </div>

        <ScrollToTop />
      </div>
    </>
  );
}
