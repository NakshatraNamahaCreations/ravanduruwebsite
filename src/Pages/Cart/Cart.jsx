import Navbar_Menu from "../../Components/Navbar_Menu";
import { Container, Table, Button } from "react-bootstrap";
import { useSpring } from "react-spring";
import { useState, useEffect } from "react";
import Vector from "/media/Vector.png";
import { Link } from "react-router-dom";
import LearnMore from "../Home/LearnMore";
import Footer from "../../Components/Footer";
import { useSelector, useDispatch } from "react-redux";
import cart from "/media/Carttroll.png";
import { useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../../redux/cartSlice";
import ScrollToTop from "../../Component/ScrollToTop";

export default function Cart() {
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

  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  // Fix: Ensure price and quantity are numbers to avoid NaN
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1),
    0
  );

  const zoomIn = useSpring({
    transform: hovered ? "scale(1)" : "scale(0.9)",
    opacity: hovered ? 1 : 1,
    config: { tension: 250, friction: 25 },
  });

  return (
    <>
      <div
        className="page-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {/* Navbar */}
        <Navbar_Menu />

        <Container>
          {cartItems.length === 0 ? (
            <div style={{ margin: "15% 0% 10% 0%", textAlign: "center" }}>
              <h1
                style={{
                  letterSpacing: "3px",
                  fontSize: "75px",
                  fontWeight: "bold",
                  fontFamily: "oswald, sans-serif",
                }}
                className="h1-shopping-empty"
              >
                YOUR SHOPPING CART IS EMPTY
              </h1>
              <div style={{ margin: "5% 0" }}>
                <img
                  src={cart}
                  alt="cart"
                  style={{ width: "35%", height: "auto", objectFit: "cover" }}
                />
              </div>
              <h4
                style={{
                  fontFamily: "oswaldMedium, sans-serif" ,
                  fontSize: "30px",
                  letterSpacing: "1px",
                }}
              >
                Hey, it feels so light!
              </h4>
              <p>There is nothing in your cart. Let’s add some spices.</p>
              <Link to="/all-products">
                <div
                  style={{
                    position: "relative",
                    width: "35%",
                    height: "70px",
                    margin: "5% auto",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <animated.img
                    src={Vector}
                    alt="Vector-img"
                    style={{
                      ...zoomIn,
                      width: "70%",
                      height: "100%",
                      display: "block",
                      margin: "0 auto",
                    }}
                    className="vector-shop"
                  />
                  <h3
                    style={{
                      position: "absolute",
                      top: "25%",
                      fontSize: "28px",
                      fontWeight: "bold",
                      letterSpacing: "2px",
                      color: "white",
                      width: "100%",
                      textAlign: "center",
                      fontFamily: "oswald, sans-serif",
                      marginBottom: "0px",
                    }}
                    className="shop-btn"
                  >
                    SHOP NOW
                  </h3>
                </div>
              </Link>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "oswald, sans-serif" }}>
                <h1
                  style={{
                    letterSpacing: "2px",
                    fontSize: "45px",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "30px",
                    margin: "15% 0% 5% 0%",
                    fontFamily: "oswald, sans-serif",
                  }}
                >
                  YOUR CART
                </h1>

                <div>
                  {/* Cart Table */}
                  <Table
                    className="custom-table"
                    hover
                    responsive
                    style={{ margin: "auto" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center", padding: "10px" }}>
                          Image
                        </th>
                        <th style={{ textAlign: "center", padding: "10px" }}>
                          Product Name
                        </th>
                        <th style={{ textAlign: "center", padding: "10px" }}>
                          Quantity
                        </th>
                        <th style={{ textAlign: "center", padding: "10px" }}>
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => {
                        const itemPrice = parseFloat(item.price) || 0;
                        const itemQuantity = parseInt(item.quantity) || 1;
                        const totalItemPrice = itemPrice * itemQuantity;

                        return (
                          <tr key={item.id} style={{ textAlign: "center" }}>
                            <td style={{ padding: "10px" }}>
                              <img
                                src={item.image}
                                alt={item.title}
                                style={{
                                  width: "100px",
                                  height: "auto",
                                  objectFit: "contain",
                                }}
                              />
                            </td>
                            <td style={{ padding: "10px" }}>
                              <h3
                                style={{
                                  fontSize: "30px",
                                  marginBottom: "10px",
                                  fontFamily: "oswald, sans-serif",
                                  letterSpacing: "1px",
                                }}
                              >
                                {item.title}
                              </h3>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <div
                                  style={{
                                    textDecoration: "line-through",
                                    fontSize: "18px",
                                    opacity: "0.5",
                                  }}
                                >
                                  {" "}
                                  &#8377; {item.discountPrice}
                                </div>
                                <div
                                  style={{
                                    fontFamily: "oswald, sans-serif",
                                    fontSize: "24px",
                                  }}
                                >
                                 &#8377; {itemPrice.toFixed(2)}
                                </div>
                              </div>

                              <Button
                                variant="outline-dark"
                                style={{
                                  fontSize: "16px",
                                  padding: "4px 10px",
                                  marginTop: "10px",
                                  fontFamily: "oswaldMedium, sans-serif" 
                                }}
                                onClick={() =>
                                  dispatch(removeFromCart(item.id))
                                }
                              >
                                Remove
                              </Button>
                            </td>
                            <td
                              style={{
                                padding: "10px",

                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      id: item.id,
                                      quantity: Math.max(1, itemQuantity - 1),
                                    })
                                  )
                                }
                                style={{
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                  border: "1px solid #ccc",
                                  backgroundColor: "#f8f9fa",
                                  cursor: "pointer",
                                  marginRight: "15px",
                                }}
                              >
                                −
                              </button>
                              <span
                                style={{
                                  width: "40px",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                {itemQuantity}
                              </span>
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      id: item.id,
                                      quantity: itemQuantity + 1,
                                    })
                                  )
                                }
                                style={{
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                  border: "1px solid #ccc",
                                  backgroundColor: "#f8f9fa",
                                  cursor: "pointer",
                                  marginLeft: "15px",
                                }}
                              >
                                +
                              </button>
                            </td>

                            <td style={{ padding: "10px" }}>
                              Rs {totalItemPrice.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                {/* Subtotal Section */}
                <div
                  style={{
                    display: "block",
                    justifySelf: "end",
                    margin: "5% 0",
                  }}
                >
                  <h1 style={{ letterSpacing: "1px" }}>
                    SUB TOTAL:{" "}
                    <span style={{ float: "right" }}>
                      Rs {subtotal.toFixed(2)}
                    </span>
                  </h1>
                  <p style={{ fontSize: "18px", letterSpacing: "0.5px", fontFamily: "oswaldMedium, sans-serif"  }}>
                    Taxes, discounts, and shipping calculated at checkout.
                  </p>

                  <div
                    style={{
                      position: "relative",
                      width: "80%",
                      height: "70px",
                      margin: "5% auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() =>
                      navigate("/checkout", { state: { cartItems, subtotal } })
                    }
                  >
                    {/* Image */}
                    <animated.img
                      src={Vector}
                      alt="Vector-img"
                      style={{
                        ...zoomIn,
                        width: "100%",
                        height: "100%",
                        display: "block",
                      }}
                    />

                    {/* Text Inside Image */}
                    <h3
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "28px",
                        fontWeight: "bold",
                        letterSpacing: "2px",
                        color: "white",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      CHECK OUT
                    </h3>
                  </div>
                </div>
              </div>
            </>
          )}
        </Container>

        <LearnMore />

        <ScrollToTop />

        <Footer />
      </div>
    </>
  );
}
