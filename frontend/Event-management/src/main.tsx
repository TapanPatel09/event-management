import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "primereact/resources/themes/saga-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons

import { PrimeReactProvider } from "primereact/api";

import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./Store/store.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryClientProvider>
    </PrimeReactProvider>
  </StrictMode>
);
