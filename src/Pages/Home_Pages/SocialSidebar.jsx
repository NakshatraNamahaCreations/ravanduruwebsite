import React from "react";
import { Button } from "react-bootstrap";
import whatspp from "/media/Whatsapp.png";
import Insta from "/media/Insta.png";
import facebook from "/media/Facebook.png";

const SocialSidebar = () => {
  return (
    <div className="social-sidebar">
      <Button
        variant="none"
        href="https://wa.me/7899830366"
        target="_blank"
        className="social-button"
      >
        <img src={whatspp} alt="whatsapp" className="social-icon" />
      </Button>

      <Button
        variant="none"
        href="https://www.instagram.com/ravanduru_stores?igsh=MTI2djFsamowYmp0Mg=="
        target="_blank"
        className="social-button"
      >
        <img src={Insta} alt="Instagram" className="social-icon" />
      </Button>

      <Button
        variant="none"
        href="#"
        target="_blank"
        className="social-button"
      >
        <img src={facebook} alt="Facebook" className="social-icon" />
      </Button>
    </div>
  );
};

export default SocialSidebar;
