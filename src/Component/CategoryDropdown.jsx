import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="dropdown-wrapper">
      <div className="dropdown-toggle" onClick={() => setOpen(!open)}>
        CATEGORIES
        <span className={`arrow ${open ? "up" : "down"}`}>▾</span>
      </div>

      {open && (
        <div className="dropdown-menu-custom">
          <div className="dropdown-indicator">
            <div className="dropdown-circle"></div>
            <div className="dropdown-line"></div>
          </div>
          <div
            className="dropdown-item active"
            onClick={() => handleNavigate("/Kamala-Ajjs-Special")}
          >
            Kamala Ajji's Special
          </div>
          <div className="dropdown-separator"></div>
          <div
            className="dropdown-item"
            onClick={() => handleNavigate("/pickels")}
          >
            PICKLES
          </div>
          <div className="dropdown-separator"></div>
          <div
            className="dropdown-item"
            onClick={() => handleNavigate("/karas")}
          >
            KARAS
          </div>
          <div className="dropdown-separator"></div>
          <div
            className="dropdown-item"
            onClick={() => handleNavigate("/sweets")}
          >
            SWEETS
          </div>
        </div>
      )}
    </div>
  );
}
