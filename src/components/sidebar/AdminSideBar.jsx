import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/zc-assuré-logo.png";
import LogoWhite from "../../assets/images/logo_white.svg";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineClose,
  MdOutlinePerson,
  MdOutlineSettings,
  MdOutlineLogout,
  MdOutlineDashboard,
  MdOutlineMessage,
  MdOutlineBarChart,
} from "react-icons/md";
import { Link } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const AdminSidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`} ref={navbarRef}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="Logo" className="sidebar-logo" />
          <span className="sidebar-brand-text">ZC-INVEST</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/adminprofile" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineDashboard size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>

            <li className="menu-item">
              <Link className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineBarChart size={18} />
                </span>
                <span className="menu-link-text">Statistics</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/editadminprofile" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlinePerson size={18} />
                </span>
                <span className="menu-link-text">Edit Profile</span>
              </Link>
            </li>

            <li className="menu-item">
              <Link to="/ReclamationAdmin" className="menu-link"> {/* Lien vers la liste des réclamations */}
                <span className="menu-link-icon">
                  <MdOutlineMessage size={18} /> {/* Utilisez une icône appropriée */}
                </span>
                <span className="menu-link-text">Reclamations List</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineSettings size={18} />
                </span>
                <span className="menu-link-text">Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="sidebar-footer">
        <button className="menu-link" onClick={handleLogout}>
          <span className="menu-link-icon">
            <MdOutlineLogout size={18} />
          </span>
          <span className="menu-link-text">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminSidebar;
