import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import PostDetail from "../pages/PostDetail";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="*" element={<p>404 – Page introuvable</p>} />
    </Routes>
  );
}

export default AppRouter;
