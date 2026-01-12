import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";

import Loginpageline from "/media/Loginpageline.png";
import BannaleafRd from "/media/BannaleafRd.png";
import Rectangle from "/media/Rectangle.png";
import plate from "/media/Layer_20.png";
import BannaleafRU from "/media/BannaleafRU.png";
import ScrollToTop from "../../Component/ScrollToTop";

/* =======================
   VALIDATION SCHEMA
======================= */
const schema = yup.object({
  identifier: yup
    .string()
    .required("Email or Mobile number is required")
    .test(
      "email-or-mobile",
      "Enter a valid email or 10-digit mobile number",
      (value) => {
        if (!value) return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile

        return emailRegex.test(value) || mobileRegex.test(value);
      }
    ),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

const API_BASE = "https://api.ravandurustores.com";

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  /* Fade animation */
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* Already logged-in check */
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /* =======================
     SUBMIT HANDLER
  ======================= */
const onSubmit = async (form) => {
  setApiError("");
  setLoading(true);

  try {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.identifier);
    const isMobile = /^[6-9]\d{9}$/.test(form.identifier);

    const payload = {
      password: form.password,
      ...(isEmail && { email: form.identifier.toLowerCase() }),
      ...(isMobile && { mobilenumber: form.identifier }),
    };

    const resp = await fetch(
      "https://api.ravandurustores.com/api/customers/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const json = await resp.json();

    if (!resp.ok) {
      throw new Error(json.message || "Login failed");
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...json.user,
        isLoggedIn: true,
      })
    );

    navigate("/account", { replace: true });

  } catch (err) {
    console.error("Login error:", err);
    setApiError(err.message);
  } finally {
    setLoading(false);
  }
};

  if (checkingSession) return null;

  return (
    <>
      <div
        className="page-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity .5s ease-in-out",
        }}
      >
        <div style={{ position: "relative", margin: "10% 0" }}>
          {/* Decorations */}
          <div style={{ position: "absolute", top: "-25%", zIndex: 1 }}>
            <img src={BannaleafRd} alt="" style={{ width: "30%" }} />
          </div>
          <div style={{ position: "absolute", top: "70%", zIndex: 1 }}>
            <img src={Rectangle} alt="" style={{ width: "25%" }} />
          </div>
          <div style={{ position: "absolute", right: "-50%", zIndex: 1 }}>
            <img src={plate} alt="" style={{ width: "25%" }} />
          </div>
          <div style={{ position: "absolute", top: "70%", right: "-42%", zIndex: 1 }}>
            <img src={BannaleafRU} alt="" style={{ width: "25%" }} />
          </div>

          {/* FORM */}
          <Container style={{ margin: "5% auto", zIndex: 10 }}>
            <div
              className="p-4"
              style={{
                maxWidth: 450,
                margin: "auto",
                border: "1px solid #00614A",
                background: "#dafeecff",
              }}
            >
              <h2
                className="text-center mb-4"
                style={{ fontWeight: "bold", color: "#00614A" }}
              >
                LOGIN
              </h2>

              {apiError && (
                <div className="alert alert-danger py-2">{apiError}</div>
              )}

              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* EMAIL OR MOBILE */}
                <Form.Group className="mb-4">
                  <Form.Control
                    type="text"
                    placeholder="Email or Mobile Number"
                    {...register("identifier")}
                    isInvalid={!!errors.identifier}
                    style={{ height: 50, fontSize: 18 }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.identifier?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* PASSWORD */}
                <Form.Group className="mb-4">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                    isInvalid={!!errors.password}
                    style={{ height: 50, fontSize: 18 }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: 50,
                    background: "#97d9c6",
                    border: "none",
                    fontWeight: "bold",
                  }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </Form>

              <img
                src={Loginpageline}
                alt=""
                style={{ width: "50%", margin: "20px auto", display: "block" }}
              />

              <Link
                to="/create_account"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#97d7c6",
                  padding: 12,
                  color: "#00614A",
                  fontWeight: "bold",
                  textDecoration: "none",
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
