import { Navigate, Routes, Route } from "react-router-dom";
import MobileShell from "../layout/MobileShell.jsx";
import LoginConversIA from "../pages/LoginConversIA.jsx";
import ConversationsPage from "../pages/ConversationsPage.jsx";
import TrainingPage from "../pages/TrainingPage.jsx";
import ProductsPage from "../pages/ProductsPage.jsx";
import GraphPage from "../pages/GraphPage.jsx";

const ROUTES = {
  login: "/login",
  conversations: "/conversations",
  training: "/training",
  products: "/products",
  graph: "/graph",
};

export function RouterConservia() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.login} replace />} />
      <Route path={ROUTES.login} element={<LoginConversIA />} />
      <Route element={<MobileShell />}>
        <Route path={ROUTES.conversations} element={<ConversationsPage />} />
        <Route path={ROUTES.training} element={<TrainingPage />} />
        <Route path={ROUTES.products} element={<ProductsPage />} />
        <Route path={ROUTES.graph} element={<GraphPage />} />
      </Route>
    </Routes>
  );
}
