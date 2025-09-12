import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Card,
  Badge,
  Stack,
} from "react-bootstrap";

export default function AddressForm() {
  const navigate = useNavigate();

  // ==== STORAGE KEYS ====
  const STORAGE_KEY = "savedAddresses";
  const SELECTED_KEY = "selectedAddressId";   // set during checkout
  const DEFAULT_KEY  = "defaultAddressId";    // set in address book

  // ==== ADDRESS MODEL ====
  const emptyAddress = {
    id: "",
    firstName: "",
    lastName: "",
    phoneCode: "+91",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  };

  // ==== STATE ====
  const [address, setAddress] = useState(emptyAddress);
  const [addresses, setAddresses] = useState([]);
  const [defaultId, setDefaultId] = useState(null);
  const [selectedId, setSelectedId] = useState(null); // from checkout
  const [editingId, setEditingId] = useState(null);   // if editing existing
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ==== HELPERS ====
  const safeParse = (raw, fb) => {
    try { return JSON.parse(raw ?? ""); } catch { return fb; }
  };

  const persistAddresses = (arr) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    setAddresses(arr);
  };

  // Derive which ID should be highlighted as "In use"
  const activeId = useMemo(() => {
    // If checkout chose one, that's the active one
    if (selectedId && addresses.some(a => a.id === selectedId)) return selectedId;
    // Otherwise fall back to default saved here
    if (defaultId && addresses.some(a => a.id === defaultId)) return defaultId;
    return null;
  }, [selectedId, defaultId, addresses]);

  // ==== LOAD ON MOUNT ====
  useEffect(() => {
    const saved = safeParse(localStorage.getItem(STORAGE_KEY), []);
    setAddresses(saved);

    const sel = localStorage.getItem(SELECTED_KEY) || null;
    setSelectedId(sel);

    const def = localStorage.getItem(DEFAULT_KEY) || null;
    setDefaultId(def);
  }, []);

  // ==== FORM HANDLERS ====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // basic normalization
    const id =
      editingId ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()));

    const normalized = { ...address, id };

    if (editingId) {
      // update existing
      const next = addresses.map((a) => (a.id === editingId ? normalized : a));
      persistAddresses(next);
    } else {
      // add new
      const next = [...addresses, normalized];
      persistAddresses(next);
      // if first address ever, mark as default
      if (!defaultId) {
        localStorage.setItem(DEFAULT_KEY, id);
        setDefaultId(id);
      }
    }

    // reset form
    setAddress(emptyAddress);
    setEditingId(null);
    alert("Address saved");
  };

  const handleCancel = () => {
    setAddress(emptyAddress);
    setEditingId(null);
  };

  // ==== ADDRESS BOOK ACTIONS ====
  const setAsDefault = (id) => {
    localStorage.setItem(DEFAULT_KEY, id);
    setDefaultId(id);
  };

  const setAsSelected = (id) => {
    // This simulates choosing it for "current use" (like checkout would)
    localStorage.setItem(SELECTED_KEY, id);
    setSelectedId(id);
  };

  

  const handleDelete = (id) => {
    const next = addresses.filter((a) => a.id !== id);
    persistAddresses(next);

    // clean up selection/default if they pointed to the deleted one
    if (defaultId === id) {
      localStorage.removeItem(DEFAULT_KEY);
      setDefaultId(null);
    }
    if (selectedId === id) {
      localStorage.removeItem(SELECTED_KEY);
      setSelectedId(null);
    }
  };

  const handleEdit = (id) => {
    const a = addresses.find((x) => x.id === id);
    if (!a) return;
    setAddress(a);
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==== SIDEBAR STYLES/ACTIONS ====
  const sidebarItemStyle = {
    fontFamily: "poppins",
    fontSize: "18px",
    padding: "15px 0",
    cursor: "pointer",
    fontWeight: "bold"
  };

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);
  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const writeLocal = (arr) => {
  localStorage.setItem(KEY_SAVED, JSON.stringify(arr));
  setSavedAddresses(arr); // <-- make sure you have this state
};

