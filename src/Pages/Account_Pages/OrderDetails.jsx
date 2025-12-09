// OrderDetails.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Table,
  Row,
  Col,
  Modal,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import DownloadPDF from "../../DownloadPDF";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShoppingBag, FaShippingFast, FaCheckCircle } from "react-icons/fa";

const API_BASE = "https://api.ravandurustores.com";

// ---------- helpers ----------
const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const INR = (n) => `₹ ${toNum(n).toFixed(2)}`;

const clampPct = (pct) => Math.min(100, Math.max(0, Number(pct || 0)));

const priceAfterPctWholeRupee = (base, pct, mode = "nearest") => {
  const b = Number(base) || 0;
  const p = clampPct(pct);
  const rawOff = (b * p) / 100;
  const off =
    mode === "floor"
      ? Math.floor(rawOff)
      : mode === "ceil"
      ? Math.ceil(rawOff)
      : Math.round(rawOff);
  return Math.max(0, b - off);
};

const recoverOriginalFromDiscounted = (discounted, pct, searchLimit = 5000) => {
  discounted = Math.round(Number(discounted) || 0);
  pct = clampPct(pct || 0);
  if (pct <= 0) return discounted;

  const maxTry = discounted + searchLimit;
  for (let cand = discounted; cand <= maxTry; cand++) {
    if (priceAfterPctWholeRupee(cand, pct, "nearest") === discounted) {
      return cand;
    }
  }

  const approx = Math.round((discounted * 100) / (100 - pct));
  return approx || discounted;
};

const renderAddress = (addr) => {
  if (!addr) return "Address not available";

  // If address is just a string from backend
  if (typeof addr === "string") {
    return addr || "Address not available";
  }

  // Object-style address
  const parts = [
    [addr.firstName, addr.lastName].filter(Boolean).join(" "),
    addr.address || addr.street || addr.addressLine1,
    [addr.city, addr.state].filter(Boolean).join(", "),
    addr.pincode || addr.zip || addr.postalCode,
    addr.country,
    addr.email ? `Email: ${addr.email}` : null,
    addr.mobileNumber || addr.phone
      ? `Phone: ${addr.mobileNumber || addr.phone}`
      : null,
  ].filter(Boolean);

  const result = parts.join("\n");
  return result || "Address not available";
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

  const orderDiscountPct = clampPct(order.discountPercentage ?? 0);

  return rawItems.map((it) => {
    const discountPercentage = clampPct(
      it.discountPercentage ?? orderDiscountPct
    );

    let discountedPrice = toNum(
      it.discountedPrice ?? it.salePrice ?? it.offerPrice ?? it.price ?? 0
    );

    let originalPrice = toNum(
      it.originalPrice ??
        it.mrp ??
        it.mrpPrice ??
        it.basePrice ??
        it.unitPrice ??
        it.productPrice ??
        0
    );

    if (!originalPrice && discountedPrice && discountPercentage > 0) {
      originalPrice = recoverOriginalFromDiscounted(
        discountedPrice,
        discountPercentage,
        5000
      );
    }

    if (!discountedPrice && originalPrice) {
      if (discountPercentage > 0) {
        discountedPrice = priceAfterPctWholeRupee(
          originalPrice,
          discountPercentage,
          "nearest"
        );
      } else {
        discountedPrice = originalPrice;
      }
    }

    if (!originalPrice && discountedPrice && discountPercentage === 0) {
      originalPrice = discountedPrice;
    }
    if (!discountedPrice && originalPrice && discountPercentage === 0) {
      discountedPrice = originalPrice;
    }

    return {
      productName: it.productName || it.name || "Product",
      productImage: it.productImage || it.image || "/media/products.png",
      originalPrice,
      discountedPrice,
      discountPercentage,
      quantity: toNum(it.quantity ?? 1),
    };
  });
};

const normalizeEmail = (s) => (s || "").trim().toLowerCase();

const orderBelongsToUser = (order, user) => {
  if (!user) return false;

  const userEmail = normalizeEmail(user.email);
  const userId = (user.id || user._id || user.userId || "").toString();

  const orderEmail =
    normalizeEmail(order?.address?.email) ||
    normalizeEmail(order?.email) ||
    normalizeEmail(order?.customerEmail);

  const orderUserId = (
    order?.userId ||
    order?.user?._id ||
    order?.customerId ||
    ""
  ).toString();

  return (
    (userEmail && userEmail === orderEmail) ||
    (userId && userId === orderUserId)
  );
};

