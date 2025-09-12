import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "/media/logo.png";
import faHeart from "/media/Whishlistheart.png";
import Cart from "/media/Cart.png";
import Account from "/media/Account.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "./CartIcon.css";
import { useNavigate } from "react-router-dom";

const CATEGORIES_URL = "https://ravandurustores-backend.onrender.com/api/categories";
const PRODUCTS_URL = "https://ravandurustores-backend.onrender.com/api/products"; // list endpoint (NOT /search)
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h cache

// RFC-3986 safe encoder: encodes ! ' ( ) * which encodeURIComponent leaves alone
const encodeRFC3986 = (s = "") =>
  encodeURIComponent(String(s)).replace(/[!'()*]/g, (c) =>
    `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );

let __PRODUCT_INDEX_MEMO = null;

// Build/load a lightweight product index and cache it
async function loadProductIndex() {
  if (__PRODUCT_INDEX_MEMO && Array.isArray(__PRODUCT_INDEX_MEMO)) return __PRODUCT_INDEX_MEMO;

  // localStorage cache
  try {
    const raw = localStorage.getItem("productIndexCache");
    if (raw) {
      const { at, items } = JSON.parse(raw);
      if (Array.isArray(items) && Date.now() - at < CACHE_TTL_MS) {
        __PRODUCT_INDEX_MEMO = items;
        return items;
      }
    }
  } catch {}

  // Fetch from API
  const resp = await fetch(PRODUCTS_URL, { method: "GET" });
  if (!resp.ok) throw new Error("Network error");
  const data = await resp.json();
  const items = Array.isArray(data) ? data : (data?.items || []);

  const index = items.map((p) => {
    // Prefer real product fields; never fall back to category
    const displayName = String(p.productName || p.name || p.title || "").trim();
    const nameNoSpaces = displayName.replace(/\s+/g, "");

    return {
      _id: p._id,
      name: displayName,
      link: `/products/${nameNoSpaces}`, // same format as your Categories page
      imageUrl: p.images?.[0]
        ? `https://ravandurustores-backend.onrender.com${p.images[0]}`
        : "/media/placeholder.png",
      categoryName: p.category || "",
      slug: p.slug || p._id,
    };
  });

  __PRODUCT_INDEX_MEMO = index;
  try {
    localStorage.setItem("productIndexCache", JSON.stringify({ at: Date.now(), items: index }));
  } catch {}
  return index;
}

// Simple contains match (case-insensitive)
function matchIncludes(hay, needle) {
  return String(hay || "").toLowerCase().includes(String(needle || "").toLowerCase());
}

// Product match on name or category
function productMatches(p, q) {
  const s = q.toLowerCase();
  return (
    String(p.name || "").toLowerCase().includes(s) ||
    String(p.categoryName || "").toLowerCase().includes(s)
  );
}

