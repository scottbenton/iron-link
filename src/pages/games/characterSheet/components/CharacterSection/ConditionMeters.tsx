import { Box, Typography } from "@mui/material";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { useConditionMeterRules } from "atoms/dataswornRules/useConditionMeterRules";
import { DebouncedConditionMeter } from "components/datasworn/ConditonMeter";
import { momentumTrack } from "data/defaultTracks";
import { useTranslation } from "react-i18next";
import { useMomentumParameters } from "../../hooks/useMomentumResetValue";
import ResetIcon from "@mui/icons-material/RestartAlt";
import { useCharacterId } from "../../hooks/useCharacterId";
import { useDerivedCharacterState } from "../../hooks/useDerivedCharacterState";
import { useCallback } from "react";
import { SingleConditionMeter } from "./SingleConditionMeter";
import { useDerivedCampaignDocumentState } from "pages/games/gamePageLayout/hooks/useDerivedCampaignState";
import { updateCampaign } from "api-calls/campaign/updateCampaign";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import { useIsOwnerOfCharacter } from "../../hooks/useIsOwnerOfCharacter";
import { DEFAULT_MOMENTUM } from "../../../../../data/constants.ts";

export function ConditionMeters() {
  const campaignId = useCampaignId();
  const characterId = useCharacterId();
  const isCharacterOwner = useIsOwnerOfCharacter();

  const campaignConditionMeterValues = useDerivedCampaignDocumentState(
    (campaign) => campaign?.conditionMeters ?? {}
  );
  const { conditionMeterValues, momentum, adds } = useDerivedCharacterState(
    characterId,
    (character) => ({
      conditionMeterValues:
        character?.characterDocument.data?.conditionMeters ?? {},
      momentum: character?.characterDocument.data?.momentum ?? DEFAULT_MOMENTUM,
      adds: character?.characterDocument.data?.adds ?? 0,
    })
  );

  const { resetValue, max } = useMomentumParameters();

  const conditionMeterRules = useConditionMeterRules();

  const { t } = useTranslation();

  const handleConditionMeterChange = useCallback(
    (key: string, value: number, isShared: boolean) => {
      if (campaignId && isShared) {
        updateCampaign({
          campaignId,
          campaign: {
            [`conditionMeters.${key}`]: value,
          },
        }).catch(() => {});
      }
      if (characterId && !isShared) {
        updateCharacter({
          characterId,
          character: { [`conditionMeters.${key}`]: value },
        }).catch(() => {});
      }
    },
    [campaignId, characterId]
  );

  const handleMomentumChange = useCallback(
    (value: number) => {
      if (characterId) {
        updateCharacter({
          characterId,
          character: { momentum: value },
        }).catch(() => {});
      }
    },
    [characterId]
  );

  return (
    <Box>
      <Typography
        variant="h6"
        textTransform="uppercase"
        fontFamily="fontFamilyTitle"
      >
        {t("character.character-sidebar.meters", "Meters")}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {Object.entries(conditionMeterRules).map(([key, rule]) => (
          <SingleConditionMeter
            key={key}
            conditionMeterKey={key}
            rule={rule}
            value={
              rule.shared
                ? campaignConditionMeterValues[key]
                : conditionMeterValues[key]
            }
            onChange={handleConditionMeterChange}
            disabled={!isCharacterOwner}
            momentum={momentum}
            adds={adds}
          />
        ))}
        <DebouncedConditionMeter
          label={t("character.character-sidebar.momentum-track", "Momentum")}
          min={momentumTrack.min}
          max={max}
          defaultValue={resetValue}
          value={momentum}
          onChange={handleMomentumChange}
          onActionClick={(setValue) => {
            setValue(resetValue);
          }}
          action={{
            actionLabel: t(
              "character.character-sidebar.momentum-track-reset",
              "Reset"
            ),
            ActionIcon: ResetIcon,
          }}
          disabled={!isCharacterOwner}
        />
      </Box>
    </Box>
  );
}
