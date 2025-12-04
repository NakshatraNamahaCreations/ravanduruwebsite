import React, { useEffect, useMemo, useState } from "react";
import { Container, Table, Button, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../redux/cartSlice";
import ScrollToTop from "../../Component/ScrollToTop";
import cart from "/media/Emptycart.png";
import "./YourCart.css";

// ----------------------------
// Config — match ProductDetails
// ----------------------------
const API_BASE = "https://ravandurustores-backend.onrender.com";

// same helpers you used in ProductDetails
const clampPct = (pct) => Math.min(100, Math.max(0, Number(pct || 0)));
const priceAfterPct = (base, pct) =>
  +(Math.max(0, Number(base) * (1 - clampPct(pct) / 100))).toFixed(2);
const pctFromPrices = (base, final) =>
  Number(base) > 0
    ? Math.round(((Number(base) - Number(final)) / Number(base)) * 100)
    : 0;

// free shipping rule
const FREE_THRESHOLD = 2000;
const BASE_SHIPPING = 0;

// GST rate
const GST_RATE = 0.18;

// weight parser fallback (if you didn’t store variantId in cart)
function parseSelectedWeight(str) {
  if (!str) return null;
  const m = String(str).trim().match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
  if (!m) return null;
  return {
    qty: String(m[1]).toLowerCase().replace(/\s+/g, ""),
    unit: String(m[2]).toLowerCase().replace(/\s+/g, ""),
  };
}
const normalize = (v) => String(v || "").toLowerCase().replace(/\s+/g, "");

// ---------- Auth helpers ----------
function decodeJwtPayload(token = "") {
  try {
    const [, payload] = String(token).split(".");
    if (!payload) return null;
    // base64url -> base64 + padding for atob
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = "=".repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(b64 + pad));
  } catch {
    return null;
  }
}
function getAuthUser() {
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      if (u && typeof u === "object") return u;
    }
  } catch {}
  const token = localStorage.getItem("token") || "";
  const p = decodeJwtPayload(token);
  if (!p) return null;
  return {
    _id: p._id || p.id || p.userId || p.sub || null,
    id: p.id || p._id || p.userId || p.sub || null,
    userId: p.userId || p.sub || p.id || p._id || null,
    email: p.email || p.user_email || null,
  };
}

// ---------- Simple fetch wrapper ----------
async function apiFetch(url, opts = {}) {
  const token = localStorage.getItem("token") || "";
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
}

// Only return current user's addresses (but don't discard if we can't decode user)
async function fetchAddressesFromBackend() {
  const data = await apiFetch(`${API_BASE}/api/addresses`, { method: "GET" });
  const arr =
    (Array.isArray(data) && data) ||
    (Array.isArray(data?.addresses) && data.addresses) ||
    (Array.isArray(data?.data) && data.data) ||
    (Array.isArray(data?.items) && data.items) ||
    [];

  const current = getAuthUser();
  if (!current) {
    // Server should already filter via Bearer token. Don't drop results.
    return arr;
  }
  const uid = String(
    current.id || current._id || current.userId || current.sub || ""
  ).trim();
  const email = String(current.email || "").toLowerCase().trim();

  return arr.filter((a) => {
    const aUid = String(
      a.userId ||
        a.user_id ||
        (a.user && (a.user._id || a.user.id)) ||
        a.createdBy ||
        ""
    ).trim();
    const aEmail = String(a.email || "").toLowerCase().trim();
    return (uid && aUid && aUid === uid) || (email && aEmail && aEmail === email);
  });
}

