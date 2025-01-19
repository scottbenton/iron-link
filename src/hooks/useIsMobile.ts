import { useIsBreakpoint } from "./useIsBreakpoint";

export function useIsMobile() {
  return useIsBreakpoint("smaller-than", "md");
}
