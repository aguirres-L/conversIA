import { Navigate, Routes, Route } from "react-router-dom";
import MobileShell from "../layout/MobileShell.jsx";
import ConversationsPage from "../pages/ConversationsPage.jsx";
import TrainingPage from "../pages/TrainingPage.jsx";
import ProductsPage from "../pages/ProductsPage.jsx";
import GraphPage from "../pages/GraphPage.jsx";

export function RouterConservia() {
  return (
    <Routes>
      <Route element={<MobileShell />}>
        <Route path="/" element={<Navigate to="/conversations" replace />} />
        <Route path="/conversations" element={<ConversationsPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/graph" element={<GraphPage/>} />
      </Route>
    </Routes>
  );
}