import React, { useEffect, useState, useCallback } from "react";
import { Container, Table, Row, Col, Modal, Button, Spinner, Alert } from "react-bootstrap";
import DownloadPDF from "../../DownloadPDF";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "https://api.ravandurustores.com"; // change if needed

// ---------- helpers ----------
const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const INR = (n) => `₹ ${toNum(n).toFixed(2)}`;

const renderAddress = (addr) => {
  if (!addr) return "Address not available";
  const parts = [
    [addr.firstName, addr.lastName].filter(Boolean).join(" "),
    addr.address,
    [addr.city, addr.state].filter(Boolean).join(", "),
    addr.pincode,
    addr.country,
    addr.email ? `Email: ${addr.email}` : null,
    addr.mobileNumber ? `Phone: ${addr.mobileNumber}` : null,
  ].filter(Boolean);
  return parts.join("\n");
};

const normalizeOrderItems = (order) => {
  const rawItems = Array.isArray(order.items)
    ? order.items
    : [
        {
          productName: order.productName || "",
          productImage: order.productImage || "",
          price: toNum(order.amount) || 0,
          quantity: toNum(order.quantity) || 0,
        },
      ];
  return rawItems.map((it) => ({
    productName: it.productName || it.name || "Product",
    productImage: it.productImage || it.image || "/media/products.png",
    price: toNum(it.price ?? it.discountedPrice ?? it.originalPrice ?? 0),
    quantity: toNum(it.quantity ?? 1),
  }));
};

// ---------- identity ----------
const normalizeEmail = (s) => (s || "").trim().toLowerCase();

const orderBelongsToUser = (order, user) => {
  if (!user) return false;

  const userEmail = normalizeEmail(user.email);
  const userId = (user.id || user._id || user.userId || "").toString();

  const orderEmail =
    normalizeEmail(order?.address?.email) ||
    normalizeEmail(order?.email) ||
    normalizeEmail(order?.customerEmail);

  const orderUserId = (order?.userId || order?.user?._id || order?.customerId || "").toString();

  const emailMatch = !!userEmail && !!orderEmail && orderEmail === userEmail;
  const idMatch = !!userId && !!orderUserId && orderUserId === userId;

  return emailMatch || idMatch;
};

