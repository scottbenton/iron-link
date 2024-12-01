import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { GradientButton } from "components/GradientButton";
import { PageContent, PageHeader } from "components/Layout";
import { EmptyState } from "components/Layout/EmptyState";

import { pathConfig } from "pages/pathConfig";

import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { addUserToCampaign } from "api-calls/campaign/addUserToCampaign";
import { getCampaign } from "api-calls/campaign/getCampaign";

import { useUID } from "stores/auth.store";

export function GameJoinPage() {
  const { t } = useTranslation();

  const { campaignId } = useParams<{ campaignId: string }>();
  const uid = useUID();

  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<CampaignDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (campaignId && uid) {
      getCampaign(campaignId)
        .then((campaign) => {
          setLoading(false);
          setError(undefined);
          setCampaign(campaign);
          if (campaign.users.includes(uid)) {
            navigate(pathConfig.game(campaignId));
          }
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setError(t("game.load-failure", "Failed to load game"));
        });
    } else {
      setLoading(false);
      setError(t("game.find-failure", "Could not find game"));
    }
  }, [campaignId, uid, t, navigate]);

  const addUser = () => {
    if (campaignId && uid) {
      // Add user to campaign
      addUserToCampaign({ campaignId, userId: uid })
        .then(() => {
          navigate(pathConfig.game(campaignId));
        })
        .catch(() => {
          setError(t("game.join-failure", "Failed to join game"));
        });
    }
  };

  if (error) {
    return (
      <PageContent maxWidth="md">
        <EmptyState message={error} />
      </PageContent>
    );
  }
  if (loading || !campaign) {
    return <LinearProgress />;
  }

  return (
    <>
      <PageHeader
        label={t("game.join-name", "Join {{campaignName}}", {
          campaignName: campaign.name,
        })}
        maxWidth="md"
      />
      <PageContent maxWidth="md">
        <div>
          <GradientButton onClick={addUser}>
            {t("game.join", "Join")}
          </GradientButton>
        </div>
      </PageContent>
    </>
  );
}
