// src/Component/ProductsDetails.jsx
import { Button, Row, Col, Badge, Table } from "react-bootstrap";
import Products_Sliders from "./Products_Sliders";
import "./ProductDetails.css";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { useDispatch } from "react-redux";

import ScrollToTop from "../Component/ScrollToTop";

const API_BASE = "https://api.ravandurustores.com";

const toAbsolute = (img) =>
  typeof img === "string" && /^https?:\/\//i.test(img)
    ? img
    : `${API_BASE}${img?.startsWith("/") ? img : `/${img || ""}`}`;

export default function ProductsDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    let abort = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const resp = await fetch(
          `${API_BASE}/api/products/${encodeURIComponent(id)}`
        );
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (abort) return;

        const clampPct = (pct) =>
          Math.min(100, Math.max(0, Number(pct || 0)));
        const priceAfterPct = (base, pct) =>
          +(
            Math.max(0, Number(base) * (1 - clampPct(pct) / 100))
          ).toFixed(2);
        const pctFromPrices = (base, final) =>
          Number(base) > 0
            ? Math.round(
                ((Number(base) - Number(final)) / Number(base)) * 100
              )
            : 0;

        const variants = Array.isArray(data?.variants) ? data.variants : [];
        const images = Array.isArray(data?.images) ? data.images : [];

        // Admin discount %
        const pct = clampPct(data?.discountPercentage);

        const imgs = images.map((img, i) => {
          const v = variants[i] ?? variants[0] ?? {};
          const base = Number(
            v.price ?? data.price ?? data.mrp ?? data.originalPrice ?? 0
          );

          const final =
            pct > 0 ? priceAfterPct(base, pct) : Number(data.discountPrice ?? base);

          return {
            src: toAbsolute(img),
            weight: v.quantity ?? "",
            unit: v.unit ?? "",
            price: final,
            originalPrice: base,
            discountedPrice: final,
          };
        });

        const base0 = imgs[0]?.originalPrice ?? 0;
        const final0 = imgs[0]?.discountedPrice ?? 0;

        const formatted = {
          id: data._id,
          name: data.name,
          category: data.category,
          description: data.description,
          ingredientsDescription: data.ingredientsDescription,
          variants,
          images: imgs,
          originalPrice: base0,
          discountedPrice: final0,
          discountPercentage: pct > 0 ? pct : pctFromPrices(base0, final0),
          stock: typeof data.stock === "number" ? data.stock : 0,
        };

        setProduct(formatted);
        setThumbnails(imgs);
        setMainImage(imgs[0]?.src || "/media/placeholder.png");
        setSelectedVariant(variants[0] ?? null);
        setPrice(imgs[0]?.price ?? formatted.discountedPrice);
      } catch (e) {
        console.error("Product fetch failed:", e);
        if (!abort) setError("Failed to load product details");
      } finally {
        if (!abort) setLoading(false);
      }
    })();

    return () => {
      abort = true;
    };
  }, [id]);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () =>
    setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (!product) return;

    const variant = selectedVariant || product.variants?.[0] || {};

    const selectedWeight =
      variant.quantity != null ? String(variant.quantity) : "";
    const selectedUnit = variant.unit ?? "";

    const parsedPackSize = (() => {
      const n = Number(selectedWeight);
      return Number.isFinite(n) ? n : undefined;
    })();

    const weightLabel = (selectedWeight || "") + (selectedUnit || "");

    const item = {
      id: product.id,
      name: product.name,
      image: mainImage || product.images?.[0]?.src || null,
      price:
        price || product.discountedPrice || product.originalPrice || 0,
      originalPrice: product.originalPrice ?? 0,
      discountedPrice: product.discountedPrice ?? 0,
      variantId: variant._id ?? null,
      selectedWeight: selectedWeight || null,
      selectedUnit: selectedUnit || null,
      weight: weightLabel || null,
      packSize: parsedPackSize ?? null,
      packUnit: selectedUnit || null,
      unit: selectedUnit || null,
      quantity: Number(quantity) > 0 ? Number(quantity) : 1,
    };

    dispatch(addToCart(item));
    navigate("/your-cart");
  };

  const handleAddToWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("Please log in to add to wishlist.");
      navigate("/login");
      return;
    }
    try {
      await fetch(`${API_BASE}/api/wishlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
        }),
      });

      setIsInWishlist(true);
      alert("Product added to wishlist!");
    } catch (err) {
      if (err.response?.data?.message === "Product already in wishlist") {
        alert("Product is already in your wishlist.");
      } else {
        console.error("Error adding to wishlist:", err);
        alert("Something went wrong. Try again.");
      }
    }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  // ------- helpers for prices & text formatting -------
  const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const orig = toNumber(product?.originalPrice);
  const disc = toNumber(
    product?.discountedPrice ?? product?.price ?? orig
  );

  const percentOff =
    orig > 0 && disc >= 0 && orig > disc
      ? Math.max(0, Math.round(((orig - disc) / orig) * 100))
      : 0;

  const displayAmount =
    orig > 0
      ? orig * (quantity || 1)
      : toNumber(price) * (quantity || 1);

  const toPoints = (text = "") =>
    text
      .split(/[,.\n]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

  const isMobile = window.innerWidth < 768;

  // ✅ stock logic – works because product is now defined
  const inStock = (product?.stock ?? 0) > 0;

  return (
    <>
      <Row className="g-3" style={{ padding: "30px" }}>
        {/* LEFT — IMAGES */}
        <Col
          md={6}
          className="position-sticky align-self-start left-product"
          style={{ top: "calc(var(--nav-h, 80px) + 12px)", zIndex: 2 }}
        >
          <img
            src={mainImage}
            alt={product.name}
            style={{ width: "100%", height: 350, objectFit: "contain" }}
          />

          <div className="d-flex flex-wrap justify-content-center gap-3 mt-3 ">
            {thumbnails.map((t, index) => {
              const active = mainImage === t.src;
              return (
                <img
                  key={index}
                  src={t.src}
                  alt={`thumb-${index}`}
                  onClick={() => {
                    setMainImage(t.src);
                    setPrice(t.price);
                    if (product.variants?.[index]) {
                      setSelectedVariant(product.variants[index]);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setMainImage(t.src);
                      setPrice(t.price);
                      if (product.variants?.[index]) {
                        setSelectedVariant(product.variants[index]);
                      }
                    }
                  }}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: 10,
                    border: active
                      ? "2px solid #00614A"
                      : "2px solid #E3EEE9",
                  }}
                />
              );
            })}
          </div>
        </Col>

        {/* RIGHT — DETAILS */}
        <Col
          md={6}
          className="d-flex flex-column align-items-start right-product-desc"
        >
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <h3
              style={{
                fontFamily: "poppins",
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "red",
              }}
            >
              {product.name}
            </h3>
          </div>

          {/* Price / Offer / Wishlist */}
          <div className="price-line mt-3">
            <div className="d-flex align-items-end gap-2">
              <div
                className="pdp-price"
                style={{ fontFamily: "poppins" }}
              >
                ₹{displayAmount.toFixed(2)}
              </div>

              {percentOff > 0 && (
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
                  {percentOff}% OFF
                </Badge>
              )}

              <Button
                variant="none"
                onClick={handleAddToWishlist}
                style={{
                  fontSize: "24px",
                  color: isInWishlist ? "#FF0000" : "#00614A",
                }}
                title={
                  isInWishlist
                    ? "Already in Wishlist"
                    : "Add to Wishlist"
                }
              >
                <FaHeart />
              </Button>
            </div>

            <div
              className="text-muted small"
              style={{ fontFamily: "poppins" }}
            >
              Inclusive of all taxes
            </div>

            {/* ✅ Stock status */}
            <div className="mb-4 mt-3">
              {inStock ? (
                <span
                  style={{
                    backgroundColor: "#d4f7dc",
                    color: "green",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontWeight: 600,
                    fontFamily: "poppins",
                    fontSize:"15px"
                  }}
                >
                  In stock
                </span>
              ) : (
                <span
                  style={{
                    backgroundColor: "#fde4e4",
                    color: "#d32f2f",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontWeight: 600,
                    fontFamily: "poppins",
                    fontSize:"15px"
                  }}
                >
                  Out of stock
                </span>
              )}
            </div>
          </div>

          {/* Variants */}
          {Array.isArray(product.variants) &&
            product.variants.length > 0 && (
              <div className="mt-4">
                <div
                  className="fw-semibold mb-2"
                  style={{ fontSize: "25px", fontFamily: "poppins" }}
                >
                  Select Quantity
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {product.variants.map((v, i) => {
                    const label = `${v.quantity ?? ""}${
                      v.unit ?? ""
                    }`.trim() || "Default";
                    const active = selectedVariant?._id
                      ? selectedVariant._id === v._id
                      : i === 0;
                    return (
                      <button
                        key={v._id || i}
                        type="button"
                        className={`zepto-chip ${
                          active ? "active" : ""
                        }`}
                        onClick={() => {
                          setSelectedVariant(v);
                          setPrice(
                            v.price ?? product.discountedPrice
                          );
                          if (thumbnails[i]?.src)
                            setMainImage(thumbnails[i].src);
                        }}
                        style={{
                          fontFamily: "poppins",
                          border: active
                            ? "2px solid #00614a"
                            : "1px solid #00614A",
                          background: active
                            ? "rgba(2, 92, 20, 1)"
                            : "transparent",
                          borderRadius: 999,
                          padding: "6px 14px",
                          cursor: "pointer",
                          color: active ? "#fff" : "inherit",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Quantity stepper */}
          <div className="d-flex flex-wrap align-items-center gap-3 mt-4 ">
            <div className="d-flex align-items-center border rounded-pill">
              <Button
                variant="link"
                className="qty-btn"
                onClick={handleDecrement}
                  disabled={!inStock}
              >
                −
              </Button>
              <span className="px-3">{quantity}</span>
              <Button
                variant="link"
                className="qty-btn"
                onClick={handleIncrement}
                disabled={!inStock}
              >
                ＋
              </Button>
            </div>
          </div>

          <div
            className="alert alert-warning mt-4"
            style={{ fontFamily: "poppins" }}
          >
            Enjoy 5% OFF on all products – shop now and save on every
            order!
          </div>

          {/* CTAs */}
          <div className="d-flex gap-3 mt-4 ">
            <Button
              variant="none"
              className="px-4 py-2 cart-btn"
              onClick={handleAddToCart}
              disabled={!inStock}
              style={{
                backgroundColor: "#97d7c6",
                width: "200px",
                height: "50px",
                fontSize: "18px",
                borderRadius: "0",
                fontFamily: "poppins",
                fontWeight: "bold",
              }}
            >
              ADD TO CART
            </Button>
            <Button
              variant="none"
              className="px-4 py-2 buy-btn"
              onClick={handleAddToCart}
              disabled={!inStock}
              style={{
                backgroundColor: "#97d7c6",
                width: "200px",
                height: "50px",
                fontSize: "18px",
                borderRadius: "0",
                fontFamily: "poppins",
                fontWeight: "bold",
              }}
            >
              BUY NOW
            </Button>
          </div>

          {/* Details (Desktop table / Mobile bullets) */}
          {!isMobile ? (
            <Table bordered responsive className="mt-4 mb-5">
              <tbody>
                <tr>
                  <td
                    style={{
                      fontFamily: "poppins",
                      padding: "15px",
                      width: "30%",
                    }}
                  >
                    <strong>Product Description</strong>
                  </td>
                  <td
                    style={{ fontFamily: "poppins", padding: "15px" }}
                  >
                    {product?.description ||
                      "No description available."}
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      fontFamily: "poppins",
                      padding: "14px",
                      width: "30%",
                    }}
                  >
                    <strong>Product Ingredients</strong>
                  </td>
                  <td
                    style={{ fontFamily: "poppins", padding: "14px" }}
                  >
                    {product?.ingredientsDescription ||
                      "No description available."}
                  </td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <div
              className="mt-4 mb-5"
              style={{ fontFamily: "poppins" }}
            >
              <h4
                style={{
                  fontWeight: "600",
                  color: "#00614A",
                  fontSize: 18,
                }}
              >
                Product Description
              </h4>
              <ul
                style={{
                  paddingLeft: "20px",
                  marginBottom: "20px",
                }}
              >
                {toPoints(product?.description).length ? (
                  toPoints(product?.description).map(
                    (point, index) => (
                      <li
                        key={index}
                        style={{ marginBottom: "6px", fontSize: 15 }}
                      >
                        {point}
                      </li>
                    )
                  )
                ) : (
                  <li>No description available.</li>
                )}
              </ul>

              <h4
                style={{
                  fontWeight: "600",
                  color: "#00614A",
                  fontSize: 18,
                }}
              >
                Product Ingredients
              </h4>
              <ul style={{ paddingLeft: "20px" }}>
                {toPoints(
                  product?.ingredientsDescription
                ).length ? (
                  toPoints(
                    product?.ingredientsDescription
                  ).map((point, index) => (
                    <li
                      key={index}
                      style={{ marginBottom: "6px", fontSize: 15 }}
                    >
                      {point}
                    </li>
                  ))
                ) : (
                  <li>No description available.</li>
                )}
              </ul>
            </div>
          )}
        </Col>
      </Row>

      {/* You may also like */}
      <div className="mt-5">
        <h3
          style={{
            fontSize: "25px",
            letterSpacing: "1px",
            fontFamily: "poppins",
            fontWeight: "bold",
            marginLeft: "40px",
          }}
        >
          YOU MAY ALSO LIKE
        </h3>
        <div>
          <Products_Sliders />
        </div>
      </div>

      <ScrollToTop />
    </>
  );
}
