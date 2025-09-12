import { Container, Row, Col, Badge } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Categories.css";
import village from "/media/village.png";

export default function Categories() {
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // (kept from your version; not used in grid)
  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  // ----- API -----
  const API_ORIGIN = "https://api.ravandurustores.com";
  const PRODUCTS_URL = `${API_ORIGIN}/api/products`;
  const CATEGORIES_URL = `${API_ORIGIN}/api/categories`;

  // ----- Helpers -----
  const toSlug = (name = "") => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s()-]/g, "")
      .replace(/\s+/g, "-");
  };

  const fromSlug = (slug = "") => {
    try {
      return decodeURIComponent(String(slug)).trim();
    } catch {
      return String(slug).trim();
    }
  };

  const keyOf = (s = "") =>
    s.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w()-]/g, "");

  const percentOffFor = (orig, disc) => {
    const o = Number(orig) || 0;
    const d = Number(disc);
    if (!(o > 0) || !Number.isFinite(d) || d < 0 || d >= o) return 0;
    return Math.max(0, Math.round(((o - d) / o) * 100));
  };

  const parsePrice = (v) => {
    const n = Number(String(v ?? "").toString().replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const parsePercent = (v) => {
    if (v == null) return 0;
    const n = Number(String(v).toString().replace(/[^\d.]/g, ""));
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, n)); // clamp 0..100
  };

  // small reveal anim
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // scroll top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // read slug from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const slug = params.get("category");
    setSelectedCategory(slug ? fromSlug(slug) : null);
  }, [location.search]);

  // fetch categories
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch(CATEGORIES_URL);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const raw = await resp.json();
        const list = Array.isArray(raw) ? raw : raw?.data ?? raw?.categories ?? [];
        const active = (list || []).filter(
          (c) => String(c?.status || "").toLowerCase() === "active"
        );
        if (!cancelled) setCategories(active);
      } catch (err) {
        console.error("Error fetching categories:", err);
        if (!cancelled) setCategories([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // snap selectedCategory to exact backend name
  useEffect(() => {
    if (!selectedCategory || !categories.length) return;
    const match = categories.find((c) => keyOf(c.name) === keyOf(selectedCategory));
    if (match && match.name !== selectedCategory) setSelectedCategory(match.name);
  }, [selectedCategory, categories]);

  // canonicalize URL to pretty query
  useEffect(() => {
    if (!selectedCategory) return;
    const pretty = `?category=${toSlug(selectedCategory)}`;
    if (location.search !== pretty) {
      navigate(encodeURI(`/categories${pretty}`), { replace: true });
    }
  }, [selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  // fetch products
  useEffect(() => {
    let cancelled = false;

    const toAbsolute = (img) =>
      typeof img === "string" && /^https?:\/\//i.test(img)
        ? img
        : `${API_ORIGIN}${img?.startsWith("/") ? img : `/${img || ""}`}`;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const resp = await fetch(PRODUCTS_URL, { method: "GET" });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const raw = await resp.json();
        const list = Array.isArray(raw)
          ? raw
          : raw?.products ?? raw?.data ?? raw?.items ?? raw?.result ?? [];

        const formatted = (list || []).map((p) => {
          const displayName = p.name || p.productName || "";
          const firstImg =
            (Array.isArray(p.images) && p.images.length ? toAbsolute(p.images[0]) : null) ||
            (p.image ? toAbsolute(p.image) : null);

          const categoryName =
            typeof p.category === "string"
              ? p.category
              : p.category?.name || p.category?.title || "";

          // base/original price
          const originalPrice = parsePrice(
            p.originalPrice ?? p.mrp ?? p.price ?? p.variants?.[0]?.mrp ?? p.variants?.[0]?.price
          );

          // read percent first (since backend gives %)
          const discountPercent = parsePercent(
            p.discountPercent ??
              p.discount_percentage ??
              p.discount ??
              p.offerPercent ??
              p.offer_percentage ??
              p.offer
          );

          // fallback discounted price (if backend still sends it)
          let discountedPrice = parsePrice(
            p.discountPrice ?? p.salePrice ?? p.price ?? p.variants?.[0]?.price ?? originalPrice
          );

          // if percent available, compute discountedPrice from originalPrice
          if (discountPercent > 0 && originalPrice > 0) {
            discountedPrice = Number((originalPrice * (1 - discountPercent / 100)).toFixed(2));
          }

          return {
            id: p._id || p.id,
            name: displayName,
            image: firstImg,
            images: Array.isArray(p.images) ? p.images.map(toAbsolute) : firstImg ? [firstImg] : [],
            category: categoryName,
            originalPrice,
            discountedPrice,
            discountPercent, // keep for UI
          };
        });

        if (!cancelled) setProducts(formatted);
      } catch (err) {
        console.error("Products fetch failed:", err);
        if (!cancelled) {
          setError("Failed to fetch products");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCategorySelect = (categoryName) => {
    const next = categoryName === "All" ? "" : `?category=${toSlug(categoryName)}`;
    navigate(encodeURI(`/categories${next}`));
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => keyOf(p.category) === keyOf(selectedCategory))
    : products;

  // (unused locally)
  const toNumber = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const orig = toNumber(product?.originalPrice);
  const disc = toNumber(product?.discountedPrice ?? product?.price ?? orig);
  const displayAmount = orig > 0 ? orig * (quantity || 1) : (toNumber(price) * (quantity || 1));

  return (
    <>
      <div
        className="page-content"
        style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}
      >
        <div style={{ backgroundColor: "#ffff", padding: "20px", color: "#002209" }}>
          <Container className="mt-4">
            <Row>
              {/* Sidebar would go here; call handleCategorySelect(name) on click */}

              <Col md={9}>
                {selectedCategory && (
                  <h1
                    style={{
                      textAlign: "left",
                      fontSize: "25px",
                      fontWeight: 700,
                      marginBottom: "50px",
                      fontFamily: "poppins",
                      letterSpacing: "1px",
                    }}
                  >
                    {selectedCategory}
                  </h1>
                )}

                {loading ? (
                  <p>Loading products...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : filteredProducts.length === 0 ? (
                  <p style={{ fontFamily: "montserrat", fontSize: "30px", fontWeight: "bold" }}>
                    Coming Soon
                  </p>
                ) : (
                  <div
                    className="product-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: "30px",
                      marginTop: "3%",
                    }}
                  >
                    {filteredProducts.map((item) => {
                      const pct =
                        Number(item.discountPercent) > 0
                          ? Math.round(Number(item.discountPercent))
                          : percentOffFor(item.originalPrice, item.discountedPrice);

                      return (
                        <Link
                          key={item.id}
                          to={`/productsdetails/${item.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <div className="product-cards">
                            <div className="product-media">
                              <img
                                src={item.image || "/placeholder.png"}
                                alt={item.name}
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.png";
                                }}
                              />
                            </div>

                            <h4
                              style={{
                                fontSize: 16,
                                fontWeight: 600,
                                fontFamily: "poppins",
                                margin: 0,
                              }}
                            >
                              {item.name}
                            </h4>

                            <div
                              className="product-price"
                              style={{ display: "flex", alignItems: "center", gap: 12 }}
                            >
                              <p
                                style={{
                                  fontSize: 18,
                                  fontWeight: 700,
                                  margin: 0,
                                  whiteSpace: "nowrap",
                                  fontFamily: "poppins",
                                }}
                              >
                                Rs {Number(item.discountedPrice || 0).toFixed(2)}
                              </p>

                              {pct > 0 && (
                                <Badge
                                  bg="success"
                                  className="discount-badge"
                                  style={{
                                    fontFamily: "poppins",
                                    backgroundColor: "#28a745",
                                    color: "#fff",
                                    borderRadius: "12px",
                                    padding: "4px 8px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                  }}
                                >
                                  {pct}% OFF
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </Col>
            </Row>
          </Container>
          <div style={{ marginTop: "-5%" }}>
            <img
              src={village}
              alt="village"
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
