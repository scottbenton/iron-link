import { useIsBreakpoint } from "./useIsBreakpoint";

export function useIsMobile() {
  return useIsBreakpoint("less-than", "md");
}
