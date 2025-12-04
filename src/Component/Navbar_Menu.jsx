import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
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
const PRODUCTS_URL = "https://ravandurustores-backend.onrender.com/api/products";

//const CATEGORIES_URL = "https://api.ravandurustores.com/api/categories";
//const PRODUCTS_URL = "https://api.ravandurustores.com/api/products";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h cache

const encodeRFC3986 = (s = "") =>
  encodeURIComponent(String(s)).replace(/[!'()*]/g, (c) =>
    `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );

let __PRODUCT_INDEX_MEMO = null;

async function loadProductIndex() {
  if (__PRODUCT_INDEX_MEMO && Array.isArray(__PRODUCT_INDEX_MEMO)) return __PRODUCT_INDEX_MEMO;

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

  const resp = await fetch(PRODUCTS_URL, { method: "GET" });
  if (!resp.ok) throw new Error("Network error");
  const data = await resp.json();
  const items = Array.isArray(data) ? data : (data?.items || []);

  const index = items.map((p) => {
    const displayName = String(p.productName || p.name || p.title || "").trim();
    const nameNoSpaces = displayName.replace(/\s+/g, "");
    return {
      _id: p._id,
      name: displayName,
      link: `/products/${nameNoSpaces}`,
      imageUrl: p.images?.[0]
       ? `https://ravandurustores-backend.onrender.com${p.images[0]}`
     // ? `https://api.ravandurustores.com${p.images[0]}`
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

function matchIncludes(hay, needle) {
  return String(hay || "").toLowerCase().includes(String(needle || "").toLowerCase());
}

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

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!searchWrapRef.current) return;
      if (!searchWrapRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions({ products: [], categories: [] });
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    const t = setTimeout(async () => {
      try {
        const catMatches = categories.filter((c) => matchIncludes(c.name, query)).slice(0, 6);
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

  const prevCountRef = useRef(itemCount);
  useEffect(() => {
    const prev = prevCountRef.current;

    if (itemCount > prev) {
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

    prevCountRef.current = itemCount;
  }, [itemCount]);

  // -- NEW: offcanvas + mobile detection + expanded state --
  const [expanded, setExpanded] = useState(false); // used by Navbar on desktop
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 992 : false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleToggle = () => {
    if (isMobile) {
      setShowOffcanvas(true);
    } else {
      setExpanded((prev) => !prev);
    }
  };

  const handleCloseNav = () => {
    setShowOffcanvas(false);
    setExpanded(false);
  };

  return (
    <div style={{ fontFamily: "oswald, sans-serif" }}>
      <Navbar
        expand="lg"
        expanded={expanded}
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

          {/* Toggle: opens Offcanvas on mobile, collapse on desktop */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />

          {/* Desktop collapse */}
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between navbar-collapse">
            {/* Menu Links */}
            <Nav
              className="me-auto navbar-links"
              style={{ fontSize: "20px", gap: "30px", display: "flex", alignItems: "center" }}
            >
              <NavLink
                to="/"
                onClick={handleCloseNav}
                className={({ isActive }) =>
                  isActive ? "nav-hover-effect active-link" : "nav-hover-effect"
                }
                style={{ color: "#fff", letterSpacing: "1px" }}
              >
                HOME
              </NavLink>

              <NavLink
                to="/best-seller"
                onClick={handleCloseNav}
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
                        onClick={handleCloseNav}
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
                <Link to="/wishlist" onClick={handleCloseNav}>
                  <img src={faHeart} alt="Wishlist" className="icon-img" />
                </Link>
              </div>

              {/* Cart */}
              <div className="icon-box cart-icon-box" style={{ position: "relative" }}>
                <Link to="/your-cart" className="cart-wrapper" onClick={handleCloseNav}>
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
                <Link to="/login" onClick={handleCloseNav}>
                  <img src={Account} alt="Account" className="icon-img" />
                </Link>
              </div>
            </div>
          </Navbar.Collapse>

          {/* Offcanvas for mobile (right side slide) */}
          <Offcanvas
            show={showOffcanvas}
            onHide={() => setShowOffcanvas(false)}
            placement="end"
            aria-labelledby="offcanvasNavbarLabel"
            style={{ width: "380px" }}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                <img
                  src={logo}
                  alt="Ravanduru-Logo"
                  style={{ width: "140px", height: "auto", objectFit: "cover" }}
                />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column" style={{ gap: "10px", fontSize: "18px" }}>
                <NavLink
                  to="/"
                  onClick={handleCloseNav}
                  className={({ isActive }) =>
                    isActive ? "nav-hover-effect active-link" : "nav-hover-effect"
                  }
                  style={{ color: "#000", letterSpacing: "1px", padding: "8px 0", fontWeight:"BOLD" }}
                >
                  HOME
                </NavLink>

                <NavLink
                  to="/best-seller"
                  onClick={handleCloseNav}
                  className={({ isActive }) =>
                    isActive ? "nav-hover-effect active-link" : "nav-hover-effect"
                  }
                  style={{ color: "#000", letterSpacing: "1px", padding: "8px 0", fontWeight:"bold" }}
                >
                  BEST SELLER
                </NavLink>

                <div style={{ marginTop: "8px", marginBottom: "8px" }}>
                  <div style={{ fontWeight: 700, letterSpacing: "1px", marginBottom: "6px" }}>CATEGORIES</div>
                  <div style={{ backgroundColor: "#97D7C6", padding: "8px", borderRadius: "6px" }}>
                    {loading ? (
                      <div>Loading...</div>
                    ) : error ? (
                      <div>{error}</div>
                    ) : categories.length === 0 ? (
                      <div>No categories available</div>
                    ) : (
                      categories.map((category) => (
                        <Link
                          key={category._id}
                          to={`/categories?category=${encodeRFC3986(category.name)}`}
                          onClick={handleCloseNav}
                          className="nav-hover-effect-categories"
                          style={{ display: "block", color: "black", fontSize: "16px", fontWeight: 700, padding: "6px 0",textDecoration:"none", fontFamily:"poppins" }}
                        >
                          {category.name}
                        </Link>
                      ))
                    )}
                  </div>
                </div>

                {/* Icons stacked in Offcanvas */}
                <div style={{ display: "flex", gap: "14px", marginTop: "18px", alignItems: "center" }}>
                  <Link to="/wishlist" onClick={handleCloseNav}>
                    <img src={faHeart} alt="Wishlist" className="icon-img" />
                  </Link>

                  <Link to="/your-cart" onClick={handleCloseNav} style={{ position: "relative" }}>
                    <img src={Cart} alt="Cart" className="icon-img" />
                    {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
                  </Link>

                  <Link to="/login" onClick={handleCloseNav}>
                    <img src={Account} alt="Account" className="icon-img" />
                  </Link>
                </div>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>
    </div>
  );
}
