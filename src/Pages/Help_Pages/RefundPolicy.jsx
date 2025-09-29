
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";

import ScrollToTop from "../../Component/ScrollToTop";
import SearchBar from "../../Component/SearchBar";

export default function RefundPolicy() {
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

        {/* REFUND POLICY */}
        <Container>
          <div
            style={{
              margin: "0% 10% 10% 10%",
              fontFamily: "oswald, sans-serif",
            }}
          >
            <h1
              style={{
                lineHeight: "1.5",
                letterSpacing: "2px",
                fontSize: "75px",
                maxWidth: "100%",
                fontWeight: "bold",
                fontFamily: "oswald, sans-serif",
                textAlign: "center",
                marginBottom: "5%",
                color: "#00614A",
              }}
            >
              REFUND POLICY
            </h1>
            <div className="div-p-ul">
              <p>At Ravanduru Stores,</p>
              <p>
                Customer Satisfaction is Our Priority We at Ravanduru Stores strive
                to ensure that our customers receive the best quality spices and
                service.
              </p>
              <p>
                However, if you are not entirely satisfied with your purchase,
                we are here to help. Eligibility for Refunds
              </p>

              <p
                style={{
                  fontSize: "20px",
                  marginRight: "5px",
                  fontFamily: "oswald, sans-serif",
                  letterSpacing: "1.5px",
                }}
              >
                1. Damaged or Defective Products:
              </p>
              <ul>
                <li>
                  If the product you received is damaged or defective, you are
                  eligible for a refund or replacement. Please report the issue
                  within 7-10 days of receiving the product.
                </li>
              </ul>

              <p
                style={{
                  fontSize: "20px",
                  marginRight: "5px",
                  fontFamily: "oswald, sans-serif",
                  letterSpacing: "1.5px",
                }}
              >
                2. Incorrect Order:
              </p>
              <ul>
                <li>
                  If you receive an incorrect product, please notify us within 7
                  days, and we will arrange for the correct product to be
                  delivered or issue a refund.
                </li>
              </ul>

              <p
                style={{
                  fontSize: "20px",
                  marginRight: "5px",
                  fontFamily: "oswald, sans-serif",
                  letterSpacing: "1.5px",
                }}
              >
                3. Return Conditions:
              </p>
              <ul>
                <li>
                  Products must be unused and in the same condition as received.
                </li>
                <li>
                  The original packaging and invoice must be intact and included
                  with the return.
                </li>
              </ul>

              <p
                style={{
                  fontSize: "20px",
                  marginRight: "5px",
                  fontFamily: "oswald, sans-serif",
                  letterSpacing: "1.5px",
                  marginTop: "5%",
                }}
              >
                Non-Refundable Items:
              </p>
              <p>We regret that the following items are non-refundable:</p>
              <ul>
                <li>Opened or used products.</li>
                <li>Products purchased on clearance or promotional sale.</li>
                <li>Custom or personalized orders. How to Request a Refund</li>
              </ul>

              <p
                style={{
                  fontSize: "20px",
                  marginRight: "5px",
                  fontFamily: "oswald, sans-serif",
                  letterSpacing: "1.5px",
                }}
              >
                1. Contact Us:
              </p>
              <ul>
                <li>
                  Email us at{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    av.kitchens1532@gmail.com
                  </span>{" "}
                  with your order number, details of the issue, and photos of
                  the product (if applicable).
                </li>
                <li>
                  Alternatively, call us at{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    +91 789930366
                  </span>{" "}
                  during business hours.
                </li>
              </ul>

              <p
                style={{
                  fontSize: "20px",
                  marginRight: "5px",
                  fontFamily: "oswald, sans-serif",
                  letterSpacing: "1.5px",
                }}
              >
                2. Processing Time:
              </p>
              <ul>
                <li>
                  Once we receive and inspect your return, we will notify you of
                  the approval or rejection of your refund.
                </li>
                <li>
                  Approved refunds will be processed within 7-10 business days,
                  and the amount will be credited in 10-15 Business days.
                </li>
              </ul>

              <p
                style={{
                  fontSize: "20px",
                  marginRight: "5px",
                  fontFamily: "oswald, sans-serif",
                  letterSpacing: "1.5px",
                }}
              >
                Return Shipping
              </p>
              <ul>
                <li>
                  For eligible returns due to damaged, defective, or incorrect
                  items, we will cover the return shipping costs.
                </li>
                <li>
                  For other returns, shipping costs will be borne by the
                  customer. Exchanges If you wish to exchange a product, please
                  contact us. Exchanges are subject to stock availability and
                  applicable terms.
                </li>
              </ul>

              <p
                style={{
                  fontSize: "20px",
                  marginRight: "5px",
                  fontFamily: "oswald, sans-serif",
                  letterSpacing: "1.5px",
                }}
              >
                Cancellation Policy
              </p>
              <ul>
                <li>
                  Orders can be cancelled within 24 hours of placing the order
                  for a full refund.
                </li>
                <li>
                  If the order has already been shipped, cancellation will not
                  be possible.
                </li>
              </ul>

              <p
                style={{
                  fontSize: "20px",
                  marginRight: "5px",
                  fontFamily: "oswald, sans-serif",
                  letterSpacing: "1.5px",
                }}
              >
                Contact Us
              </p>
              <ul>
                <p>
                  If you have any questions about our Refund Policy or need
                  assistance, feel free to reach out:
                </p>
                <li>
                  Email:{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
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
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    +91 789930366
                  </span>
                </li>
                <li>
                  Address:{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                   #1881/3A, WESLEY ROAD, MYSORE
                  </span>
                </li>
                <li>
                  State Name:{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      marginRight: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Karnataka, Code : 29
                  </span>
                </li>
              </ul>

              <p>
                We value your feedback and look forward to serving you better!
                Thank you for choosing Ravanduru Stores!
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
