import { useAnnouncement } from "atoms/announcement.atom";
import { ScreenReaderOnly } from "components/ScreenReaderOnly";

export function LiveRegion() {
  const [announcement] = useAnnouncement();

  return (
    <ScreenReaderOnly live id={"live-region"}>
      {announcement}
    </ScreenReaderOnly>
  );
}
