import { render } from "@testing-library/react";

import {
  AssetNameAndDescription,
  AssetNameAndDescriptionProps,
} from "../AssetNameAndDescription";
import { describe, expect, it } from "vitest";

describe("AssetNameAndDescription", () => {
  const defaultProps: AssetNameAndDescriptionProps = {
    name: "Test Asset",
    description: "This is a test description.",
    shared: false,
    showSharedIcon: false,
  };

  it("renders the name", () => {
    const { getByText } = render(<AssetNameAndDescription {...defaultProps} />);
    expect(getByText("Test Asset")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    const { getByText } = render(<AssetNameAndDescription {...defaultProps} />);
    expect(getByText("This is a test description.")).toBeInTheDocument();
  });

  it("renders the shared icon when shared and showSharedIcon are true", () => {
    const props = { ...defaultProps, shared: true, showSharedIcon: true };
    const { getByLabelText } = render(<AssetNameAndDescription {...props} />);
    expect(getByLabelText("Shared")).toBeInTheDocument();
  });

  it("does not render the shared icon when shared is false", () => {
    const props = { ...defaultProps, shared: false, showSharedIcon: true };
    const { queryByTitle } = render(<AssetNameAndDescription {...props} />);
    expect(queryByTitle("Shared")).not.toBeInTheDocument();
  });

  it("does not render the shared icon when showSharedIcon is false", () => {
    const props = { ...defaultProps, shared: true, showSharedIcon: false };
    const { queryByTitle } = render(<AssetNameAndDescription {...props} />);
    expect(queryByTitle("Shared")).not.toBeInTheDocument();
  });
});