export default function Navbar_Menu() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [suggestions, setSuggestions] = useState({ products: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [productIndexReady, setProductIndexReady] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [liveText, setLiveText] = useState("");

  const searchWrapRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Cart badge (Redux)
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (cartItems.length > 0) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [cartItems]);

  const isCategoryActive = location.pathname.startsWith("/categories");

  // Fetch categories once
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const resp = await fetch(CATEGORIES_URL, { method: "GET" });
        if (!resp.ok) throw new Error("Network error");
        const data = await resp.json();
        const list = Array.isArray(data) ? data : data?.data ?? data?.categories ?? [];
        const active = (list || []).filter(
          (c) => String(c?.status || "").toLowerCase() === "active"
        );
        setCategories(active);
      } catch (e) {
        setError("Failed to fetch categories");
        console.error("Categories fetch failed:", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // Warm up product index
  useEffect(() => {
    let mounted = true;
    loadProductIndex()
      .then(() => mounted && setProductIndexReady(true))
      .catch(() => mounted && setProductIndexReady(false));
    return () => {
      mounted = false;
    };
  }, []);

  const handleSearchToggle = () => {
    setShowSearch((s) => !s);
    setShowSuggestions(false);
    if (!showSearch) setTimeout(() => setShowSuggestions(true), 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  // click outside to close suggestion panel
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!searchWrapRef.current) return;
      if (!searchWrapRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Debounced suggestions (client-side)
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions({ products: [], categories: [] });
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    const t = setTimeout(async () => {
      try {
        // categories – local filter
        const catMatches = categories.filter((c) => matchIncludes(c.name, query)).slice(0, 6);

        // products – from client-side index
        let prodMatches = [];
        if (productIndexReady) {
          const idx = await loadProductIndex();
          prodMatches = idx.filter((p) => productMatches(p, query)).slice(0, 6);
        }

        if (!cancelled) setSuggestions({ products: prodMatches, categories: catMatches });
      } finally {
        if (!cancelled) setIsSearching(false);
        if (!cancelled) setShowSuggestions(true);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, categories, productIndexReady]);

  // Track previous count to detect *adds*
  const prevCountRef = useRef(itemCount);
  useEffect(() => {
    const prev = prevCountRef.current;

    if (itemCount > prev) {
      // Item(s) added
      setAnimate(true);
      setShowMessage(true);
      setLiveText("Item added to cart");

      const animTimer = setTimeout(() => setAnimate(false), 600);
      const msgTimer = setTimeout(() => setShowMessage(false), 1500);

      return () => {
        clearTimeout(animTimer);
        clearTimeout(msgTimer);
      };
    }

    prevCountRef.current = itemCount; // update after checks
  }, [itemCount]);

  return (
    <div style={{ fontFamily: "oswald, sans-serif" }}>
      <Navbar
        expand="lg"
        className="navbar-sticky"
        style={{
          backgroundColor: "#00614A",
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px",
          padding: "0",
        }}
      >
        <Container>
          {/* Logo */}
          <Navbar.Brand href="/">
            <img
              src={logo}
              alt="Ravanduru-Logo"
              className="navbar-logo"
              style={{ width: "150px", height: "auto", objectFit: "cover", marginRight: "20px" }}
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between navbar-collapse">
            {/* Menu Links */}
            <Nav
              className="me-auto navbar-links"
              style={{ fontSize: "20px", gap: "30px", display: "flex", alignItems: "center" }}
            >
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-hover-effect active-link" : "nav-hover-effect"
                }
                style={{ color: "#fff", letterSpacing: "1px" }}
              >
                HOME
              </NavLink>

              <NavLink
                to="/best-seller"
                className={({ isActive }) =>
                  isActive ? "nav-hover-effect active-link" : "nav-hover-effect"
                }
                style={{ color: "#fff", letterSpacing: "1px" }}
              >
                BEST SELLER
              </NavLink>

              {/* Categories Dropdown */}
              <NavDropdown
                title={
                  <span
                    style={{
                      color: isOpen || isCategoryActive ? "#00614A" : "#fff",
                      letterSpacing: "1px",
                      fontWeight: isOpen || isCategoryActive ? "600" : "normal",
                    }}
                  >
                    CATEGORIES
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      style={{
                        margin: "0 10px",
                        transition: "transform 0.3s ease",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        color: isOpen || isCategoryActive ? "#00614A" : "#fff",
                      }}
                    />
                  </span>
                }
                className={`nav-hover-effect ${isOpen || isCategoryActive ? "active-link" : ""}`}
                id="basic-nav-dropdown"
                menuVariant="#97D7C6"
                onToggle={(open) => setIsOpen(open)}
              >
                <div style={{ width: "300px", backgroundColor: "#97D7C6", padding: "10px" }}>
                  {loading ? (
                    <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
                  ) : error ? (
                    <NavDropdown.Item disabled>{error}</NavDropdown.Item>
                  ) : categories.length === 0 ? (
                    <NavDropdown.Item disabled>No categories available</NavDropdown.Item>
                  ) : (
                    categories.map((category) => (
                      <NavDropdown.Item
                        key={category._id}
                        as={Link}
                        to={`/categories?category=${encodeRFC3986(category.name)}`}
                        className="nav-hover-effect-categories"
                        style={{ color: "black", fontSize: "18px", letterSpacing: "1px", fontWeight: "700" }}
                      >
                        {category.name}
                      </NavDropdown.Item>
                    ))
                  )}
                </div>
              </NavDropdown>
            </Nav>

            {/* Icons Section */}
            <div className="d-flex gap-3 text-white navbar-icons">
              {/* Wishlist */}
              <div className="icon-box">
                <Link to="/wishlist">
                  <img src={faHeart} alt="Wishlist" className="icon-img" />
                </Link>
              </div>

              {/* Cart */}
              <div className="icon-box cart-icon-box"> {/* ensure position:relative in CSS */}
                <Link to="/your-cart" className="cart-wrapper">
                  <div className={`cart-icon ${animate ? "cart-bounce" : ""} icon-box`}>
                    <img src={Cart} alt="Cart" className="icon-img" />
                    {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
                  </div>
                </Link>

                {/* Floating “Item Added” text */}
                {showMessage && <span className="cart-message">Item added to cart!</span>}

                {/* Screen-reader live region */}
                <span className="sr-only" aria-live="polite">
                  {liveText}
                </span>
              </div>

              {/* Account */}
              <div className="icon-box">
                <Link to="/login">
                  <img src={Account} alt="Account" className="icon-img" />
                </Link>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
