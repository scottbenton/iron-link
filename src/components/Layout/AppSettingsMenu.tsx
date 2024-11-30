import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  IconButton,
  ListItemIcon,
  ListSubheader,
  Menu,
  MenuItem,
  useColorScheme,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { AuthState, useAuthStatus } from "atoms/auth.atom";

import { firebaseAuth } from "config/firebase.config";

export function AppSettingsMenu() {
  const { t } = useTranslation();
  const status = useAuthStatus();

  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <>
      <IconButton
        ref={buttonRef}
        color="inherit"
        aria-label={t("iron-link.app-settings", "App Settings")}
        onClick={() => setOpen(true)}
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={buttonRef.current}
      >
        <ListSubheader>
          {t("iron-link.app-settings", "App Settings")}
        </ListSubheader>
        <MenuItem
          onClick={() => {
            setColorScheme(colorScheme === "light" ? "dark" : "light");
            setOpen(false);
          }}
        >
          <ListItemIcon>
            {colorScheme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </ListItemIcon>
          {colorScheme === "light"
            ? t("iron-link.dark-mode", "Dark Mode")
            : t("iron-link.light-mode", "Light Mode")}
        </MenuItem>
        {status === AuthState.Authenticated && (
          <MenuItem
            onClick={() => {
              setOpen(false);
              signOut(firebaseAuth).then(() => window.location.reload());
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>

            {t("iron-link.sign-out", "Sign Out")}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
