import { useEffect } from "react";

import {
  useDerivedNotesAtom,
  useSetOpenItem,
} from "pages/games/gamePageLayout/atoms/notes.atom";
import {
  CampaignPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";
import { useUID } from "atoms/auth.atom";
import { addFolder } from "api-calls/notes/addFolder";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import { ViewPermissions, WritePermissions } from "api-calls/notes/_notes.type";
import { GUIDE_NOTE_FOLDER_NAME } from "api-calls/notes/_getRef";
import { CampaignType } from "api-calls/campaign/_campaign.type";

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
        console.debug("ADDING A USER FOLDER");
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
        console.debug("ADDING A GUIDE FOLDER");
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
    console.debug(isSomethingOpen, folderState);
    if (!isSomethingOpen && !folderState.loading) {
      console.debug(campaignPermission);
      if (campaignPermission === CampaignPermissionType.Viewer) {
        return;
      }

      if (campaignPermission === CampaignPermissionType.Guide) {
        const guideFolder = folderState.folders[GUIDE_NOTE_FOLDER_NAME];
        if (guideFolder) {
          console.debug("OPENING GUIDE FOLDER");
          setOpenItem({
            type: "folder",
            folderId: GUIDE_NOTE_FOLDER_NAME,
          });
          return;
        }
      }

      const userFolder = folderState.folders[uid];
      console.debug(userFolder);
      if (userFolder) {
        console.debug("OPENING USER FOLDER");
        setOpenItem({
          type: "folder",
          folderId: uid,
        });
        return;
      }
      console.debug("COULD NOT OPEN ANYTHING");
    }
  }, [isSomethingOpen, folderState, campaignPermission, uid, setOpenItem]);
}
