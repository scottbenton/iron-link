import { Outlet } from "react-router-dom";

import { useSyncUsersCampaigns } from "atoms/users.campaigns";
import { useSyncUsersCharacters } from "atoms/users.characters";

import { useListenToAuth } from "stores/auth.store";

// Really just exists to run listeners and such at top level
export function App() {
  useListenToAuth();
  useSyncUsersCharacters();
  useSyncUsersCampaigns();

  return <Outlet />;
}
