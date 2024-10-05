import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { useStatRules } from "atoms/dataswornRules/useStatRules";
import { ConditionMeter } from "components/datasworn/ConditonMeter";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCharacterId } from "../../hooks/useCharacterId";
import { useDerivedCharacterState } from "../../hooks/useDerivedCharacterState";

export interface CharacterStatsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CharacterStatsDialog(props: CharacterStatsDialogProps) {
  const { open, onClose } = props;

  const { t } = useTranslation();

  const characterId = useCharacterId();
  const stats = useDerivedCharacterState(
    characterId,
    (character) => character?.characterDocument.data?.stats ?? {}
  );
  const statRules = useStatRules();

  const [localStatValues, setLocalStatValues] = useState({ ...stats });
  useEffect(() => {
    setLocalStatValues({ ...stats });
  }, [stats]);

  const handleSave = () => {
    if (characterId) {
      updateCharacter({ characterId, character: { stats: localStatValues } });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitleWithCloseButton onClose={onClose}>
        {t("character.character-sidebar.update-stats", "Update Stats")}
      </DialogTitleWithCloseButton>
      <DialogContent sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {Object.entries(statRules).map(([statKey, statRule]) => (
          <ConditionMeter
            key={statKey}
            label={statRule.label}
            defaultValue={0}
            value={localStatValues[statKey]}
            onChange={(value) => {
              setLocalStatValues((prev) => ({
                ...prev,
                [statKey]: value,
              }));
            }}
            min={-9}
            max={9}
          />
        ))}
        {/* Add your stat updating components here */}
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          {t("common.cancel", "Cancel")}
        </Button>
        <Button variant="contained" onClick={handleSave}>
          {t("common.save-changes", "Save Changes")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
