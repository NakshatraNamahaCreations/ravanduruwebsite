import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ScrollToTop from "../../Component/ScrollToTop";
import SearchBar from "../../Component/SearchBar";

export default function TermsConditions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div
        className="page-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {/* NAVBAR MENU */}
        {/* <Navbar_Menu /> */}

        {/* SEARCH BAR */}
        <SearchBar />

        {/* TERMS & CONDITION */}

        <Container>
          <div
            style={{
              padding: "30px",
              margin: "0% 10% 10% 10%",
              fontFamily: "oswald, sans-serif",
            }} className="terms-section"
          >
            <h1
              style={{
                fontWeight: "bold",
                color: "#00614A",
                textAlign: "center",
                fontSize: "64px",
                letterSpacing: "2px",
                marginBottom:'5%'
              }}
              className="mobile-font"
            >
              TERMS OF SERVICES
            </h1>
            <div className="div-p-ul">
              <p>
                Welcome to Ravanduru Stores. Please read these Terms and
                Conditions carefully before using our website, products, and
                services. By accessing or using our platform, you agree to
                comply with and be bound by these Terms and Conditions. If you
                do not agree to these terms, please refrain from using our
                website.
              </p>
              <p>1. General Information</p>
              <ul>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Company Details:
                  </span>{" "}
                  Ravanduru Stores, 
                  specializes in the manufacturing and export of whole spices,
                  retail spice blends, DIY spice kits, and ground spices.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Contact Information:
                  </span>{" "}
                  For any inquiries, you can reach us at:
                  <ul style={{ listStyleType: "none" }}>
                    <li>
                      - Email:{" "}
                      <span
                        style={{
                          fontSize: "18px",
                          marginLeft: "5px",
                          fontFamily: "oswald, sans-serif",
                          letterSpacing: "1.5px",
                        }}
                      >
                        info@avitrispices.in
                      </span>
                    </li>
                    <li>
                      - Phone:{" "}
                      <span
                        style={{
                          fontSize: "18px",
                          marginLeft: "5px",
                          fontFamily: "oswald, sans-serif",
                          letterSpacing: "1.5px",
                        }}
                      >
                        +91 734 944 4419
                      </span>
                    </li>
                  </ul>
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Website Usage:
                  </span>{" "}
                  The use of this website is subject to the terms outlined
                  below, as well as our Privacy Policy.
                </li>
              </ul>

              <p>2. Product Information</p>
              <ul>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Accuracy of Information:
                  </span>{" "}
                  We make every effort to ensure the accuracy of product
                  descriptions, pricing, and availability. However, errors may
                  occur, and we reserve the right to correct any inaccuracies or
                  omissions.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Product Availability:
                  </span>{" "}
                  All products are subject to availability. We may discontinue
                  or modify any product without prior notice.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Allergen Information:
                  </span>{" "}
                  Please note that our products may contain or be processed in
                  facilities that handle allergens. Customers are advised to
                  review packaging for allergen information.
                </li>
              </ul>

              <p>3. Orders and Payments</p>
              <ul>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Order Process:
                  </span>{" "}
                  All orders are subject to acceptance and availability. Once an
                  order is placed, you will receive an acknowledgment via email.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Pricing:
                  </span>{" "}
                  All prices are listed in Indian Rupees (INR) unless stated
                  otherwise and are subject to change without notice. Taxes and
                  shipping charges are additional unless explicitly mentioned.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Payment Terms:
                  </span>{" "}
                  Payments can be made via approved payment gateways. By
                  submitting payment details, you confirm that you are
                  authorized to use the payment method provided.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Cancellation Policy:
                  </span>{" "}
                  Orders can be canceled before dispatch. Once dispatched,
                  orders cannot be canceled.
                </li>
              </ul>

              <p>4. Shipping and Delivery</p>
              <ul>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Shipping Policy:
                  </span>{" "}
                  We ship products within India and internationally, subject to
                  shipping restrictions. Delivery timelines will be 10 - 15 days
                  from the time of purchase.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Delayed Shipments:
                  </span>{" "}
                 Ravanduru Stores is not responsible for delays caused by
                  circumstances beyond our control, including but not limited to
                  natural disasters, strikes, or courier delays.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Customs and Duties:
                  </span>{" "}
                  International orders may be subject to customs duties and
                  taxes, which are the responsibility of the customer.
                </li>
              </ul>

              <p>5. Returns and Refunds</p>
              <ul>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Eligibility for Returns:
                  </span>{" "}
                  Returns are accepted within 15 days of delivery if the product
                  is damaged, defective, or incorrect. The product must be
                  unopened and in its original packaging.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Refund Process:
                  </span>{" "}
                  Refunds will be processed within 7-10 business days after the
                  returned product is received and inspected. Refunds will be
                  credited in 10 - 15 Days.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Non-Returnable Items:
                  </span>{" "}
                  Perishable goods, such as fresh spices, are non-returnable
                  unless defective.
                </li>
              </ul>

              <p>6. Intellectual Property</p>
              <ul>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Ownership:
                  </span>{" "}
                  All content on this website, including text, images, graphics,
                  and logos, is the intellectual property of Ravanduru Stores and protected under copyright laws.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Use of Content:
                  </span>{" "}
                  You may not reproduce, distribute, or use any content from
                  this website for commercial purposes without our prior written
                  consent.
                </li>
              </ul>

              <p>
                7. Limitation of Liability Ravanduru Stores is not liable
                for any indirect, incidental, or consequential damages arising
                from the use or inability to use our website or products.
              </p>

              <p>
                8. Privacy Policy Our Privacy Policy outlines how we collect,
                use, and protect your personal information. By using our
                website, you consent to the practices described in our Privacy
                Policy.
              </p>

              <p>
                9. Governing Law These Terms and Conditions are governed by the
                laws of India. Any disputes will be subject to the exclusive
                jurisdiction of the courts in Bangalore, India.
              </p>

              <p>
                10. Changes to Terms and Conditions We reserve the right to
                update or modify these Terms and Conditions at any time without
                prior notice. Changes will be effective immediately upon posting
                on this website.
              </p>

              <p>
                11. Contact Us If you have any questions or concerns regarding
                these Terms and Conditions, please contact us at:
              </p>
              <ul>
                <li>
                  Email:{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      marginLeft: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    av.kitchens1532@gmail.com
                  </span>
                </li>
                <li>
                  Phone:{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      marginLeft: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    +91 7899830366
                  </span>
                </li>
              </ul>

              <p>
                By continuing to use our website and services, you acknowledge
                that you have read, understood, and agreed to these Terms and
                Conditions.
              </p>
            </div>
          </div>
        </Container>

        <ScrollToTop />

        {/* FOOTER */}
        {/* <Footer /> */}
      </div>
    </>
  );
}
