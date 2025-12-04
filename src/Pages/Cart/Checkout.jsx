{/*import React, { useEffect, useState } from "react";
{/*import {
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


{/*import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
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
 {/*} const handlePayNow = async () => {
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
  };*/}

 {/*} const handlePayNow = async () => {
  // Guard rails for invalid cart or address
  if (!cartItems || cartItems.length === 0) {
    alert("Your cart is empty. Please add items to proceed.");
    navigate("/best-seller"); // redirect to categories
    return;
  }

  if (!selectedAddress || !selectedAddress._id) {
    alert("Please select or add a valid address before proceeding to payment.");
    return;
  }

  setIsLoading(true);

  try {
    // Prepare the items array for payment initiation
    const items = cartToApiItems(cartItems);

    // Calculate the total amount
    const computedSubtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const shippingFee = 0;
    const taxAmount = computedSubtotal * 0;
    const grandTotal = computedSubtotal + shippingFee + taxAmount;

    // Initiate the payment
    const res = await fetch(`${API_BASE}/api/payment/initiate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
        amount: grandTotal, // for testing, replace with grandTotal later
        callbackUrl: "https://ravandurustores.com//thankyou", 
        items,
        addressId: selectedAddress._id, 
      })
  });

    // ✅ Adjust to use merchantTransactionId
    const redirectUrl = paymentResponse.data?.phonepeResponse?.redirectUrl;
    const orderId = 
      paymentResponse.data?.phonepeResponse?.orderId || 
      paymentResponse.data?.phonepeResponse?.merchantTransactionId;

    if (redirectUrl && orderId) {
      // Save order details
      localStorage.setItem(
        "orderDetails",
        JSON.stringify({
          items,
          grandTotal,
          addressId: selectedAddress._id,
          orderId,
        })
      );
      // Redirect to PhonePe payment page
      window.location.href = redirectUrl;
    } else {
      setIsLoading(false);
      alert("Payment initiation failed. No redirect URL.");
    }
  } catch (err) {
    console.error("Payment initiation error:", err.response?.data || err);
    setIsLoading(false);
    alert("Error initiating payment.");
  }
};*/}

{/*const handlePayNow = async () => {
  // Guard rails for invalid cart
  if (!cartItems || cartItems.length === 0) {
    alert("Your cart is empty. Please add items to proceed.");
    navigate("/best-seller");
    return;
  }

  // Use selected saved address or the form snapshot
  const addr =
    selectedIndex >= 0 ? shippingAddressFromSelected() : shippingAddressFromState();

  const hasAddress =
    addr.email &&
    addr.firstName &&
    addr.lastName &&
    addr.address &&
    addr.city &&
    addr.state &&
    addr.pincode &&
    addr.country;

  if (!hasAddress) {
    alert("Please select or add a valid address before proceeding.");
    return;
  }

  setIsLoading(true);
  try {
    // Items in the shape your API expects for payment preview
    const items = cartToApiItems(cartItems);

    // Use your UI grand total (already includes discount, shipping, GST)
    const grandTotal = Number(uiTotal.toFixed(2));

    // Initiate payment
    const res = await fetch(`${API_BASE}/api/payments/initiate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: grandTotal, // if your gateway expects paise, multiply by 100 here
        callbackUrl: "https://ravandurustores.com//thankyou",
        items,
        // no addressId—we’re using local-only addresses; send a snapshot instead
        shippingAddress: addr,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Payment init failed (${res.status}). ${text}`);
    }

    const paymentResponse = await res.json().catch(() => ({}));

    // Common shapes supported (adjust if your backend returns different keys)
    const redirectUrl =
      paymentResponse?.redirectUrl ||
      paymentResponse?.data?.redirectUrl ||
      paymentResponse?.phonepeResponse?.redirectUrl;

    const orderId =
      paymentResponse?.orderId ||
      paymentResponse?.merchantTransactionId ||
      paymentResponse?.data?.orderId ||
      paymentResponse?.data?.merchantTransactionId ||
      paymentResponse?.phonepeResponse?.orderId ||
      paymentResponse?.phonepeResponse?.merchantTransactionId;

    if (redirectUrl && orderId) {
      // Save a snapshot for post-payment success page
      localStorage.setItem(
        "orderDetails",
        JSON.stringify({
          items,
          grandTotal,
          address: addr,
          orderId,
          createdAt: new Date().toISOString(),
        })
      );

      // Clear cart if you want to mirror a placed order
      dispatch({ type: "cart/clearCart" });

      // Redirect to gateway
      window.location.assign(redirectUrl);
      return;
    }

    // Fallback: if no redirect URL present
    alert("Payment initiation succeeded but no redirect URL was returned.");
  } catch (err) {
    console.error("Payment initiation error:", err);
    alert("Error initiating payment. Please try again.");
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
        {/*}  <div className="sectionHeader">
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
        {/*}  {(isEditing || savedAddresses.length === 0) && (
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
      {/*}  <Col md={4}>
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
}*/}


