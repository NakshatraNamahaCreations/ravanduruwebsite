import React, { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";

/* Helpers */
const safeJSON = (raw, fb) => { try { return JSON.parse(raw ?? ""); } catch { return fb; } };
const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const normalizeSrc = (s) => (typeof s === "string" ? s : "");
const INR = (n) => `₹ ${Number(n || 0).toFixed(2)}`;
const strEq = (a,b) => String(a ?? "").toLowerCase() === String(b ?? "").toLowerCase();
const pick = (...vals) => vals.find((v) => v !== undefined && v !== null);

const matchesUser = (order, u) => {
  if (!order || !u) return false;
  const oId = order.userId ?? order.user?.id ?? order.user?.userId ?? order.user?._id ?? order.customerId;
  const oEmail = order.email ?? order.userEmail ?? order.user?.email ?? order.contactEmail;
  const uId = u.id ?? u.userId ?? u._id;
  const uEmail = u.email;
  return (oId && uId && String(oId) === String(uId)) || (oEmail && uEmail && strEq(oEmail, uEmail));
};

const STORAGE_ADDR = "savedAddresses";
const STORAGE_ORDERS = "orders";
const STORAGE_CART = "cartItems";
const KEY_SELECTED = "selectedAddressId";
const KEY_DEFAULT = "defaultAddressId";

export default function DownloadPDF() {
  // Redux state
  const user = useSelector((s) => s.user?.profile || s.auth?.user || s.user) || null;
  const cartRedux = useSelector((s) => s?.cart?.cartItems) || [];

  // Hydration + LS
  const [hydrated, setHydrated] = useState(false);
  const [ordersLS, setOrdersLS] = useState([]);
  const [cartLS, setCartLS] = useState([]);
  const [addressesLS, setAddressesLS] = useState([]);
  const [orderIdFromUrl, setOrderIdFromUrl] = useState(null);

  // Logo
  const [logoBase64, setLogoBase64] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOrdersLS(safeJSON(localStorage.getItem(STORAGE_ORDERS), []));
    setCartLS(safeJSON(localStorage.getItem(STORAGE_CART), []));
    setAddressesLS(safeJSON(localStorage.getItem(STORAGE_ADDR), []));
    setOrderIdFromUrl(new URLSearchParams(window.location.search).get("orderId"));
    setHydrated(true);

    (async () => {
      try {
        const res = await fetch("/media/logo.png", { mode: "cors", credentials: "same-origin" });
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => setLogoBase64(reader.result);
        reader.readAsDataURL(blob);
      } catch (e) {
        console.error("Logo load failed", e);
        setLogoBase64(null);
      }
    })();
  }, []);

  // Pick order
  const userOrders = useMemo(
    () => (ordersLS || []).filter((o) => !user || matchesUser(o, user)),
    [ordersLS, user]
  );

  const order = useMemo(() => {
    if (!hydrated) return null;
    return (
      userOrders.find((o) => String(o.orderId) === String(orderIdFromUrl)) ||
      userOrders[0] ||
      null
    );
  }, [userOrders, orderIdFromUrl, hydrated]);

  // Items
  const orderedItems = useMemo(() => {
    if (!order) return [];
    const candidates = [
      ...toArray(order?.items),
      ...toArray(order?.orderItems),
      ...toArray(order?.cartItems),
    ];
    const list = [...candidates];

    if (!list.length && order?.productName) {
      list.push({
        id: order.productId ?? order.id,
        productName: order.productName,
        productImage: order.productImage,
        price: Number(pick(order.price, order.discountedPrice, order.originalPrice)) || 0,
        quantity: Number(order.quantity) || 1,
        originalPrice: order.originalPrice,
        discountedPrice: order.discountedPrice,
      });
    }

    return list.map((it, idx) => {
      const price = Number(pick(it.price, it.discountedPrice, it.unitPrice, it.originalPrice, it.productPrice, 0));
      const qty = Number(pick(it.quantity, it.qty, 1));
      return {
        id: pick(it.id, it.productId, `${Date.now()}-${idx}`),
        name: pick(it.productName, it.name, it.title, "Product"),
        image: normalizeSrc(pick(it.productImage, it.image, "")),
        price,
        quantity: qty,
        total: price * qty,
      };
    });
  }, [order]);

  // Cart fallback
  const cartSource = cartRedux.length ? cartRedux : cartLS;
  const cartFallback = useMemo(
    () =>
      (cartSource || []).map((it, idx) => {
        const price = Number(pick(it.discountedPrice, it.price, it.originalPrice, 0)) || 0;
        const qty = Number(it.quantity) || 1;
        return {
          id: pick(it.id, it.productId, `${Date.now()}-c${idx}`),
          name: pick(it.name, it.productName, it.title, "Product"),
          image: normalizeSrc(pick(it.image, it.productImage, "")),
          price,
          quantity: qty,
          total: price * qty,
        };
      }),
    [cartSource]
  );

  const displayItems = orderedItems.length ? orderedItems : cartFallback;

  // Totals
  const derivedSubtotal = useMemo(
    () => displayItems.reduce((a, p) => a + (Number(p.price) || 0) * (Number(p.quantity) || 0), 0),
    [displayItems]
  );
  const subtotal = order?.totals?.subtotal != null ? Number(order.totals.subtotal) : derivedSubtotal;
  const shipping = order?.totals?.shipping != null ? Number(order.totals.shipping) : 50;
  const tax = order?.totals?.tax != null ? Number(order.totals.tax) : subtotal * 0.18;
  const total = order?.totals?.total != null ? Number(order.totals.total) : subtotal + shipping + tax;

  // Address (prefer Checkout-selected > Default > first)
  const selectedId = typeof window !== "undefined" ? localStorage.getItem(KEY_SELECTED) : null;
  const defaultId = typeof window !== "undefined" ? localStorage.getItem(KEY_DEFAULT) : null;

  const selectedAddr = useMemo(() => {
    const fromSelected = addressesLS.find((a) => a.id && a.id === selectedId);
    if (fromSelected) return fromSelected;
    const fromDefault = addressesLS.find((a) => a.id && a.id === defaultId);
    if (fromDefault) return fromDefault;
    return addressesLS[0] || null;
  }, [addressesLS, selectedId, defaultId]);

  const shippingAddress = useMemo(
    () => order?.shippingAddress || selectedAddr || {},
    [order, selectedAddr]
  );

  // Invoice meta
  const invoiceNo = pick(order?.invoiceId, order?.id, order?.orderId, `TEMP-${Date.now()}`);
  const invoiceDate = order?.createdAt ? new Date(order.createdAt) : new Date();

  const formatAddressLines = (addr) => {
    const lines = [];
    const name = pick(addr?.name, [addr?.firstName, addr?.lastName].filter(Boolean).join(" "));
    if (name) lines.push(name);
    const phone = pick(addr?.phone, addr?.phoneNumber);
    if (phone) lines.push(`Phone: ${phone}`);
    const line1 = pick(addr?.line1, addr?.address1, "");
    const line2 = pick(addr?.line2, addr?.address2, "");
    const city = addr?.city || "";
    const state = addr?.state || "";
    const pincode = pick(addr?.pincode, addr?.postalCode, "");
    const country = addr?.country || "India";
    const addrA = [line1, line2].filter(Boolean).join(", ");
    if (addrA) lines.push(addrA);
    const addrB = [city, state, pincode].filter(Boolean).join(", ");
    if (addrB) lines.push(addrB);
    if (country) lines.push(country);
    return lines;
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // Helper for clean right alignment (avoids ghost "1" with ₹)
    const drawRight = (doc, text, x, y) => {
      const w = doc.getTextWidth(text);
      doc.text(text, x - w, y);
    };

    // ---------- Logo + centered header ----------
    let y = 10;
    if (logoBase64) {
      try {
        const w = 40;
        const x = (pageW - w) / 2;
        doc.addImage(logoBase64, "PNG", x, y, w, 20);
        y += 30;
      } catch (e) {
        console.error("Logo render failed", e);
      }
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Ravanduru Stores", pageW / 2, y, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("#1881/3A, WESLEY ROAD, MYSORE", pageW / 2, y + 10, { align: "center" });
    doc.text("Phone: +91 7899830366", pageW / 2, y + 20, { align: "center" });
    doc.text("GSTIN: 29AAWFT9273G1Z6", pageW / 2, y + 30, { align: "center" });
    y += 42;

    // ---------- Order meta ----------
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const shortId = String(invoiceNo).slice(-8);
    const formattedDate = invoiceDate.toLocaleDateString("en-IN", { day:"2-digit", month:"2-digit", year:"numeric" });
    const formattedTime = invoiceDate.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:true });

    doc.text(`Bill No: S/25-26/${shortId}`, 20, y);
    doc.text(`Date: ${formattedDate}`, pageW - 20, y, { align: "right" }); // safe (no ₹)
    doc.text(`Time: ${formattedTime}`, pageW - 20, y + 8, { align: "right" }); // safe
    y += 16;

    // ---------- Shipping Address ----------
    doc.setFont("helvetica", "bold");
    doc.text("Shipping Address:", 20, y);
    doc.setFont("helvetica", "normal");
    const addrLines = formatAddressLines(shippingAddress);
    let addrY = y + 6;
    addrLines.forEach((ln) => { doc.text(ln, 20, addrY); addrY += 6; });

    // ---------- Items (custom “2nd code” design) ----------
    const pageH = doc.internal.pageSize.getHeight();
    const marginTop = 20;
    const marginBottom = 20;
    const leftX = 20;
    const qtyX = 120;             // same as your 2nd code
    const amountRightX = pageW - 20;
    const rowGap = 25;            // same as your 2nd code
    // const subtitleGap = 5;

    let yPosition = Math.max((addrY || 0) + 6, (y || 0) + 30);

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Product", leftX, yPosition);
    doc.text("Quantity", qtyX, yPosition, { align: "center" });
    drawRight(doc, "Total", amountRightX, yPosition); // <- manual right-align

    // divider
    doc.setDrawColor(200);
    doc.setLineWidth(0.2);
    doc.line(leftX, yPosition + 4, amountRightX, yPosition + 4);

    yPosition += 10;

    // Page-break helper
    const ensureSpace = (needed = rowGap) => {
      if (yPosition + needed + marginBottom > pageH) {
        doc.addPage();
        yPosition = marginTop;

        // redraw header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Product", leftX, yPosition);
        doc.text("Quantity", qtyX, yPosition, { align: "center" });
        drawRight(doc, "Total", amountRightX, yPosition);

        doc.setDrawColor(200);
        doc.setLineWidth(0.2);
        doc.line(leftX, yPosition + 4, amountRightX, yPosition + 4);
        yPosition += 10;
      }
    };

    const items = Array.isArray(displayItems) ? displayItems : [];

    if (items.length === 0) {
      ensureSpace(20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("No items found", leftX, yPosition);
      yPosition += 20;
    } else {
      items.forEach((item) => {
        ensureSpace(rowGap);

        const name = String(item?.name ?? item?.productName ?? item?.title ?? "Product");
        const qty = Number(item?.quantity ?? item?.qty ?? 1) || 1;
        const unit =
          Number(item?.unitPrice ?? item?.discountedPrice ?? item?.price ?? item?.amount ?? 0) || 0;
        const lineTotal = unit * qty;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(name, leftX, yPosition);

        // Qty
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(String(qty), qtyX, yPosition, { align: "center" });

        // Amount (manual right-aligned)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        drawRight(doc, INR(lineTotal), amountRightX, yPosition);

        yPosition += rowGap;
      });
    }

    const afterTableY = yPosition;

    // ---------- Invoice summary ----------
    const labelX = pageW - 80;
    const valueX = pageW - 20;
    let sy = afterTableY + 12;
    const lh = 7;

    // page-break safety for summary block (height ~ 60)
    if (sy + 60 > pageH - 20) {
      doc.addPage();
      sy = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Summary", 20, sy);
    doc.setLineWidth(0.5);
    doc.line(20, sy + 4, pageW - 20, sy + 4);

    sy += 12;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    doc.text("SUB TOTAL", labelX, sy, { align: "right" });
    drawRight(doc, INR(subtotal), valueX, sy);

    sy += lh;
    doc.text("SHIPPING", labelX, sy, { align: "right" });
    drawRight(doc, INR(shipping), valueX, sy);

    sy += lh;
    doc.text("GST (18%)", labelX, sy, { align: "right" });
    drawRight(doc, INR(tax), valueX, sy);

    sy += lh + 2;
    doc.setDrawColor(225);
    doc.line(labelX - 120, sy, valueX, sy);

    sy += lh;
    doc.setFont("helvetica", "bold");
    doc.text("AMOUNT PAID", labelX, sy, { align: "right" });
    drawRight(doc, INR(total), valueX, sy); 

    // Save
    doc.save(`Order_Invoice_${shortId}.pdf`);
  };

  if (!hydrated) return null;

  return (
    <Button
      variant="outline-success"
      className="download"
      onClick={handleDownload}
      style={{
        backgroundColor: "#D3B353",
        color: "#002209",
        fontWeight: "bold",
        borderColor: "#D3B353",
        padding: "10px 20px",
        borderRadius: "0px",
      }}
    >
      DOWNLOAD
    </Button>
  );
}
