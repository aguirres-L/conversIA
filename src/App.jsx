import { BrowserRouter } from "react-router-dom";
import { RouterConservia } from "./router/RouterConservia";

export default function App() {
  return (
    <BrowserRouter>
      <RouterConservia />
    </BrowserRouter>
  );
}