export default function OrderDetails() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ needed if you use location below

  // (optional, only if you actually use these)
  const orderId = new URLSearchParams(location.search).get("orderId");
  const orderSuccess = location.state?.success;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Failed to load orders (HTTP ${res.status})`);
      }

      const data = await res.json();
      const allOrders = Array.isArray(data) ? data : data.items || [];

      // Sort orders (latest first)
      const sorted = allOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // 🔥 FILTER ONLY LOGGED-IN USER'S ORDERS
      const userOrders = sorted.filter((order) => orderBelongsToUser(order, user));

      setOrders(userOrders);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError(err.message || "Failed to load order details.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") fetchOrders();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [fetchOrders]);

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);
  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const sidebarItemStyle = {
    fontFamily: "poppins",
    fontSize: "18px",
    padding: "15px 0",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <>
      <Container style={{ fontFamily: "poppins, sans-serif" }} className="mt-5 mb-5">
        <Row className="align-items-start g-4">
          <Col xs={12} md={3}>
            <div style={{ borderRight: "1px solid #ddd", paddingRight: 10 }}>
              <div style={sidebarItemStyle} onClick={() => navigate("/profile-details")}>Profile &gt;</div>
              <div style={sidebarItemStyle} onClick={() => navigate("/order-details")}>Orders &gt;</div>
              <div style={sidebarItemStyle} onClick={() => navigate("/wishlist")}>Wishlist &gt;</div>
              <div style={sidebarItemStyle} onClick={() => navigate("/address-details")}>Address Book &gt;</div>
              <div style={sidebarItemStyle} onClick={openLogoutModal}>Log Out &gt;</div>
            </div>
          </Col>

          <Col xs={12} md={9}>
            {loading && (
              <div className="d-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" />
                <span>Loading order details...</span>
              </div>
            )}

            {!loading && error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            {!loading && !error && orders.length === 0 && (
              <Alert variant="info">No order details available.</Alert>
            )}

            {!loading &&
              !error &&
              orders.length > 0 &&
              orders.map((order, index) => {
                const items = normalizeOrderItems(order);
                const subtotal = items.reduce(
                  (sum, p) => sum + toNum(p.price) * toNum(p.quantity),
                  0
                );
                const DEFAULT_SHIPPING = 50;
                const tax = 0;

                const shipping =
                  order.shippingFee != null
                    ? toNum(order.shippingFee)
                    : order.amount != null
                    ? Math.max(0, toNum(order.amount) - subtotal - tax)
                    : DEFAULT_SHIPPING;

                const computedTotal = subtotal + shipping + tax;
                const total = order.amount != null ? toNum(order.amount) : computedTotal;

                const addr = order.address || order.shippingAddress || {};

                return (
                  <div
                    key={order._id || index}
                    style={{ boxShadow: "1px 1px 6px #D3B353", padding: 20, borderRadius: 10, marginTop: 30 }}
                  >
                    <h2 style={{ fontWeight: 700, color: "#002209", fontSize: 24 }}>
                      Order {order.merchantOrderId ? `#${order.merchantOrderId}` : `#${index + 1}`}
                    </h2>

                    <div className="p-3 mt-4 order-box">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="invoice-title m-0">ORDER INVOICE</h5>

                        <DownloadPDF
                          order={order}
                          address={addr}
                          orderItems={items}
                          subtotal={subtotal}
                          shipping={shipping}
                          tax={tax}
                          total={total}
                        />
                      </div>

                      <div style={{ overflowX: "auto" }}>
                        <Table bordered className="mt-4">
                          <thead>
                            <tr className="table-head-row">
                              <th style={{ color: "#00614A", fontSize: 20, textTransform: "uppercase", letterSpacing: "1px" }}>
                                Product
                              </th>
                              <th style={{ color: "#00614A", fontSize: 20, textTransform: "uppercase", letterSpacing: "1px" }}>
                                Quantity
                              </th>
                              <th style={{ color: "#00614A", fontSize: 20, textTransform: "uppercase", letterSpacing: "1px" }}>
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="text-center py-4" style={{ color: "#00614A" }}>
                                  No items found for this order.
                                </td>
                              </tr>
                            ) : (
                              items.map((item, i) => {
                                const line = toNum(item.price) * toNum(item.quantity);
                                return (
                                  <tr key={i} style={{ textAlign: "center", color: "#002209" }}>
                                    <td style={{ padding: 10, width: "50%", textAlign: "left" }}>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <img
                                          src={item.productImage || "/media/products.png"}
                                          alt={item.productName}
                                          style={{ width: 60, height: 60, objectFit: "contain" }}
                                          onError={(e) => {
                                            if (!e.currentTarget.dataset.fallback) {
                                              e.currentTarget.dataset.fallback = "1";
                                              e.currentTarget.src = "/media/products.png";
                                            }
                                          }}
                                        />
                                        <div style={{ marginLeft: 16 }}>
                                          <div style={{ fontSize: 18, marginBottom: 6, fontWeight: 700, color: "#00614A" }}>
                                            {item.productName}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td style={{ color: "#00614A", fontSize: 18 }}>{item.quantity}</td>
                                    <td style={{ color: "#00614A", fontSize: 18 }}>
                                      <strong>{INR(line)}</strong>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </Table>
                      </div>

                      <div style={{ marginTop: "5%" }}>
                        <h4 className="h6-shipping mb-3"><strong>SHIPPING ADDRESS</strong></h4>
                        <div style={{ fontFamily: "poppins, sans-serif", fontSize: 16, whiteSpace: "pre-line" }}>
                          {renderAddress(addr)}
                        </div>
                      </div>

                      <div className="mt-5 d-flex justify-content-end">
                        <table className="table table-borderless w-auto text-end" style={{ width: 300, color: "#00614A" }}>
                          <tbody>
                            <tr>
                              <td style={{ fontWeight: 600, letterSpacing: ".5px", fontSize: 18 }}>SUB TOTAL</td>
                              <td style={{ width: 200, fontWeight: 700, fontSize: 18 }}>
                                <strong>{INR(subtotal)}</strong>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ fontWeight: 700, letterSpacing: ".5px" }}>SHIPPING</td>
                              <td style={{ fontWeight: 700, letterSpacing: "1px" }}>
                                <strong>{INR(shipping)}</strong>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ fontWeight: 700, letterSpacing: "1px" }}>TAX</td>
                              <td style={{ fontWeight: 500, letterSpacing: "1px" }}>
                                <strong>{INR(0)}</strong>
                              </td>
                            </tr>
                            <tr><td colSpan={2}><hr /></td></tr>
                            <tr>
                              <td style={{ fontWeight: 600, fontSize: 20, letterSpacing: "1px" }}>
                                <strong>AMOUNT PAID</strong>
                              </td>
                              <td style={{ fontWeight: 700, fontSize: 20 }}>
                                <strong>{INR(total)}</strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
          </Col>
        </Row>
      </Container>

      <Modal show={showLogoutModal} onHide={closeLogoutModal} centered>
        <Modal.Header closeButton><Modal.Title>Log out?</Modal.Title></Modal.Header>
        <Modal.Body>You're about to log out. Continue?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeLogoutModal}>Cancel</Button>
          <Button variant="danger" onClick={handleLogoutConfirm}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
