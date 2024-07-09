import "./app.css";
import App from "./App.svelte";

// Supports weights 100-900
import '@fontsource-variable/inter';
import '@fontsource/barlow-condensed/600.css';

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
