import { render, screen } from "@testing-library/react";

import {
  DebouncedConditionMeter,
  DebouncedConditionMeterProps,
} from "../DebouncedConditionMeter";
import userEvent from "@testing-library/user-event";
import { TestWrapper } from "tests/TestWrapper";
import { describe, expect, it, vi } from "vitest";

describe("DebouncedConditionMeter", () => {
  const setup = (props?: Partial<DebouncedConditionMeterProps>) => {
    const debouncedConditionMeterProps = {
      label: "Test Label",
      defaultValue: 5,
      min: 0,
      max: 10,
      onChange: vi.fn(),
      ...props,
    };

    render(<DebouncedConditionMeter {...debouncedConditionMeterProps} />, {
      wrapper: TestWrapper,
    });

    return {
      onChange: debouncedConditionMeterProps.onChange,
    };
  };

  it("should render the label", () => {
    setup();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("should call onChange with the correct value after debouncing", async () => {
    const { onChange } = setup();
    userEvent.click(screen.getByRole("button", { name: /add/i }));
    // Assuming useDebouncedSync has a debounce time of 300ms
    await new Promise((r) => setTimeout(r, 2300));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it("should pass the correct props to ConditionMeter", () => {
    setup();
    expect(screen.getByText("+5")).toBeInTheDocument();
  });

  it("should handle value and defaultValue props correctly", () => {
    setup({ value: 7 });
    expect(screen.getByText("+7")).toBeInTheDocument();
  });
});
