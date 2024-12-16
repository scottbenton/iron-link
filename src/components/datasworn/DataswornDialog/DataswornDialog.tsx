import { Dialog } from "@mui/material";

import { useAppState } from "stores/appState.store";

import { DataswornDialogContent } from "./DataswornDialogContent";

export function DataswornDialog() {
  const { isOpen, openId } = useAppState((state) => state.dataswornDialogState);

  const handleClose = useAppState((state) => state.closeDataswornDialog);
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DataswornDialogContent id={openId ?? ""} onClose={handleClose} />
    </Dialog>
  );
}
