// Best_Seller.jsx
import { Container, Button, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import visiblestar from "/media/Star-visible.png";
import hiddenstar from "/media/Star-hidden.png";

export default function Best_Seller() {
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const navigate = useNavigate();

  const API_BASE = "https://api.ravandurustores.com";
  const PRODUCTS_URL = `${API_BASE}/api/products`;

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // make relative image paths absolute
  const toAbsolute = (img) =>
    typeof img === "string" && /^https?:\/\//i.test(img)
      ? img
      : `${API_BASE}${img?.startsWith("/") ? img : `/${img || ""}`}`;

  // helpers to compute price/discount
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const variantSale = (v) => {
    const mrp = toNum(v?.price);
    const disc = toNum(v?.discountPrice);
    // sale price for a variant = min(valid discount, price)
    return disc > 0 && disc < mrp ? disc : mrp;
  };
  const bestPrices = (p) => {
    // If variants exist, choose the **lowest** sale price across variants
    if (Array.isArray(p?.variants) && p.variants.length) {
      let bestSale = Infinity;
      let bestMrp  = Infinity;
      for (const v of p.variants) {
        const mrp  = toNum(v?.price);
        const sale = variantSale(v);
        if (sale < bestSale) bestSale = sale;
        if (mrp  < bestMrp ) bestMrp  = mrp;
      }
      // Fallbacks if variant data is weird
      if (!Number.isFinite(bestSale)) bestSale = 0;
      if (!Number.isFinite(bestMrp))  bestMrp  = bestSale;
      return { originalPrice: bestMrp, discountedPrice: bestSale };
    }

    // Otherwise, use top-level fields
    const mrp  = toNum(p?.price);
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

        const formatted = list.map((p) => {
          const { originalPrice, discountedPrice } = bestPrices(p);
          const percentOff =
            originalPrice > 0 && discountedPrice >= 0 && originalPrice > discountedPrice
              ? Math.max(0, Math.round(((originalPrice - discountedPrice) / originalPrice) * 100))
              : 0;

          return {
            id: p._id,
            name: p.name || p.productName || "",
            image: toAbsolute(p.images?.[0] || "/media/default.jpg"),
            originalPrice,
            discountedPrice,
            percentOff,
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
    return () => { cancelled = true; };
  }, []);

  // search (?search=)
  const { search } = useLocation();
  const q = (new URLSearchParams(search).get("search") || "").toLowerCase();
  const filtered = useMemo(
    () => (q ? products.filter((p) => p.name?.toLowerCase().includes(q)) : products),
    [q, products]
  );

  const handleCardClick = (id) => navigate(`/productsdetails/${id}`);

  return (
    <div
      className="page-content"
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}
    >
      <div style={{ backgroundColor: "#FBF9F4", fontFamily: "poppins, sans-serif", position: "relative" }}>
        <Container>
          <div style={{ padding: 30, marginTop: "3%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h1 style={{ fontWeight: "bold", color: "#00614A", textAlign: "center", fontSize: 35 }}>
                BEST SELLERS
              </h1>
            </div>

            {loading ? (
              <p>Loading products…</p>
            ) : error ? (
              <p>{error}</p>
            ) : filtered.length === 0 ? (
              <p style={{ fontSize: 20, fontWeight: 600, textAlign: "center", color: "#00614A" }}>
                No matching products found.
              </p>
            ) : (
              <div
                className="product-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 30,
                  padding: 10,
                  margin: "3% 0",
                }}
              >
                {filtered.map((item) => (
                  <div key={item.id} className="product-card" style={{ display: "flex", margin: "16px auto" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "40%", height: 250, objectFit: "contain" }}
                      onError={(e) => { e.currentTarget.src = "/media/default.jpg"; }}
                    />

                    <div style={{ padding: "15px 20px", color: "#00614A", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <h4 style={{ fontSize: 22, fontWeight: 700, marginBottom: 0, textAlign: "left" }}>{item.name}</h4>

                      <div style={{ display: "flex", gap: 5 }}>
                        {[visiblestar, visiblestar, visiblestar, visiblestar, hiddenstar].map((s, i) => (
                          <img key={i} src={s} alt="star" style={{ width: 16, height: 16 }} />
                        ))}
                      </div>

                      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                        <p style={{ fontSize: 22, margin: 0, fontWeight: "bold" }}>
                          ₹ {item.discountedPrice?.toFixed(2)}
                        </p>

                        {/* Optional strike-through MRP when discounted */}
                        {item.originalPrice > item.discountedPrice && (
                          <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
                            ₹ {item.originalPrice?.toFixed(2)}
                          </span>
                        )}

                        {item.percentOff > 0 && (
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
                            {item.percentOff}% OFF
                          </Badge>
                        )}
                      </div>

                      <Button
                        onClick={() => handleCardClick(item.id)}
                        variant="none"
                        style={{ fontWeight: "bold", color: "#00614A", backgroundColor: "#97d7c6", border: "none", padding: "10px 14px", width: "fit-content" }}
                      >
                        VIEW PRODUCT
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
