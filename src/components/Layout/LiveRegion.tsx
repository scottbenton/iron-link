import { useEffect } from "react";

import { ScreenReaderOnly } from "components/ScreenReaderOnly";

import { useAnnouncement } from "stores/appState.store";

const DEBUG_MODE = true;

export function LiveRegion() {
  const announcement = useAnnouncement();

  useEffect(() => {
    if (DEBUG_MODE && announcement) {
      console.log("-- ANNOUNCEMENT --");
      console.log(announcement);
    }
  }, [announcement]);

  return (
    <ScreenReaderOnly live id={"live-region"}>
      {announcement}
    </ScreenReaderOnly>
  );
}
