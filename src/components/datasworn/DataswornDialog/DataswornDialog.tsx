import { Dialog } from "@mui/material";

import { DataswornDialogContent } from "./DataswornDialogContent";
import {
  useCloseDataswornDialog,
  useDataswornDialogState,
} from "atoms/dataswornDialog.atom";

export function DataswornDialog() {
  const { isOpen, openId } = useDataswornDialogState();
  const handleClose = useCloseDataswornDialog();
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DataswornDialogContent id={openId ?? ""} onClose={handleClose} />
    </Dialog>
  );
}
