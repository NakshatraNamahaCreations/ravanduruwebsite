import { Container, Button, Form, FormControl, Badge } from "react-bootstrap";
import placeholderImg from "/media/products.png"; // rename to avoid confusion
import visiblestar from "/media/Star-visible.png";
import hiddenstar from "/media/Star-hidden.png";
import lock from "/media/Silverlock.png";
import smile from "/media/Smile.png";
import linelock from "/media/whiteLine.png";
import Chakaliimageflipreverse from "/media/Chakaliimageflip-reverse.png";
import Chakaliimage from "/media/Chakaliimage.png";
import Chakaliimagereverse from "/media/Chakaliimage-reverse.png";
import Chakaliimageflip from "/media/Chakaliimageflip.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Reviews from "../Home_Pages/Reviews";
import ScrollToTop from "../../Component/ScrollToTop";
import { FaTrash } from "react-icons/fa";

const API_BASE = "https://api.ravandurustores.com";

export default function Wishlist() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]); // normalized items
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // helpers
  const getUserId = (u) => u?.id || u?._id || u?.user?.id || u?.user?._id || null;
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // Normalize server response into a stable shape used by UI
  const normalize = (entry) => {
    const p = entry?.product || entry || {};
    const image =
      p.image ||
      (Array.isArray(p.images) && p.images[0]) ||
      p.thumbnail ||
      p.featuredImage ||
      placeholderImg;

    const originalPrice = toNum(p.originalPrice ?? p.mrp ?? p.price ?? 0);
    const discountedPrice = toNum(p.discountedPrice ?? p.price ?? originalPrice);
    const price = toNum(p.price ?? discountedPrice ?? originalPrice); // ensure we always have a unit price
    const quantity = toNum(p.quantity ?? entry?.quantity ?? 1) || 1;

    return {
      _id: p._id || p.id || entry?.productId,       // product id
      productId: entry?.productId || p._id || p.id, // keep both for API ops
      name: p.name || p.title || "Product",
      image,
      originalPrice,
      discountedPrice,
      price,        // <= use this for display
      quantity,     // default 1 for wishlists
      variants: p.variants || entry?.variants || [], // keep if backend sometimes sends variants
    };
  };

  // Load wishlist
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const user = JSON.parse(localStorage.getItem("user") || "null");
        const userId = getUserId(user);
        if (!userId) {
          setErr("Please log in to view your wishlist.");
          setProducts([]);
          return;
        }

        const res = await fetch(`${API_BASE}/api/wishlist/${encodeURIComponent(userId)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const list =
          (Array.isArray(data) && data) ||
          data.items ||
          data.data ||
          data.wishlist ||
          data.products ||
          [];

        setProducts((list || []).map(normalize));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setErr(error?.message || "Failed to load wishlist.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Remove from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = getUserId(user);

    if (!userId) {
      alert("Please log in to remove from wishlist.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/wishlist/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

      setProducts((prev) =>
        (prev || []).filter((p) => p._id !== productId && p.productId !== productId)
      );
      alert("Product removed from wishlist!");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Something went wrong. Try again.");
    }
  };

  const handleCardClick = (id) => {
    if (id) navigate(`/productsdetails/${id}`);
  };

  // Search
  const filteredProducts = (products || []).filter((card) =>
    (card.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div
        className="page-content"
        style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}
      >
        {/* SEARCH */}
        <Container
          className="my-4 search-container"
          style={{ margin: "auto", width: "850px", fontFamily: "poppins, sans-serif" }}
        >
          <Form className="d-flex custom-search" onSubmit={(e) => e.preventDefault()}>
            <FormControl
              type="search"
              placeholder="Search our products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="me-2 input-account-forms search-input"
              style={{ border: "1.5px solid #00614A", letterSpacing: "1px" }}
            />
            <div
              className="search-button-slider"
              style={{
                padding: "5px 24px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#00614A",
                backgroundImage: "url('/media/Searchbutton.png')",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                border: "none",
                fontSize: "18px",
                letterSpacing: "1px",
                margin: "0 10px",
                cursor: "pointer",
                fontFamily: "poppins",
              }}
            >
              SEARCH
            </div>
          </Form>
        </Container>

        {/* CONTENT */}
        <div
          style={{ backgroundColor: "#FBF9F4", fontFamily: "poppins, sans-serif", position: "relative" }}
          className="login-background"
        >
          <Container>
            <div style={{ padding: "30px", marginTop: "3%" }}>
              <h1
                style={{ fontWeight: "bold", color: "#00614A", textAlign: "center", fontSize: "35px" }}
                className="mobile-font"
              >
                YOUR WISHLIST
              </h1>

              {loading && (
                <div style={{ textAlign: "center", marginTop: 40, color: "#00614A" }}>
                  Loading your wishlist…
                </div>
              )}

              {!loading && err && (
                <div style={{ textAlign: "center", marginTop: 40, color: "#c0392b" }}>{err}</div>
              )}

              {!loading && !err && filteredProducts.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                  <img src="/media/Emptycart.png" style={{ width: "250px" }} />
                  <p style={{ fontFamily: "poppins" }}>No products found in your wishlist.</p>
                  <Button
                    variant="dark"
                    style={{ padding: "10px 30px", fontFamily: "Poppins", marginTop: "20px" }}
                    onClick={() => navigate("/best-seller")}
                  >
                    Shop Now
                  </Button>
                </div>
              ) : null}

              {!loading && !err && filteredProducts.length > 0 && (
                <div
                  className="product-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "30px",
                    padding: "10px",
                    margin: "3% 0",
                  }}
                >
                  {filteredProducts.map((item) => {
                    const qty = toNum(item.quantity || 1) || 1;
                    // pick best available unit price
                    const unit =
                      toNum(item.discountedPrice) ||
                      toNum(item.price) ||
                      toNum(item.variants?.[0]?.price) ||
                      toNum(item.originalPrice);
                    const lineTotal = unit * qty;

                    const percentOff =
                      item.originalPrice > 0 && unit >= 0 && item.originalPrice > unit
                        ? Math.max(0, Math.round(((item.originalPrice - unit) / item.originalPrice) * 100))
                        : 0;

                    return (
                      <div
                        className="product-card"
                        key={item._id || item.productId}
                        style={{
                          borderTopRightRadius: "20px",
                          borderBottomRightRadius: "20px",
                          width: "100%",
                          maxWidth: "800px",
                          display: "flex",
                          margin: "16px auto",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          className="product-image"
                          src={item.image || placeholderImg}
                          alt={item.name}
                          style={{ width: "40%", height: "250px", objectFit: "contain" }}
                          onError={(e) => (e.currentTarget.src = placeholderImg)}
                        />

                        <div
                          className="product-info"
                          style={{
                            padding: "15px 20px",
                            color: "#00614A",
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <h4 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px", textAlign: "left" }}>
                            {item.name}
                          </h4>

                          <div style={{ display: "flex", justifyContent: "start", gap: "5px", marginBottom: "10px" }}>
                            {[visiblestar, visiblestar, visiblestar, visiblestar, hiddenstar].map((star, i) => (
                              <img key={i} src={star} alt="star" style={{ width: "16px", height: "16px" }} />
                            ))}
                          </div>

                          <div
                            className="product-price"
                            style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-start", gap: "10px" }}
                          >
                            {/* Show unit & total cleanly */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ fontSize: "18px" }}>
                               
                                {item.originalPrice > unit && (
                                  <s style={{ marginLeft: 8, opacity: 0.7 }}>₹{item.originalPrice.toFixed(2)}</s>
                                )}
                              </span>
                              <span style={{ fontSize: "22px", marginTop: 4, fontWeight: "bold" }}>
                                Price: ₹{lineTotal.toFixed(2)}
                              </span>
                            </div>

                            {percentOff > 0 && (
                              <Badge bg="success" className="discount-badge">
                                {percentOff}% OFF
                              </Badge>
                            )}
                          </div>

                          <div style={{ display: "flex", gap: 12 }}>
                            <Button
                              onClick={() => handleCardClick(item._id || item.productId)}
                              variant="none"
                              className="view-button"
                              style={{
                                fontWeight: "bold",
                                color: "#00614A",
                                backgroundColor: "#97d7c6",
                                border: "none",
                                padding: "10px 14px",
                                fontSize: "16px",
                                letterSpacing: "1px",
                                textAlign: "left",
                                width: "fit-content",
                              }}
                            >
                              VIEW PRODUCT
                            </Button>

                            <Button
                              variant="none"
                              onClick={() => handleRemoveFromWishlist(item.productId || item._id)}
                              style={{ color: "#FF0000" }}
                              title="Remove from Wishlist"
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Container>
        </div>

        {/* LOCK & SMILE (unchanged visuals) */}
        <div
          style={{
            backgroundImage: "url('/media/Nopreservatives.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            padding: "20px 0 0 0",
            height: "auto",
            color: "white",
            fontFamily: "poppins, sans-serif",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              className="lock-section"
              style={{
                padding: "70px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <img src={lock} alt="Silver Lock" className="lock-image" style={{ width: "25%", height: "auto", objectFit: "cover", zIndex: "999999" }} />
              <h3 style={{ fontSize: "40px", marginLeft: "-17%", letterSpacing: "1px" }}>
                Unlock the path to <br />
                <span style={{ fontWeight: "900", fontSize: "65px" }}>Healthy Snacks</span> <br /> with a smile
              </h3>
              <img src={smile} alt="smile" className="smile-image" style={{ width: "25%", height: "auto", objectFit: "cover", zIndex: "999999" }} />
            </div>

            <div style={{ position: "absolute", bottom: "20%", display: "flex", justifyContent: "center", width: "100%" }}>
              <img src={linelock} alt="lines" className="line-image" style={{ width: "55%", height: "auto", objectFit: "cover" }} />
            </div>
          </div>
        </div>

        <Reviews />
        <ScrollToTop />
      </div>
    </>
  );
}
