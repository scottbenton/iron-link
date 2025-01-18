import { Card, Typography } from "@mui/material";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useSnackbar } from "providers/SnackbarProvider";

import { GradientButton } from "components/GradientButton";
import { GridLayout, PageContent, PageHeader } from "components/Layout";
import { CardActionAreaLink } from "components/LinkComponent";

import { useUID } from "stores/auth.store";
import { useLoadUsersWorlds, useUsersWorlds } from "stores/users.worlds.store";

import { usePathConfig } from "lib/paths.lib";

export const Route = createLazyFileRoute("/_defaultNavLayout/worlds/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  useLoadUsersWorlds();

  const worlds = useUsersWorlds((store) => store.worlds);
  const loading = useUsersWorlds((store) => store.loading);
  const worldError = useUsersWorlds((store) => store.error);
  const createWorld = useUsersWorlds((store) => store.createWorld);

  const uid = useUID();

  const { error } = useSnackbar();
  const navigate = useNavigate();
  const pathConfig = usePathConfig();

  const handleCreateWorld = useCallback(() => {
    if (uid) {
      createWorld(uid, t("worlds.default-world-name", "New World"))
        .then((worldId) => {
          navigate({ to: pathConfig.world, params: { worldId } });
        })
        .catch(() => {
          error(
            t(
              "worlds.create-world-error",
              "Failed to create world. Please try again later.",
            ),
          );
        });
    }
  }, [createWorld, uid, t, error, pathConfig, navigate]);

  return (
    <>
      <PageHeader
        label={t("worlds.list.header", "Your Worlds")}
        actions={
          <GradientButton onClick={handleCreateWorld}>
            {t("worlds.list.create", "Create World")}
          </GradientButton>
        }
      />
      <PageContent>
        <GridLayout
          items={worlds}
          renderItem={(world) => (
            <Card key={world.id} variant="outlined">
              <CardActionAreaLink
                to={pathConfig.world}
                params={{ worldId: world.id }}
                sx={{ p: 2 }}
              >
                <Typography variant="h6" fontFamily="fontFamilyTitle">
                  {world.name}
                </Typography>
              </CardActionAreaLink>
            </Card>
          )}
          loading={loading}
          error={
            worldError
              ? t(
                  "worlds.list.error-loading-worlds",
                  "Failed to load your worlds. Please try again later.",
                )
              : undefined
          }
          emptyStateMessage={t(
            "worlds.list.no-worlds-found",
            "No worlds found",
          )}
          emptyStateAction={
            <GradientButton onClick={handleCreateWorld}>
              {t("worlds.list.create", "Create World")}
            </GradientButton>
          }
          minWidth={300}
        />
      </PageContent>
    </>
  );
}
