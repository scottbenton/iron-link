import { Box, Fab, Slide } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import ClearIcon from "@mui/icons-material/Close";
import {
  useClearAllRollSnackbars,
  useClearRollSnackbar,
  useVisibleRolls,
} from "atoms/rollDisplay.atom";
import { RollSnackbar } from "./RollSnackbar";
import { useParams } from "react-router-dom";
import { NormalRollActions } from "pages/games/characterSheet/components/GameLog/NormalRollActions";

export function RollSnackbarSection() {
  const rolls = useVisibleRolls();
  const clearRoll = useClearRollSnackbar();
  const clearRolls = useClearAllRollSnackbars();

  const campaignId = useParams<{ campaignId: string }>().campaignId;

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
        {rolls.map(({ id, roll }, index, array) => (
          <Slide direction={"left"} key={index}>
            <Box mt={1}>
              <RollSnackbar
                roll={roll}
                rollId={id}
                isExpanded={index === array.length - 1}
                onSnackbarClick={() => clearRoll(index)}
                actions={
                  campaignId &&
                  id && <NormalRollActions rollId={id} roll={roll} />
                }
              />
            </Box>
          </Slide>
        ))}
      </TransitionGroup>
      <Slide direction={"left"} in={rolls.length > 0} unmountOnExit>
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
