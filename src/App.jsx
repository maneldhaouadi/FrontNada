import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import Login from "./components/authentification/Login";
import { Dashboard} from "./screens";
import CoinList from "./components/dashboard/CoinList/CoinList";
import UserProfile from "./components/dashboard/profiles/UserProfile";
import UserCoins from "./components/dashboard/CoinList/UserCoins";
import Signup from "./components/authentification/SignUp";
import AdminProfile from "./components/dashboard/profiles/AdminProfile";
import EditAdminProfile from "./components/dashboard/profiles/EditAdminProfile";
import AdminAddUser from "./components/dashboard/profiles/AdminAddUser";
import EditUser from "./components/dashboard/profiles/EditUser";
import EditInfosAdmin from "./components/dashboard/profiles/EditInfosAdmin";
import UpdateUserPage from "./components/dashboard/profiles/UpdateUserPage";
import ReclamationAdmin from "./components/dashboard/Reclamation/ReclamationAdmin";
import CreateReclamation from "./components/dashboard/Reclamation/CreateReclamation";
import ReclamationUser from "./components/dashboard/Reclamation/ReclamationUser";
import CurrencyConverter from "./components/dashboard/conversion/CurrencyConverter";

import WalletBalance from "./components/dashboard/Wallet/WalletBalance";
function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Adding dark-mode class if dark mode is set to the body tag
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route element={<BaseLayout />}>
          {/* Redirect from the root path to the login page */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/CoinList" element={<CoinList />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/UserCoins" element={<UserCoins />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/AdminProfile" element={<AdminProfile />} />
          <Route path="/EditAdminProfile" element={<EditAdminProfile />} />
          <Route path="/AdminAddUser" element={<AdminAddUser />} />
          <Route path="/EditInfosAdmin/:id" element={<EditInfosAdmin />} />
          <Route path="/EditUser/:id" element={<EditUser />} />
          <Route path="/update-user/:id" element={<UpdateUserPage />} />
          <Route path="/ReclamationAdmin" element={< ReclamationAdmin/>} />
          <Route path="/createReclamation" element={< CreateReclamation/>} />
          <Route path="/ReclamationUser" element={< ReclamationUser/>} />
          <Route path="/CurrencyConverter" element={< CurrencyConverter/>} />
          
          <Route path="/walletBalance" element={< WalletBalance/>} />


        </Route>
      </Routes>

      {/* Button for theme toggle */}
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label="Toggle Theme"
      >
        <img
          className="theme-icon"
          src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          alt={theme === LIGHT_THEME ? "Light Theme Icon" : "Dark Theme Icon"}
        />
      </button>
    </Router>
  );
}

export default App;
