import { useDerivedCharacterState } from "pages/games/characterSheet/hooks/useDerivedCharacterState";
import { useDerivedCampaignState } from "pages/games/gamePageLayout/hooks/useDerivedCampaignState";
import { useParams } from "react-router-dom";

export function useActiveAssets() {
  const { characterId } = useParams<{
    characterId?: string;
  }>();

  const characterAssetDocuments = useDerivedCharacterState(
    characterId,
    (store) => {
      return store?.assets?.assets ?? {};
    }
  );

  const campaignAssetDocuments = useDerivedCampaignState(
    (campaign) => campaign?.sharedAssets.assets ?? {}
  );

  return { characterAssetDocuments, campaignAssetDocuments };
}
