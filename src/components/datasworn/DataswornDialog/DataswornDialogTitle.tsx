import PreviousIcon from "@mui/icons-material/ChevronLeft";
import { IconButton } from "@mui/material";
import { PropsWithChildren } from "react";

import {
  useCloseDataswornDialog,
  useDataswornDialogState,
  usePrevDataswornDialog,
} from "atoms/dataswornDialog.atom";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";

export function DataswornDialogTitle(props: PropsWithChildren) {
  const { children } = props;

  const { previousIds } = useDataswornDialogState();
  const handleClose = useCloseDataswornDialog();
  const handleGoToPreviousItem = usePrevDataswornDialog();

  return (
    <DialogTitleWithCloseButton
      actions={
        previousIds.length > 0 ? (
          <IconButton onClick={handleGoToPreviousItem}>
            <PreviousIcon />
          </IconButton>
        ) : undefined
      }
      onClose={handleClose}
    >
      {children}
    </DialogTitleWithCloseButton>
  );
}
