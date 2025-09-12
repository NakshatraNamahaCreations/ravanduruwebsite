import { Container, Button, Badge, Spinner } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import visiblestar from "/media/Star-visible.png";
import hiddenstar from "/media/Star-hidden.png";
import arrowLeft from "/media/Leftarrow.png";
import arrowRight from "/media/Rightarrow.png";
import fallbackImg from "/media/products.png"; // fallback if product image fails
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

// ---- Backend URLs ----
const API_BASE = "https://api.ravandurustores.com";
const PRODUCTS_URL = `${API_BASE}/api/products`;

// Convert API image path to an absolute URL
function toAbsolute(u) {
  if (!u) return "";
  // already absolute or protocol-relative
  if (/^(https?:)?\/\//i.test(u)) return u.startsWith("//") ? window.location.protocol + u : u;
  if (/^data:|^blob:/i.test(u)) return u;
  // starts with "/" -> join with API base
  if (u.startsWith("/")) return `${API_BASE}${u}`;
  // plain "uploads/..." -> add slash
  return `${API_BASE}/${u}`;
}

// Some APIs return images as array of strings or array of objects
function firstImageOf(p) {
  if (Array.isArray(p.images) && p.images.length) {
    const v = p.images[0];
    if (typeof v === "string") return v;
    return v?.url || v?.src || v?.path || "";
  }
  return p.image || p.thumbnail || p.featuredImage || "";
}

export default function Products_Sliders() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [serverProducts, setServerProducts] = useState([]);
  const navigate = useNavigate();

  // fade-in
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ---- Fetch products from backend ----
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(PRODUCTS_URL, {
          headers: { "Content-Type": "application/json" },
          // credentials: "include", // only if your API truly needs cookies
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const raw = Array.isArray(data) ? data : (data.items || data.data || []);

        const mapped = (raw || []).map((p) => {
          const rawImg = firstImageOf(p);
          const img = toAbsolute(rawImg);

          const originalPrice = Number(
            p.originalPrice ??
              p.mrp ??
              p.price ??
              p.variants?.[0]?.mrp ??
              p.variants?.[0]?.price ??
              0
          );
          const discountedPrice = Number(
            p.discountPrice ??
              p.salePrice ??
              p.price ??
              p.variants?.[0]?.price ??
              originalPrice
          );

          return {
            id: p._id || p.id,
            slug: p.slug,
            name: p.name || p.productName || "Product",
            image: img,
            originalPrice,
            discountedPrice,
          };
        });

        // Keep only products that can render safely
        const safe = mapped.filter((x) => x.id && x.name && x.image);

        if (alive) setServerProducts(safe);
      } catch (e) {
        if (alive) setErr(e.message || "Failed to load products");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ---- Slick arrows ----
  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          right: "-10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          cursor: "pointer",
        }}
      >
        <img src={arrowRight} alt="Next" style={{ width: 30, height: 30 }} />
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          left: "-10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          cursor: "pointer",
        }}
      >
        <img src={arrowLeft} alt="Previous" style={{ width: 30, height: 30 }} />
      </div>
    );
  };

  // ---- Slick settings ----
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, arrows: false } },
    ],
  };

  const products = useMemo(() => serverProducts, [serverProducts]);

  const handleCardClick = (idOrSlug) => {
    const found = products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (found?.slug) navigate(`/products/${found.slug}`);
    else navigate(`/productsdetails/${idOrSlug}`);
  };

  return (
    <div
      className="page-content"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      <Container className="my-4 mt-5">
        <style>{`
          .slick-slide > div { padding: 12px; } 
          .v-card{
            border-radius:16px; display:flex; flex-direction:column; height:100%; overflow:hidden;
            background:#fff; box-shadow:0 4px 18px rgba(0,0,0,.06);
          }
          .v-img{width:100%; height:220px; object-fit:contain; background:#fafafa;}
          .v-body{padding:14px 16px; color:#00614A; display:flex; flex-direction:column; gap:8px; flex:1;}
          .v-title{font-size:16px; font-weight:bold; margin:0; font-family:poppins; text-align:center}
          .v-stars{display:flex; gap:8px;}
          .v-price{display:flex; align-items:center; gap:8px; font-size:17px;}
          .v-old{text-decoration:line-through; text-decoration-thickness:2px; text-decoration-color:red; opacity:.5;}
          .v-btn{margin-top:auto;}
        `}</style>

        {loading && (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {!loading && err && (
          <div className="text-center text-danger py-4" style={{ fontFamily: "poppins" }}>
            Failed to load products: {err}
          </div>
        )}

        {!loading && !err && products.length === 0 && (
          <div className="text-center py-4" style={{ fontFamily: "poppins" }}>
            No products to display right now.
          </div>
        )}

        {!loading && !err && products.length > 0 && (
          <Slider {...settings}>
            {products.map((item) => (
              <div key={item.id}>
                <div className="v-card" style={{ height: "400px" }}>
                  <img
                    className="v-img"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImg; // fallback if image 404/blocked
                    }}
                  />

                  <div className="v-body">
                    <h6 className="v-title" title={item.name}>
                      {item.name}
                    </h6>

                    <div className="v-stars" style={{ marginInline: "auto" }}>
                      {[visiblestar, visiblestar, visiblestar, visiblestar, hiddenstar].map((s, k) => (
                        <img key={k} src={s} alt="star" style={{ width: 14, height: 14 }} />
                      ))}
                    </div>

                    <div className="v-price" style={{ marginInline: "auto" }}>
                      {item.originalPrice > item.discountedPrice && item.originalPrice > 0 && (
                        <span className="v-old">₹{Number(item.originalPrice).toFixed(2)}</span>
                      )}
                      <span style={{ fontWeight: "bold", color: "#00614A", marginRight: 8 }}>
                        ₹{Number(item.discountedPrice || item.originalPrice || 0).toFixed(2)}
                      </span>
                      {item.originalPrice > item.discountedPrice && item.originalPrice > 0 && (
                        <Badge bg="success" className="discount-badge">
                          {Math.max(
                            0,
                            Math.round(
                              ((Number(item.originalPrice) - Number(item.discountedPrice)) /
                                Number(item.originalPrice)) * 100
                            )
                          )}
                          % OFF
                        </Badge>
                      )}
                    </div>

                    <Button
                      onClick={() => handleCardClick(item.slug || item.id)}
                      variant="none"
                      className="v-btn"
                      style={{
                        fontWeight: "bold",
                        color: "#00614A",
                        backgroundColor: "#97d7c6",
                        fontSize: 16,
                        padding: "10px 10px",
                        letterSpacing: ".4px",
                        width: "80%",
                        marginInline: "auto",
                        fontFamily: "poppins",
                      }}
                    >
                      VIEW PRODUCT
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </Container>
    </div>
  );
}
