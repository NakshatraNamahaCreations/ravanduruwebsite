import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Button, Alert, Breadcrumb } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  // Brand palette similar to your Thank You page, with failure accents
  const BRAND = {
    dark: "#002209",
    green: "#00614a",
    danger: "#D72638",
    lightBg: "#ffffff",
  };

  // Read URL params once
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const orderId = params.get("orderId") || "";
  const txnId = params.get("txnId") || "";
  const amount = params.get("amount") || "";
  const method = params.get("method") || "";
  const reason = params.get("reason") || "";

  // Fade-in like Thank You page
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fadeInTimeout = setTimeout(() => setIsVisible(true), 100);
    const redirectTimeout = setTimeout(() => {
      navigate("/carts");
    }, 10000); // auto-redirect after 7s

    return () => {
      clearTimeout(fadeInTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  // Actions
  const handleRetryNow = () => navigate("/carts");
  const handleChangeMethod = () => navigate("/checkout?changeMethod=1");
  const handleViewOrders = () => navigate("/orders");
  const handleGoHome = () => navigate("/");

  return (
    <>
      {/* Breadcrumb header  */}
      <Container>
        <div
          className="d-flex justify-content-flex-start align-items-center gap-2"
          style={{ color: "#8d5662", fontSize: "1rem", marginBottom: "30px", padding: "5px" }}
        >
          <Breadcrumb style={{ background: "transparent", marginLeft: "10px", marginTop: "5px" }}>
            <Breadcrumb.Item
              linkAs={Link}
              linkProps={{ to: "/" }}
              className="text-reset text-decoration-none"
              style={{ fontFamily: "poppins" }}
            >
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              active
              style={{ color: BRAND.green, fontWeight: "bold", fontFamily: "poppins" }}
            >
              Payment Failure
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Container>

      {/* Main content block — mirrors Thank You page layout */}
      <div
        className="page-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <div
          style={{
            backgroundColor: BRAND.lightBg,
            color: "black",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              textAlign: "center",
              fontWeight: "bold",
              backgroundImage: "url('/media/Thankyoudecoration.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              padding: "20px",
              minHeight: "80vh",
            }}
          >
            {/* Big headline like Thank You, but red + failure text */}
            <h1
              style={{
                fontWeight: 900,
                fontSize: "72px",
                letterSpacing: "2px",
                margin: "10% 0 0 0",
                color: BRAND.danger,
                textTransform: "uppercase",
              }}
            >
              Payment Failed
            </h1>

            {/* Sub text: brief, with optional reason and meta */}
            <div
              style={{
                marginTop: "12px",
                color: BRAND.dark,
                fontFamily: "poppins",
              }}
            >
              <p
                style={{
                  fontSize: "22px",
                  letterSpacing: "0.5px",
                  opacity: 0.9,
                  marginBottom: "8px",
                }}
              >
                We couldn’t complete your transaction. You’ll be redirected to your cart to try again.
              </p>

              {reason ? (
                <p style={{ fontSize: "16px", opacity: 0.9, margin: 0 }}>
                  <strong>Reason:</strong> {decodeURIComponent(reason)}
                </p>
              ) : null}

              {(orderId || txnId || amount || method) ? (
{/*<p style={{ fontSize: "14px", opacity: 0.65, marginTop: "6px" }}>
                  {orderId ? <span>Order: <strong>{orderId}</strong> &nbsp;•&nbsp; </span> : null}
                  {txnId ? <span>Txn: <strong>{txnId}</strong> &nbsp;•&nbsp; </span> : null}
                  {method ? <span>Method: <strong>{method}</strong> &nbsp;•&nbsp; </span> : null}
                  {amount ? <span>Amount: <strong>₹{amount}</strong></span> : null}
                </p>*/}
              ) : null}
            </div>

            {/* Center visual — use a failure image if you have one */}
            <div
              style={{
                position: "absolute",
                top: "82%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "35vw",
                maxWidth: 180,
              }}
            >
              <img
                src="/media/payment-failed.png"
                alt="Payment Failed"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  // Fallback to an inline SVG cross if image missing
                  e.currentTarget.style.display = "none";
                  const holder = document.getElementById("pf-fallback");
                  if (holder) holder.style.display = "block";
                }}
              />
              <div id="pf-fallback" style={{ display: "none" }}>
                <svg viewBox="0 0 120 120" style={{ width: "100%", height: "auto" }}>
                  <circle cx="60" cy="60" r="56" fill="none" stroke={BRAND.danger} strokeWidth="6" />
                  <path
                    d="M40 40 L80 80 M80 40 L40 80"
                    stroke={BRAND.danger}
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Action buttons (retry, change method, view orders, home) */}
          {/*}  <div
              style={{
                position: "absolute",
                top: "92%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={handleRetryNow}
                style={{
                  backgroundColor: "#FFD814",
                  color: "#111",
                  border: "none",
                  fontWeight: 700,
                  padding: "10px 18px",
                  borderRadius: 999,
                  minWidth: 160,
                }}
              >
                Retry Now
              </Button>
              <Button
                variant="outline-success"
                onClick={handleChangeMethod}
                style={{
                  borderColor: BRAND.green,
                  color: BRAND.green,
                  fontWeight: 700,
                  padding: "10px 18px",
                  borderRadius: 999,
                  minWidth: 160,
                }}
              >
                Change Method
              </Button>
              <Button
                variant="outline-dark"
                onClick={handleViewOrders}
                style={{
                  fontWeight: 700,
                  padding: "10px 18px",
                  borderRadius: 999,
                  minWidth: 160,
                }}
              >
                View Orders
              </Button>
              <Button
                variant="link"
                onClick={handleGoHome}
                className="text-decoration-none"
                style={{ fontWeight: 700, color: BRAND.dark }}
              >
                Go Home
              </Button>
            </div>*/}
          </div>
        </div>

        {/* FYI note (same vibe as your earlier alert) */}
        <Container>
          <Row>
            <Col>
              <Alert
                variant="secondary"
                style={{ background: "#F8FAF9", borderColor: "rgba(0,0,0,0.06)",fontFamily:"poppins" }}
              >
                <strong>Note:</strong> If the amount was debited by your bank but the order still shows
                unpaid, it will be automatically reversed to your source account within a few working
                days. You can safely retry now.
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
