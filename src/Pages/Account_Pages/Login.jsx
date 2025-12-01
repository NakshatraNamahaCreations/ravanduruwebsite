import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
//import axios from "axios";

import Loginpageline from "/media/Loginpageline.png";
import BannaleafRd from "/media/BannaleafRd.png";
import Rectangle from "/media/Rectangle.png";
import plate from "/media/Layer_20.png";
import BannaleafRU from "/media/BannaleafRU.png";
import ScrollToTop from "../../Component/ScrollToTop";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Min 6 characters").required("Password is required"),
});

const API_BASE = "https://ravandurustores-backend.onrender.com";

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // If already logged in, bounce to account (or previous target)
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("user") || "null");
      if (existing && (existing.isLoggedIn || existing.email)) {
        navigate("/account", { replace: true });
        return;
      }
    } catch {}
    setCheckingSession(false);
  }, [navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

const onSubmit = async (form) => {
  setApiError("");
  setLoading(true);

  try {
    const resp = await fetch(`${API_BASE}/api/customers/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // If your API sets cookies for session auth, uncomment this:
      // credentials: "include",
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    // Try to parse response body safely (even on non-2xx)
    const text = await resp.text();
    let json = {};
    try { json = text ? JSON.parse(text) : {}; } catch (_) {}

    if (!resp.ok) {
      // Prefer API’s message if present
      throw new Error(json?.message || `HTTP ${resp.status} ${resp.statusText}`);
    }

    // Expected shape: { user, token } OR { user }
    const user = json.user || json;
    const token = json.token;

    const sessionUser = {
      ...user,
      token,
      isLoggedIn: true,
      lastLoginAt: new Date().toISOString(),
    };
    localStorage.setItem("user", JSON.stringify(sessionUser));

    // Redirect: 1) state.from 2) redirectAfterLogin 3) /account
    const fallback = localStorage.getItem("redirectAfterLogin") || "/your-cart";
    localStorage.removeItem("redirectAfterLogin");
    const target = location?.state?.from || fallback;

    navigate(target, { replace: true });
  } catch (err) {
    console.error("Login error:", err);
    setApiError(err.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  if (checkingSession) return null;

  return (
    <>
      <div
        className="page-content"
        style={{ opacity: isVisible ? 1 : 0, transition: "opacity .5s ease-in-out" }}
      >
        {/* Background decorations */}
        <div style={{ position: "relative", margin: "10% 0" }} className="login-background">
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

          {/* Login form */}
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
                maxWidth: 450,
                width: "100%",
                border: "1px solid #00614A",
                backgroundColor: "#dafeecff",
              }}
            >
              <h2
                className="text-center mb-4 mobile-font"
                style={{ fontWeight: "bold", fontSize: 30, letterSpacing: "1px", color: "#00614A" }}
              >
                LOGIN
              </h2>

              {apiError && (
                <div className="alert alert-danger py-2" role="alert">
                  {apiError}
                </div>
              )}

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-4">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    isInvalid={!!errors.email}
                    style={{ height: 50, border: "1.5px solid #00614A", fontSize: 18 }}
                    className="input-account-forms search-input"
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                    isInvalid={!!errors.password}
                    style={{ height: 50, border: "1.5px solid #00614A", fontSize: 18 }}
                    className="input-account-forms search-input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="none"
                  type="submit"
                  disabled={loading}
                  className="w-50 mt-2 login-buttons"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 280,
                    height: 50,
                    fontWeight: "bold",
                    color: "#00614A",
                    backgroundColor: "#97d9c6",
                    fontSize: 20,
                    border: "none",
                    margin: "20px auto",
                    borderRadius: 0,
                  }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </Form>

              <div>
                <img
                  src={Loginpageline}
                  alt="Divider"
                  style={{ width: "50%", objectFit: "cover", display: "block", margin: "0 auto" }}
                />
              </div>

              <Link
                to="/create_account"
                className="login-buttons"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 220,
                  height: 50,
                  fontWeight: "bold",
                  color: "#00614A",
                  backgroundColor: "#97d7c6",
                  fontSize: 20,
                  textDecoration: "none",
                  border: "none",
                  margin: "20px auto",
                }}
              >
                Create Account
              </Link>
            </div>
          </Container>
        </div>

        <ScrollToTop />
      </div>
    </>
  );
};

export default Login;
