import { Box, Fab, Slide } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import ClearIcon from "@mui/icons-material/Close";
import { useMemo } from "react";
import {
  useClearAllRollSnackbars,
  useClearRollSnackbar,
  useVisibleRolls,
} from "atoms/rollDisplay.atom";
import { RollSnackbar } from "./RollSnackbar";

export function RollSnackbarSection() {
  const rolls = useVisibleRolls();
  const clearRoll = useClearRollSnackbar();
  const clearRolls = useClearAllRollSnackbars();

  const sortedRolls = useMemo(() => {
    return Object.entries(rolls).sort(
      ([, r1], [, r2]) => r1.timestamp.getTime() - r2.timestamp.getTime()
    );
  }, [rolls]);

  return (
    <Box
      position={"fixed"}
      zIndex={10000}
      bottom={(theme) => theme.spacing(2)}
      right={(theme) => theme.spacing(2)}
      ml={2}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"flex-end"}
      sx={(theme) => ({
        transition: theme.transitions.create(["bottom", "transform"]),
        "&>div": {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        },
      })}
    >
      <TransitionGroup>
        {sortedRolls.map(([rollId, roll], index, array) => (
          <Slide direction={"left"} key={rollId}>
            <Box mt={1}>
              <RollSnackbar
                roll={roll}
                rollId={rollId}
                isExpanded={index === array.length - 1}
                onSnackbarClick={() => clearRoll(rollId)}
              />
            </Box>
          </Slide>
        ))}
      </TransitionGroup>
      <Slide direction={"left"} in={sortedRolls.length > 0} unmountOnExit>
        <Fab
          variant={"extended"}
          size={"medium"}
          color={"primary"}
          onClick={() => clearRolls()}
          sx={{ mt: 2 }}
        >
          Clear All
          <ClearIcon sx={{ ml: 1 }} />
        </Fab>
      </Slide>
    </Box>
  );
}
