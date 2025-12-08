// Best_Seller.jsx
import { Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import visiblestar from "/media/Star-visible.png";
import hiddenstar from "/media/Star-hidden.png";
import "./BestSeller.css";

export default function Best_Seller() {
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE = "https://api.ravandurustores.com";
  const PRODUCTS_URL = `${API_BASE}/api/products`;

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // build correct image URL from API path like "/uploads/xxx.jpg"
  const makeImageUrl = (img) => {
    if (!img) return "/media/default.jpg"; // fallback

    // if already a full URL, just return it
    if (/^https?:\/\//i.test(img)) return img;

    // API gives "/uploads/xxx.jpg" -> make it "https://api.../uploads/xxx.jpg"
    return `${API_BASE}/${img.replace(/^\/+/, "")}`;
  };

  // helpers to compute price/discount
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const variantSale = (v) => {
    const mrp = toNum(v?.price);
    const disc = toNum(v?.discountPrice);
    return disc > 0 && disc < mrp ? disc : mrp;
  };

  const bestPrices = (p) => {
    if (Array.isArray(p?.variants) && p.variants.length) {
      let bestSale = Infinity;
      let bestMrp = Infinity;

      for (const v of p.variants) {
        const mrp = toNum(v?.price);
        const sale = variantSale(v);
        if (sale < bestSale) bestSale = sale;
        if (mrp < bestMrp) bestMrp = mrp;
      }

      if (!Number.isFinite(bestSale)) bestSale = 0;
      if (!Number.isFinite(bestMrp)) bestMrp = bestSale;

      return { originalPrice: bestMrp, discountedPrice: bestSale };
    }

    const mrp = toNum(p?.price);
    const disc = toNum(p?.discountPrice);
    const sale = disc > 0 && disc < mrp ? disc : mrp;

    return {
      originalPrice: mrp || sale,
      discountedPrice: sale || 0,
    };
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const resp = await fetch(PRODUCTS_URL, { method: "GET" });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const body = await resp.json();
        const list = Array.isArray(body)
          ? body
          : Array.isArray(body.products)
          ? body.products
          : Array.isArray(body.items)
          ? body.items
          : [];

        // ✅ 1) Filter OUT out-of-stock products (stock <= 0 or missing)
        const inStockOnly = list.filter((p) => {
          const stockVal =
            typeof p.stock === "number"
              ? p.stock
              : toNum(p.stock); // fallback if it's string
          return stockVal > 0;
        });

        const formatted = inStockOnly.map((p) => {
          const { originalPrice, discountedPrice } = bestPrices(p);
          const percentOff =
            originalPrice > 0 &&
            discountedPrice >= 0 &&
            originalPrice > discountedPrice
              ? Math.max(
                  0,
                  Math.round(
                    ((originalPrice - discountedPrice) / originalPrice) * 100
                  )
                )
              : 0;

          return {
            id: p._id,
            name: p.name || p.productName || "",
            image: makeImageUrl(p.images?.[0]), // ✅ full URL
            originalPrice,
            discountedPrice,
            percentOff,
            stock:
              typeof p.stock === "number"
                ? p.stock
                : toNum(p.stock), // keep if needed later
          };
        });

        if (!cancelled) setProducts(formatted);
      } catch (e) {
        console.error("Error fetching products:", e);
        if (!cancelled) {
          setProducts([]);
          setError("Failed to fetch products");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // search (?search=)
  const { search } = useLocation();
  const q = (new URLSearchParams(search).get("search") || "").toLowerCase();

  const filtered = useMemo(
    () =>
      q ? products.filter((p) => p.name?.toLowerCase().includes(q)) : products,
    [q, products]
  );

  const handleCardClick = (id) => navigate(`/productsdetails/${id}`);

  return (
    <div
      className="page-content"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      <div
        style={{
          backgroundColor: "#FBF9F4",
          fontFamily: "poppins, sans-serif",
          position: "relative",
        }}
      >
        <Container>
          <div style={{ padding: 30, marginTop: "3%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <h1
                style={{
                  fontWeight: "bold",
                  color: "#00614A",
                  textAlign: "center",
                  fontSize: 35,
                }}
              >
                BEST SELLERS
              </h1>
            </div>

            {loading ? (
              <p>Loading products…</p>
            ) : error ? (
              <p>{error}</p>
            ) : filtered.length === 0 ? (
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  textAlign: "center",
                  color: "#00614A",
                }}
              >
                No matching products found.
              </p>
            ) : (
              <div className="product-grid">
                {filtered.map((item) => (
                  <article
                    key={item.id}
                    className="product-card"
                    aria-label={item.name}
                  >
                    <div
                      className="product-image-wrap"
                      style={{
                        width: "100%",
                        height: 220,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="product-image"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/media/default.jpg";
                        }}
                      />
                    </div>

                    <div className="product-body">
                      <h4 className="product-name">{item.name}</h4>

                      <div className="product-rating" aria-hidden="true">
                        {[visiblestar, visiblestar, visiblestar, visiblestar, hiddenstar].map(
                          (s, i) => (
                            <img
                              key={i}
                              src={s}
                              alt="star"
                              style={{ width: 16, height: 16 }}
                            />
                          )
                        )}
                      </div>

                      <div className="product-pricing">
                        <p className="price">
                          ₹ {item.discountedPrice?.toFixed(2)}
                        </p>

                        {item.originalPrice > item.discountedPrice && (
                          <span className="mrp">
                            ₹ {item.originalPrice?.toFixed(2)}
                          </span>
                        )}

                        {item.percentOff > 0 && (
                          <span className="discount-badge">
                            {item.percentOff}% OFF
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCardClick(item.id)}
                        className="view-product-btn"
                        type="button"
                      >
                        VIEW PRODUCT
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
