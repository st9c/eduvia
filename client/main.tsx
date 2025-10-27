import "./global.css";

import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ThemeProvider } from "./context/ThemeContext";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

if (import.meta.hot) {
  import.meta.hot.accept("./App", () => {
    root.render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
  });
}
