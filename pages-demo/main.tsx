import { createRoot } from "react-dom/client";
import "../app/globals.css";
import "./demo.css";
import { DemoApp } from "./App";

window.__PGO_PAGES_DEMO__ = {
  basePath: import.meta.env.BASE_URL,
};

createRoot(document.getElementById("root")!).render(<DemoApp />);
