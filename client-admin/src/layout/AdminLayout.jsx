import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/layout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Navbar />
      <div className="layout-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
