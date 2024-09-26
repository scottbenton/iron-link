import {
  Box,
  capitalize,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import { useImpactRules } from "atoms/dataswornRules/useImpactRules";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";
import { GridLayout } from "components/Layout";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { Button } from "@mui/material";
import { useCharacterId } from "../../hooks/useCharacterId";
import { useDerivedCharacterState } from "../../hooks/useDerivedCharacterState";
import { useIsOwnerOfCharacter } from "../../hooks/useIsOwnerOfCharacter";

export function ImpactsSection() {
  const characterId = useCharacterId();
  const isCharacterOwner = useIsOwnerOfCharacter();

  const impacts = useDerivedCharacterState(
    characterId,
    (character) => character?.characterDocument.data?.debilities ?? {}
  );
  const { impactCategories, impacts: impactRules } = useImpactRules();

  const { t } = useTranslation();

  const activeImpactString: string =
    Object.entries(impacts)
      .filter(
        ([impactKey, impactValue]) => impactValue && impactRules[impactKey]
      )
      .map(([impactKey]) => impactRules[impactKey].label)
      .join(", ") || t("None");

  const [isImpactDialogOpen, setIsImpactDialogOpen] = useState(false);

  return (
    <Box>
      <Typography
        variant="h6"
        textTransform="uppercase"
        fontFamily="fontFamilyTitle"
      >
        {t("Impacts")}
      </Typography>
      <Card variant="outlined">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2, pr: 1 }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            {t("Active Impacts")}
          </Typography>
          {isCharacterOwner && (
            <IconButton
              aria-label={t("Edit Impacts")}
              onClick={() => setIsImpactDialogOpen(true)}
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>
        <Typography pb={2} px={2}>
          {capitalize(activeImpactString)}
        </Typography>
      </Card>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={isImpactDialogOpen}
        onClose={() => setIsImpactDialogOpen(false)}
      >
        <DialogTitleWithCloseButton
          onClose={() => setIsImpactDialogOpen(false)}
        >
          {t("Edit Impacts")}
        </DialogTitleWithCloseButton>
        <DialogContent>
          <GridLayout
            items={Object.entries(impactCategories)}
            renderItem={([categoryKey, category]) => (
              <Box key={categoryKey}>
                <Typography variant="h6" textTransform="capitalize">
                  {category.label}
                </Typography>
                <Box>
                  {Object.entries(category.contents).map(
                    ([impactKey, impactRule]) => (
                      <FormControlLabel
                        key={impactKey}
                        control={
                          <Checkbox
                            checked={impacts[impactKey]}
                            onChange={(_, checked) => {
                              if (characterId) {
                                updateCharacter({
                                  characterId,
                                  character: {
                                    [`debilities.${impactKey}`]: checked,
                                  },
                                }).catch(() => {});
                              }
                            }}
                          />
                        }
                        label={capitalize(impactRule.label)}
                      />
                    )
                  )}
                </Box>
              </Box>
            )}
            emptyStateMessage={t("No impacts found")}
            minWidth={150}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant={"contained"}
            onClick={() => setIsImpactDialogOpen(false)}
          >
            {t("Done")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
