import { Outlet } from "react-router-dom";

import { useListenToAuth } from "stores/auth.store";

// Really just exists to run listeners and such at top level
export function App() {
  useListenToAuth();

  return <Outlet />;
}
