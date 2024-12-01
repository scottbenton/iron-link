import { useEffect } from "react";

import {
  useDerivedNotesAtom,
  useSetOpenItem,
} from "pages/games/gamePageLayout/atoms/notes.atom";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import {
  CampaignPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";

import { CampaignType } from "api-calls/campaign/_campaign.type";
import { GUIDE_NOTE_FOLDER_NAME } from "api-calls/notes/_getRef";
import { EditPermissions, ReadPermissions } from "api-calls/notes/_notes.type";
import { addFolder } from "api-calls/notes/addFolder";

import { useUID } from "stores/auth.store";

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
      uid &&
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
          readPermissions: ReadPermissions.OnlyAuthor,
          editPermissions: EditPermissions.OnlyAuthor,
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
          readPermissions: ReadPermissions.OnlyGuides,
          editPermissions: EditPermissions.OnlyGuides,
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
      if (uid) {
        const userFolder = folderState.folders[uid];
        if (userFolder) {
          setOpenItem({
            type: "folder",
            folderId: uid,
          });
          return;
        }
      }
    }
  }, [isSomethingOpen, folderState, campaignPermission, uid, setOpenItem]);
}
