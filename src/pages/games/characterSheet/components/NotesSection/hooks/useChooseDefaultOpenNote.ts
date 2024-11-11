import { useEffect } from "react";

import { CampaignType } from "api-calls/campaign/_campaign.type";
import { GUIDE_NOTE_FOLDER_NAME } from "api-calls/notes/_getRef";
import { ViewPermissions, WritePermissions } from "api-calls/notes/_notes.type";
import { addFolder } from "api-calls/notes/addFolder";
import { useUID } from "atoms/auth.atom";
import {
  useDerivedNotesAtom,
  useSetOpenItem,
} from "pages/games/gamePageLayout/atoms/notes.atom";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import {
  CampaignPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";

export function useChooseDefaultOpenNote() {
  const isSomethingOpen = useDerivedNotesAtom(
    (notes) => notes.openItem !== undefined,
  );

  const folderState = useDerivedNotesAtom((notes) => notes.folders);
  const campaignId = useCampaignId();
  const uid = useUID();

  const { campaignPermission, campaignType } = useCampaignPermissions();

  const setOpenItem = useSetOpenItem();

  useEffect(() => {
    // If our folders have loaded and we are not a viewer, lets make sure we've created our default folders
    if (
      !folderState.loading &&
      campaignPermission !== CampaignPermissionType.Viewer
    ) {
      const userFolder = folderState.folders[uid];
      if (!userFolder) {
        addFolder({
          uid,
          campaignId,
          parentFolderId: null,
          order: 0,
          name: uid,
          viewPermissions: {
            type: ViewPermissions.OnlyAuthor,
            inherited: false,
          },
          writePermissions: {
            type: WritePermissions.OnlyAuthor,
            inherited: false,
          },
          folderId: uid,
        });
      }
      if (
        campaignType !== CampaignType.Solo &&
        campaignPermission === CampaignPermissionType.Guide &&
        !folderState.folders[GUIDE_NOTE_FOLDER_NAME]
      ) {
        addFolder({
          uid,
          campaignId,
          parentFolderId: null,
          order: 0,
          name: GUIDE_NOTE_FOLDER_NAME,
          viewPermissions: {
            type: ViewPermissions.OnlyGuides,
            inherited: false,
          },
          writePermissions: {
            type: WritePermissions.OnlyGuides,
            inherited: false,
          },
          folderId: GUIDE_NOTE_FOLDER_NAME,
        });
      }
    }
  }, [campaignPermission, campaignType, folderState, uid, campaignId]);

  useEffect(() => {
    if (!isSomethingOpen && !folderState.loading) {
      if (campaignPermission === CampaignPermissionType.Viewer) {
        return;
      }

      if (campaignPermission === CampaignPermissionType.Guide) {
        const guideFolder = folderState.folders[GUIDE_NOTE_FOLDER_NAME];
        if (guideFolder) {
          setOpenItem({
            type: "folder",
            folderId: GUIDE_NOTE_FOLDER_NAME,
          });
          return;
        }
      }

      const userFolder = folderState.folders[uid];
      if (userFolder) {
        setOpenItem({
          type: "folder",
          folderId: uid,
        });
        return;
      }
    }
  }, [isSomethingOpen, folderState, campaignPermission, uid, setOpenItem]);
}