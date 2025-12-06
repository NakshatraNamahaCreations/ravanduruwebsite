import { Container, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import BannaleafRd from "/media/BannaleafRd.png";
import Rectangle from "/media/Rectangle.png";
import plate from "/media/Layer_20.png";
import BannaleafRU from "/media/BannaleafRU.png";
import Loginpageline from "/media/Loginpageline.png";
import ScrollToTop from "../../Component/ScrollToTop";

const API_BASE = "https://api.ravandurustores.com";

export default function Create_Account() {
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNumber: "",
    smsConsent: false,
  });

  const brand = "#00614A";

  // --------------------------------
  // SINGLE FIELD VALIDATION
  // --------------------------------
  const validateField = (name, value) => {
    switch (name) {
      case "firstName": {
        const v = value.trim();
        if (!/^[A-Za-z]{2,}$/.test(v)) {
          return "First name should contain only letters and be at least 2 characters.";
        }
        return "";
      }
      case "lastName": {
        const v = value.trim();
        if (!/^[A-Za-z]{1,}$/.test(v)) {
          return "Last name should contain only letters and be at least 1 character.";
        }
        return "";
      }
      case "email": {
        const v = value.trim();
        if (!/^\S+@\S+\.\S+$/.test(v)) {
          return "Enter a valid email address.";
        }
        return "";
      }
      case "mobileNumber": {
        if (!/^\d{10}$/.test(value)) {
          return "Mobile number must be exactly 10 digits and only numbers allowed.";
        }
        return "";
      }
      case "password": {
        if (value.length < 6) {
          return "Password must be at least 6 characters.";
        }
        return "";
      }
      default:
        return "";
    }
  };

  // ----------------------------
  // HANDLE CHANGE (sanitized + live validation)
  // ----------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    // First & Last Name: letters + space only
    if (name === "firstName" || name === "lastName") {
      newValue = newValue.replace(/[^A-Za-z ]/g, "");
    }

    // Mobile Number: digits only, max 10
    if (name === "mobileNumber") {
      newValue = newValue.replace(/\D/g, "").slice(0, 10);
    }

    // Email: no spaces
    if (name === "email") {
      newValue = newValue.replace(/\s/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // validate this field immediately
    if (["firstName", "lastName", "email", "mobileNumber", "password"].includes(name)) {
      const errorMsg = validateField(name, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg,
      }));
    }
  };

  // ---------------------------------------------------
  // FULL FORM VALIDATION ON SUBMIT
  // ---------------------------------------------------
  const validateForm = () => {
    const newErrors = {};

    newErrors.firstName = validateField("firstName", formData.firstName);
    newErrors.lastName = validateField("lastName", formData.lastName);
    newErrors.email = validateField("email", formData.email);
    newErrors.mobileNumber = validateField("mobileNumber", formData.mobileNumber);
    newErrors.password = validateField("password", formData.password);

    // remove empty errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------------------------------
  // SUBMIT HANDLER
  // ---------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

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
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`HTTP ${resp.status} ${resp.statusText} ${text}`);
      }

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
            <img src={BannaleafRd} alt="Banana Leaf" style={{ width: "30%" }} />
          </div>

          <div style={{ position: "absolute", top: "70%", pointerEvents: "none", zIndex: 1 }}>
            <img src={Rectangle} alt="Rectangle" style={{ width: "25%" }} />
          </div>

          <div style={{ position: "absolute", right: "-50%", pointerEvents: "none", zIndex: 1 }}>
            <img src={plate} alt="Plate" style={{ width: "25%" }} />
          </div>

          <div
            style={{ position: "absolute", top: "70%", right: "-42%", pointerEvents: "none", zIndex: 1 }}
          >
            <img src={BannaleafRU} alt="Banana Leaf" style={{ width: "25%" }} />
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

              {/* FORM START */}
              <Form onSubmit={handleSubmit}>
                {/* FIRST NAME */}
                <Form.Group className="mb-4">
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{
                      height: 40,
                      border: `1.5px solid ${errors.firstName ? "red" : brand}`,
                      fontSize: 18,
                    }}
                    required
                  />
                  {errors.firstName && (
                    <small style={{ color: "red" }}>{errors.firstName}</small>
                  )}
                </Form.Group>

                {/* LAST NAME */}
                <Form.Group className="mb-4">
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{
                      height: 40,
                      border: `1.5px solid ${errors.lastName ? "red" : brand}`,
                      fontSize: 18,
                    }}
                    required
                  />
                  {errors.lastName && (
                    <small style={{ color: "red" }}>{errors.lastName}</small>
                  )}
                </Form.Group>

                {/* EMAIL */}
                <Form.Group className="mb-4">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email ID"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      height: 40,
                      border: `1.5px solid ${errors.email ? "red" : brand}`,
                      fontSize: 18,
                    }}
                    required
                  />
                  {errors.email && (
                    <small style={{ color: "red" }}>{errors.email}</small>
                  )}
                </Form.Group>

                {/* MOBILE */}
                <Form.Group className="mb-4">
                  <Form.Control
                    type="tel"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    maxLength={10}
                    inputMode="numeric"
                    style={{
                      height: 40,
                      border: `1.5px solid ${errors.mobileNumber ? "red" : brand}`,
                      fontSize: 18,
                    }}
                  />
                  {errors.mobileNumber && (
                    <small style={{ color: "red" }}>{errors.mobileNumber}</small>
                  )}
                </Form.Group>

                {/* PASSWORD */}
               <Form.Group className="mb-4" style={{ position: "relative" }}>
  <Form.Control
    type={showPassword ? "text" : "password"}  // 🔥 dynamic
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    style={{
      height: 40,
      border: `1.5px solid ${errors.password ? "red" : brand}`,
      fontSize: 18,
      paddingRight: "45px", // space for the eye icon
    }}
    required
  />

  {/* Error */}
  {errors.password && (
    <small style={{ color: "red" }}>{errors.password}</small>
  )}

  {/* Show/Hide eye icon */}
  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "20px",
      color: brand,
    }}
  >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</Form.Group>


                {/* SUBMIT BUTTON */}
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
                    margin: "20px auto",
                    border: "none",
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
                  textDecoration: "none",
                  letterSpacing: "1px",
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
