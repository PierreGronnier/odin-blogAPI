import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAdmin } from "./api/auth";
import Login from "./pages/Login";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import Comments from "./pages/Comments";
import "./styles/global.css";

function AdminRoute({ children }) {
  if (!isAdmin()) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/create" element={<Posts />} />
          <Route path="posts/edit/:id" element={<Posts />} />
          <Route path="comments" element={<Comments />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
