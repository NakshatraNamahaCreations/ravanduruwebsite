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
import "./Wishlist.css"

const API_BASE = "https://ravandurustores-backend.onrender.com";

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
  className="page-content wishlist-page"
  style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}
>
  {/* SEARCH */}
  <Container className="my-4 search-container">
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
        role="button"
        onClick={() => {/* optionally trigger search if you have handler */}}
      >
        SEARCH
      </div>
    </Form>
  </Container>

  {/* CONTENT */}
  <div className="login-background">
    <Container>
      <div className="wishlist-inner">
        <h1 className="wishlist-title">YOUR WISHLIST</h1>

        {loading && (
          <div className="text-center loading-text">Loading your wishlist…</div>
        )}

        {!loading && err && (
          <div className="text-center error-text">{err}</div>
        )}

        {!loading && !err && filteredProducts.length === 0 ? (
          <div className="empty-wishlist text-center">
            <img src="/media/Emptycart.png" className="empty-img" />
            <p>No products found in your wishlist.</p>
            <Button
              variant="dark"
              className="shop-now-btn"
              onClick={() => navigate("/best-seller")}
            >
              Shop Now
            </Button>
          </div>
        ) : null}

        {!loading && !err && filteredProducts.length > 0 && (
          <div className="product-grid wishlist-grid">
            {filteredProducts.map((item) => {
              const qty = toNum(item.quantity || 1) || 1;
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
                <article key={item._id || item.productId} className="product-card wishlist-card">
                  <div className="product-media">
                    <img
                      className="product-image"
                      src={item.image || placeholderImg}
                      alt={item.name}
                      onError={(e) => (e.currentTarget.src = placeholderImg)}
                    />
                  </div>

                  <div className="product-info">
                    <div>
                      <h4 className="product-name">{item.name}</h4>

                      <div className="product-rating">
                        {[visiblestar, visiblestar, visiblestar, visiblestar, hiddenstar].map((star, i) => (
                          <img key={i} src={star} alt="star" className="star-icon" />
                        ))}
                      </div>

                      <div className="product-price">
                        <div className="price-block">
                          {item.originalPrice > unit && (
                            <s className="mrp">₹{item.originalPrice.toFixed(2)}</s>
                          )}
                          <div className="price-line">Price: ₹{lineTotal.toFixed(2)}</div>
                        </div>

                        {percentOff > 0 && <Badge bg="success" className="discount-badge">{percentOff}% OFF</Badge>}
                      </div>
                    </div>

                    <div className="product-actions">
                      <Button
                        onClick={() => handleCardClick(item._id || item.productId)}
                        variant="none"
                        className="view-button"
                      >
                        VIEW PRODUCT
                      </Button>

                      <Button
                        variant="none"
                        onClick={() => handleRemoveFromWishlist(item.productId || item._id)}
                        className="remove-button"
                        title="Remove from Wishlist"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  </div>

  {/* LOCK & SMILE (responsive) */}
  <div className="lock-smile-section">
    <div className="lock-section-inner">
      <img src={lock} alt="Silver Lock" className="lock-image" />
      <h3 className="lock-heading">
        Unlock the path to <br />
        <span className="lock-heading-strong">Healthy Snacks</span> <br />
        with a smile
      </h3>
      <img src={smile} alt="smile" className="smile-image" />
    </div>

    <div className="line-wrap">
      <img src={linelock} alt="lines" className="line-image" />
    </div>
  </div>

  <Reviews />
  <ScrollToTop />
</div>

    </>
  );
}
