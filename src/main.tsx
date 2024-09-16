import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "providers/Providers.tsx";
import "./App.css";
import "i18n/config";

import "@fontsource-variable/inter";
import "@fontsource/barlow-condensed/600.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers />
  </StrictMode>
);
