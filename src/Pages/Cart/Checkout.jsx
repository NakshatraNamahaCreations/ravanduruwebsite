{/*import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Card,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function Checkout() {
  // ---------- Cart ----------
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, it) => sum + (Number(it.discountedPrice) || 0) * (Number(it.quantity) || 1),
    0
  );
  const shipping = 50;                 // previous behavior
  const tax = subtotal * 0.18;         // 18% GST
  const total = subtotal + shipping + tax;

  // ---------- Address state ----------
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // only for button disabling

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    phoneCode: "+91",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  // ---------- Load / persist ----------
  const STORAGE_KEY = "savedAddresses";

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setSavedAddresses(stored);

    if (stored.length > 0) {
      setSelectedAddress(stored[0]);
      setIsEditing(false);
    } else {
      // no addresses -> show form first
      setIsEditing(true);
    }
  }, []);

  const writeLocal = (list) => {
    setSavedAddresses(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddressTop = () => {
    // Always open a blank form
    setAddress({
      firstName: "",
      lastName: "",
      phoneCode: "+91",
      phoneNumber: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    });
    setEditingAddressId(null);
    setIsEditing(true);
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    setIsEditing(false);
    setEditingAddressId(null);
  };

  const handleEditClick = (addr) => {
    setAddress({
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
      phoneCode: addr.phoneCode || "+91",
      phoneNumber: addr.phoneNumber || "",
      address1: addr.address1 || "",
      address2: addr.address2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      country: addr.country || "",
    });
    setEditingAddressId(addr.id);
    setIsEditing(true);
  };

  const handleDeleteAddress = (addrId) => {
    if (!addrId) return;
    if (!window.confirm("Delete this address?")) return;

    const remaining = savedAddresses.filter((a) => a.id !== addrId);
    writeLocal(remaining);

    if (selectedAddress?.id === addrId) {
      if (remaining[0]) {
        setSelectedAddress(remaining[0]);
      } else {
        setSelectedAddress(null);
        setIsEditing(true); // no addresses left -> open form
      }
    }
  };

  const handleCancel = () => {
    // back to list without saving
    if (savedAddresses.length === 0) {
      // keep form if nothing exists
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
    setEditingAddressId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // normalize a compact object
    const newAddr = {
      id: editingAddressId || Date.now(),
      firstName: address.firstName.trim(),
      lastName: address.lastName.trim(),
      phoneCode: address.phoneCode.trim() || "+91",
      phoneNumber: address.phoneNumber.trim(),
      address1: address.address1.trim(),
      address2: (address.address2 || "").trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
      country: address.country.trim(),
    };

    let next;
    if (editingAddressId) {
      next = savedAddresses.map((a) => (a.id === editingAddressId ? newAddr : a));
    } else {
      next = [...savedAddresses, newAddr];
    }

    writeLocal(next);
    setSelectedAddress(newAddr);
    setIsEditing(false);
    setEditingAddressId(null);
    setIsLoading(false);
    alert(editingAddressId ? "Address updated successfully!" : "Address saved successfully!");
  };

  const handlePayNow = () => {
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed.");
      navigate("/best-seller");
      return;
    }
    if (!selectedAddress) {
      alert("Please select or add a delivery address.");
      return;
    }

    alert("Order placed successfully!");
    dispatch({ type: "cart/clearCart" });
    navigate("/thankyou");
  };

  
 
  const font = "poppins, sans-serif";

  return (
    <>
   
      <Container className="mt-4 mb-5" style={{ fontFamily: font }}>
        <Row>
          {/* Left: Addresses & Form */}
          {/*<Col md={8} style={{ marginBottom: 30 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 style={{ fontWeight: 700, color: "#00614A", letterSpacing: "1px" }}>
                Enter Delivery Address
              </h4>
              <Button
                variant="outline-success"
                size="sm"
                onClick={handleAddAddressTop}
                style={{
                  borderColor: "#00614A",
                  color: "#00614A",
                  backgroundColor: "transparent",
                  fontWeight: 600,
                  marginRight: "355px"
                }}
              >
                + Add Address
              </Button>
            </div>

            {/* Saved addresses (only when NOT editing and there are addresses) */}
           {/*} {!isEditing && savedAddresses.length > 0 && (
              <>
                <h5 style={{ color: "#00614A", marginBottom: 10, letterSpacing: "0.5px" }}>
                  Choose a saved address
                </h5>

                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddress?.id === addr.id;
                  return (
                    <Card
                      key={addr.id}
                      className="mb-2"
                      style={{
                        borderColor: isSelected ? "#00614A" : "#ddd",
                        boxShadow: isSelected ? `0 0 0 2px ${"#00614A"}30` : "none",
                        width:"500px"
                      }}
                    >
                      <Card.Body className="d-flex justify-content-between">
                        <div style={{ fontSize: 15 }}>
                          <Form.Check
                            type="radio"
                            name="savedAddress"
                            id={`addr-${addr.id}`}
                            checked={isSelected}
                            onChange={() => handleSelectAddress(addr)}
                            className="mb-2"
                            label={
                              <>
                                <strong>
                                  {addr.firstName} {addr.lastName}
                                </strong>
                                <br />
                                {addr.address1}
                                {addr.address2 ? `, ${addr.address2}` : ""}
                                <br />
                                {addr.city}, {addr.state} - {addr.pincode}
                                <br />
                                {addr.country}
                                <br />
                                Phone: {addr.phoneCode} {addr.phoneNumber}
                              </>
                            }
                          />
                        </div>

                        <div className="d-flex align-items-start gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleEditClick(addr)}
                            style={{ fontWeight: 600 }}
                          >
                            Edit
                          </Button>

                          <Button
                            className="ms-2"
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteAddress(addr.id)}
                            disabled={isLoading}
                            style={{ fontWeight: 600 }}
                          >
                            Delete
                          </Button>

                        </div>
                      </Card.Body>
                    </Card>
                  );
                })}

                {/* Current selection summary */}
                {/*{selectedAddress && (
                  <Card className="mt-3" style={{ borderColor: "#00614A" , width:"500px"}}>
                    <Card.Body>
                      <h6 style={{ color: "#00614A", marginBottom: 8, letterSpacing: "0.5px" }}>
                        Delivery Address
                      </h6>
                      <p style={{ margin: 0 }}>
                        {selectedAddress.firstName} {selectedAddress.lastName}
                        <br />
                        {selectedAddress.address1}
                        {selectedAddress.address2 ? `, ${selectedAddress.address2}` : ""}
                        <br />
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                        <br />
                        {selectedAddress.country}
                        <br />
                        Phone: {selectedAddress.phoneCode} {selectedAddress.phoneNumber}
                      </p>
                    </Card.Body>
                  </Card>
                )}
              </>
            )}

            {/* Address Form — show when editing OR no saved addresses */}
          {/*}  {(isEditing || savedAddresses.length === 0) && (
              <Card className="mt-3" style={{ borderColor: "#00614A", width:"500px" }}>
                <Card.Body>
                  <h5 style={{ color: "#00614A", letterSpacing: "0.5px" }}>
                    {editingAddressId ? "Edit Address" : "Add New Address"}
                  </h5>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Control
                          type="text"
                          className="mb-2"
                          placeholder="First Name"
                          name="firstName"
                          value={address.firstName}
                          onChange={handleChange}
                          required
                          style={{ fontFamily: font }}
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          className="mb-2"
                          placeholder="Last Name"
                          name="lastName"
                          value={address.lastName}
                          onChange={handleChange}
                          required
                          style={{ fontFamily: font }}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Select
                          className="mb-2"
                          name="phoneCode"
                          value={address.phoneCode}
                          onChange={handleChange}
                          style={{ fontFamily: font, color: "#00614A" }}
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
                          value={address.phoneNumber}
                          onChange={handleChange}
                          required
                          style={{ fontFamily: font }}
                        />
                      </Col>
                    </Row>

                    <Form.Control
                      className="mb-2"
                      placeholder="Address Line 1"
                      name="address1"
                      value={address.address1}
                      onChange={handleChange}
                      required
                      style={{ fontFamily: font }}
                    />
                    <Form.Control
                      className="mb-2"
                      placeholder="Address Line 2 (optional)"
                      name="address2"
                      value={address.address2}
                      onChange={handleChange}
                      style={{ fontFamily: font }}
                    />

                    <Row>
                      <Col md={6}>
                        <Form.Control
                          className="mb-2"
                          placeholder="City"
                          name="city"
                          value={address.city}
                          onChange={handleChange}
                          required
                          style={{ fontFamily: font }}
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          className="mb-2"
                          placeholder="State"
                          name="state"
                          value={address.state}
                          onChange={handleChange}
                          required
                          style={{ fontFamily: font }}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Control
                          className="mb-2"
                          placeholder="Pincode"
                          name="pincode"
                          value={address.pincode}
                          onChange={handleChange}
                          required
                          style={{ fontFamily: font }}
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          className="mb-2"
                          placeholder="Country"
                          name="country"
                          value={address.country}
                          onChange={handleChange}
                          required
                          style={{ fontFamily: font }}
                        />
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2 mt-2">
                      {savedAddresses.length > 0 && (
                        <Button
                          variant="outline-secondary"
                          onClick={handleCancel}
                          style={{ fontFamily: font }}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        variant="success"
                        type="submit"
                        disabled={isLoading}
                        style={{
                          backgroundColor: "#00614A",
                          borderColor: "#00614A",
                          fontFamily: font,
                          fontWeight: 700,
                        }}
                      >
                        {editingAddressId ? "Update Address" : "Save Address"}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Right: Order summary */}
         {/*} <Col md={4}>
            <Card style={{ padding: 20, backgroundColor: "#FBF9F4", borderColor: "#00614A" }}>
              <Button
                onClick={handlePayNow}
                style={{
                  width: "100%",
                  backgroundColor: "#00614A",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  padding: "12px",
                  letterSpacing: "1px",
                  fontFamily: font,
                }}
              >
                Deliver to this address
              </Button>

              <div className="mt-4" style={{ fontFamily: font, fontSize: 16, color: "#00614" }}>
                <p style={{ fontWeight: 700, marginBottom: 8 }}>Order Summary</p>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-start mb-3"
                    style={{ gap: 10, color: "#1c4931" }}
                  >
                    <div style={{ width: 70, flexShrink: 0 }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "100%", objectFit: "contain", borderRadius: 4 }}
                      />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <p className="mb-1" style={{ fontSize: 14, fontWeight: 600 }}>
                        {item.name}
                      </p>
                      <p className="mb-1" style={{ fontSize: 13, opacity: 0.8 }}>
                        Qty: {item.quantity}
                      </p>
                      <p className="mb-0" style={{ fontSize: 13 }}>
                        Price: ₹
                        {(
                          Number(item.discountedPrice || 0) * Number(item.quantity || 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <hr />
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
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
                <div className="d-flex justify-content-between" style={{ fontWeight: 700 }}>
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}*/}