// Replace any existing delete handlers with this one:
const handleDeleteAddress = (aId) => {
  if (!aId) return;
  if (!window.confirm("Delete this address?")) return;

  // 1) Remove from list + persist
  const remaining = (addresses || []).filter((a) => a.id !== aId);
  persistAddresses(remaining);

  // 2) If the deleted one was currently selected (e.g., used in checkout)
  if (selectedId === aId) {
    if (remaining.length) {
      const nextSel = remaining[0].id;
      localStorage.setItem(SELECTED_KEY, nextSel);
      setSelectedId(nextSel);
    } else {
      localStorage.removeItem(SELECTED_KEY);
      setSelectedId(null);
    }
  }

  // 3) If the deleted one was the default
  if (defaultId === aId) {
    if (remaining.length) {
      const nextDef = remaining[0].id;
      localStorage.setItem(DEFAULT_KEY, nextDef);
      setDefaultId(nextDef);
    } else {
      localStorage.removeItem(DEFAULT_KEY);
      setDefaultId(null);
    }
  }

  // 4) If you were editing the same address, reset the form
  if (editingId === aId) {
    setEditingId(null);
    setAddress(emptyAddress);
  }
};


  // ==== UI ====
  return (
    <>
      <Container style={{ fontFamily: "poppins, sans-serif" }} className="mt-5 mb-5">
        <Row className="g-4 align-items-start">
          {/* LEFT: SIDEBAR */}
          <Col xs={12} md={5}>
            <Col md={4}>
              <div style={{ borderRight: "1px solid #ddd", paddingRight: "10px" }}>
                <div style={sidebarItemStyle} onClick={() => navigate("/profile-details")}>Profile &gt;</div>
                <div style={sidebarItemStyle} onClick={() => navigate("/order-details")}>Orders &gt;</div>
                <div style={sidebarItemStyle} onClick={() => navigate("/wishlist")}>Wishlist &gt;</div>
                <div style={sidebarItemStyle} onClick={() => navigate("/address-details")}>Address Book &gt;</div>
                <div style={sidebarItemStyle} onClick={openLogoutModal}>Log Out &gt;</div>
              </div>
            </Col>
          </Col>

          {/* RIGHT: FORM + LIST */}
          <Col xs={12} md={7}>
            <h4 className="mb-3 fw-bold">Address Book</h4>

            {/* FORM */}
            {/*<Card className="mb-4">
              <Card.Body>
                <Card.Title style={{ color: "#00614A" }}>
                  {editingId ? "Edit Address" : "Add New Address"}
                </Card.Title>

                <Form onSubmit={handleSubmit} style={{ fontSize: 18, color: "#00614A" }} className="mt-3">
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          placeholder="Enter First Name"
                          value={address.firstName}
                          onChange={handleChange}
                          required
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          placeholder="Enter Last Name"
                          value={address.lastName}
                          onChange={handleChange}
                          required
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif" }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Group controlId="phoneCode">
                        <Form.Label>Phone Code</Form.Label>
                        <Form.Select
                          name="phoneCode"
                          value={address.phoneCode}
                          onChange={handleChange}
                          required
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif" }}
                        >
                          <option value="+1">+1 (USA)</option>
                          <option value="+91">+91 (India)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+61">+61 (Australia)</option>
                          <option value="+81">+81 (Japan)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={8}>
                      <Form.Group controlId="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phoneNumber"
                          placeholder="Enter Phone Number"
                          value={address.phoneNumber}
                          onChange={handleChange}
                          required
                          pattern="\d{7,15}"
                          title="Enter digits only (7–15)"
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif" }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group controlId="address1" className="mt-3">
                    <Form.Label>Address 1</Form.Label>
                    <Form.Control
                      type="text"
                      name="address1"
                      placeholder="Enter Address Line 1"
                      value={address.address1}
                      onChange={handleChange}
                      required
                      className="input-addressdetails search-input"
                      style={{ fontFamily: "poppins, sans-serif" }}
                    />
                  </Form.Group>

                  <Form.Group controlId="address2" className="mt-3">
                    <Form.Label>Address 2</Form.Label>
                    <Form.Control
                      type="text"
                      name="address2"
                      placeholder="Enter Address Line 2 (Optional)"
                      value={address.address2}
                      onChange={handleChange}
                      className="input-addressdetails search-input"
                      style={{ fontFamily: "poppins, sans-serif" }}
                    />
                  </Form.Group>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Group controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          placeholder="Enter Your City"
                          value={address.city}
                          onChange={handleChange}
                          required
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="state">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          placeholder="Enter Your State"
                          value={address.state}
                          onChange={handleChange}
                          required
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="pincode">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          name="pincode"
                          placeholder="Enter Pincode"
                          value={address.pincode}
                          onChange={handleChange}
                          required
                          pattern="\d{4,10}"
                          title="Enter digits only (4–10)"
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif" }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between mt-3 flex-wrap">
                    <Button
                      type="submit"
                      variant="outline-success"
                      className="mb-2"
                      style={{ fontSize: 20, letterSpacing: "1px" }}
                    >
                      {editingId ? "UPDATE ADDRESS" : "ADD ADDRESS"}
                    </Button>

                    <div>
                      <Button
                        variant="outline-success"
                        onClick={handleCancel}
                        className="me-2 mb-2"
                        style={{ color: "#00614A", fontSize: 20, letterSpacing: "1px" }}
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={() => navigate("/")}
                        variant="outline-success"
                        className="mb-2"
                        style={{ color: "#00614A", fontSize: 20, letterSpacing: "1px" }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>*/}

            {/* ADDRESS LIST */}
            <h6 className="mb-3 fw-bold">Saved Addresses</h6>
            {addresses.length === 0 ? (
             <Card className="mb-4">
              <Card.Body>
                <Card.Title style={{ color: "#00614A", fontWeight:"bold" }}>
                  {editingId ? "Edit Address" : "Add New Address"}
                </Card.Title>

                <Form onSubmit={handleSubmit} style={{ fontSize: 18, color: "#00614A" }} className="mt-3">
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          placeholder="Enter First Name"
                          value={address.firstName}
                          onChange={handleChange}
                          required
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif", fontSize:"16px" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          placeholder="Enter Last Name"
                          value={address.lastName}
                          onChange={handleChange}
                          required
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif", fontSize:"16px" }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Group controlId="phoneCode">
                        <Form.Label>Phone Code</Form.Label>
                        <Form.Select
                          name="phoneCode"
                          value={address.phoneCode}
                          onChange={handleChange}
                          required
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif", fontSize:"16px" }}
                        >
                          <option value="+1">+1 (USA)</option>
                          <option value="+91">+91 (India)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+61">+61 (Australia)</option>
                          <option value="+81">+81 (Japan)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={8}>
                      <Form.Group controlId="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phoneNumber"
                          placeholder="Enter Phone Number"
                          value={address.phoneNumber}
                          onChange={handleChange}
                          required
                          pattern="\d{7,15}"
                          title="Enter digits only (7–15)"
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif", fontSize:"16px" }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group controlId="email" className="mt-3">
  
  <Form.Control
    type="email"                    // use the email type
    name="email"                    // must match state key exactly
    placeholder="Email"
    value={address.email}           // bind to address.email (not address1)
    onChange={handleChange}
    required
    autoComplete="email"
    inputMode="email"
    className="input-addressdetails search-input"
    style={{ fontFamily: "poppins, sans-serif", fontSize: "17px" }}
  />
</Form.Group>

                  <Form.Group controlId="address1" className="mt-3">
                    <Form.Label>Address 1</Form.Label>
                    <Form.Control
                      type="text"
                      name="address1"
                      placeholder="Enter Address Line 1"
                      value={address.address1}
                      onChange={handleChange}
                      required
                      className="input-addressdetails search-input"
                      style={{ fontFamily: "poppins, sans-serif", fontSize:"16px" }}
                    />
                  </Form.Group>

                  <Form.Group controlId="address2" className="mt-3">
                    <Form.Label>Address 2</Form.Label>
                    <Form.Control
                      type="text"
                      name="address2"
                      placeholder="Enter Address Line 2 (Optional)"
                      value={address.address2}
                      onChange={handleChange}
                      className="input-addressdetails search-input"
                      style={{ fontFamily: "poppins, sans-serif" , fontSize:"16px"}}
                    />
                  </Form.Group>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Group controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          placeholder="Enter Your City"
                          value={address.city}
                          onChange={handleChange}
                          required
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif", fontSize:"16px" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="state">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          placeholder="Enter Your State"
                          value={address.state}
                          onChange={handleChange}
                          required
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif", fontSize:"16px" }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="pincode">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          name="pincode"
                          placeholder="Enter Pincode"
                          value={address.pincode}
                          onChange={handleChange}
                          required
                          pattern="\d{4,10}"
                          title="Enter digits only (4–10)"
                          className="input-addressdetails search-input"
                          style={{ fontFamily: "poppins, sans-serif", fontSize:"16px" }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between mt-3 flex-wrap">
                    <Button
                      type="submit"
                      variant="outline-success"
                      className="mb-2"
                      style={{ fontSize: 20, letterSpacing: "1px" }}
                    >
                      {editingId ? "UPDATE ADDRESS" : "ADD ADDRESS"}
                    </Button>

                    <div>
                      <Button
                        variant="outline-success"
                        onClick={handleCancel}
                        className="me-2 mb-2"
                        style={{ color: "#00614A", fontSize: 20, letterSpacing: "1px" }}
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={() => navigate("/")}
                        variant="outline-success"
                        className="mb-2"
                        style={{ color: "#00614A", fontSize: 20, letterSpacing: "1px" }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            ) : (
              <Row xs={1} md={2} className="g-3">
                {addresses.map((a) => {
                  const isDefault = a.id === defaultId;
                  const isActive = a.id === activeId;
                  return (
                    <Col key={a.id}>
                      <Card className="h-100">
                        <Card.Body>
                          <Stack direction="horizontal" className="justify-content-between mb-2">
                            <Card.Title className="mb-0 fw-bold" style={{ fontSize: 18 }}>
                              {a.firstName} {a.lastName}
                            </Card.Title>
                           {/*} <div>
                              {isActive && <Badge bg="success" className="me-1">In Use</Badge>}
                              {isDefault && <Badge bg="primary">Default</Badge>}
                            </div>*/}
                          </Stack>

                          <Card.Text className="mb-2" style={{ lineHeight: 1.3 }}>
                            {a.address1}
                            {a.address2 ? `, ${a.address2}` : ""}
                            <br />
                            {a.city}, {a.state} - {a.pincode}
                            <br />
                            {a.phoneCode} {a.phoneNumber}
                          </Card.Text>

                          {/*<div className="d-flex flex-wrap gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => setAsSelected(a.id)}
                              title="Mark as in-use (like Checkout selection)"
                            >
                              Use This
                            </Button>
                            {!isDefault && (
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => setAsDefault(a.id)}
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => handleEdit(a.id)}
                            >
                              Edit
                            </Button>*/}
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDeleteAddress(a.id)}
                              className="fw-bold"
                            >
                              Delete
                            </Button>
                        {/*}  </div>*/}
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Col>
        </Row>
      </Container>

      {/* LOGOUT MODAL */}
      <Modal show={showLogoutModal} onHide={closeLogoutModal} centered>
        <Modal.Header closeButton><Modal.Title style={{fontFamily:"poppins", fontSize:"18px", fontWeight:"bold"}}>Log out?</Modal.Title></Modal.Header>
        <Modal.Body style={{fontFamily:"poppins"}}>You’re about to log out. Are you sure you want to continue?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeLogoutModal} style={{fontFamily:"poppins"}}>Cancel</Button>
          <Button variant="danger" onClick={handleLogoutConfirm} style={{fontFamily:"poppins"}}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
