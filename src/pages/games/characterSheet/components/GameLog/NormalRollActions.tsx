import { useRef, useState } from "react";
import BackspaceIcon from "@mui/icons-material/Backspace";
import RerollIcon from "@mui/icons-material/Casino";
import CopyIcon from "@mui/icons-material/CopyAll";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import MomentumIcon from "@mui/icons-material/Whatshot";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

import { useCharacterIdOptional } from "../../hooks/useCharacterId";
import { useDerivedCharacterState } from "../../hooks/useDerivedCharacterState";
import { useMomentumParameters } from "../../hooks/useMomentumResetValue";
import { convertRollToClipboard } from "./clipboardFormatter";
import { DieRerollDialog } from "./DieRerollDialog";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { removeLog } from "api-calls/game-log/removeLog";
import { updateLog } from "api-calls/game-log/updateLog";
import { useUID } from "atoms/auth.atom";
import { useDataswornTree } from "atoms/dataswornTree.atom";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import {
  CampaignPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";
import { useSnackbar } from "providers/SnackbarProvider";
import { Roll, RollResult, RollType } from "types/DieRolls.type";

export interface NormalRollActionsProps {
  rollId: string;
  roll: Roll;
}

async function pasteRich(rich: string, plain: string) {
  if (typeof ClipboardItem !== "undefined") {
    // Shiny new Clipboard API, not fully supported in Firefox.
    // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#browser_compatibility
    const html = new Blob([rich], { type: "text/html" });
    const text = new Blob([plain], { type: "text/plain" });
    const data = new ClipboardItem({ "text/html": html, "text/plain": text });
    await navigator.clipboard.write([data]);
  } else {
    // Fallback using the deprecated `document.execCommand`.
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#browser_compatibility
    const cb = (e: ClipboardEvent) => {
      e.clipboardData?.setData("text/html", rich);
      e.clipboardData?.setData("text/plain", plain);
      e.preventDefault();
    };
    document.addEventListener("copy", cb);
    document.execCommand("copy");
    document.removeEventListener("copy", cb);
  }
}

export function NormalRollActions(props: NormalRollActionsProps) {
  const { rollId, roll } = props;

  const uid = useUID();
  const campaignId = useCampaignId();
  const currentCharacterId = useCharacterIdOptional();
  const momentum = useDerivedCharacterState(
    currentCharacterId,
    (character) => character?.characterDocument.data?.momentum ?? 0,
  );
  const momentumResetValue = useMomentumParameters().resetValue;

  const canDeleteLogs =
    useCampaignPermissions().campaignPermission ===
    CampaignPermissionType.Guide;

  let isMomentumBurnUseful = false;
  if (roll.type === RollType.Stat && roll.momentumBurned === null) {
    if (
      roll.result === RollResult.Miss &&
      (momentum > roll.challenge1 || momentum > roll.challenge2)
    ) {
      isMomentumBurnUseful = true;
    } else if (
      roll.result === RollResult.WeakHit &&
      momentum > roll.challenge1 &&
      momentum > roll.challenge2
    ) {
      isMomentumBurnUseful = true;
    }
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuParent = useRef<HTMLButtonElement>(null);
  const [isDieRerollDialogOpen, setIsDieRerollDialogOpen] = useState(false);

  const { error, success } = useSnackbar();

  const tree = useDataswornTree();
  const handleCopyRoll = () => {
    const clipboardData = convertRollToClipboard(roll, tree);

    if (clipboardData) {
      pasteRich(clipboardData.rich, clipboardData.plain)
        .then(() => {
          success("Copied roll to clipboard.");
        })
        .catch(() => {
          error("Failed to copy roll");
        });
    } else {
      error("Copying this roll type is not supported");
    }
  };

  const handleBurnMomentum = () => {
    if (
      currentCharacterId &&
      roll.type === RollType.Stat &&
      momentum &&
      momentumResetValue !== undefined
    ) {
      let newRollResult = RollResult.Miss;
      if (momentum > roll.challenge1 && momentum > roll.challenge2) {
        newRollResult = RollResult.StrongHit;
      } else if (momentum > roll.challenge1 || momentum > roll.challenge2) {
        newRollResult = RollResult.WeakHit;
      }

      const promises: Promise<unknown>[] = [];
      promises.push(
        updateLog({
          campaignId,
          logId: rollId,
          log: {
            ...roll,
            momentumBurned: momentum,
            result: newRollResult,
          },
        }),
      );
      promises.push(
        updateCharacter({
          characterId: currentCharacterId,
          character: { momentum: momentumResetValue },
        }),
      );

      Promise.all(promises)
        .catch(() => {})
        .then(() => {
          success("Burned Momentum");
        });
    }
  };

  return (
    <>
      <IconButton
        aria-label={"Copy Roll Result"}
        color={"inherit"}
        onClick={() => {
          handleCopyRoll();
        }}
      >
        <CopyIcon />
      </IconButton>
      <IconButton
        aria-label={"Roll Menu"}
        color={"inherit"}
        ref={menuParent}
        onClick={() => {
          setIsMenuOpen(true);
        }}
      >
        <MoreIcon />
      </IconButton>
      {isMenuOpen && (
        <Menu
          sx={{
            zIndex: 10001,
          }}
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          anchorEl={menuParent.current}
        >
          <MenuItem
            onClick={(evt) => {
              evt.stopPropagation();
              handleCopyRoll();
              setIsMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <CopyIcon />
            </ListItemIcon>
            <ListItemText>Copy Roll Result</ListItemText>
          </MenuItem>
          {roll.type === RollType.Stat && roll.uid === uid && (
            <MenuItem
              onClick={(evt) => {
                evt.stopPropagation();
                setIsMenuOpen(false);
                setIsDieRerollDialogOpen(true);
              }}
            >
              <ListItemIcon>
                <RerollIcon />
              </ListItemIcon>
              <ListItemText>Reroll Die</ListItemText>
            </MenuItem>
          )}
          {roll.type === RollType.Stat &&
            roll.uid === uid &&
            roll.characterId === currentCharacterId &&
            isMomentumBurnUseful && (
              <MenuItem
                onClick={(evt) => {
                  evt.stopPropagation();
                  setIsMenuOpen(false);
                  handleBurnMomentum();
                }}
              >
                <ListItemIcon>
                  <MomentumIcon />
                </ListItemIcon>
                <ListItemText>Burn Momentum</ListItemText>
              </MenuItem>
            )}
          {canDeleteLogs && (
            <MenuItem
              onClick={(evt) => {
                evt.stopPropagation();
                setIsMenuOpen(false);
                removeLog({ campaignId, logId: rollId }).catch(() => {});
              }}
            >
              <ListItemIcon>
                <BackspaceIcon />
              </ListItemIcon>
              <ListItemText>Delete Roll</ListItemText>
            </MenuItem>
          )}
        </Menu>
      )}
      {roll.type === RollType.Stat && (
        <DieRerollDialog
          open={isDieRerollDialogOpen}
          handleClose={() => setIsDieRerollDialogOpen(false)}
          rollId={rollId}
          roll={roll}
        />
      )}
    </>
  );
}
