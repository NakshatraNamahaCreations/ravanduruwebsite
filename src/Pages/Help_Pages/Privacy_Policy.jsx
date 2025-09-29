import ScrollToTop from "../../Component/ScrollToTop";
import { useEffect, useState } from "react";
import { Container,  } from "react-bootstrap";
import SearchBar from "../../Component/SearchBar";

export default function Privacy_Policy() {
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
        
        {/* PRIVACY POLICY */}
        <Container>
          <div style={{margin: "0% 10% 10% 10%",
              fontFamily: "oswald, sans-serif", }}>
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
                color:'#00614A'
              }}
            >
              PRIVACY POLICY
            </h1>

            <div className="div-p-ul">
              <p style={{ textAlign: "right" }}>
                Effective Date:{" "}
                <span
                  style={{
                    fontSize: "18px",
                    marginRight: "5px",
                    fontFamily: "oswald, sans-serif",
                    letterSpacing: "1.5px",
                  }}
                >
                  10-12-2024
                </span>
              </p>
              <p>
                At Ravanduru Stores, your privacy is important to us. This
                Privacy Policy explains how we collect, use, and protect your
                personal information when you visit our website, purchase our
                products, or interact with us in any way.
              </p>
              <p>
                1. Information We Collect We may collect the following types of
                personal information from you:{" "}
              </p>
              <ul>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginLeft: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Personal Identifiable Information (PII):
                  </span>{" "}
                  Name, email address, phone number, shipping address, and
                  billing address.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginLeft: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Payment Information:
                  </span>{" "}
                  Credit/debit card details and payment method information.
                  (Note: This information is processed securely through
                  third-party payment gateways and is not stored on our
                  servers.)
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginLeft: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    {" "}
                    Account Information:
                  </span>{" "}
                  Login credentials (if you create an account on our website).
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginLeft: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Usage Data:{" "}
                  </span>{" "}
                  Information about how you interact with our website, such as
                  IP address, browser type, pages visited, and time spent.
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "18px",
                      marginLeft: "5px",
                      fontFamily: "oswald, sans-serif",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Other Data:
                  </span>{" "}
                  Privacy Policy for  Ravanduru Stores - Any information you
                  voluntarily provide through surveys, feedback forms, or
                  customer support.
                </li>
              </ul>

              <p>
                2. How We Use Your Information We use your personal information
                for the following purposes:
              </p>
              <ul>
                <li>To process and fulfill your orders.</li>
                <li>To provide customer support and resolve issues.</li>
                <li>
                  To send order confirmations, shipping notifications, and
                  promotional emails (with your consent).
                </li>
                <li>
                  To analyze website performance and improve user experience.
                </li>
                <li>
                  To comply with legal obligations or enforce our terms and
                  policies.
                </li>
              </ul>

              <p>
                3. Sharing Your Information We do not sell or rent your personal
                information to third parties. However, we may share your
                information with:
              </p>
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
                    Service Providers:
                  </span>
                  Third-party vendors who assist in payment processing,
                  shipping, and marketing.
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
                    Legal Authorities:
                  </span>
                  If required by law or to protect our legal rights.
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
                    Business Transfers:
                  </span>
                  In case of a merger, acquisition, or sale of assets.
                </li>
                <li>
                  Cookies and Tracking Technologies Our website uses cookies and
                  similar technologies to enhance user experience. <br />
                  These may include:
                  <ul style={{ listStyleType: "none" }}>
                    <li>
                      <span
                        style={{
                          fontSize: "18px",
                          marginRight: "5px",
                          fontFamily: "oswald, sans-serif",
                          letterSpacing: "1.5px",
                        }}
                      >
                        - Essential Cookies:
                      </span>{" "}
                      For basic website functionality. Privacy Policy for 
                      Ravanduru Stores
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
                        - Analytics Cookies:
                      </span>{" "}
                      To track website performance.
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
                        - Marketing Cookies:
                      </span>{" "}
                      To deliver targeted ads. You can manage your cookie
                      preferences through your browser settings.
                    </li>
                  </ul>
                </li>
                <li>
                  Data Security We take appropriate technical and organizational
                  measures to protect your personal information against
                  unauthorized access, loss, or misuse. <br />
                  These include:
                  <ul style={{ listStyleType: "none" }}>
                    <li>Secure servers and encrypted data transmissions.</li>
                    <li>
                      Regular security audits and updates. However, no method of
                      transmission over the internet is 100% secure, and we
                      cannot guarantee absolute security
                    </li>
                  </ul>
                </li>
                <li>
                  Your Rights You have the following rights regarding your
                  personal information:
                  <ul style={{ listStyleType: "none" }}>
                    <li>
                      <span
                        style={{
                          fontSize: "18px",
                          marginRight: "5px",
                          fontFamily: "oswald, sans-serif",
                          letterSpacing: "1.5px",
                        }}
                      >
                        - Access:
                      </span>{" "}
                      Request a copy of the information we hold about you.
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
                        - Correction:
                      </span>{" "}
                      Update or correct inaccurate information.
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
                        - Deletion:
                      </span>{" "}
                      Request the deletion of your data.
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
                        - Withdrawal of Consent:
                      </span>{" "}
                      Opt-out of marketing communications. To exercise these
                      rights, please contact us at{" "}
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
                  </ul>
                </li>
                <li>
                  Third-Party Links Our website may contain links to third-party
                  websites. We are not responsible for the privacy practices of
                  these websites. We encourage you to read their privacy
                  policies before providing any personal information. Privacy
                  Policy for Ravanduru Stores.
                </li>
                <li>
                  Updates to This Policy We may update this Privacy Policy from
                  time to time. Any changes will be posted on this page with the
                  updated effective date. We encourage you to review this policy
                  periodically.
                </li>
                <li>
                  Contact Us If you have any questions or concerns about this
                  Privacy Policy, please contact us:
                  <ul style={{ listStyleType: "none" }}>
                    <li>
                      - Email:{" "}
                      <span
                        style={{
                          fontSize: "18px",
                          marginRight: "5px",
                          fontFamily: "oswald, sans-serif",
                          letterSpacing: "2px",
                        }}
                      >
                        av.kitchens1532@gmail.com
                      </span>
                    </li>
                    <li>
                      - Phone:{" "}
                      <span
                        style={{
                          fontSize: "18px",
                          marginRight: "5px",
                          fontFamily: "oswald, sans-serif",
                          letterSpacing: "2px",
                        }}
                      >
                        +91 7899830366
                      </span>
                    </li>
                    <li>
                      - Address:{" "}
                      <span
                        style={{
                          fontSize: "18px",
                          marginRight: "5px",
                          fontFamily: "oswald, sans-serif",
                          letterSpacing: "2px",
                        }}
                      >
                        #1881/3A, WESLEY ROAD, MYSORE
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
              <p>
                Thank you for trusting Ravanduru Stores. Your privacy is our
                priority.
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
