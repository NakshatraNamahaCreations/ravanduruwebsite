import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";



export default function ProfileDetails() {
 const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobilenumber: "",
    password: "",
  });
  const [actualPassword, setActualPassword] = useState("");
  const navigate = useNavigate();

  // tiny helpers
  const parse = (k, fallback = null) => {
    try { return JSON.parse(localStorage.getItem(k) || (fallback ?? "null")); }
    catch { return fallback; }
  };
  const pickPhone = (o = {}) =>
    o.mobilenumber ??
    o.mobileNumber ??
    o.phoneNumber ??
    o.phone ??
    o.mobile ??
    "";

  useEffect(() => {
    const session = parse("user");                    // set at login
    const profile = parse("profile");                 // if you keep a profile doc
    const regs = parse("registeredUsers", "[]") || []; // array from signup
    const addresses = parse("savedAddresses", "[]") || [];

    // try to match a registered user by email to grab missing fields
    const email = session?.email || profile?.email || "";
    const fromRegs = email
      ? regs.find(
          u => (u.email || u.username || "").toLowerCase() === email.toLowerCase()
        )
      : null;

    // phone might only live in the first saved address
    const phoneFromAddress =
      addresses[0]?.phoneNumber ||
      addresses[0]?.mobilenumber ||
      addresses[0]?.phone ||
      "";

    const merged = { ...fromRegs, ...profile, ...session };
    const phone = pickPhone(merged) || phoneFromAddress;

    setFormData(prev => ({
      ...prev,
      firstname: merged.firstname || merged.firstName || "",
      lastname:  merged.lastname  || merged.lastName  || "",
      email:     merged.email     || merged.username || "",
      mobilenumber: phone,
      password:  merged.password  || "",
    }));
    setActualPassword(merged.password || "");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // persist back into session so future loads work
    const session = parse("user") || {};
    const updatedUser = {
      ...session,
      firstname: formData.firstname,
      lastname:  formData.lastname,
      email:     formData.email,
      mobilenumber: formData.mobilenumber, // normalize key
      password:  actualPassword,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Profile updated successfully!");
    navigate("/account");
  };

 const [showLogoutModal, setShowLogoutModal] = useState(false);
  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);
  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    navigate("/login");
  };

  

  return (
    <>
      
      <Container className="py-5" style={{ maxWidth: "1140px" }}>
        <Row>
          {/* Sidebar */}
           <Col xs={12} md={3}>
            <div style={{ borderRight: "1px solid #ddd", paddingRight: "10px" }}>
              <div style={sidebarItemStyle} onClick={() => navigate("/profile-details")}>Profile &gt;</div>
              <div style={sidebarItemStyle} onClick={() => navigate("/order-details")}>Orders &gt;</div>
              <div style={sidebarItemStyle} onClick={() => navigate("/wishlist")}>Wishlist &gt;</div>
              <div style={sidebarItemStyle} onClick={() => navigate("/address-details")}>Address Book &gt;</div>
              <div style={sidebarItemStyle} onClick={openLogoutModal}>Log Out &gt;</div>
            </div>
          </Col>

          {/* Profile Form */}
          <Col md={9}>
            <h2 style={{ fontFamily: "poppins", fontWeight: "600", marginBottom: "30px" }}>Your Profile</h2>
            <Form>
              {renderInputRow("First Name", "firstname", formData.firstname, handleChange)}
              {renderInputRow("Last Name", "lastname", formData.lastname, handleChange)}
              {renderInputRow("Email", "email", formData.email, handleChange, true)}
              {renderInputRow("Mobile", "mobilenumber", formData.mobilenumber, handleChange)}

             <Row className="mb-4">
  <Col md={3} style={{ fontFamily: "poppins", fontWeight: "500" }}>Password</Col>
  <Col md={9}>
    <Form.Control
      type="text"
      value="************"  // Static Masked Display
      readOnly
      style={{
        fontFamily: "poppins",
        border: "none",
        borderBottom: "1px solid #ddd",
        borderRadius: "0",
        backgroundColor: "#fff"
      }}
    />
  </Col>
</Row>



              <div className="d-flex justify-content-end">
                <Button
                   style={{backgroundColor:"#97d7c6",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
         width: "160px",
          height: "50px",
        fontSize:"16px", fontFamily:"poppins", borderRadius:"0", fontWeight:"bold"}}
                  variant="none"
                  onClick={handleSave}
                >
                  SAVE CHANGES
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>

      <Modal show={showLogoutModal} onHide={closeLogoutModal} centered>
        <Modal.Header closeButton><Modal.Title>Log out?</Modal.Title></Modal.Header>
        <Modal.Body>You’re about to log out. Are you sure you want to continue?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeLogoutModal}>Cancel</Button>
          <Button variant="danger" onClick={handleLogoutConfirm}>OK</Button>
        </Modal.Footer>
      </Modal>
      
    </>
  );
}

const sidebarItemStyle = {
  fontFamily: "poppins",
  fontSize: "18px",
  padding: "15px 0",
  cursor: "pointer",
  fontWeight:"bold"
};

// Helper Function for Input Rows (Excluding Password Row)
const renderInputRow = (label, name, value, onChange, readOnly = false, type = "text") => (
  <Row className="mb-4" key={name}>
    <Col md={3} style={{ fontFamily: "poppins", fontWeight: "500", fontSize:"18px" }}>{label}</Col>
    <Col md={9}>
      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        style={{ fontFamily: "poppins", border: "none", borderBottom: "1px solid #ddd", borderRadius: "0", background: readOnly ? "#fff" : "transparent" }}
      />
    </Col>
  </Row>

  
);