// src/pages/checkout/Checkout.jsx

/*import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";


import "./Checkout.css";

const API_BASE = "https://api.ravandurustores.com";

// ---------- Small helpers ----------
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

// Split a combined mobile number into code + number, defaulting to +91
function splitMobile(mobile = "") {
  const candidates = ["+91", "+1", "+44", "+61", "+81"];
  const code = candidates.find((c) => mobile.startsWith(c)) || "+91";
  return { phoneCode: code, phoneNumber: mobile.replace(code, "") };
}

// Split a single-line address into address1 / address2 (loosely)
function splitAddress(line = "") {
  if (!line) return { address1: "", address2: "" };
  const [first, ...rest] = line.split(",").map((s) => s.trim());
  return { address1: first || "", address2: rest.join(", ") || "" };
}

/** Decode a JWT and return its payload (best-effort, no crypto). */
/*function decodeJwtPayload(token = "") {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json && typeof json === "object" ? json : null;
  } catch {
    return null;
  }
}

/** Read the current auth user from localStorage token or 'user' object. */
{/*function getAuthUser() {
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

// ---------- Auth header helper (adjust if only cookies are used) ----------
function authHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.cartItems);

  // ---------- SERVER ADDRESSES ----------
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

  // Fetch addresses on mount (robust, filtered to logged-in user)
  useEffect(() => {
    let mounted = true;

    async function loadAddresses() {
      setAddrLoading(true);
      setAddrError("");

      try {
        const token = localStorage.getItem("token") || "";
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const url = `${API_BASE}/api/addresses`;

        const res = await fetch(url, {
          method: "GET",
          headers,
          // credentials: "include", // keep disabled unless cookies + proper CORS
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

        // 🔐 Filter to current user's addresses only
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

            const idMatch = uid && aUid && aUid === uid; // best match
            const emailMatch = email && aEmail && aEmail === email; // fallback

            return idMatch || emailMatch;
          });
        }

        if (!mounted) return;

        setAddresses(mine);

        // Prefer a "default" address if your schema has it; else pick last
        const preferred =
          mine.find((x) => x.isDefault || x.default) || mine[mine.length - 1];

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

  // Create new address on the server
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

    // Map form -> backend schema
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

      // After successful POST, re-fetch the list and select the newly added one
      const listRes = await fetch(`${API_BASE}/api/addresses`, {
        method: "GET",
        headers: authHeaders(),
        // NOTE: do NOT set credentials: "include" unless your server
        // sets ACAO to your origin (not *) AND Access-Control-Allow-Credentials: true
      });

      if (listRes.ok) {
        const data = await listRes.json();
        const arr =
          (Array.isArray(data) && data) ||
          (Array.isArray(data?.addresses) && data.addresses) ||
          (Array.isArray(data?.data) && data.data) ||
          (Array.isArray(data?.items) && data.items) ||
          [];

        // Re-apply same user filtering on refreshed list
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
            const idMatch = uid && aUid && aUid === uid;
            const emailMatch = email && aEmail && aEmail === email;
            return idMatch || emailMatch;
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

  // ---------- PRICING (backend-aligned) ----------
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

  // ---------- Totals ----------
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

  // Convert Redux cartItems → backend API items for payment
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

  // ---------- Payment using SELECTED BACKEND ADDRESS ----------
const handlePayNow = async () => {
  // Guard rails for invalid cart or address
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
    // Prepare the items array for payment initiation
    const items = cartToApiItems(cartItems);

    // Calculate the total amount
    const computedSubtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const shippingFee = 0;
    const taxAmount = 0;
    const grandTotal = computedSubtotal + shippingFee + taxAmount;

    // Initiate the payment
    const res = await fetch("https://api.ravandurustores.com/api/payments/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: grandTotal,
        callbackUrl: "https://ravandurustores.com/thankyou", 
        items,
        addressId: selectedAddress._id,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP error ${res.status}`);
    }

    const paymentResponse = await res.json();
    console.log("Payment API Response:", paymentResponse);

    // ✅ Use merchantTransactionId if orderId missing
    const redirectUrl = paymentResponse?.phonepeResponse?.redirectUrl;
    const orderId =
      paymentResponse?.phonepeResponse?.orderId ||
      paymentResponse?.phonepeResponse?.merchantTransactionId;

    if (redirectUrl && orderId) {
      // Save order details
      localStorage.setItem(
        "orderDetails",
        JSON.stringify({
          items,
          grandTotal,
          addressId: selectedAddress._id,
          orderId,
        })
      );
      // Redirect to PhonePe payment page
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
        {/*<Col md={8}>
          <div className="infoBar">
            <span
              className={`pill ${unlockLeft > 0 ? "pill-warn" : "pill-success"}`}
              style={{ fontFamily: "poppins" }}
            >
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
              Shipping ₹{(subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50).toLocaleString("en-IN")} if
              not unlocked
            </span>
          </div>

          {/* Bag */}
        {/*}  <Card className="bagCard">
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
         {/*} <div className="sectionHeader">
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
          {/*<Card className="addrFormCard">
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

                    // Normalize for display: support both backend & legacy shapes
                    const fullName = `${a.firstName || ""} ${a.lastName || ""}`.trim();
                    const addrLine = a.address || `${a.address1 || ""} ${a.address2 || ""}`.trim();
                    const cityStatePin = `${a.city || ""}, ${a.state || ""} - ${a.pincode || ""}`;
                    const phoneDisplay = a.mobileNumber
                      ? (() => {
                          const { phoneCode, phoneNumber } = splitMobile(a.mobileNumber);
                          return `${phoneCode} ${phoneNumber}`;
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
           {/*}   {showForm && (
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
       {/*} <Col md={4}>
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
}*/}



