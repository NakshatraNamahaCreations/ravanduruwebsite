
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "/media/logo.png";


export default function Footer() {
  return (
    <div
      style={{
        background: "#00614A",
        padding: "40px 20px",
        fontFamily: "oswaldMedium, sans-serif",
        color: "#fff",
      }}
    >

      <Container fluid>
        {/* Subscription Input */}
        {/*<InputGroup
          className="mb-5 footer-subscribe-input"
          style={{ maxWidth: "750px", margin: "auto" }}
        >
          <Form.Control
            placeholder="EMAIL"
            style={{
              borderRadius: "0",
              fontSize: "16px",
              color: "#00614A",
              fontWeight: "bold",
              fontFamily: "oswald, sans-serif",
            }}
            className="me-2 search-input input-account-forms"
          />
          <InputGroup.Text
            className="footer-subscribe-button"
            style={{
              borderRadius: "0",
              fontWeight: "bold",
              color: "#00614A",
              backgroundColor: "#97D7C6",
              height: "48px",
              cursor: "pointer",
              fontSize: "16px",
              padding: "0 24px",
              letterSpacing: "1px",
              fontFamily: "oswald, sans-serif",
            }}
          >
            SUBSCRIBE
          </InputGroup.Text>
        </InputGroup>

        {/* Footer Grid */}
        <div
          className="footer-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "15px",
            padding: "0 5%",
            alignItems: "start",
            textAlign: "left",
          }}
        >
          {/* Logo */}
          <Link to="/">
          <div className="footer-logo" style={{ textAlign: "center" }}>
            <img
              src={logo}
              alt="logo"
              style={{ width: "90%", objectFit: "contain", margin: "0 auto" }}
            />
          </div>
          </Link>

          {/* Sections */}
          <div>
            <h5 className="footer-heading" style={headingStyle}>
              ABOUT
            </h5>
            <ul className="footer-list" style={listStyle}>
              <li>About Us</li>
              <Link to="/account" style={linkStyle}>
                <li>Account</li>
              </Link>
              <Link to="/contact" style={linkStyle}>
                <li>Contact Us</li>
              </Link>
            </ul>
          </div>

          <div>
            <h5 className="footer-heading" style={headingStyle}>
              SUPPORT
            </h5>
            <ul className="footer-list" style={listStyle}>
              <Link to="/create_account" style={linkStyle}>
                <li>Sign Up</li>
              </Link>
            
            </ul>
          </div>

          <div>
            <h5 className="footer-heading" style={headingStyle}>
              SOCIALS
            </h5>
            <ul className="footer-list" style={listStyle}>
              <li>Instagram</li>
              <li>Facebook</li>
            
            </ul>
          </div>

          <div>
            <h5 className="footer-heading" style={headingStyle}>
              HELP
            </h5>
            <ul className="footer-list" style={listStyle}>
              <Link to="/terms-conditions"  style={linkStyle}>
              <li>Terms of Services</li>
              </Link>
              <Link to="/privacy" style={linkStyle}>
              <li>Privacy Policy</li>
              </Link>
              <Link to="/shipping-policy" style={linkStyle}>
              <li>Shipping Policy</li>
              </Link>
              <Link to="/refund-policy" style={linkStyle}>
              <li>Return & Refund Policy</li>
              </Link>
            </ul>
          </div>

          <div className="footer-contact">
            <h5 className="footer-heading" style={headingStyle}>
              CONTACT
            </h5>
            <ul className="footer-list" style={listStyle}>
              <li style={{fontSize:"17px"}}>
                <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                #1881/3A, WESLEY ROAD, MYSORE
              </li>
              <li style={{fontSize:"17px"}}>
                <a href="mailto:av.kitchens1532@gmail.com" style={{textDecoration:"none", color:"inherit"}}>
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                av.kitchens1532@gmail.com
                </a>
              </li>
              <li style={{fontSize:"17px"}}>
                <a href="tel:  7899830366" style={{textDecoration:"none", color:"inherit"}}>
                <FontAwesomeIcon icon={faPhone} className="me-2" />
                7899830366
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}

const headingStyle = {
  fontWeight: "bold",
  fontSize: "26px",
  marginBottom: "20px",
  letterSpacing: "1px",
  fontFamily: "oswald, sans-serif",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  fontSize: "18px",
  lineHeight: "2.0",
};

const linkStyle = {
  textDecoration: "none",
  color: "white",
};
