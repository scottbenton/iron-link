import { useParams } from "react-router-dom";

export function useCampaignId() {
  const { campaignId } = useParams<{ campaignId: string }>();
  if (!campaignId) {
    throw new Error("No campaignId found in route");
  }

  return campaignId;
}
