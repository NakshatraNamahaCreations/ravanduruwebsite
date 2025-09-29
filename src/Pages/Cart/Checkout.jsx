import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./Checkout.css";

const API_BASE = "https://api.ravandurustores.com";

/* --------------------------- Small helpers --------------------------- */
const clampPct = (pct) => Math.min(100, Math.max(0, Number(pct || 0)));
const priceAfterPctWholeRupee = (base, pct, mode = "nearest") => {
  const b = Number(base) || 0;
  const p = clampPct(pct);
  const rawOff = (b * p) / 100;
  const off =
    mode === "floor" ? Math.floor(rawOff) : mode === "ceil" ? Math.ceil(rawOff) : Math.round(rawOff);
  return Math.max(0, b - off);
};
const parseSelectedWeight = (str) => {
  if (!str) return null;
  const m = String(str).trim().match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
  if (!m) return null;
  return { qty: m[1].toLowerCase(), unit: m[2].toLowerCase() };
};
const norm = (v) => String(v || "").toLowerCase().replace(/\s+/g, "");

/* ----------------------------- Auth utils ---------------------------- */
function decodeJwtPayload(token = "") {
  try {
    const [, payload] = String(token).split(".");
    if (!payload) return null;
    // base64url -> base64 (+ padding) for atob
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = "=".repeat((4 - (b64.length % 4)) % 4);
    const json = atob(b64 + pad);
    const obj = JSON.parse(json);
    return obj && typeof obj === "object" ? obj : null;
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
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  return {
    _id: payload._id || payload.id || payload.userId || payload.sub || null,
    id: payload.id || payload._id || payload.userId || payload.sub || null,
    userId: payload.userId || payload.sub || payload.id || payload._id || null,
    email: payload.email || payload.user_email || null,
  };
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

/* ================================ Page ================================ */
export default function Checkout() {
  const navigate = useNavigate();
  const cartItems = useSelector((s) => s.cart.cartItems);

  /* ----------------------- SERVER ADDRESSES STATE ---------------------- */
  const [addresses, setAddresses] = useState([]); // fetched from backend
  const [selectedId, setSelectedId] = useState(null); // backend _id / id
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState("");

  // Add-new form toggle & state
  const [showForm, setShowForm] = useState(false);
  const [savingNew, setSavingNew] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneCode: "+91",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // for pay-now button state
  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ----------------------- FETCH ADDRESSES ON MOUNT -------------------- */
  useEffect(() => {
    let mounted = true;

    async function loadAddresses() {
      setAddrLoading(true);
      setAddrError("");
      try {
        const res = await fetch(`${API_BASE}/api/addresses`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (res.status === 401 || res.status === 403) {
          if (!mounted) return;
          setAddresses([]);
          setSelectedId(null);
          setAddrError("You are not logged in. Please sign in to view saved addresses.");
          return;
        }

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to fetch addresses (HTTP ${res.status})`);
        }

        const data = await res.json();
        const arr =
          (Array.isArray(data) && data) ||
          (Array.isArray(data?.addresses) && data.addresses) ||
          (Array.isArray(data?.data) && data.data) ||
          (Array.isArray(data?.items) && data.items) ||
          [];

        // Optional: client-side filter to current user (server should already do this by token)
        const current = getAuthUser();
        let mine = arr;
        if (current) {
          const uid = String(
            current.id || current._id || current.userId || current.sub || ""
          ).trim();
          const email = String(current.email || "").toLowerCase().trim();
          mine = arr.filter((a) => {
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

        if (!mounted) return;
        setAddresses(mine);

        const preferred = mine.find((x) => x.isDefault || x.default) || mine[mine.length - 1];
        setSelectedId(preferred?._id || preferred?.id || null);
      } catch (e) {
        if (!mounted) return;
        setAddrError(e?.message || "Failed to fetch addresses.");
        setAddresses([]);
        setSelectedId(null);
      } finally {
        if (mounted) setAddrLoading(false);
      }
    }

    loadAddresses();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedAddress = useMemo(
    () => addresses.find((a) => (a?._id || a?.id) === selectedId) || null,
    [addresses, selectedId]
  );

  /* --------------------------- CREATE ADDRESS -------------------------- */
  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    const required = [
      "email",
      "firstName",
      "lastName",
      "phoneNumber",
      "address1",
      "city",
      "state",
      "pincode",
    ];
    if (!required.every((k) => String(form[k] || "").trim() !== "")) {
      alert("Please complete all required fields.");
      return;
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      mobileNumber: `${form.phoneCode}${String(form.phoneNumber).replace(/\s+/g, "")}`,
      state: form.state,
      city: form.city,
      address: [form.address1, form.address2].filter(Boolean).join(", "),
      pincode: form.pincode,
      country: form.country || "India",
    };

    setSavingNew(true);
    try {
      const res = await fetch(`${API_BASE}/api/addresses`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.status === 401 || res.status === 403) {
        alert("Please log in to save your address.");
        return;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to save address (${res.status})`);
      }

      // Re-fetch
      const listRes = await fetch(`${API_BASE}/api/addresses`, {
        method: "GET",
        headers: authHeaders(),
      });

      if (listRes.ok) {
        const data = await listRes.json();
        const arr =
          (Array.isArray(data) && data) ||
          (Array.isArray(data?.addresses) && data.addresses) ||
          (Array.isArray(data?.data) && data.data) ||
          (Array.isArray(data?.items) && data.items) ||
          [];

        const current = getAuthUser();
        let mine = arr;
        if (current) {
          const uid = String(
            current.id || current._id || current.userId || current.sub || ""
          ).trim();
          const email = String(current.email || "").toLowerCase().trim();
          mine = arr.filter((a) => {
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

        setAddresses(mine);
        const last = mine[mine.length - 1];
        setSelectedId(last?._id || last?.id || null);
        setShowForm(false);
      } else {
        setShowForm(false);
      }
    } catch (e) {
      alert(e.message || "Could not save address.");
    } finally {
      setSavingNew(false);
    }
  };

  /* ------------------------------ PRICING ------------------------------ */
  const [pricing, setPricing] = useState({});
  const [productsById, setProductsById] = useState({});
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setPricingLoading(true);
        setPricingError("");

        const ids = [...new Set((cartItems || []).map((i) => i.id))];
        if (!ids.length) {
          if (mounted) {
            setPricing({});
            setProductsById({});
          }
          return;
        }

        // Bulk fetch, fallback to per-id
        let products;
        try {
          const r = await fetch(`${API_BASE}/api/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
          });
          if (r.ok) products = await r.json();
        } catch {}

        if (!Array.isArray(products)) {
          products = await Promise.all(
            ids.map(async (id) => {
              const r = await fetch(`${API_BASE}/api/products/${encodeURIComponent(id)}`);
              if (!r.ok) throw new Error("Failed product fetch " + id);
              return r.json();
            })
          );
        }

        const map = {};
        const byId = {};
        for (const prod of products) {
          if (!prod || !prod._id) continue;
          byId[prod._id] = prod;
          const pct = clampPct(prod.discountPercentage);
          const variants = Array.isArray(prod.variants) ? prod.variants : [];
          for (const v of variants) {
            const base = Number(v.price ?? prod.price ?? prod.mrp ?? 0);
            const final =
              pct > 0
                ? priceAfterPctWholeRupee(base, pct, "nearest")
                : Number(prod.discountPrice ?? base);
            map[`${prod._id}|${v._id}`] = {
              originalPrice: base,
              discountedPrice: final,
              discountPercentage: pct,
            };
          }
        }

        if (mounted) {
          setPricing(map);
          setProductsById(byId);
        }
      } catch (e) {
        if (mounted) setPricingError(e.message || "Pricing error");
      } finally {
        if (mounted) setPricingLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [cartItems]);

  const getPriceInfo = (item) => {
    if (!item) return { originalPrice: 0, discountedPrice: 0, discountPercentage: 0 };
    if (item.variantId) {
      const k = `${item.id}|${item.variantId}`;
      if (pricing[k]) return pricing[k];
    }
    const prod = productsById[item.id];
    const parsed = parseSelectedWeight(item.selectedWeight);
    if (prod && parsed && Array.isArray(prod.variants)) {
      const match = prod.variants.find(
        (v) => norm(v.quantity) === parsed.qty && norm(v.unit) === parsed.unit
      );
      if (match) {
        const k2 = `${prod._id}|${match._id}`;
        if (pricing[k2]) return pricing[k2];
        const base = Number(match.price ?? prod.price ?? prod.mrp ?? 0);
        const pct = clampPct(prod.discountPercentage);
        const final =
          pct > 0
            ? priceAfterPctWholeRupee(base, pct, "nearest")
            : Number(prod.discountPrice ?? base);
        return { originalPrice: base, discountedPrice: final, discountPercentage: pct };
      }
    }
    return { originalPrice: 0, discountedPrice: 0, discountPercentage: 0 };
  };

  /* ------------------------------- TOTALS ------------------------------ */
  const subtotal = useMemo(() => {
    return (cartItems || []).reduce((sum, item) => {
      const q = Number(item.quantity) || 1;
      return sum + (getPriceInfo(item).originalPrice || 0) * q;
    }, 0);
  }, [cartItems, pricing]);

  const itemsDiscount = useMemo(() => {
    return (cartItems || []).reduce((sum, item) => {
      const q = Number(item.quantity) || 1;
      const info = getPriceInfo(item);
      return sum + Math.max(0, info.originalPrice - info.discountedPrice) * q;
    }, 0);
  }, [cartItems, pricing]);

  const FREE_SHIPPING_THRESHOLD = 2000;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50;
  const gst = subtotal * 0.18;
  const grandTotal = subtotal - itemsDiscount + shippingFee + gst;

  const itemsCount = (cartItems || []).reduce((n, it) => n + Number(it.quantity || 0), 0);
  const unlockLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  function cartToApiItems(list = []) {
    return list.map((ci) => {
      const q = Number(ci.quantity) || 1;
      const info =
        typeof getPriceInfo === "function"
          ? getPriceInfo(ci)
          : { discountedPrice: ci.price || 0 };
      return {
        productId: ci.id,
        variantId: ci.variantId || null,
        name: ci.name,
        image: ci.image,
        quantity: q,
        selectedWeight: ci.selectedWeight || null,
        price: info.discountedPrice || 0,
      };
    });
  }

  /* ------------------------------- PAY NOW ----------------------------- */
  const handlePayNow = async () => {
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed.");
      navigate("/best-seller");
      return;
    }
    if (!selectedAddress || !selectedAddress._id) {
      alert("Please select or add a valid address before proceeding to payment.");
      return;
    }

    setIsLoading(true);
    try {
      const items = cartToApiItems(cartItems);
      // Use cart discounted prices for payment amount
      const computedSubtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
      const shipping = 0; // backend may add shipping/tax if needed
      const tax = 0;
      // const amount = computedSubtotal + shipping + tax;
      
const amount = 1

         // 🔹 FIX: get user here
    const authUser = getAuthUser();

      const res = await fetch(`http://localhost:8022/api/payments/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          callbackUrl: "https://ravandurustores.com/thankyou",
          items,
          addressId: selectedAddress._id,
            customerId: authUser?.id || authUser?._id || null,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP error ${res.status}`);
      }

      const paymentResponse = await res.json();

      const redirectUrl = paymentResponse?.phonepeResponse?.redirectUrl;
      const orderId =
        paymentResponse?.phonepeResponse?.orderId ||
        paymentResponse?.phonepeResponse?.merchantTransactionId;

      if (redirectUrl && orderId) {
        localStorage.setItem(
          "orderDetails",
          JSON.stringify({
            items,
            grandTotal: amount,
            addressId: selectedAddress._id,
            orderId,
          })
        );
        window.location.href = redirectUrl;
      } else {
        setIsLoading(false);
        alert("Payment initiation failed. No redirect URL.");
      }
    } catch (err) {
      console.error("Payment initiation error:", err);
      setIsLoading(false);
      alert("Error initiating payment.");
    }
  };


  return (
    <Container className="checkout">
      <Row className="gx-4">
        {/* LEFT */}
        <Col md={8}>
          <div className="infoBar">
            <span className={`pill ${unlockLeft > 0 ? "pill-warn" : "pill-success"}`} style={{ fontFamily: "poppins" }}>
              <span className={`badge ${unlockLeft > 0 ? "badge-warn" : "badge-success"}`}>
                {unlockLeft > 0 ? "Almost there" : "Unlocked"}
              </span>
              {unlockLeft > 0 ? (
                <>Add ₹{unlockLeft.toLocaleString("en-IN")} more to unlock FREE delivery</>
              ) : (
                <>FREE delivery unlocked!</>
              )}
            </span>
            <span style={{ fontFamily: "poppins" }}>
              Shipping ₹{(subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50).toLocaleString("en-IN")} if not unlocked
            </span>
          </div>

          {/* Bag */}
          <Card className="bagCard">
            <div className="bagHeader">
              <h5 style={{ fontFamily: "poppins" }}>Your Bag ({itemsCount})</h5>
              <div className="subtotal" style={{ fontFamily: "poppins" }}>
                Subtotal: <b>₹{subtotal.toFixed(2)}</b>
              </div>
            </div>

            {pricingLoading && <div className="px-3 pb-2 text-muted">Updating prices…</div>}
            {pricingError && <div className="px-3 pb-2 text-danger">{pricingError}</div>}

            <div className="bagList">
              {(cartItems || []).map((ci) => {
                const q = Number(ci.quantity) || 1;
                const info = getPriceInfo(ci);
                const line = Number(info.originalPrice || 0) * q;
                return (
                  <div key={`${ci.id}-${ci.variantId || ci.selectedWeight || ""}`} className="bagRow">
                    <img src={ci.image} alt={ci.name} className="bagImg" />
                    <div className="bagMeta">
                      <div className="bagTitle">{ci.name}</div>
                      <div className="bagSub">Qty {q}</div>
                    </div>
                    <div className="bagPrice">₹{line.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Delivery Address (from BACKEND) */}
          <div className="sectionHeader">
            <h4 style={{ fontFamily: "poppins" }}>Delivery Address</h4>
            <Button
              variant="success"
              size="sm"
              className="addNew"
              onClick={() => setShowForm((s) => !s)}
              style={{ fontFamily: "poppins" }}
            >
              {showForm ? "Close" : "+ Add New"}
            </Button>
          </div>

          {/* Address list */}
          <Card className="addrFormCard">
            <Card.Body>
              {addrLoading && <div className="text-muted mb-2">Loading saved addresses…</div>}
              {addrError && <div className="text-danger mb-2">{addrError}</div>}

              {addresses.length === 0 && !addrLoading && !showForm && (
                <div className="text-muted">No saved addresses yet. Add one to continue.</div>
              )}

              {addresses.length > 0 && (
                <div className="addressList">
                  {addresses.map((a) => {
                    const id = a._id || a.id;
                    const isSelected = selectedId === id;

                    const fullName = `${a.firstName || ""} ${a.lastName || ""}`.trim();
                    const addrLine = a.address || `${a.address1 || ""} ${a.address2 || ""}`.trim();
                    const cityStatePin = `${a.city || ""}, ${a.state || ""} - ${a.pincode || ""}`;
                    const phoneDisplay = a.mobileNumber
                      ? (() => {
                          const candidates = ["+91", "+1", "+44", "+61", "+81"];
                          const code = candidates.find((c) => a.mobileNumber.startsWith(c)) || "+91";
                          return `${code} ${a.mobileNumber.replace(code, "")}`;
                        })()
                      : `${a.phoneCode || "+91"} ${a.phoneNumber || ""}`;

                    return (
                      <div className={`addrCard ${isSelected ? "selected" : ""}`} key={id}>
                        <div className="addrTop">
                          <div className="left">
                            <label className="radio">
                              <input
                                type="radio"
                                name="savedAddress"
                                checked={isSelected}
                                onChange={() => setSelectedId(id)}
                              />
                              <span />
                            </label>
                            <div className="addrName">{fullName}</div>
                            {!isSelected && (
                              <span className="deliverTag" style={{ fontFamily: "poppins" }}>
                                Deliver here
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="addrBody">
                          <div className="line" style={{ fontFamily: "poppins" }}>
                            {addrLine}
                          </div>
                          <div className="line" style={{ fontFamily: "poppins" }}>
                            {cityStatePin}
                          </div>
                          <div className="line" style={{ fontFamily: "poppins" }}>
                            Phone: {phoneDisplay}
                          </div>
                          <div className="line" style={{ fontFamily: "poppins" }}>{a.email}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add new address (POST to backend) */}
              {showForm && (
                <Form onSubmit={handleAddNewAddress} className="mt-3">
                  <Form.Control
                    type="email"
                    className="mb-2"
                    placeholder="Email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                  />
                  <Row>
                    <Col md={6}>
                      <Form.Control
                        className="mb-2"
                        placeholder="First Name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        className="mb-2"
                        placeholder="Last Name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <Form.Select
                        className="mb-2"
                        name="phoneCode"
                        value={form.phoneCode}
                        onChange={handleFormChange}
                      >
                        <option value="+91">+91 (India)</option>
                        <option value="+1">+1 (USA)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+61">+61 (Australia)</option>
                        <option value="+81">+81 (Japan)</option>
                      </Form.Select>
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        className="mb-2"
                        placeholder="Phone Number"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                  </Row>

                  <Form.Control
                    className="mb-2"
                    placeholder="Address Line 1"
                    name="address1"
                    value={form.address1}
                    onChange={handleFormChange}
                    required
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="Address Line 2 (optional)"
                    name="address2"
                    value={form.address2}
                    onChange={handleFormChange}
                  />

                  <Row>
                    <Col md={6}>
                      <Form.Control
                        className="mb-2"
                        placeholder="City"
                        name="city"
                        value={form.city}
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        className="mb-2"
                        placeholder="State"
                        name="state"
                        value={form.state}
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Control
                        className="mb-2"
                        placeholder="Pincode"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        className="mb-2"
                        placeholder="Country"
                        name="country"
                        value={form.country}
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="outline-secondary" onClick={() => setShowForm(false)} disabled={savingNew}>
                      Cancel
                    </Button>
                    <Button className="btnPrimary" type="submit" disabled={savingNew}>
                      {savingNew ? "Saving…" : "Save Address"}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT */}
        <Col md={4}>
          <Card className="orderCard sticky">
            <div className="orderHeader" style={{ fontFamily: "poppins" }}>
              Order Details
            </div>

            <div className="orderRows">
              <div className="rowLine" style={{ fontFamily: "poppins" }}>
                <span>Items Subtotal</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>

              <div className="rowLine" style={{ fontFamily: "poppins" }}>
                <span>Discount</span>
                <span>₹ {itemsDiscount.toFixed(2)}</span>
              </div>

              <div className="rowLine" style={{ fontFamily: "poppins" }}>
                <span>Shipping</span>
                <span>₹ {(subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50).toLocaleString("en-IN")}</span>
              </div>

              <div className="rowLine" style={{ fontFamily: "poppins" }}>
                <span>GST (18%)</span>
                <span>₹ {(subtotal * 0.18).toFixed(2)}</span>
              </div>
            </div>

            <div className="totalRow">
              <span style={{ fontFamily: "poppins" }}>Total</span>
              <span style={{ fontFamily: "poppins" }}>₹ {grandTotal.toLocaleString("en-IN")}</span>
            </div>

            <Button className="payBtn" onClick={handlePayNow} disabled={isLoading}>
              {isLoading ? "Processing…" : `Pay ₹${grandTotal.toLocaleString("en-IN")}`}
            </Button>

            <div className="orderNote" style={{ fontFamily: "poppins" }}>
              Secure payments • Easy returns • Fast support
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

