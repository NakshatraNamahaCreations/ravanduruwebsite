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
import "./Footer.css"; 

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <Container fluid>
        {/* Grid container */}
        <div className="footer-container">
          {/* 1: Logo */}
          <div className="footer-col footer-logo-col">
            <Link to="/" className="footer-logo-link" aria-label="Home">
              <img
                src={logo}
                alt="logo"
                className="footer-logo-img"
              />
            </Link>
          </div>

          {/* 2: ABOUT */}
          <div className="footer-col footer-about-col">
            <h5 className="footer-heading">ABOUT</h5>
            <ul className="footer-list">
              <li>
                <Link to="/account" className="footer-link">Account</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* 3: SUPPORT */}
          <div className="footer-col footer-support-col">
            <h5 className="footer-heading">SUPPORT</h5>
            <ul className="footer-list">
              <li>
                <Link to="/create_account" className="footer-link">Sign Up</Link>
              </li>
            </ul>
          </div>

          {/* 4: SOCIALS */}
          <div className="footer-col footer-socials-col">
            <h5 className="footer-heading">SOCIALS</h5>
            <ul className="footer-list footer-socials-list">
              <li><a className="footer-link" href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a className="footer-link" href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>

          {/* 5: HELP */}
          <div className="footer-col footer-help-col">
            <h5 className="footer-heading">HELP</h5>
            <ul className="footer-list">
              <li><Link to="/terms-conditions" className="footer-link">Terms of Services</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/shipping-policy" className="footer-link">Shipping Policy</Link></li>
              <li><Link to="/refund-policy" className="footer-link">Return & Refund Policy</Link></li>
            </ul>
          </div>

          {/* 6: CONTACT */}
          <div className="footer-col footer-contact-col">
            <h5 className="footer-heading">CONTACT</h5>
            <ul className="footer-list footer-contact-list">
              <li style={{fontSize:"16px"}}>
                <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                #1881/3A, WESLEY ROAD, MYSORE
              </li>
              <li style={{fontSize:"16px"}}>
                <a href="mailto:av.kitchens1532@gmail.com" className="footer-link">
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                  av.kitchens1532@gmail.com
                </a>
              </li>
              <li style={{fontSize:"16px"}}>
                <a href="tel:8105999016" className="footer-link">
                  <FontAwesomeIcon icon={faPhone} className="me-2" />
                  8105999016
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
