import { SvgIconProps } from "@mui/material";

import { CampaignType } from "api-calls/campaign/_campaign.type";

import { CoopIcon } from "./CoopIcon";
import { GuidedIcon } from "./GuidedIcon";
import { SoloIcon } from "./SoloIcon";

export interface CampaignTypeIconProps extends SvgIconProps {
  campaignType: CampaignType;
}
export function CampaignTypeIcon(props: CampaignTypeIconProps) {
  const { campaignType, ...rest } = props;

  switch (campaignType) {
    case CampaignType.Solo:
      return <SoloIcon {...rest} />;
    case CampaignType.Coop:
      return <CoopIcon {...rest} />;
    case CampaignType.Guided:
      return <GuidedIcon {...rest} />;
    default:
      return null;
  }
}
