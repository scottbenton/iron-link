import { Outlet } from "react-router-dom";

import { useListenToAuth } from "atoms/auth.atom";
import { useSyncUsersCampaigns } from "atoms/users.campaigns";
import { useSyncUsersCharacters } from "atoms/users.characters";

// Really just exists to run listeners and such at top level
export function App() {
  useListenToAuth();
  useSyncUsersCharacters();
  useSyncUsersCampaigns();

  return <Outlet />;
}
