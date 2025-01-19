import { Breakpoint, useMediaQuery, useTheme } from "@mui/material";

export function useIsBreakpoint(
  comparator: "greater-than" | "smaller-than" | "equal-to",
  breakpoint: Breakpoint,
): boolean {
  const theme = useTheme();
  return useMediaQuery(
    comparator === "greater-than"
      ? theme.breakpoints.up(breakpoint)
      : comparator === "smaller-than"
        ? theme.breakpoints.down(breakpoint)
        : theme.breakpoints.only(breakpoint),
  );
}