const FREE_SHIPPING_THRESHOLD = 2000;
const BASE_SHIPPING_FEE = 0;
const GST_RATE = 0.18;

// Build proper image URL for items
const getImageUrl = (img) => {
  if (!img) return "/media/products.png";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  const clean = img.startsWith("/") ? img : `/${img}`;
  return `${API_BASE}${clean}`;
};

export default function OrderDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderSuccess = location.state?.success;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Track which order is currently being tracked in popup
  const [trackingOrder, setTrackingOrder] = useState(null);

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

      const sorted = allOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const userOrders = sorted.filter((order) =>
        orderBelongsToUser(order, user)
      );

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

  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const closeTrackingModal = () => setTrackingOrder(null);

  return (
    <>
      <Container
        style={{ fontFamily: "poppins, sans-serif" }}
        className="mt-5 mb-5"
      >
        <Row className="align-items-start g-4">
          {/* SIDEBAR */}
          <Col xs={12} md={3}>
            <div style={{ borderRight: "1px solid #ddd", paddingRight: 10 }}>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  padding: "15px 0",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/profile-details")}
              >
                Profile &gt;
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  padding: "15px 0",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/order-details")}
              >
                Orders &gt;
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  padding: "15px 0",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/wishlist")}
              >
                Wishlist &gt;
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  padding: "15px 0",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/address-details")}
              >
                Address Book &gt;
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  padding: "15px 0",
                  cursor: "pointer",
                }}
                onClick={() => setShowLogoutModal(true)}
              >
                Log Out &gt;
              </div>
            </div>
          </Col>

          {/* MAIN CONTENT */}
          <Col xs={12} md={9}>
            {loading && (
              <div className="d-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" />
                <span>Loading order details...</span>
              </div>
            )}

            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}

            {!loading && !error && orders.length === 0 && (
              <Alert variant="info" className="mt-3">
                No order details available.
              </Alert>
            )}

            {!loading &&
              !error &&
              orders.map((order, index) => {
                const items = normalizeOrderItems(order);

                // ---------- detect FAILED orders ----------
                const rawStatus = (
                  order.status ||
                  order.orderStatus ||
                  order.bookingStatus ||
                  order.paymentStatus ||
                  ""
                ).toString();

                const isFailed = /fail|failed|payment_failed/i.test(rawStatus);

                // ---------- pricing (for successful orders only) ----------
                const originalSubtotal = items.reduce(
                  (sum, p) => sum + toNum(p.originalPrice) * toNum(p.quantity),
                  0
                );

                const itemsDiscount = items.reduce((sum, p) => {
                  const orig = toNum(p.originalPrice);
                  const disc = toNum(p.discountedPrice);
                  const qty = toNum(p.quantity);
                  return sum + (orig - disc) * qty;
                }, 0);

                const discount = Math.round(itemsDiscount * 100) / 100;
                const fixedDiscountedSubtotal = Math.max(
                  0,
                  originalSubtotal - discount
                );

                const shipping =
                  fixedDiscountedSubtotal >= FREE_SHIPPING_THRESHOLD
                    ? 0
                    : BASE_SHIPPING_FEE;

                const tax = fixedDiscountedSubtotal * GST_RATE;
                const total =
                  order.amount != null
                    ? toNum(order.amount)
                    : fixedDiscountedSubtotal + shipping + tax;

                const addr = order.address || order.shippingAddress || {};

                // ----- Expected delivery: 1 week from order placed -----
                const placedDate = order.createdAt
                  ? new Date(order.createdAt)
                  : null;
                const expectedDeliveryDate = placedDate
                  ? new Date(
                      placedDate.getTime() + 7 * 24 * 60 * 60 * 1000
                    )
                  : null;

                return (
                  <div
                    key={order._id || index}
                    style={{
                      boxShadow: "1px 1px 6px #D3B353",
                      padding: 20,
                      borderRadius: 10,
                      marginTop: 30,
                    }}
                  >
                    {/* Top row: Order # (left) + Expected Delivery (right) */}
                    <div className="d-flex justify-content-between align-items-center">
                      <h2
                        style={{
                          fontWeight: 700,
                          color: "#002209",
                          fontSize: 24,
                          marginBottom: 0,
                        }}
                      >
                        Order #{order.merchantOrderId || index + 1}
                      </h2>

                      <div
                        style={{
                          textAlign: "right",
                          fontSize: 14,
                          color: "#002209",
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>Expected Delivery</div>
                        <div style={{ fontWeight: 500 }}>
                          {expectedDeliveryDate
                            ? expectedDeliveryDate.toLocaleDateString()
                            : "—"}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 mt-4 order-box">
                      {/* HEADER */}
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="invoice-title m-0">ORDER INVOICE</h5>

                        {isFailed ? (
                          <span
                            style={{
                              color: "#d32f2f",
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                          >
                            Payment failed – invoice not available.
                          </span>
                        ) : (
                          <div className="d-flex align-items-center gap-2">
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => setTrackingOrder(order)}
                              style={{padding:"12px 20px", borderRadius:"0px", textTransform:"uppercase", fontWeight:"bold", letterSpacing:"0.5px", fontSize:"16px"}}
                            >
                              Track Order
                            </Button>
                            <DownloadPDF
                              order={order}
                              address={addr}
                              orderItems={items}
                              subtotal={fixedDiscountedSubtotal}
                              shipping={shipping}
                              tax={tax}
                              total={total}
                            />
                          </div>
                        )}
                      </div>

                      {/* For FAILED orders: do NOT show anything else */}
                      {isFailed ? null : (
                        <>
                          {/* ITEMS TABLE */}
                          <div style={{ overflowX: "auto" }}>
                            <Table bordered className="mt-4">
                              <thead>
                                <tr className="table-head-row">
                                  <th>Product</th>
                                  <th>Qty</th>
                                  <th>MRP</th>
                                </tr>
                              </thead>
                              <tbody>
                                {items.length === 0 ? (
                                  <tr>
                                    <td colSpan={3} className="text-center py-4">
                                      No items found for this order.
                                    </td>
                                  </tr>
                                ) : (
                                  items.map((item, i) => (
                                    <tr key={i}>
                                      <td>
                                        <div className="d-flex align-items-center gap-2">
                                          <img
                                            src={getImageUrl(
                                              item.productImage
                                            )}
                                            alt={item.productName}
                                            style={{
                                              width: 60,
                                              height: 60,
                                              objectFit: "cover",
                                              borderRadius: 6,
                                            }}
                                            onError={(e) => {
                                              e.target.src =
                                                "/media/products.png";
                                            }}
                                          />
                                          <span>{item.productName}</span>
                                        </div>
                                      </td>
                                      <td>{item.quantity}</td>
                                      <td>{INR(item.originalPrice)}</td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </Table>
                          </div>

                          {/* SHIPPING ADDRESS */}
                          <div style={{ marginTop: "5%" }}>
                            <h4 className="mb-3">
                              <strong>SHIPPING ADDRESS</strong>
                            </h4>
                            <div
                              style={{
                                fontFamily: "poppins, sans-serif",
                                fontSize: 16,
                                whiteSpace: "pre-line",
                              }}
                            >
                              {renderAddress(addr)}
                            </div>
                          </div>

                          {/* TOTALS SECTION */}
                          <div className="mt-5 d-flex justify-content-end">
                            <table
                              className="table table-borderless w-auto text-end"
                              style={{ width: 320, color: "#00614A" }}
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      fontWeight: 600,
                                      letterSpacing: ".5px",
                                      fontSize: 18,
                                    }}
                                  >
                                    ORIGINAL AMOUNT (MRP)
                                  </td>
                                  <td
                                    style={{
                                      width: 200,
                                      fontWeight: 700,
                                      fontSize: 18,
                                    }}
                                  >
                                    {INR(originalSubtotal)}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      fontWeight: 600,
                                      letterSpacing: ".5px",
                                      fontSize: 18,
                                    }}
                                  >
                                    DISCOUNT AMOUNT
                                  </td>
                                  <td
                                    style={{
                                      fontWeight: 700,
                                      fontSize: 18,
                                    }}
                                  >
                                    - {INR(discount)}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      fontWeight: 600,
                                      letterSpacing: ".5px",
                                      fontSize: 18,
                                    }}
                                  >
                                    AMOUNT AFTER DISCOUNT
                                  </td>
                                  <td
                                    style={{
                                      fontWeight: 700,
                                      fontSize: 18,
                                    }}
                                  >
                                    {INR(fixedDiscountedSubtotal)}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      fontWeight: 700,
                                      letterSpacing: ".5px",
                                    }}
                                  >
                                    SHIPPING
                                  </td>
                                  <td
                                    style={{
                                      fontWeight: 700,
                                      letterSpacing: "1px",
                                    }}
                                  >
                                    {INR(shipping)}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      fontWeight: 700,
                                      letterSpacing: "1px",
                                    }}
                                  >
                                    GST (18%)
                                  </td>
                                  <td
                                    style={{
                                      fontWeight: 700,
                                      letterSpacing: "1px",
                                    }}
                                  >
                                    {INR(tax)}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={2}>
                                    <hr />
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      fontWeight: 600,
                                      fontSize: 20,
                                      letterSpacing: "1px",
                                    }}
                                  >
                                    AMOUNT PAID
                                  </td>
                                  <td
                                    style={{
                                      fontWeight: 700,
                                      fontSize: 20,
                                    }}
                                  >
                                    {INR(total)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
          </Col>
        </Row>
      </Container>

      {/* TRACKING MODAL */}
      <Modal
        show={!!trackingOrder}
        onHide={closeTrackingModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {trackingOrder
              ? `Track Order #${
                  trackingOrder.merchantOrderId ||
                  String(trackingOrder.customOrderId || trackingOrder._id || "")
                    .slice(-12)
                }`
              : "Track Order"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {trackingOrder && (
            <>
              <p className="fw-bold mb-4">
                Status: {trackingOrder.status || "Pending"}
              </p>

              {(() => {
                const status = trackingOrder.status || "Pending";

                const isDispatched =
                  status === "Ready for Dispatch" || status === "Delivered";
                const isDelivered = status === "Delivered";

                const placedTime = trackingOrder.createdAt;
                const dispatchedTime =
                  trackingOrder.dispatchDate ||
                  (isDispatched ? trackingOrder.updatedAt : null);
                const deliveredTime =
                  trackingOrder.deliveryDate ||
                  (isDelivered ? trackingOrder.updatedAt : null);

                const steps = [
                  {
                    label: "Order Placed",
                    icon: <FaShoppingBag size={28} />,
                    isActive: true,
                    time: placedTime,
                  },
                  {
                    label: "Order Dispatched",
                    icon: <FaShippingFast size={28} />,
                    isActive: isDispatched,
                    time: dispatchedTime,
                  },
                  {
                    label: "Delivered Successfully",
                    icon: <FaCheckCircle size={28} />,
                    isActive: isDelivered,
                    time: deliveredTime,
                  },
                ];

                return (
                  <Row className="text-center align-items-center my-4">
                    {steps.map((step, i) => (
                      <Col key={i} xs={12} sm={4} className="mb-4">
                        <div
                          style={{
                            backgroundColor: step.isActive
                              ? "#002209"
                              : "transparent",
                            border: step.isActive
                              ? "none"
                              : "1px solid lightgray",
                            borderRadius: "50%",
                            padding: "10px",
                            margin: "auto",
                            width: "60px",
                            height: "60px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: step.isActive ? "#fff" : "#000",
                          }}
                        >
                          {step.icon}
                        </div>

                        <h6 className="mt-2">{step.label}</h6>

                        <p style={{ fontSize: "12px", marginBottom: 0 }}>
                          {step.time
                            ? new Date(step.time).toLocaleDateString()
                            : "—"}
                        </p>
                        <p style={{ fontSize: "12px" }}>
                          {step.time
                            ? new Date(step.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </p>
                      </Col>
                    ))}
                  </Row>
                );
              })()}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeTrackingModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* LOGOUT MODAL */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Log out?</Modal.Title>
        </Modal.Header>
        <Modal.Body>You're about to log out. Continue?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowLogoutModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogoutConfirm}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
