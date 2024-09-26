import { Datasworn } from "@datasworn/core";
import {
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { CollectionMap } from "atoms/dataswornRules/collectionMap.type";

export interface AssetCollectionSidebarProps {
  collections: CollectionMap<Datasworn.AssetCollection>;
  selectedCollectionId: string;
  setSelectedCollectionId: (rulesetId: string, collectionId: string) => void;
}

export function AssetCollectionSidebar(props: AssetCollectionSidebarProps) {
  const { collections, selectedCollectionId, setSelectedCollectionId } = props;

  // const { t } = useTranslation();

  return (
    <Card variant={"outlined"} sx={{ bgcolor: "background.default" }}>
      {Object.entries(collections).map(([rulesetKey, ruleset], _, arr) => (
        <List key={rulesetKey}>
          {arr.length > 1 && (
            <ListSubheader
              sx={(theme) => ({
                px: 2,
                fontFamily: theme.typography.fontFamilyTitle,
              })}
              key={rulesetKey}
            >
              {ruleset.title}
            </ListSubheader>
          )}
          {Object.entries(ruleset.collections).map(
            ([collectionKey, collection], index) => (
              <ListItem
                disablePadding
                key={collectionKey}
                sx={(theme) => ({
                  bgcolor:
                    theme.palette.mode === "light"
                      ? index % 2 === 0
                        ? "grey.100"
                        : "grey.200"
                      : index % 2 === 0
                      ? "grey.900"
                      : "grey.800",
                })}
              >
                <ListItemButton
                  selected={collection._id === selectedCollectionId}
                  onClick={() =>
                    setSelectedCollectionId(rulesetKey, collection._id)
                  }
                >
                  <ListItemText primary={collection.name} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      ))}
    </Card>
  );
}
