import ExampleIcon from "@mui/icons-material/Casino";
import { render, screen } from "@testing-library/react";

import {
  ConditionMeter,
  ConditionMeterProps,
} from "components/datasworn/ConditonMeter/ConditionMeter";
import { TestWrapper } from "tests/TestWrapper";
import { describe, expect, it, vi } from "vitest";

describe("ConditionMeter", () => {
  const setup = (props?: Partial<ConditionMeterProps>) => {
    const conditionMeterProps = {
      label: "Test Label",
      defaultValue: 5,
      min: 0,
      max: 10,
      ...props,
    };

    // Render the ConditionMeter component with the provided props
    render(<ConditionMeter {...conditionMeterProps} />, {
      wrapper: TestWrapper,
    });
  };

  it("should render the label", () => {
    setup();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });
  it("should render the default value if an explicit value is not provided", () => {
    setup();
    expect(screen.getByText("+5")).toBeInTheDocument();
  });
  it("should render the increment and decrement buttons when onChange is provided", () => {
    setup({ onChange: () => {} });
    expect(
      screen.getByRole("button", { name: /subtract/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("should disable the increment and decrement buttons when onChange is not provided", () => {
    setup();
    expect(screen.getByRole("button", { name: /subtract/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
  });

  it("should call onChange with the correct value when increment button is clicked", () => {
    const handleChange = vi.fn();
    setup({ onChange: handleChange });
    screen.getByRole("button", { name: /add/i }).click();
    expect(handleChange).toHaveBeenCalledWith(6);
  });

  it("should call onChange with the correct value when decrement button is clicked", () => {
    const handleChange = vi.fn();
    setup({ onChange: handleChange });
    screen.getByRole("button", { name: /subtract/i }).click();
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("should disable the decrement button when the value is at the minimum", () => {
    setup({ value: 0, onChange: () => {} });
    expect(screen.getByRole("button", { name: /subtract/i })).toBeDisabled();
  });

  it("should disable the increment button when the value is at the maximum", () => {
    setup({ value: 10, onChange: () => {} });
    expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
  });

  it("should render the ActionIcon when provided", () => {
    setup({ action: { ActionIcon: ExampleIcon, actionLabel: "Test Action" } });
    expect(screen.getByLabelText("Test Action")).toBeInTheDocument();
  });

  it("should call onActionClick when the action button is clicked", () => {
    const handleActionClick = vi.fn();
    setup({ onActionClick: handleActionClick });
    screen.getByText("+5").click();
    expect(handleActionClick).toHaveBeenCalled();
  });
});
