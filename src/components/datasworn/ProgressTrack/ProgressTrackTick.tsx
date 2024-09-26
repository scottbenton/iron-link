import { Box } from "@mui/material";
import { Tick1, Tick2, Tick3, Tick4 } from "./assets";
export interface ProgressTrackTickProps {
  value: number;
}

const tickProps = (sizeValue: number) => ({
  width: sizeValue,
  height: sizeValue,
  strokeWidth: 4,
  style: { stroke: "currentcolor" },
  "aria-hidden": true,
});

const size = 28;

export function ProgressTrackTick(props: ProgressTrackTickProps) {
  const { value } = props;

  return (
    <Box
      sx={{
        width: size,
        height: size,
      }}
    >
      {value === 1 && <Tick1 {...tickProps(size)} />}
      {value === 2 && <Tick2 {...tickProps(size)} />}
      {value === 3 && <Tick3 {...tickProps(size)} />}
      {value === 4 && <Tick4 {...tickProps(size)} />}
    </Box>
  );
}
