import { Box, capitalize, IconButton, Typography } from "@mui/material";
import { useSetAnnouncement } from "atoms/announcement.atom";
import { useEffect, useId, useState } from "react";
import MinusIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { ProgressTrackTick } from "./ProgressTrackTick";

export interface ProgressTrackProps {
  label: string;
  value: number;
  onChange?: (newValue: number) => void;
  step?: number;
}

const maxTicks = 40;

export function ProgressTrack(props: ProgressTrackProps) {
  const { label, value, onChange, step = 1 } = props;

  const announce = useSetAnnouncement();
  const [checks, setChecks] = useState<number[]>([]);

  const handleChange = (increment: boolean) => {
    if (onChange) {
      const newValue = increment
        ? Math.min(value + step, maxTicks)
        : Math.max(value - step, 0);
      onChange(newValue);
      if (newValue === value) {
        announce(`${label} is already at ${increment ? maxTicks : 0} ticks`);
      } else {
        announce(`Updated ${label} to ${getValueText(newValue)}`);
      }
    }
  };

  useEffect(() => {
    const checks: number[] = [];

    let checksIndex = 0;
    let checksValue = 0;

    for (let i = 0; i <= maxTicks; i++) {
      if (i % 4 === 0 && i !== 0) {
        checks[checksIndex] = checksValue;
        checksIndex++;
        checksValue = 0;
      }

      if (i < value) {
        checksValue++;
      }
    }

    setChecks(checks);
  }, [value]);

  const labelId = useId();

  const getValueText = (value: number) => {
    return `${value} ticks: (${Math.floor(value / 4)} boxes fully filled)`;
  };
  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent={"space-between"}>
        <Typography
          variant={"h6"}
          component={"p"}
          id={labelId}
          color={"text.primary"}
          fontFamily={"fontFamilyTitle"}
        >
          {capitalize(label)}
        </Typography>
        {onChange && (
          <Box display="flex">
            <IconButton onClick={() => handleChange(false)}>
              <MinusIcon />
            </IconButton>
            <IconButton onClick={() => handleChange(true)}>
              <AddIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      <Box
        display={"flex"}
        bgcolor={(theme) => theme.palette.background.paper}
        color={(theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[600]
            : theme.palette.grey[300]
        }
        borderRadius={1}
        border={1}
        borderColor={(theme) => theme.palette.divider}
        role={"meter"}
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={maxTicks}
        aria-valuenow={value}
        aria-valuetext={getValueText(value)}
      >
        {checks.map((value, index) => (
          <Box
            key={index}
            sx={(theme) => ({
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "transparent",
              borderLeftColor: index !== 0 ? theme.palette.divider : undefined,
            })}
          >
            <ProgressTrackTick value={value} key={index} aria-hidden />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
