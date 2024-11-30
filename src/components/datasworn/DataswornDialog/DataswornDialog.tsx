import { Dialog } from "@mui/material";

import {
  useCloseDataswornDialog,
  useDataswornDialogState,
} from "atoms/dataswornDialog.atom";

import { DataswornDialogContent } from "./DataswornDialogContent";

export function DataswornDialog() {
  const { isOpen, openId } = useDataswornDialogState();
  const handleClose = useCloseDataswornDialog();
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DataswornDialogContent id={openId ?? ""} onClose={handleClose} />
    </Dialog>
  );
}
