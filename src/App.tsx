import { useListenToAuth } from "atoms/auth.atom";
import { useSyncUsersCampaigns } from "atoms/users.campaigns";
import { useSyncUsersCharacters } from "atoms/users.characters";
import { Outlet } from "react-router-dom";

// Really just exists to run listeners and such at top level
export function App() {
  useListenToAuth();
  useSyncUsersCharacters();
  useSyncUsersCampaigns();

  return <Outlet />;
}
