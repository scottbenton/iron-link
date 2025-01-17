import { Breakpoint, useMediaQuery, useTheme } from "@mui/material";

export function useIsBreakpoint(
  comparator: "greater-than" | "less-than" | "equal-to",
  breakpoint: Breakpoint,
): boolean {
  const theme = useTheme();
  return useMediaQuery(
    comparator === "greater-than"
      ? theme.breakpoints.up(breakpoint)
      : comparator === "less-than"
        ? theme.breakpoints.down(breakpoint)
        : theme.breakpoints.only(breakpoint),
  );
}