async function createAddressInBackend(payload) {
  return apiFetch(`${API_BASE}/api/addresses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Map form ➜ API payload
function mapFormToApi(a) {
  return {
    firstName: a.firstName,
    lastName: a.lastName,
    email: a.email,
    mobileNumber: `${a.phoneCode}${a.phoneNumber}`.replace(/\s+/g, ""),
    state: a.state,
    city: a.city,
    address: [a.address1, a.address2].filter(Boolean).join(", "),
    pincode: a.pincode,
    country: "India",
  };
}

// Map API ➜ form (for displaying/changing the latest saved card)
function mapApiToForm(api) {
  const { mobileNumber = "" } = api || {};
  const candidates = ["+91", "+1", "+44", "+61", "+81"];
  const phoneCode = candidates.find((c) => mobileNumber.startsWith(c)) || "+91";
  const phoneNumber = mobileNumber.replace(phoneCode, "");
  const addr1 = api?.address || "";
  return {
    firstName: api?.firstName || "",
    lastName: api?.lastName || "",
    phoneCode,
    phoneNumber,
    email: api?.email || "",
    address1: addr1,
    address2: "",
    city: api?.city || "",
    state: api?.state || "",
    pincode: api?.pincode || "",
  };
}

export default function Yourcart() {
  const [isVisible, setIsVisible] = useState(false);

  // address state
  const emptyAddress = {
    firstName: "",
    lastName: "",
    phoneCode: "+91",
    phoneNumber: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  };
  const [address, setAddress] = useState(emptyAddress);

  // backend pricing cache
  const [pricing, setPricing] = useState({});
  const [productsById, setProductsById] = useState({});
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState(null);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shippingOverride] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => window.scrollTo(0, 0), []);

  // ----------------------------
  // Address helpers
  // ----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Saved addresses from backend
  const [savedList, setSavedList] = useState([]);
  const latestSaved = useMemo(() => {
    if (!Array.isArray(savedList) || !savedList.length) return null;
    const sorted = [...savedList].sort((a, b) => {
      const tA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const tB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return tA - tB;
    });
    return sorted[sorted.length - 1];
  }, [savedList]);

  function isAddressFilled(a) {
    if (!a) return false;
    const required = [
      "firstName",
      "lastName",
      "phoneCode",
      "phoneNumber",
      "email",
      "address1",
      "city",
      "state",
      "pincode",
    ];
    return required.every((f) => a[f] && String(a[f]).trim() !== "");
  }

  const hasSaved = useMemo(() => Boolean(latestSaved && latestSaved._id), [latestSaved]);

  // Show/hide form (hide when we already have a saved address)
  const [showForm, setShowForm] = useState(true);

  // Load from backend on mount (filtered to current user)
  useEffect(() => {
    (async () => {
      try {
        const list = await fetchAddressesFromBackend();
        setSavedList(Array.isArray(list) ? list : []);
        setShowForm(!(Array.isArray(list) && list.length));
      } catch (e) {
        console.warn("Could not load addresses:", e?.message || e);
        setSavedList([]);
        setShowForm(true);
      }
    })();
  }, []);

  function getStoredUser() {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const p = JSON.parse(raw);
      return typeof p === "string" ? JSON.parse(p) : p;
    } catch {
      return null;
    }
  }
  function hasSession(user) {
    const token = localStorage.getItem("token");
    return Boolean(
      (user &&
        (user.token ||
          user.authToken ||
          user.isLoggedIn ||
          user.id ||
          user.email)) ||
        token
    );
  }

  function validateAddress(data) {
  const namePattern = /^[A-Za-z\s]+$/;
  const phonePattern = /^[0-9]{10}$/;
  const emailPattern = /^\S+@\S+\.\S+$/;
  const cityStatePattern = /^[A-Za-z\s]+$/;
  const pincodePattern = /^[0-9]{6}$/;

  if (!namePattern.test(data.firstName)) {
    alert("First name should contain only letters.");
    return false;
  }

  if (!namePattern.test(data.lastName)) {
    alert("Last name should contain only letters.");
    return false;
  }

  if (!phonePattern.test(data.phoneNumber)) {
    alert("Phone number must be exactly 10 digits.");
    return false;
  }

  if (!emailPattern.test(data.email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  if (data.address1.trim().length < 5) {
    alert("Address Line 1 must be at least 5 characters long.");
    return false;
  }

  if (!cityStatePattern.test(data.city)) {
    alert("City name must contain only letters.");
    return false;
  }

  if (!cityStatePattern.test(data.state)) {
    alert("State name must contain only letters.");
    return false;
  }

  if (!pincodePattern.test(data.pincode)) {
    alert("Pincode must be exactly 6 digits.");
    return false;
  }

  return true;
}


  const handleSubmit = async (e) => {
    e.preventDefault();
   if (!validateAddress(address)) return;


    try {
      const payload = mapFormToApi(address);
      await createAddressInBackend(payload);

      // Refresh list after creation (filtered)
      const list = await fetchAddressesFromBackend();
      setSavedList(Array.isArray(list) ? list : []);
      setShowForm(false);
    } catch (err) {
      console.warn(err);
      alert("Could not save address. Please try again.");
      return;
    }

    const user = getStoredUser();
    if (!hasSession(user)) {
      alert("Address saved. Please log in to proceed to checkout.");
      navigate("/login", { state: { from: "/checkout", cartItems } });
      return;
    }
    navigate("/checkout", { state: { cartItems } });
  };

  const handleCancel = () => setAddress(emptyAddress);

  // ----------------------------
  // Pricing fetch — aligned with ProductDetails
  // ----------------------------
  async function fetchPricingAndProducts(items) {
    const ids = [...new Set(items.map((i) => i.id))];
    if (ids.length === 0) return { map: {}, byId: {} };

    // Try BULK first
    let products = null;
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) products = await res.json();
    } catch {}

    // Fallback: fetch one-by-one
    if (!Array.isArray(products)) {
      products = await Promise.all(
        ids.map(async (id) => {
          const r = await fetch(
            `${API_BASE}/api/products/${encodeURIComponent(id)}`
          );
          if (!r.ok) throw new Error("Failed to fetch " + id);
          return r.json();
        })
      );
    }

    const map = {};
    const byId = {};

    for (const prod of products) {
      if (!prod || !prod._id) continue;
      byId[prod._id] = prod;

      const variants = Array.isArray(prod.variants) ? prod.variants : [];
      const pct = clampPct(prod.discountPercentage);

      variants.forEach((v) => {
        const base = Number(
          v.price ?? prod.price ?? prod.mrp ?? prod.originalPrice ?? 0
        );
        const final =
          pct > 0
            ? priceAfterPct(base, pct)
            : Number(prod.discountPrice ?? base);

        map[`${prod._id}|${v._id}`] = {
          originalPrice: base,
          discountPercentage: pct > 0 ? pct : pctFromPrices(base, final),
          discountedPrice: final,
        };
      });
    }

    return { map, byId };
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setPricingLoading(true);
        setPricingError(null);
        const { map, byId } = await fetchPricingAndProducts(cartItems);
        if (!mounted) return;
        setPricing(map);
        setProductsById(byId);
      } catch (e) {
        if (mounted) setPricingError(e?.message || "Failed to load pricing");
      } finally {
        if (mounted) setPricingLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [cartItems]);

  // Price for one cart line — prefer variantId, else try selectedWeight
  const getPriceInfo = (item) => {
    if (!item)
      return { originalPrice: 0, discountPercentage: 0, discountedPrice: 0 };

    if (item.variantId) {
      const k = `${item.id}|${item.variantId}`;
      if (pricing[k]) return pricing[k];
    }

    // Fallback: match by selectedWeight
    const prod = productsById[item.id];
    const parsed = parseSelectedWeight(item.selectedWeight);
    if (prod && parsed && Array.isArray(prod.variants)) {
      const match = prod.variants.find(
        (v) =>
          normalize(v.quantity) === parsed.qty &&
          normalize(v.unit) === parsed.unit
      );
      if (match) {
        const k2 = `${prod._id}|${match._id}`;
        if (pricing[k2]) return pricing[k2];

        const base = Number(
          match.price ?? prod.price ?? prod.mrp ?? prod.originalPrice ?? 0
        );
        const pct = clampPct(prod.discountPercentage);
        const final =
          pct > 0 ? priceAfterPct(base, pct) : Number(prod.discountPrice ?? base);
        return {
          originalPrice: base,
          discountPercentage: pct > 0 ? pct : pctFromPrices(base, final),
          discountedPrice: final,
        };
      }
    }

    if (prod) {
      const pct = clampPct(prod.discountPercentage);
      return { originalPrice: 0, discountPercentage: pct, discountedPrice: 0 };
    }

    return { originalPrice: 0, discountPercentage: 0, discountedPrice: 0 };
  };

  // ----------------------------
  // PRICE CALCULATIONS (BACKEND DISCOUNT)
// ----------------------------

  // Subtotal at original price (before any discount)
  const S = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const q = parseInt(item.quantity, 10) || 1;
      const info = getPriceInfo(item);
      const orig = Number(info.originalPrice || 0);
      return sum + orig * q;
    }, 0);
  }, [cartItems, pricing, productsById]);

  // Total rupee discount from backend (original - discounted)
  const itemsDiscount = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const q = parseInt(item.quantity, 10) || 1;
      const info = getPriceInfo(item);
      const orig = Number(info.originalPrice) || 0;
      const disc = Number(
        info.discountedPrice ?? info.originalPrice ?? 0
      ) || 0;
      const perUnitOff = Math.max(0, orig - disc);
      return sum + perUnitOff * q;
    }, 0);
  }, [cartItems, pricing, productsById]);

  // Subtotal after discount (this is what customer pays before tax & shipping)
  const discountedSubtotal = useMemo(() => {
    const value = S - itemsDiscount;
    return value < 0 ? 0 : value;
  }, [S, itemsDiscount]);

  // SHIPPING based on discounted subtotal
  const shippingAuto =
    discountedSubtotal >= FREE_THRESHOLD ? 0 : BASE_SHIPPING;
  const shipping =
    shippingOverride === null
      ? shippingAuto
      : shippingOverride
      ? 0
      : BASE_SHIPPING;

  // GST ON DISCOUNTED AMOUNT
  const tax = useMemo(() => {
    return discountedSubtotal * GST_RATE;
  }, [discountedSubtotal]);

  // FINAL TOTAL
  const total = useMemo(() => {
    return discountedSubtotal + shipping + tax;
  }, [discountedSubtotal, shipping, tax]);

  return (
    <>
      <div
        className="page-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <Container className="mb-5">
          {cartItems.length === 0 ? (
            <div className="empty-cart-wrapper">
              <div className="empty-cart-inner">
                <div className="empty-cart-image-wrap">
                  <img
                    src={cart}
                    alt="cart"
                    className="empty-cart-img"
                    width={150}
                    height={150}
                  />
                </div>

                <h1 className="empty-cart-title">
                  YOUR SHOPPING CART IS EMPTY
                </h1>

                <h4 className="empty-cart-subtitle">
                  Looks like you haven't added anything to your cart yet.
                </h4>

                <Link
                  to="/best-seller"
                  className="shop-now-link"
                  aria-label="Shop now"
                >
                  <button className="shop-now-btn" type="button">
                    SHOP NOW
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "poppins, sans-serif" }}>
                <h1
                  style={{
                    fontSize: 35,
                    fontWeight: "bold",
                    textAlign: "center",
                    margin: "5% 0%",
                    color: "#00614A",
                  }}
                >
                  YOUR CART
                </h1>

                <Row className="align-items-start justify-content-center gap-5">
                  {cartItems.length > 0 && (
                    <h3
                      className="mb-4 fw-bold"
                      style={{
                        fontFamily: "poppins",
                        marginLeft: 100,
                      }}
                    >
                      Cart : {cartItems.length} Item
                      {cartItems.length > 1 ? "s" : ""}
                    </h3>
                  )}

                  {/* LEFT: Cart table (desktop) + Mobile stacked list */}
                  <Col
                    xs={12}
                    lg={6}
                    style={{ padding: 20, height: "fit-content" }}
                  >
                    {/* ---------- DESKTOP TABLE (visible >=768px) ---------- */}
                    <div className="desktop-only">
                      <Table className="custom-table" style={{ margin: "auto" }}>
                        <thead>
                          <tr>
                            <th
                              style={{
                                padding: 10,
                                color: "#00614A",
                                fontSize: 20,
                                letterSpacing: "1px",
                                background: "transparent",
                              }}
                            >
                              Product
                            </th>
                            <th
                              style={{
                                textAlign: "center",
                                padding: 10,
                                color: "#00614A",
                                fontSize: 20,
                                letterSpacing: "1px",
                                background: "transparent",
                              }}
                            >
                              Quantity
                            </th>
                            <th
                              style={{
                                textAlign: "center",
                                padding: 10,
                                color: "#00614A",
                                fontSize: 20,
                                letterSpacing: "1px",
                                background: "transparent",
                              }}
                            >
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((item) => {
                            const q = parseInt(item.quantity, 10) || 1;
                            const pinfo = getPriceInfo(item);
                            const unitPrice = Number(pinfo.originalPrice || 0);
                            const lineTotal = unitPrice * q;
                            const hasDiscountPct =
                              Number(pinfo.discountPercentage || 0) > 0;

                            return (
                              <tr
                                key={`${item.id}-${
                                  item.variantId || item.selectedWeight || ""
                                }`}
                                style={{ textAlign: "center" }}
                              >
                                <td
                                  style={{
                                    padding: 10,
                                    width: "50%",
                                    background: "transparent",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "left",
                                      alignItems: "start",
                                    }}
                                  >
                                    <img
                                      src={item.image}
                                      alt="product"
                                      style={{
                                        width: 70,
                                        height: "auto",
                                        objectFit: "contain",
                                      }}
                                    />
                                    <div
                                      style={{
                                        marginLeft: 20,
                                        color: "#00614A",
                                        textAlign: "left",
                                      }}
                                    >
                                      <h3
                                        style={{
                                          fontSize: 18,
                                          marginBottom: 10,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {item.name}
                                      </h3>
                                      <div
                                        style={{
                                          fontSize: 14,
                                          opacity: 0.8,
                                        }}
                                      >
                                        {item.selectedWeight}
                                      </div>

                                      <div
                                        style={{
                                          display: "flex",
                                          gap: 10,
                                          alignItems: "baseline",
                                          marginTop: 6,
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: 18,
                                            fontWeight: 600,
                                          }}
                                        >
                                          ₹{lineTotal.toFixed(2)}
                                        </span>
                                        {hasDiscountPct && (
                                          <span
                                            style={{
                                              fontSize: 12,
                                              color: "#d63384",
                                              fontWeight: 600,
                                            }}
                                          >
                                            {pinfo.discountPercentage}% OFF
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td
                                  style={{
                                    padding: 10,
                                    background: "transparent",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginBottom: 10,
                                    }}
                                  >
                                    <button
                                      className="qty-btn"
                                      onClick={() =>
                                        dispatch(
                                          updateQuantity({
                                            id: item.id,
                                            variantId: item.variantId ?? null,
                                            selectedWeight:
                                              item.selectedWeight ?? null,
                                            quantity: Math.max(
                                              1,
                                              item.quantity - 1
                                            ),
                                          })
                                        )
                                      }
                                    >
                                      −
                                    </button>
                                    <span
                                      style={{
                                        width: 40,
                                        textAlign: "center",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {item.quantity}
                                    </span>
                                    <button
                                      className="qty-btn"
                                      onClick={() =>
                                        dispatch(
                                          updateQuantity({
                                            id: item.id,
                                            variantId: item.variantId ?? null,
                                            selectedWeight:
                                              item.selectedWeight ?? null,
                                            quantity: item.quantity + 1,
                                          })
                                        )
                                      }
                                    >
                                      +
                                    </button>
                                  </div>

                                  <Button
                                    variant="outline-danger"
                                    style={{
                                      fontSize: 16,
                                      padding: "5px 6px",
                                      letterSpacing: "1px",
                                      textTransform: "uppercase",
                                      display: "block",
                                      margin: "0 auto",
                                    }}
                                    onClick={() =>
                                      dispatch(
                                        removeFromCart({
                                          id: item.id,
                                          variantId: item.variantId ?? null,
                                          selectedWeight:
                                            item.selectedWeight ?? null,
                                        })
                                      )
                                    }
                                  >
                                    Remove
                                  </Button>
                                </td>

                                <td
                                  style={{
                                    padding: 10,
                                    fontSize: 20,
                                    letterSpacing: "1px",
                                    color: "#00614A",
                                    background: "transparent",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ₹{lineTotal.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>

                    {/* ---------- MOBILE STACKED LIST (visible <768px) ---------- */}
                    <div className="mobile-only">
                      {cartItems.map((item) => {
                        const q = parseInt(item.quantity, 10) || 1;
                        const pinfo = getPriceInfo(item);
                        const unitPrice = Number(pinfo.originalPrice || 0);
                        const lineTotal = unitPrice * q;
                        const hasDiscountPct =
                          Number(pinfo.discountPercentage || 0) > 0;

                        return (
                          <div
                            key={`m-${item.id}-${
                              item.variantId || item.selectedWeight || ""
                            }`}
                            className="mobile-cart-card"
                          >
                            <div className="mobile-cart-top">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="mobile-cart-img"
                              />
                              <div className="mobile-cart-meta">
                                <h4 className="mobile-cart-name">
                                  {item.name}
                                </h4>
                                <div className="mobile-cart-weight">
                                  {item.selectedWeight}
                                </div>

                                <div className="mobile-cart-price-row">
                                  <div className="mobile-price">
                                    ₹{lineTotal.toFixed(2)}
                                  </div>
                                  {hasDiscountPct && (
                                    <div className="mobile-discount">
                                      {pinfo.discountPercentage}% OFF
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="mobile-cart-controls">
                              <div className="mobile-qty-wrap">
                                <button
                                  className="qty-btn-mobile"
                                  onClick={() =>
                                    dispatch(
                                      updateQuantity({
                                        id: item.id,
                                        variantId: item.variantId ?? null,
                                        selectedWeight:
                                          item.selectedWeight ?? null,
                                        quantity: Math.max(
                                          1,
                                          item.quantity - 1
                                        ),
                                      })
                                    )
                                  }
                                >
                                  −
                                </button>
                                <div className="mobile-qty-num">
                                  {item.quantity}
                                </div>
                                <button
                                  className="qty-btn-mobile"
                                  onClick={() =>
                                    dispatch(
                                      updateQuantity({
                                        id: item.id,
                                        variantId: item.variantId ?? null,
                                        selectedWeight:
                                          item.selectedWeight ?? null,
                                        quantity: item.quantity + 1,
                                      })
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>

                              <button
                                className="mobile-remove-btn"
                                onClick={() =>
                                  dispatch(
                                    removeFromCart({
                                      id: item.id,
                                      variantId: item.variantId ?? null,
                                      selectedWeight:
                                        item.selectedWeight ?? null,
                                    })
                                  )
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ---------- Totals (same block, responsive) ---------- */}
                    <div
                      className="cart-totals mt-3"
                      style={{
                        display: "block",
                        margin: 0,
                        color: "#00614A",
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <span>Items Subtotal (MRP):</span>
                        <span>₹{S.toFixed(2)}</span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span>Discount:</span>
                        <span>- ₹{itemsDiscount.toFixed(2)}</span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span>Subtotal after discount:</span>
                        <span>₹{discountedSubtotal.toFixed(2)}</span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span>Shipping:</span>
                        <span>₹{shipping.toFixed(2)}</span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span>GST (18%):</span>
                        <span>₹{tax.toFixed(2)}</span>
                      </div>

                      <hr />

                      <div
                        className="d-flex justify-content-between"
                        style={{ fontWeight: 800 }}
                      >
                        <span>Total to pay:</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </Col>

                  {/* RIGHT: Delivery details */}
                  <Col xs={12} lg={5}>
                    <h3
                      style={{
                        fontFamily: "poppins",
                        fontWeight: "bold",
                        fontSize: 22,
                      }}
                    >
                      Delivery Details
                    </h3>

                    {/* Saved Address */}
                    {hasSaved && !showForm && (
                      <div
                        style={{
                          border: "1px solid #d7eee6",
                          background: "#f3fbf8",
                          borderRadius: 12,
                          padding: 16,
                          color: "#00614A",
                          marginTop: 16,
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div style={{ lineHeight: 1.6 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: 16,
                              }}
                            >
                              {latestSaved.firstName} {latestSaved.lastName}
                            </div>
                            <div>{latestSaved.address}</div>
                            <div>
                              {latestSaved.city}, {latestSaved.state} -{" "}
                              {latestSaved.pincode}
                            </div>
                            <div>{latestSaved.mobileNumber}</div>
                            <div>{latestSaved.email}</div>
                          </div>

                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-success"
                              style={{ fontWeight: 600 }}
                              onClick={() => {
                                const formPrefill = mapApiToForm(latestSaved);
                                setAddress(formPrefill);
                                setShowForm(true);
                              }}
                            >
                              Change Address
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {(!hasSaved || showForm) && (
                      <Form
                        onSubmit={handleSubmit}
                        style={{ fontSize: 22, color: "#00614A" }}
                        className="mt-4"
                      >
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId="firstName">
                             <Form.Control
  type="text"
  name="firstName"
  placeholder="First Name"
  value={address.firstName}
  onChange={handleChange}
  required
  pattern="^[A-Za-z\s]+$"
  title="Only letters allowed"
  className="input-addressdetails search-input"
/>

                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="lastName">
                              <Form.Control
  type="text"
  name="lastName"
  placeholder="Last Name"
  value={address.lastName}
  onChange={handleChange}
  required
  pattern="^[A-Za-z\s]+$"
  title="Only letters allowed"
  className="input-addressdetails search-input"
/>

                            </Form.Group>
                          </Col>
                        </Row>

                        <Row className="mt-3">
                          <Col md={4}>
                            <Form.Group controlId="phoneCode">
                              <Form.Control
                                as="select"
                                name="phoneCode"
                                value={address.phoneCode}
                                onChange={handleChange}
                                required
                                className="input-addressdetails search-input"
                                style={{
                                  fontFamily: "poppins, sans-serif",
                                  fontSize: 17,
                                }}
                              >
                                <option value="+1">+1 (USA)</option>
                                <option value="+91">+91 (India)</option>
                                <option value="+44">+44 (UK)</option>
                                <option value="+61">+61 (Australia)</option>
                                <option value="+81">+81 (Japan)</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={8}>
                            <Form.Group controlId="phoneNumber">
                              <Form.Control
  type="text"
  name="phoneNumber"
  placeholder="Phone Number"
  value={address.phoneNumber}
  onChange={handleChange}
  required
  maxLength={10}
  pattern="^[0-9]{10}$"
  title="Phone number must be 10 digits"
  className="input-addressdetails search-input"
/>

                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group controlId="email" className="mt-3">
                          <Form.Control
  type="email"
  name="email"
  placeholder="Email"
  value={address.email}
  onChange={handleChange}
  required
  pattern="^\S+@\S+\.\S+$"
  title="Enter a valid email"
  className="input-addressdetails search-input"
/>

                        </Form.Group>

                        <Form.Group controlId="address1" className="mt-3">
                         <Form.Control
  type="text"
  name="address1"
  placeholder="Address Line 1"
  value={address.address1}
  onChange={handleChange}
  required
  minLength={15}
  title="Minimum 15 characters required"
  className="input-addressdetails search-input"
/>

                        </Form.Group>

                        <Form.Group controlId="address2" className="mt-3">
                          <Form.Control
                            type="text"
                            name="address2"
                            placeholder="Address Line 2 (Optional)"
                            value={address.address2}
                            onChange={handleChange}
                            className="input-addressdetails search-input"
                            style={{
                              fontFamily: "poppins, sans-serif",
                              fontSize: 17,
                            }}
                          />
                        </Form.Group>

                        <Row className="mt-3">
                          <Col md={4}>
                            <Form.Group controlId="city">
                             <Form.Control
  type="text"
  name="city"
  placeholder="City"
  value={address.city}
  onChange={handleChange}
  required
  pattern="^[A-Za-z\s]+$"
  title="City must contain only letters"
  className="input-addressdetails search-input"
/>

                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group controlId="state">
                             <Form.Control
  type="text"
  name="state"
  placeholder="State"
  value={address.state}
  onChange={handleChange}
  required
  pattern="^[A-Za-z\s]+$"
  title="State must contain only letters"
  className="input-addressdetails search-input"
/>

                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group controlId="pincode">
                             <Form.Control
  type="text"
  name="pincode"
  placeholder="Pincode"
  value={address.pincode}
  onChange={handleChange}
  required
  maxLength={6}
  pattern="^[0-9]{6}$"
  title="Pincode must be 6 digits"
  className="input-addressdetails search-input"
/>

                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-between mt-3 flex-wrap">
                          <Button
                            type="submit"
                            variant="outline-success"
                            className="mb-2"
                            style={{
                              fontSize: 18,
                              letterSpacing: "1px",
                              fontWeight: "bold",
                            }}
                          >
                            ADD ADDRESS
                          </Button>

                          <div>
                            <Button
                              variant="outline-success"
                              onClick={handleCancel}
                              className="me-2 mb-2"
                              style={{
                                color: "#00614A",
                                fontSize: 18,
                                letterSpacing: "1px",
                                fontWeight: "bold",
                              }}
                            >
                              Reset
                            </Button>
                            <Button
                              onClick={() => navigate("/")}
                              variant="outline-success"
                              className="mb-2"
                              style={{
                                color: "#00614A",
                                fontSize: 18,
                                letterSpacing: "1px",
                                fontWeight: "bold",
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </Form>
                    )}

                    {/* Actions row */}
                    <div className="d-flex gap-3">
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: 70,
                          margin: "24px 0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          cursor: "pointer",
                          flex: 1,
                        }}
                        onClick={() => navigate("/best-seller")}
                      >
                        <h3
                          className="continue-btn"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: 18,
                            fontWeight: "bold",
                            backgroundColor: "#97d7c6",
                            color: "#00614A",
                            textAlign: "center",
                            width: "100%",
                            margin: 0,
                            padding: "15px 24px",
                          }}
                        >
                          Continue Shopping
                        </h3>
                      </div>

                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: 70,
                          margin: "24px 0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          cursor: "pointer",
                          flex: 1,
                        }}
                        onClick={() => {
                          const user = getStoredUser();
                          if (!hasSession(user)) {
                            alert(
                              "You are not logged in. Please log in to continue."
                            );
                            navigate("/login", {
                              state: { from: "/checkout", cartItems, subtotal: discountedSubtotal },
                            });
                            return;
                          }
                          const filledNow = isAddressFilled(address);
                          if (!hasSaved && !filledNow) {
                            alert(
                              "⚠️ Please fill your delivery details or save an address before proceeding to checkout."
                            );
                            return;
                          }
                          navigate("/checkout", {
                            state: { cartItems, subtotal: discountedSubtotal },
                          });
                        }}
                      >
                        <h3
                          className="checkout-btn"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#00614A",
                            backgroundColor: "#97d7c6",
                            textAlign: "center",
                            width: "100%",
                            margin: 0,
                            padding: "15px 24px",
                          }}
                        >
                          Check Out
                        </h3>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </Container>

        <ScrollToTop />
      </div>
    </>
  );
}
