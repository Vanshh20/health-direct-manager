import {
  FiGrid,
  FiCalendar,
  FiUsers,
  FiUser,
  FiFileText,
  FiMessageSquare,
  FiPhone,
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Health Direct Logo" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/dash"
          className={`nav-item ${
            location.pathname === "/dash" ? "active" : ""
          }`}
        >
          <FiGrid className="nav-icon" />
          <span>Applications</span>
        </Link>

        <Link
          to="/calendar"
          className={`nav-item ${
            location.pathname === "/calendar" ? "active" : ""
          }`}
        >
          <FiCalendar className="nav-icon" />
          <span>Calendar</span>
        </Link>

        <Link
          to="/patients"
          className={`nav-item ${
            location.pathname === "/patients" ? "active" : ""
          }`}
        >
          <FiUsers className="nav-icon" />
          <span>Patients</span>
        </Link>

        <Link
          to="/doctors"
          className={`nav-item ${
            location.pathname === "/doctors" ? "active" : ""
          }`}
        >
          <FiUser className="nav-icon" />
          <span>Doctors</span>
        </Link>

        <Link
          to="/reports"
          className={`nav-item ${
            location.pathname === "/reports" ? "active" : ""
          }`}
        >
          <FiFileText className="nav-icon" />
          <span>Reports</span>
        </Link>

        <Link
          to="/messenger"
          className={`nav-item ${
            location.pathname === "/messenger" ? "active" : ""
          }`}
        >
          <FiMessageSquare className="nav-icon" />
          <span>Messenger</span>
        </Link>

        <Link
          to="/profile"
          className={`nav-item ${
            location.pathname === "/profile" ? "active" : ""
          }`}
        >
          <FiUser className="nav-icon" />
          <span>Profile</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="help-desk">
          <div className="help-icon">
            <FiPhone />
          </div>
          <div className="help-info">
            <div className="help-title">Help Desk</div>
            <div className="help-number">+123 456 789</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;