import { useDebouncedSync } from "hooks/useDebouncedSync";
import { ClockCircle, ClockSize } from "./ClockCircle";
import { useSetAnnouncement } from "atoms/announcement.atom";

export interface DebouncedClockCircleProps {
  segments: number;
  value: number;
  onFilledSegmentsChange?: (value: number) => void;
  size?: ClockSize;
  voiceLabel: string;
}

export function DebouncedClockCircle(props: DebouncedClockCircleProps) {
  const { segments, value, onFilledSegmentsChange, size, voiceLabel } = props;

  const [localFilledSegments, setLocalFilledSegments] = useDebouncedSync(
    onFilledSegmentsChange ? onFilledSegmentsChange : () => {},
    value
  );

  const announce = useSetAnnouncement();

  const handleIncrement = () => {
    setLocalFilledSegments((prev) => {
      const newValue = prev + 1;
      if (segments < newValue) {
        announce(
          `Cannot increase clock ${voiceLabel} beyond ${segments}. Resetting field to 0`
        );
        return 0;
      }
      announce(
        `Increased clock ${voiceLabel} by 1 for a total of ${newValue} of ${segments} segments.`
      );
      return newValue;
    });
  };

  return (
    <ClockCircle
      segments={segments}
      value={localFilledSegments}
      size={size}
      onClick={handleIncrement}
    />
  );
}
