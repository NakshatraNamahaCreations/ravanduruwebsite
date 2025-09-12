import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FaUser, FaShoppingBag, FaHeart, FaAddressBook } from "react-icons/fa";


export default function Account_Page() {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState({ firstname: "Guest", lastname: "" }); 
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // page fade-in
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // top scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // read optional user from localStorage (no API)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored && (stored.firstname || stored.lastname)) {
        setUser({
          firstname: stored.firstname || "Guest",
          lastname: stored.lastname || "",
        });
      }
    } catch {
      // ignore parse errors; keep Guest fallback
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // simple client-only sign out
    setShowLogoutModal(false);
    navigate("/login");
  };

  const dashboardSections = [
    {
      title: "PROFILE",
      desc: "View or edit your personal information.",
      icon: <FaUser />,
      link: "/profile-details",
    },
    {
      title: "ORDERS",
      desc: "Track, return or buy your favourite products again.",
      icon: <FaShoppingBag />,
      link: "/order-details",
    },
    {
      title: "WISHLIST",
      desc: "View your wishlist and modify or add items to your cart.",
      icon: <FaHeart />,
      link: "/wishlist",
    },
    {
      title: "ADDRESS BOOK",
      desc: "Edit addresses for your orders.",
      icon: <FaAddressBook />,
      link: "/address-details",
    },
  ];

  return (
    <>


      <div
        className="page-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          minHeight: "100vh",
          backgroundColor: "#fff",
        }}
      >
        <Container style={{ maxWidth: "1140px", padding: "50px 0" }}>
          {/* Greeting */}
          <div className="text-center mb-5">
            <h3 style={{ fontFamily: "poppins", fontWeight: 600 }}>
              Hi, {user.firstname} {user.lastname}
            </h3>
            <p style={{ fontFamily: "poppins", color: "#555" , fontSize:"20px", fontWeight:"bold"}}>
              Welcome to Ravanduru Stores
            </p>
          </div>

          {/* Dashboard tiles */}
          <Row className="g-4">
            {dashboardSections.map((section, index) => (
              <Col md={4} sm={6} xs={12} key={index}>
                <Card
                  className="h-100 shadow-sm border-0"
                  style={{
                    backgroundColor: "#e1f8ebff",
                    padding: 20,
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "transform .15s ease, box-shadow .15s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                  onClick={() => navigate(section.link)}
                >
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div
                        style={{
                          fontSize: 22,
                          marginRight: 10,
                          color: "#00614A",
                          display: "inline-flex",
                          width: 45,
                          height: 45,
                          borderRadius: 10,
                          background: "#E9F7EF",
                          alignItems: "center",
                          justifyContent: "center",
                          position:"absolute",
                          top:"-10%",
                          left:"43%",
                          border: "1px solid #00614A"
                        }}
                      >
                        {section.icon}
                      </div>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 10, justifyContent:"center" }}>
                      
                      <h5
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          fontFamily: "poppins",
                          letterSpacing: "0.5px",
                          fontSize: 20
                        }} className="mt-2"
                      >
                        {section.title}
                      </h5>
                    </div>

                    <p
                      style={{
                        fontSize: 18,
                        color: "#333",
                        fontFamily: "poppins",
                        marginBottom: 8,
                        textAlign:"center"
                      }}
                    >
                      {section.desc}
                    </p>

                    <div style={{ textAlign: "right", fontSize: 18, color: "#333" }}>
                      &rarr;
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Logout */}
          <div className="text-center mt-5">
            <Button
              onClick={() => setShowLogoutModal(true)}
              variant="link"
              style={{
                color: "#000",
                fontFamily: "poppins",
                fontWeight: 700,
                textDecoration: "underline",
                fontSize: 20,
              }}
            >
              LOG OUT
            </Button>
          </div>

          {/* Confirm Logout Modal */}
          <Modal
            show={showLogoutModal}
            onHide={() => setShowLogoutModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Logout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to logout?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>

   
      </div>
    </>
  );
}
