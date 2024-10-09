import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import { pathConfig } from "pages/pathConfig";
import { useNavigate } from "react-router-dom";
import { useCharacterId } from "../../hooks/useCharacterId";
import { useDerivedCharacterState } from "../../hooks/useDerivedCharacterState";
import { useDerivedCampaignState } from "pages/games/gamePageLayout/hooks/useDerivedCampaignState";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteCharacter } from "api-calls/character/deleteCharacter";
import { deleteCampaign } from "api-calls/campaign/deleteCampaign";

export interface DeleteCharacterButtonProps {
  closeMenu: () => void;
}

export function DeleteCharacterButton(props: DeleteCharacterButtonProps) {
  const { closeMenu } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const campaignId = useCampaignId();
  const characterId = useCharacterId();
  const portraitFilename = useDerivedCharacterState(
    characterId,
    (store) => store?.characterDocument.data?.profileImage?.filename
  );
  const campaignCharacters = useDerivedCampaignState(
    (state) => state?.characters
  );

  const handleDeleteCharacter = useCallback(() => {
    if (Array.isArray(campaignCharacters)) {
      const alsoDeleteCampaign = campaignCharacters.length === 1;
      navigate(
        alsoDeleteCampaign ? pathConfig.gameSelect : pathConfig.game(campaignId)
      );
      deleteCharacter({
        characterId,
        campaignId: alsoDeleteCampaign ? undefined : campaignId,
        portraitFilename,
      });
      if (alsoDeleteCampaign) {
        deleteCampaign({ campaignId, characterIds: [] }).catch(() => {});
      }
    }
  }, [campaignCharacters, campaignId, characterId, portraitFilename, navigate]);

  return (
    <MenuItem
      onClick={() => {
        handleDeleteCharacter();
        closeMenu();
      }}
    >
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText
        primary={t(
          "character.character-sidebar.delete-character",
          "Delete Character"
        )}
      />
    </MenuItem>
  );
}
