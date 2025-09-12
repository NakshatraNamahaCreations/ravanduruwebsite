import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ========= CONFIG ========= */
const API_ENDPOINT = "https://api.ravandurustores.com/api/products"; // fixed path

/* utils */
const slugify = (s = "") =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export default function SearchBar() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const controllerRef = useRef(null);

  const minChars = 2; // start searching after 2 chars
  const debounceMs = 300;

  // Close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Debounced backend fetch & client-side filter
  useEffect(() => {
    const q = query.trim();
    if (q.length < minChars) {
      setResults([]);
      setOpen(false);
      setErr("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErr("");
    setOpen(true);
    setHighlight(-1);

    const t = setTimeout(async () => {
      try {
        controllerRef.current?.abort();
      } catch (_) {}

      const ctrl = new AbortController();
      controllerRef.current = ctrl;

      try {
        const res = await fetch(API_ENDPOINT, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const all = Array.isArray(data?.data) ? data.data : [];

        // 🔍 Client-side filter
        const filtered = all.filter((p) =>
          (p.name || "").toLowerCase().includes(q.toLowerCase())
        );

        const normalized = filtered.map((it) => ({
          id: it._id ?? slugify(it.name || ""),
          name: it.name || it.productName || "",
          slug: slugify(it.name || ""),
          ...it,
        }));

        setResults(normalized);
      } catch (e) {
        if (e?.name !== "AbortError") {
          setErr(e?.message || "Search failed");
        }
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(t);
  }, [query]);

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/best-seller?search=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  const handleSuggestionClick = (item) => {
    setQuery(item.name || "");
    setOpen(false);
    navigate(`/productsdetails/${item.id}`); // direct product details page
  };

  const onKeyDown = (e) => {
    const len = results.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setHighlight((h) => Math.min(h + 1, len - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && highlight >= 0 && highlight < len) {
        e.preventDefault();
        handleSuggestionClick(results[highlight]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      ref={wrapRef}
      className="container mt-5 mb-5"
      style={{ fontFamily: "poppins, sans-serif", maxWidth: 900 }}
    >
      <div
        className="position-relative"
        style={{
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          maxWidth: 750,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="form-control input-account-forms search-input"
          placeholder="Search our products..."
          style={{
            borderRadius: "10px",
            fontSize: 16,
            color: "#002209",
            fontWeight: 500,
            border: "2px solid #00614A",
            height: 40,
            fontFamily: "poppins",
          }}
        />

        <button
          type="button"
          className="search-button-slider"
          onClick={handleSearch}
          style={{
            padding: "5px 24px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#00614a",
            backgroundColor: "#97d7c6",
            border: "none",
            fontSize: 18,
            letterSpacing: 1,
            margin: "0 10px",
            cursor: "pointer",
            fontFamily: "poppins",
            borderRadius: 8,
            height: 40,
          }}
        >
          SEARCH
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="position-absolute z-3"
            style={{
              top: 46,
              left: 0,
              width: "calc(100% - 130px)",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05)",
              overflow: "hidden",
            }}
            role="listbox"
            aria-label="Search suggestions"
          >
            {loading && <div className="p-3 text-muted small">Searching…</div>}
            {!loading && err && (
              <div className="p-3 text-danger small">{err}</div>
            )}
            {!loading && !err && results.length === 0 && query.trim().length >= minChars && (
              <div className="p-3 text-muted small">No results found</div>
            )}

            {!loading &&
              !err &&
              results.map((item, idx) => (
                <button
                  key={item.id ?? idx}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className="w-100 text-start"
                  style={{
                    padding: "10px 12px",
                    background: idx === highlight ? "#f1f5f9" : "#fff",
                    border: "none",
                    borderBottom: "1px solid #f1f5f9",
                    cursor: "pointer",
                    fontFamily: "poppins, sans-serif",
                  }}
                  role="option"
                  aria-selected={idx === highlight}
                >
                  {item.name || item.title || "Unnamed product"}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