// Checkout.jsx
import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./Checkout.css";

const API_BASE = "https://ravandurustores-backend.onrender.com";

/* --------------------------- Small helpers --------------------------- */
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

const parseSelectedWeight = (str) => {
  if (!str) return null;
  const m = String(str).trim().match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
  if (!m) return null;
  return { qty: m[1].toLowerCase(), unit: m[2].toLowerCase() };
};

const norm = (v) => String(v || "").toLowerCase().replace(/\s+/g, "");

function decodeJwtPayload(token = "") {
  try {
    const [, payload] = String(token).split(".");
    if (!payload) return null;
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = "=".repeat((4 - (b64.length % 4)) % 4);
    const json = atob(b64 + pad);
    return JSON.parse(json);
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
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState("");

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

  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ----------------------- FETCH ADDRESSES ----------------------------- */
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
          setAddrError(
            "You are not logged in. Please sign in to view saved addresses."
          );
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch addresses (HTTP ${res.status})`);
        }

        const data = await res.json();
        const arr =
          (Array.isArray(data) && data) ||
          data.addresses ||
          data.data ||
          data.items ||
          [];

        const current = getAuthUser();
        let mine = arr;

        if (current) {
          const uid = String(current.id || current._id).trim();
          const email = String(current.email || "").toLowerCase().trim();

          mine = arr.filter((a) => {
            const aUid = String(a.userId || "").trim();
            const aEmail = String(a.email || "").toLowerCase().trim();
            return aUid === uid || aEmail === email;
          });
        }

        if (!mounted) return;
        setAddresses(mine);

        const storedPref = localStorage.getItem("preferredAddressId");

        let preferred = null;

        if (storedPref) {
          preferred = mine.find(
            (x) =>
              (x._id || x.id)?.toString() === storedPref.toString()
          );
        }

        if (!preferred) {
          preferred =
            mine.find((x) => x.isDefault || x.default) ||
            mine[mine.length - 1];
        }

        setSelectedId(preferred?._id || preferred?.id || null);
      } catch (e) {
        if (!mounted) return;
        setAddrError(e.message || "Failed to load addresses.");
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
    () => addresses.find((a) => (a._id || a.id) === selectedId) || null,
    [addresses, selectedId]
  );

  /* ---------------------- ADD NEW ADDRESS (VALIDATED) ------------------ */
  const handleAddNewAddress = async (e) => {
    e.preventDefault();

    // VALIDATION RULES
    const emailPattern = /^\S+@\S+\.\S+$/;
    const namePattern = /^[A-Za-z\s]+$/;
    const phonePattern = /^[0-9]{10}$/;
    const pincodePattern = /^[0-9]{6}$/;
    const cityStatePattern = /^[A-Za-z\s]+$/;

    if (!emailPattern.test(form.email)) {
      alert("Enter a valid email address.");
      return;
    }

    if (!namePattern.test(form.firstName)) {
      alert("First name must contain only letters.");
      return;
    }

    if (!namePattern.test(form.lastName)) {
      alert("Last name must contain only letters.");
      return;
    }

    if (!phonePattern.test(form.phoneNumber)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    if (form.address1.trim().length < 5) {
      alert("Address Line 1 must be at least 5 characters.");
      return;
    }

    if (!cityStatePattern.test(form.city)) {
      alert("City must contain only letters.");
      return;
    }

    if (!cityStatePattern.test(form.state)) {
      alert("State must contain only letters.");
      return;
    }

    if (!pincodePattern.test(form.pincode)) {
      alert("Pincode must be exactly 6 digits.");
      return;
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      mobileNumber: `${form.phoneCode}${form.phoneNumber}`,
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

      if (!res.ok) throw new Error(await res.text());

      const listRes = await fetch(`${API_BASE}/api/addresses`, {
        method: "GET",
        headers: authHeaders(),
      });

      const data = await listRes.json();
      const arr = data.addresses || data.data || data.items || data || [];

      const current = getAuthUser();
      let mine = arr;

      if (current) {
        const uid = String(current.id || current._id).trim();
        const email = String(current.email || "").toLowerCase().trim();
        mine = arr.filter((a) => {
          const aUid = String(a.userId || "").trim();
          const aEmail = String(a.email || "").toLowerCase().trim();
          return aUid === uid || aEmail === email;
        });
      }

      setAddresses(mine);

      const last = mine[mine.length - 1];
      const lastId = last?._id || last?.id;
      setSelectedId(lastId);

      localStorage.setItem("preferredAddressId", lastId);

      setShowForm(false);
    } catch (err) {
      alert(err.message || "Could not save address.");
    } finally {
      setSavingNew(false);
    }
  };

  /* --------------------------- DELETE ADDRESS -------------------------- */
  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address permanently?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/addresses/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error(await res.text());

      setAddresses((prev) => {
        const next = prev.filter((x) => (x._id || x.id) !== id);
        if (selectedId === id) {
          const first = next[0];
          setSelectedId(first ? first._id || first.id : null);
        }
        return next;
      });
    } catch (e) {
      alert(e.message || "Delete failed.");
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

        // Fetch individually
        const productResults = await Promise.all(
          ids.map(async (id) => {
            const r = await fetch(`${API_BASE}/api/products/${id}`);
            if (!r.ok) throw new Error(`Product fetch failed: ${id}`);
            return r.json();
          })
        );

        const map = {};
        const byId = {};

        productResults.forEach((prod) => {
          if (!prod || !prod._id) return;

          byId[prod._id] = prod;

          const pct = clampPct(prod.discountPercentage);
          const variants = Array.isArray(prod.variants) ? prod.variants : [];

          variants.forEach((v) => {
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
          });
        });

        if (mounted) {
          setPricing(map);
          setProductsById(byId);
        }
      } catch (e) {
        if (mounted) setPricingError(e.message);
      } finally {
        if (mounted) setPricingLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [cartItems]);

  const getPriceInfo = (item) => {
    if (!item)
      return { originalPrice: 0, discountedPrice: 0, discountPercentage: 0 };

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

        return {
          originalPrice: base,
          discountedPrice: final,
          discountPercentage: pct,
        };
      }
    }

    return { originalPrice: 0, discountedPrice: 0, discountPercentage: 0 };
  };

  /* ------------------------------- TOTALS ------------------------------ */

  const FREE_SHIPPING_THRESHOLD = 2000;
  const BASE_SHIPPING_FEE = 0;

  const subtotal = useMemo(() => {
    return (cartItems || []).reduce((sum, item) => {
      const q = Number(item.quantity) || 1;
      const info = getPriceInfo(item);
      return sum + Number(info.originalPrice || 0) * q;
    }, 0);
  }, [cartItems, pricing]);

  const itemsDiscount = useMemo(() => {
    return (cartItems || []).reduce((sum, item) => {
      const q = Number(item.quantity) || 1;
      const info = getPriceInfo(item);
      const orig = Number(info.originalPrice || 0);
      const pct = Number(info.discountPercentage || 0);
      return sum + (orig * pct) / 100 * q;
    }, 0);
  }, [cartItems, pricing]);

  const discountedSubtotal = useMemo(() => {
    return Math.max(0, subtotal - itemsDiscount);
  }, [subtotal, itemsDiscount]);

  const shippingFee =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_FEE;

  const gst = discountedSubtotal * 0.18;

  const grandTotal = discountedSubtotal + shippingFee + gst;

  const itemsCount = (cartItems || []).reduce(
    (n, it) => n + Number(it.quantity || 0),
    0
  );

  const unlockLeft = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - discountedSubtotal
  );

  function cartToApiItems(list = []) {
    return list.map((ci) => {
      const q = Number(ci.quantity) || 1;
      const info = getPriceInfo(ci);

      return {
        productId: ci.id,
        variantId: ci.variantId || null,
        name: ci.name,
        image: ci.image,
        quantity: q,
        selectedWeight: ci.selectedWeight,
        price: Number(info.discountedPrice || 0),
      };
    });
  }

  /* ------------------------------- PAY NOW ----------------------------- */
  const handlePayNow = async () => {
    if (!cartItems?.length) {
      alert("Your cart is empty.");
      navigate("/best-seller");
      return;
    }

    if (!selectedAddress || !selectedAddress._id) {
      alert("Select an address before paying.");
      return;
    }

    const currentUser = getAuthUser();
    if (!currentUser?.id && !currentUser?._id) {
      alert("Please log in to continue.");
      return;
    }

    const customerId =
      currentUser.id || currentUser._id || currentUser.userId;

    setIsLoading(true);

    try {
      const items = cartToApiItems(cartItems);
      const amount = grandTotal;

      const res = await fetch(`${API_BASE}/api/payments/initiate`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          amount,
          items,
          addressId: selectedAddress._id,
          customerId,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const paymentResponse = await res.json();
      const redirectUrl = paymentResponse?.phonepeResponse?.redirectUrl;
      const orderId =
        paymentResponse?.phonepeResponse
          ?.merchantTransactionId ||
        paymentResponse?.phonepeResponse?.orderId;

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
        alert("Payment initiation failed.");
      }
    } catch (e) {
      alert("Error during payment.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------- UI --------------------------------- */
  return (
    <Container className="checkout">
      <Row className="gx-4">
        {/* LEFT */}
        <Col md={8}>
          <div className="infoBar">
            <span
              className={`pill ${
                unlockLeft > 0 ? "pill-warn" : "pill-success"
              }`}
            >
              <span
                className={`badge ${
                  unlockLeft > 0
                    ? "badge-warn"
                    : "badge-success"
                }`}
              >
                {unlockLeft > 0 ? "Almost there" : "Unlocked"}
              </span>
              {unlockLeft > 0 ? (
                <>Add ₹{unlockLeft} more to unlock free delivery</>
              ) : (
                <>FREE delivery unlocked!</>
              )}
            </span>

            <span>
              Shipping ₹
              {(subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50)}
              {" "}if not unlocked
            </span>
          </div>

          {/* Bag */}
          <Card className="bagCard">
            <div className="bagHeader">
              <h5>Your Bag ({itemsCount})</h5>
              <div className="subtotal">
                Subtotal: <b>₹{subtotal.toFixed(2)}</b>
              </div>
            </div>

            {pricingLoading && (
              <div className="px-3 pb-2 text-muted">
                Updating prices…
              </div>
            )}
            {pricingError && (
              <div className="px-3 pb-2 text-danger">
                {pricingError}
              </div>
            )}

            <div className="bagList">
              {(cartItems || []).map((ci) => {
                const q = Number(ci.quantity) || 1;
                const info = getPriceInfo(ci);
                const line = Number(info.originalPrice || 0) * q;

                return (
                  <div
                    key={`${ci.id}-${ci.variantId || ci.selectedWeight}`}
                    className="bagRow"
                  >
                    <img
                      src={ci.image}
                      alt={ci.name}
                      className="bagImg"
                    />

                    <div className="bagMeta">
                      <div className="bagTitle">{ci.name}</div>
                      <div className="bagSub">Qty {q}</div>
                    </div>

                    <div className="bagPrice">
                      ₹{line.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Address */}
          <div className="sectionHeader">
            <h4>Delivery Address</h4>
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowForm((s) => !s)}
            >
              {showForm ? "Close" : "+ Add New"}
            </Button>
          </div>

          <Card className="addrFormCard">
            <Card.Body>
              {addrLoading && (
                <div className="text-muted mb-2">
                  Loading saved addresses…
                </div>
              )}
              {addrError && (
                <div className="text-danger mb-2">{addrError}</div>
              )}

              {addresses.length === 0 &&
                !addrLoading &&
                !showForm && (
                  <div className="text-muted">
                    No saved addresses yet. Add one to continue.
                  </div>
                )}

              {addresses.length > 0 && (
                <div className="addressList">
                  {addresses.map((a) => {
                    const id = a._id || a.id;
                    const isSelected = selectedId === id;

                    const fullName = `${a.firstName} ${a.lastName}`;
                    const addrLine = a.address;

                    return (
                      <div
                        key={id}
                        className={`addrCard ${
                          isSelected ? "selected" : ""
                        }`}
                      >
                        <div className="addrTop">
                          <label className="radio">
                            <input
                              type="radio"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedId(id);
                                localStorage.setItem(
                                  "preferredAddressId",
                                  id
                                );
                              }}
                            />
                            <span />
                          </label>
                          <div className="addrName">{fullName}</div>
                        </div>

                        <div className="addrBody">
                          <div className="line">{addrLine}</div>
                          <div className="line">
                            {a.city}, {a.state} - {a.pincode}
                          </div>
                          <div className="line">
                            Phone: {a.mobileNumber}
                          </div>
                          <div className="line">{a.email}</div>
                        </div>

                        <div className="addrActions">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteAddress(id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add new */}
              {showForm && (
                <Form onSubmit={handleAddNewAddress}>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="mb-2"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                  />

                  <Row>
                    <Col md={6}>
                      <Form.Control
                        name="firstName"
                        placeholder="First Name"
                        className="mb-2"
                        value={form.firstName}
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        name="lastName"
                        placeholder="Last Name"
                        className="mb-2"
                        value={form.lastName}
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <Form.Select
                        name="phoneCode"
                        value={form.phoneCode}
                        onChange={handleFormChange}
                        className="mb-2"
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                      </Form.Select>
                    </Col>

                    <Col md={8}>
                      <Form.Control
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className="mb-2"
                        value={form.phoneNumber}
                        onChange={handleFormChange}
                        required
                        maxLength={10}
                      />
                    </Col>
                  </Row>

                  <Form.Control
                    name="address1"
                    placeholder="Address Line 1"
                    className="mb-2"
                    value={form.address1}
                    onChange={handleFormChange}
                    required
                  />

                  <Form.Control
                    name="address2"
                    placeholder="Address Line 2 (optional)"
                    className="mb-2"
                    value={form.address2}
                    onChange={handleFormChange}
                  />

                  <Row>
                    <Col md={6}>
                      <Form.Control
                        name="city"
                        placeholder="City"
                        className="mb-2"
                        value={form.city}
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        name="state"
                        placeholder="State"
                        className="mb-2"
                        value={form.state}
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Control
                        name="pincode"
                        placeholder="Pincode"
                        className="mb-2"
                        value={form.pincode}
                        onChange={handleFormChange}
                        required
                        maxLength={6}
                      />
                    </Col>

                    <Col md={6}>
                      <Form.Control
                        name="country"
                        placeholder="Country"
                        className="mb-2"
                        value={form.country}
                        onChange={handleFormChange}
                        required
                      />
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" className="btnPrimary">
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
            <div className="orderHeader">Order Details</div>

            <div className="orderRows">
              <div className="rowLine">
                <span>Items Subtotal</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>

              <div className="rowLine">
                <span>Discount</span>
                <span>- ₹ {itemsDiscount.toFixed(2)}</span>
              </div>

              <div className="rowLine">
                <span>Subtotal after discount</span>
                <span>₹ {discountedSubtotal.toFixed(2)}</span>
              </div>

              <div className="rowLine">
                <span>Shipping</span>
                <span>₹ {shippingFee}</span>
              </div>

              <div className="rowLine">
                <span>GST (18%)</span>
                <span>₹ {gst.toFixed(2)}</span>
              </div>
            </div>

            <div className="totalRow">
              <span>Total</span>
              <span>₹ {grandTotal.toFixed(2)}</span>
            </div>

            <Button
              className="payBtn"
              onClick={handlePayNow}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing…"
                : `Pay ₹${grandTotal.toFixed(2)}`}
            </Button>

            <div className="orderNote">
              Secure payments • Easy returns • Fast support
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