{/*import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Checkout.css";

const API_BASE = "https://api.ravandurustores.com/";

// ---- discount helpers (whole-rupee off like 3% of 100 → ₹3) ----
const clampPct = (pct) => Math.min(100, Math.max(0, Number(pct || 0)));
const priceAfterPctWholeRupee = (base, pct, mode = "nearest") => {
  const b = Number(base) || 0;
  const p = clampPct(pct);
  const rawOff = (b * p) / 100;
  const off =
    mode === "floor" ? Math.floor(rawOff)
    : mode === "ceil" ? Math.ceil(rawOff)
    : Math.round(rawOff);
  return Math.max(0, b - off);
};

// fallback matching if cart doesn’t store variantId
const parseSelectedWeight = (str) => {
  if (!str) return null;
  const m = String(str).trim().match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
  if (!m) return null;
  return { qty: m[1].toLowerCase(), unit: m[2].toLowerCase() };
};
const norm = (v) => String(v || "").toLowerCase().replace(/\s+/g, "");

export default function Checkout() {
  const LOCAL_STORAGE_KEY = "savedAddresses";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.cartItems);

  // ---------- Address (local only; no Mongo id) ----------
  const [isEditing, setIsEditing] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]); // local-only list
  const [selectedIndex, setSelectedIndex] = useState(-1);   // index in savedAddresses
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [address, setAddress] = useState({
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
  const [saveAddress, setSaveAddress] = useState(false);

  const handleChange = (e) =>
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Load locally saved addresses on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      setSavedAddresses(arr);
      if (arr.length) {
        setSelectedIndex(arr.length - 1);
        setIsEditing(false);
      }
    } catch (e) {
      console.warn("Could not read local saved addresses", e);
    }
  }, []);

  const handleSelectIndex = (idx) => {
    setSelectedIndex(idx);
    const a = savedAddresses[idx];
    if (a) {
      setAddress({
        email: a.email || "",
        firstName: a.firstName || "",
        lastName: a.lastName || "",
        phoneCode: (a.phoneCode || "+91"),
        phoneNumber: a.phoneNumber || "",
        address1: a.address1 || "",
        address2: a.address2 || "",
        city: a.city || "",
        state: a.state || "",
        pincode: a.pincode || "",
        country: a.country || "India",
      });
      setIsEditing(false);
    }
  };

  const handleAddAddress = () => {
    setAddress({
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
    setSaveAddress(false);
    setIsEditing(true);
    setSelectedIndex(-1);
  };

  const handleEditCurrent = () => {
    if (selectedIndex < 0) return;
    setIsEditing(true);
  };

  const handleDeleteIndex = (idx) => {
    if (idx < 0) return;
    if (!window.confirm("Delete this address?")) return;
    const next = savedAddresses.filter((_, i) => i !== idx);
    setSavedAddresses(next);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
    if (selectedIndex === idx) {
      setSelectedIndex(-1);
      setIsEditing(true);
    } else if (selectedIndex > idx) {
      setSelectedIndex((i) => i - 1);
    }
  };

  const handleCancel = () => {
    if (selectedIndex >= 0) {
      handleSelectIndex(selectedIndex);
      setSaveAddress(false);
    } else {
      handleAddAddress();
    }
    setIsEditing(false);
  };

  const handleSubmitAddress = (e) => {
    e.preventDefault();
    if (!saveAddress) {
      alert("Please check 'Save address' to save the address locally.");
      return;
    }
    const next = [...savedAddresses];
    if (selectedIndex >= 0 && !isEditing) {
      // no-op
    } else if (selectedIndex >= 0 && isEditing) {
      // update existing
      next[selectedIndex] = { ...address };
    } else {
      // add new
      next.push({ ...address });
      setSelectedIndex(next.length - 1);
      setIsEditing(false);
    }
    setSavedAddresses(next);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
    alert("Address saved locally.");
  };

  // ---------- PRICING from backend ----------
  const [pricing, setPricing] = useState({});
  const [productsById, setProductsById] = useState({});
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setPricingLoading(true);
        setPricingError(null);

        const ids = [...new Set(cartItems.map((i) => i.id))];
        if (!ids.length) { setPricing({}); setProductsById({}); return; }

        // bulk fetch; fallback to per-id
        let products = null;
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
              if (!r.ok) throw new Error("Fetch product failed " + id);
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
            const base = Number(v.price ?? prod.price ?? prod.mrp ?? prod.originalPrice ?? 0);
            const final = pct > 0
              ? priceAfterPctWholeRupee(base, pct, "nearest")
              : Number(prod.discountPrice ?? base);
            map[`${prod._id}|${v._id}`] = {
              originalPrice: base,
              discountedPrice: final,
              discountPercentage: pct,
            };
          }
        }

        if (!mounted) return;
        setPricing(map);
        setProductsById(byId);
      } catch (e) {
        if (mounted) setPricingError(e.message || "Pricing error");
      } finally {
        if (mounted) setPricingLoading(false);
      }
    })();
    return () => { mounted = false; };
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
        const base = Number(match.price ?? prod.price ?? prod.mrp ?? prod.originalPrice ?? 0);
        const pct = clampPct(prod.discountPercentage);
        const final = pct > 0
          ? priceAfterPctWholeRupee(base, pct, "nearest")
          : Number(prod.discountPrice ?? base);
        return { originalPrice: base, discountedPrice: final, discountPercentage: pct };
      }
    }
    return { originalPrice: 0, discountedPrice: 0, discountPercentage: 0 };
  };


// ---------- totals (use BACKEND prices) ----------


// what the customer actually pays before tax/shipping
const subtotalDiscounted = useMemo(() => {
  return cartItems.reduce((sum, item) => {
    const q = parseInt(item.quantity) || 1;
    const info = getPriceInfo(item);
    const unit = Number( info.originalPrice || 0);
    return sum + unit * q;
  }, 0);
}, [cartItems, pricing, productsById]);

// rupee discount from items = (original - discounted) × qty
const itemsDiscount = useMemo(() => {
  return cartItems.reduce((sum, item) => {
    const q = parseInt(item.quantity) || 1;
    const info = getPriceInfo(item);
    const orig = Number(info.originalPrice) || 0;
    const disc = Number(info.discountedPrice ?? orig) || 0;
    return sum + Math.max(0, orig - disc) * q;
  }, 0);
}, [cartItems, pricing, productsById]);

const FREE_SHIPPING_THRESHOLD = 2000;
const shippingFee = subtotalDiscounted >= FREE_SHIPPING_THRESHOLD ? 0 : 50;

// GST on the discounted subtotal
const gst = subtotalDiscounted * 0.18;

// grand total
const uiTotal = (subtotalDiscounted-itemsDiscount) + shippingFee + gst;


  const itemsCount = (cartItems ?? []).reduce((n, it) => n + Number(it.quantity || 0), 0);
  const unlockLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalDiscounted);
  const badgeGap = Math.max(0, unlockLeft - shippingFee);
  const badgeGapDisplay = badgeGap === 0 && unlockLeft > 0 ? 1 : badgeGap;

  // ---------- Order payload (NO Mongo id) ----------
  const shippingAddressFromState = () => ({
    firstName: address.firstName,
    lastName: address.lastName,
    email: address.email,
    mobileNumber: `${address.phoneCode || "+91"}${address.phoneNumber || ""}`,
    state: address.state,
    city: address.city,
    address: `${address.address1 || ""} ${address.address2 || ""}`.trim(),
    pincode: address.pincode,
    country: address.country || "India",
  });

  const shippingAddressFromSelected = () => {
    if (selectedIndex < 0 || !savedAddresses[selectedIndex]) return shippingAddressFromState();
    const a = savedAddresses[selectedIndex];
    return {
      firstName: a.firstName,
      lastName: a.lastName,
      email: a.email,
      mobileNumber: `${a.phoneCode || "+91"}${a.phoneNumber || ""}`,
      state: a.state,
      city: a.city,
      address: `${a.address1 || ""} ${a.address2 || ""}`.trim(),
      pincode: a.pincode,
      country: a.country || "India",
    };
  };

  const cartToApiItems = (items = []) =>
    (items || []).map((item) => {
      const info = getPriceInfo(item);
      const unit = Number(info.discountedPrice || info.originalPrice || 0);
      return {
        productId: item.id,                    // identifier you already use
        variantId: item.variantId || null,     // optional
        productName: item.name || "",
        productImage: item.image || "",
        price: unit,                           // backend-priced
        quantity: Math.max(1, Number(item.quantity) || 1),
      };
    });

 // Helper: create address on backend and return its id
const createAddress = async (addr) => {
  const res = await fetch(`${API_BASE}/api/addresses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(addr),
  });
  const txt = await res.text().catch(() => "");
  let json; try { json = txt ? JSON.parse(txt) : null; } catch { json = null; }
  if (!res.ok) {
    const msg = json?.error || json?.message || txt || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json?._id || json?.id; // Get backend-generated ID
};

const handlePayNow = async () => {
  if (isLoading) return;
  if (!cartItems || cartItems.length === 0) {
    alert("Your cart is empty. Please add items to proceed.");
    navigate("/best-seller");
    return;
  }

  // Validate address
  const addr = selectedIndex >= 0 ? shippingAddressFromSelected() : shippingAddressFromState();
  const hasAddress = addr.email && addr.firstName && addr.lastName &&
                     addr.address && addr.city && addr.state && addr.pincode && addr.country;
  if (!hasAddress) {
    alert("Please select or add a valid address before proceeding to payment.");
    return;
  }

  setIsLoading(true);
  try {
    // 1) Save address to backend and get ID
    const addressId = await createAddress(addr);

    // 2) Map items
    const items = cartToApiItems(cartItems);
    const amount = uiTotal;

    // 3) Match backend structure
    const orderPayload = {
      addressId,                     // ✅ Use addressId
      amount: Number(amount.toFixed(2)),
      paymentMode: "UPI",
      items,
    };

    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const txt = await res.text().catch(() => "");
    let json; try { json = txt ? JSON.parse(txt) : null; } catch { json = null; }
    if (!res.ok) {
      const msg = json?.error || json?.message || txt || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    alert("Order placed successfully!");
    dispatch({ type: "cart/clearCart" });
    navigate("/thankyou", { replace: true, state: { email: addr.email } });
  } catch (e) {
    console.error("Order API error:", e);
    alert(e.message || "An error occurred while placing your order.");
  } finally {
    setIsLoading(false);
  }
};



  return (
    <Container className="checkout">
      <Row className="gx-4">
        {/* LEFT */}
      {/*}  <Col md={8}>
          <div className="infoBar">
            <span className={`pill ${unlockLeft > 0 ? "pill-warn" : "pill-success"}`} style={{ fontFamily: "poppins" }}>
              <span className={`badge ${unlockLeft > 0 ? "badge-warn" : "badge-success"}`}>
                {unlockLeft > 0 ? "Almost there" : "Unlocked"}
              </span>
              {unlockLeft > 0
                ? <>Add ₹{badgeGapDisplay.toLocaleString("en-IN")} more to unlock FREE delivery</>
                : <>FREE delivery unlocked!</>}
            </span>
            <span style={{ fontFamily: "poppins" }}>
              Shipping ₹{(subtotalDiscounted >= FREE_SHIPPING_THRESHOLD ? 0 : 50).toLocaleString("en-IN")} if not unlocked
            </span>
          </div>

          {/* Bag */}
        {/*}  <Card className="bagCard">
            <div className="bagHeader">
              <h5 style={{ fontFamily: "poppins" }}>Your Bag ({itemsCount})</h5>
              <div className="subtotal" style={{ fontFamily: "poppins" }}>
                Subtotal: <b>₹{subtotalDiscounted.toFixed(2)}</b>
              </div>
            </div>

            {pricingLoading && <div className="px-3 pb-2 text-muted">Updating prices…</div>}
            {pricingError && <div className="px-3 pb-2 text-danger">{pricingError}</div>}

            <div className="bagList">
              {(cartItems ?? []).map((ci) => {
                const q = Number(ci.quantity) || 1;
                const info = getPriceInfo(ci);
                const unit = Number( info.originalPrice || 0);
                const line = unit * q;
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

          {/* Delivery Address */}
       {/*}   <div className="sectionHeader">
            <h4 style={{ fontFamily: "poppins" }}>Delivery Address</h4>
            <Button variant="success" size="sm" className="addNew" onClick={handleAddAddress} style={{ fontFamily: "poppins" }}>
              + Add New
            </Button>
          </div>

          {/* Saved addresses (local) */}
        {/*}  {!isEditing && savedAddresses.length > 0 && (
            <div className="addressList">
              {savedAddresses.map((a, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <div className={`addrCard ${isSelected ? "selected" : ""}`} key={`addr-${idx}`}>
                    <div className="addrTop">
                      <div className="left">
                        <label className="radio">
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={isSelected}
                            onChange={() => handleSelectIndex(idx)}
                          />
                          <span />
                        </label>
                        <div className="addrName">{a.firstName} {a.lastName}</div>
                        {!isSelected && <span className="deliverTag" style={{ fontFamily: "poppins" }}>Deliver here</span>}
                      </div>
                      <div className="right">
                        <button className="chip" onClick={handleEditCurrent} style={{ fontFamily: "poppins" }}>
                          Edit
                        </button>
                        <button
                          className="chip danger"
                          style={{ backgroundColor: "red", color: "#fff", fontFamily: "poppins", marginLeft: 5 }}
                          onClick={() => handleDeleteIndex(idx)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="addrBody">
                      <div className="line" style={{ fontFamily: "poppins" }}>
                        {`${a.address1 || ""} ${a.address2 || ""}`.trim()}
                      </div>
                      <div className="line" style={{ fontFamily: "poppins" }}>
                        {a.city}, {a.state} - {a.pincode}
                      </div>
                      <div className="line" style={{ fontFamily: "poppins" }}>
                        Phone: {(a.phoneCode || "+91")}{a.phoneNumber}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Address Form */}
          {/*{(isEditing || savedAddresses.length === 0) && (
            <Card className="addrFormCard">
              <Card.Body>
                <h5 style={{ fontFamily: "poppins" }} className="mb-3">
                  {selectedIndex >= 0 ? "Edit Address" : "Add New Address"}
                </h5>
                <Form onSubmit={handleSubmitAddress}>
                  <Form.Control type="email" className="mb-2" placeholder="Email" name="email"
                    value={address.email} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                  <Row>
                    <Col md={6}>
                      <Form.Control className="mb-2" placeholder="First Name" name="firstName"
                        value={address.firstName} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                    </Col>
                    <Col md={6}>
                      <Form.Control className="mb-2" placeholder="Last Name" name="lastName"
                        value={address.lastName} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                    </Col>
                  </Row>

                  <Form.Control className="mb-2" placeholder="Phone Number" name="phoneNumber"
                    value={address.phoneNumber} onChange={handleChange} required style={{ fontFamily: "poppins" }} />

                  <Form.Control className="mb-2" placeholder="Address Line 1" name="address1"
                    value={address.address1} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                  <Form.Control className="mb-2" placeholder="Address Line 2" name="address2"
                    value={address.address2} onChange={handleChange} style={{ fontFamily: "poppins" }} />

                  <Row>
                    <Col md={6}>
                      <Form.Control className="mb-2" placeholder="City" name="city"
                        value={address.city} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                    </Col>
                    <Col md={6}>
                      <Form.Control className="mb-2" placeholder="State" name="state"
                        value={address.state} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Control className="mb-2" placeholder="Pincode" name="pincode"
                        value={address.pincode} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                    </Col>
                    <Col md={6}>
                      <Form.Control className="mb-2" placeholder="Country" name="country"
                        value={address.country} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                    </Col>
                  </Row>

                  <div className="formRow">
                    <Form.Check
                      type="checkbox"
                      label="Save this address locally"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      style={{ fontFamily: "poppins" }}
                    />
                    <div className="gap" />
                    {selectedIndex >= 0 && (
                      <Button variant="outline-secondary" onClick={handleCancel} style={{ fontFamily: "poppins" }}>
                        Cancel
                      </Button>
                    )}
                    <Button className="btnPrimary" type="submit" disabled={isLoading} style={{ fontFamily: "poppins" }}>
                      {selectedIndex >= 0 ? "Update Address" : "Save Address"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* RIGHT */}
       {/*} <Col md={4}>
          <Card className="orderCard sticky">
            <div className="orderHeader" style={{ fontFamily: "poppins" }}>
              Order Details
            </div>

            <div className="orderRows">
              <div className="rowLine" style={{ fontFamily: "poppins" }}>
                <span>Items Subtotal</span>
                <span>₹ {subtotalDiscounted.toFixed(2)}</span>
              </div>
             
                <div className="rowLine" style={{ fontFamily: "poppins" }}>
                    <span>Discount:</span>
  <span>₹{itemsDiscount.toFixed(2)}</span>
                </div>
             
              <div className="rowLine" style={{ fontFamily: "poppins" }}>
                <span>Shipping</span>
                <span>₹{(subtotalDiscounted >= FREE_SHIPPING_THRESHOLD ? 0 : 50).toLocaleString("en-IN")}</span>
              </div>
              <div className="rowLine" style={{ fontFamily: "poppins" }}>
                <span>GST (18%)</span>
                <span>₹{subtotalDiscounted * 0.18}</span>
              </div>
            </div>

            <div className="totalRow">
              <span style={{ fontFamily: "poppins" }}>Total</span>
              <span style={{ fontFamily: "poppins" }}>
                ₹{uiTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <Button className="payBtn" onClick={handlePayNow} disabled={isLoading} style={{ fontFamily: "poppins" }}>
              {isLoading ? "Processing..." : `Pay ₹${uiTotal.toLocaleString("en-IN")}`}
            </Button>

            <div className="orderNote" style={{ fontFamily: "poppins" }}>
              Secure payments • Easy returns • Fast support
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}*/}


import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Checkout.css";

const API_BASE = "https://api.ravandurustores.com";

// ---- discount helpers (whole-rupee off like 3% of 100 → ₹3) ----
const clampPct = (pct) => Math.min(100, Math.max(0, Number(pct || 0)));
const priceAfterPctWholeRupee = (base, pct, mode = "nearest") => {
  const b = Number(base) || 0;
  const p = clampPct(pct);
  const rawOff = (b * p) / 100;
  const off =
    mode === "floor" ? Math.floor(rawOff)
    : mode === "ceil" ? Math.ceil(rawOff)
    : Math.round(rawOff);
  return Math.max(0, b - off);
};

// fallback matching if cart doesn’t store variantId
const parseSelectedWeight = (str) => {
  if (!str) return null;
  const m = String(str).trim().match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
  if (!m) return null;
  return { qty: m[1].toLowerCase(), unit: m[2].toLowerCase() };
};
const norm = (v) => String(v || "").toLowerCase().replace(/\s+/g, "");

export default function Checkout() {
  const LOCAL_STORAGE_KEY = "savedAddresses";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.cartItems);

  // ---------- Address (local only; no Mongo id) ----------
  const [isEditing, setIsEditing] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]); // local-only list
  const [selectedIndex, setSelectedIndex] = useState(-1);   // index in savedAddresses
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [address, setAddress] = useState({
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
  const [saveAddress, setSaveAddress] = useState(false);

  const handleChange = (e) =>
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Load locally saved addresses on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      setSavedAddresses(arr);
      if (arr.length) {
        setSelectedIndex(arr.length - 1);
        setIsEditing(false);
      }
    } catch (e) {
      console.warn("Could not read local saved addresses", e);
    }
  }, []);

  const handleSelectIndex = (idx) => {
    setSelectedIndex(idx);
    const a = savedAddresses[idx];
    if (a) {
      setAddress({
        email: a.email || "",
        firstName: a.firstName || "",
        lastName: a.lastName || "",
        phoneCode: (a.phoneCode || "+91"),
        phoneNumber: a.phoneNumber || "",
        address1: a.address1 || "",
        address2: a.address2 || "",
        city: a.city || "",
        state: a.state || "",
        pincode: a.pincode || "",
        country: a.country || "India",
      });
      setIsEditing(false);
    }
  };

  const handleAddAddress = () => {
    setAddress({
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
    setSaveAddress(false);
    setIsEditing(true);
    setSelectedIndex(-1);
  };

  const handleEditCurrent = () => {
    if (selectedIndex < 0) return;
    setIsEditing(true);
  };

  const handleDeleteIndex = (idx) => {
    if (idx < 0) return;
    if (!window.confirm("Delete this address?")) return;
    const next = savedAddresses.filter((_, i) => i !== idx);
    setSavedAddresses(next);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
    if (selectedIndex === idx) {
      setSelectedIndex(-1);
      setIsEditing(true);
    } else if (selectedIndex > idx) {
      setSelectedIndex((i) => i - 1);
    }
  };

  const handleCancel = () => {
    if (selectedIndex >= 0) {
      handleSelectIndex(selectedIndex);
      setSaveAddress(false);
    } else {
      handleAddAddress();
    }
    setIsEditing(false);
  };

  const handleSubmitAddress = (e) => {
    e.preventDefault();
    if (!saveAddress) {
      alert("Please check 'Save address' to save the address locally.");
      return;
    }
    const next = [...savedAddresses];
    if (selectedIndex >= 0 && !isEditing) {
      // no-op
    } else if (selectedIndex >= 0 && isEditing) {
      // update existing
      next[selectedIndex] = { ...address };
    } else {
      // add new
      next.push({ ...address });
      setSelectedIndex(next.length - 1);
      setIsEditing(false);
    }
    setSavedAddresses(next);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
    alert("Address saved locally.");
  };

  // ---------- PRICING from backend ----------
  const [pricing, setPricing] = useState({});
  const [productsById, setProductsById] = useState({});
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setPricingLoading(true);
        setPricingError(null);

        const ids = [...new Set(cartItems.map((i) => i.id))];
        if (!ids.length) { setPricing({}); setProductsById({}); return; }

        // bulk fetch; fallback to per-id
        let products = null;
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
              if (!r.ok) throw new Error("Fetch product failed " + id);
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
            const base = Number(v.price ?? prod.price ?? prod.mrp ?? prod.originalPrice ?? 0);
            const final = pct > 0
              ? priceAfterPctWholeRupee(base, pct, "nearest")
              : Number(prod.discountPrice ?? base);
            map[`${prod._id}|${v._id}`] = {
              originalPrice: base,
              discountedPrice: final,
              discountPercentage: pct,
            };
          }
        }

        if (!mounted) return;
        setPricing(map);
        setProductsById(byId);
      } catch (e) {
        if (mounted) setPricingError(e.message || "Pricing error");
      } finally {
        if (mounted) setPricingLoading(false);
      }
    })();
    return () => { mounted = false; };
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
        const base = Number(match.price ?? prod.price ?? prod.mrp ?? prod.originalPrice ?? 0);
        const pct = clampPct(prod.discountPercentage);
        const final = pct > 0
          ? priceAfterPctWholeRupee(base, pct, "nearest")
          : Number(prod.discountPrice ?? base);
        return { originalPrice: base, discountedPrice: final, discountPercentage: pct };
      }
    }
    return { originalPrice: 0, discountedPrice: 0, discountPercentage: 0 };
  };

  // ---------- totals (use BACKEND prices) ----------
  // what the customer actually pays before tax/shipping (sum of originalPrice × qty)
  const subtotalDiscounted = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const q = parseInt(item.quantity) || 1;
      const info = getPriceInfo(item);
      const unit = Number(info.originalPrice || 0);
      return sum + unit * q;
    }, 0);
  }, [cartItems, pricing, productsById]);

  // rupee discount from items = (original - discounted) × qty
  const itemsDiscount = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const q = parseInt(item.quantity) || 1;
      const info = getPriceInfo(item);
      const orig = Number(info.originalPrice) || 0;
      const disc = Number(info.discountedPrice ?? orig) || 0;
      return sum + Math.max(0, orig - disc) * q;
    }, 0);
  }, [cartItems, pricing, productsById]);

  const FREE_SHIPPING_THRESHOLD = 2000;
  const shippingFee = subtotalDiscounted >= FREE_SHIPPING_THRESHOLD ? 0 : 50;

  // GST on the discounted subtotal (your original logic used subtotalDiscounted)
  const gst = subtotalDiscounted * 0.18;

  // grand total
  const uiTotal = (subtotalDiscounted - itemsDiscount) + shippingFee + gst;

  const itemsCount = (cartItems ?? []).reduce((n, it) => n + Number(it.quantity || 0), 0);
  const unlockLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalDiscounted);
  const badgeGap = Math.max(0, unlockLeft - shippingFee);
  const badgeGapDisplay = badgeGap === 0 && unlockLeft > 0 ? 1 : badgeGap;

  // ---------- Address helpers ----------
  const shippingAddressFromState = () => ({
    firstName: address.firstName,
    lastName: address.lastName,
    email: address.email,
    mobileNumber: `${address.phoneCode || "+91"}${address.phoneNumber || ""}`,
    state: address.state,
    city: address.city,
    address: `${address.address1 || ""} ${address.address2 || ""}`.trim(),
    pincode: address.pincode,
    country: address.country || "India",
  });

  const shippingAddressFromSelected = () => {
    if (selectedIndex < 0 || !savedAddresses[selectedIndex]) return shippingAddressFromState();
    const a = savedAddresses[selectedIndex];
    return {
      firstName: a.firstName,
      lastName: a.lastName,
      email: a.email,
      mobileNumber: `${a.phoneCode || "+91"}${a.phoneNumber || ""}`,
      state: a.state,
      city: a.city,
      address: `${a.address1 || ""} ${a.address2 || ""}`.trim(),
      pincode: a.pincode,
      country: a.country || "India",
    };
  };

  const cartToApiItems = (items = []) =>
    (items || []).map((item) => {
      const info = getPriceInfo(item);
      const unit = Number(info.discountedPrice || info.originalPrice || 0);
      return {
        productId: item.id,
        variantId: item.variantId || null,
        productName: item.name || "",
        productImage: item.image || "",
        price: unit,
        quantity: Math.max(1, Number(item.quantity) || 1),
      };
    });

  // ---------- NO PAYMENT GATEWAY: Save review & go to Thank You ----------
  const handlePayNow = async () => {
    if (isLoading) return;
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed.");
      navigate("/best-seller");
      return;
    }

    // Validate address (selected or form)
    const addr = selectedIndex >= 0 ? shippingAddressFromSelected() : shippingAddressFromState();
    const hasAddress = addr.email && addr.firstName && addr.lastName &&
                       addr.address && addr.city && addr.state && addr.pincode && addr.country;
    if (!hasAddress) {
      alert("Please select or add a valid address before proceeding.");
      return;
    }

    setIsLoading(true);
    try {
      const items = cartToApiItems(cartItems);

      const orderReview = {
        items,
        totals: {
          itemsSubtotal: Number(subtotalDiscounted.toFixed(2)),
          itemsDiscount: Number(itemsDiscount.toFixed(2)),
          shipping: shippingFee,
          gst: Number(gst.toFixed(2)),
          grandTotal: Number(uiTotal.toFixed(2)),
        },
        address: addr, // store full address snapshot locally
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("orderReview", JSON.stringify(orderReview));

      // Clear cart if you want to mirror a placed order (optional). Keeping as-is from your previous success path:
      dispatch({ type: "cart/clearCart" });

      navigate("/thankyou", { replace: true, state: { email: addr.email } });
    } catch (e) {
      console.error("Local order review error:", e);
      alert("Something went wrong while preparing your order.");
    } finally {
      setIsLoading(false);
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
              {unlockLeft > 0
                ? <>Add ₹{badgeGapDisplay.toLocaleString("en-IN")} more to unlock FREE delivery</>
                : <>FREE delivery unlocked!</>}
            </span>
            <span style={{ fontFamily: "poppins" }}>
              Shipping ₹{(subtotalDiscounted >= FREE_SHIPPING_THRESHOLD ? 0 : 50).toLocaleString("en-IN")} if not unlocked
            </span>
          </div>

          {/* Bag */}
          <Card className="bagCard">
            <div className="bagHeader">
              <h5 style={{ fontFamily: "poppins" }}>Your Bag ({itemsCount})</h5>
              <div className="subtotal" style={{ fontFamily: "poppins" }}>
                Subtotal: <b>₹{subtotalDiscounted.toFixed(2)}</b>
              </div>
            </div>

            {pricingLoading && <div className="px-3 pb-2 text-muted">Updating prices…</div>}
            {pricingError && <div className="px-3 pb-2 text-danger">{pricingError}</div>}

            <div className="bagList">
              {(cartItems ?? []).map((ci) => {
                const q = Number(ci.quantity) || 1;
                const info = getPriceInfo(ci);
                const unit = Number(info.originalPrice || 0);
                const line = unit * q;
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

          {/* Delivery Address */}
          <div className="sectionHeader">
            <h4 style={{ fontFamily: "poppins" }}>Delivery Address</h4>
            <Button variant="success" size="sm" className="addNew" onClick={handleAddAddress} style={{ fontFamily: "poppins" }}>
              + Add New
            </Button>
          </div>

          {/* Saved addresses (local) */}
          {!isEditing && savedAddresses.length > 0 && (
            <div className="addressList">
              {savedAddresses.map((a, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <div className={`addrCard ${isSelected ? "selected" : ""}`} key={`addr-${idx}`}>
                    <div className="addrTop">
                      <div className="left">
                        <label className="radio">
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={isSelected}
                            onChange={() => handleSelectIndex(idx)}
                          />
                          <span />
                        </label>
                        <div className="addrName">{a.firstName} {a.lastName}</div>
                        {!isSelected && <span className="deliverTag" style={{ fontFamily: "poppins" }}>Deliver here</span>}
                      </div>
                      <div className="right">
                        <button className="chip" onClick={handleEditCurrent} style={{ fontFamily: "poppins" }}>
                          Edit
                        </button>
                        <button
                          className="chip danger"
                          style={{ backgroundColor: "red", color: "#fff", fontFamily: "poppins", marginLeft: 5 }}
                          onClick={() => handleDeleteIndex(idx)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="addrBody">
                      <div className="line" style={{ fontFamily: "poppins" }}>
                        {`${a.address1 || ""} ${a.address2 || ""}`.trim()}
                      </div>
                      <div className="line" style={{ fontFamily: "poppins" }}>
                        {a.city}, {a.state} - {a.pincode}
                      </div>
                      <div className="line" style={{ fontFamily: "poppins" }}>
                        Phone: {(a.phoneCode || "+91")}{a.phoneNumber}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Address Form */}
          {(isEditing || savedAddresses.length === 0) && (
            <Card className="addrFormCard">
              <Card.Body>
                <h5 style={{ fontFamily: "poppins" }} className="mb-3">
                  {selectedIndex >= 0 ? "Edit Address" : "Add New Address"}
                </h5>
                <Form onSubmit={handleSubmitAddress}>
                  <Form.Control type="email" className="mb-2" placeholder="Email" name="email"
                    value={address.email} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                  <Row>
                    <Col md={6}>
                      <Form.Control className="mb-2" placeholder="First Name" name="firstName"
                        value={address.firstName} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                    </Col>
                    <Col md={6}>
                      <Form.Control className="mb-2" placeholder="Last Name" name="lastName"
                        value={address.lastName} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                    </Col>
                  </Row>

                  <Form.Control className="mb-2" placeholder="Phone Number" name="phoneNumber"
                    value={address.phoneNumber} onChange={handleChange} required style={{ fontFamily: "poppins" }} />

                  <Form.Control className="mb-2" placeholder="Address Line 1" name="address1"
                    value={address.address1} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                  <Form.Control className="mb-2" placeholder="Address Line 2" name="address2"
                    value={address.address2} onChange={handleChange} style={{ fontFamily: "poppins" }} />

                  <Row>
                    <Col md={6}>
                      <Form.Control className="mb-2" placeholder="City" name="city"
                        value={address.city} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                    </Col>
                    <Col md={6}>
                      <Form.Control className="mb-2" placeholder="State" name="state"
                        value={address.state} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Control className="mb-2" placeholder="Pincode" name="pincode"
                        value={address.pincode} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                    </Col>
                    <Col md={6}>
                      <Form.Control className="mb-2" placeholder="Country" name="country"
                        value={address.country} onChange={handleChange} required style={{ fontFamily: "poppins" }} />
                    </Col>
                  </Row>

                  <div className="formRow">
                    <Form.Check
                      type="checkbox"
                      label="Save this address locally"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      style={{ fontFamily: "poppins" }}
                    />
                    <div className="gap" />
                    {selectedIndex >= 0 && (
                      <Button variant="outline-secondary" onClick={handleCancel} style={{ fontFamily: "poppins" }}>
                        Cancel
                      </Button>
                    )}
                    <Button className="btnPrimary" type="submit" disabled={isLoading} style={{ fontFamily: "poppins" }}>
                      {selectedIndex >= 0 ? "Update Address" : "Save Address"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
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
                <span>₹ {subtotalDiscounted.toFixed(2)}</span>
              </div>

              <div className="rowLine" style={{ fontFamily: "poppins" }}>
                <span>Discount:</span>
                <span>₹{itemsDiscount.toFixed(2)}</span>
              </div>

              <div className="rowLine" style={{ fontFamily: "poppins" }}>
                <span>Shipping</span>
                <span>₹{(subtotalDiscounted >= FREE_SHIPPING_THRESHOLD ? 0 : 50).toLocaleString("en-IN")}</span>
              </div>
              <div className="rowLine" style={{ fontFamily: "poppins" }}>
                <span>GST (18%)</span>
                <span>₹{(subtotalDiscounted * 0.18).toFixed(2)}</span>
              </div>
            </div>

            <div className="totalRow">
              <span style={{ fontFamily: "poppins" }}>Total</span>
              <span style={{ fontFamily: "poppins" }}>
                ₹{uiTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <Button className="payBtn" onClick={handlePayNow} disabled={isLoading} style={{ fontFamily: "poppins" }}>
              {isLoading ? "Processing..." : `Pay ₹${uiTotal.toLocaleString("en-IN")}`}
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





