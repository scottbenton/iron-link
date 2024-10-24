import { Meta, StoryObj } from "@storybook/react";

import { NavRail } from "components/Layout/NavRail";
import {
  authenticatedNavRoutes,
  unauthenticatedNavRoutes,
} from "components/Layout/navRoutes";

const meta = {
  title: "Layout/NavRail",
  component: NavRail,
  tags: ["autodocs"],
} satisfies Meta<typeof NavRail>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AuthenticatedRoutes: Story = {
  args: {
    routes: authenticatedNavRoutes,
  },
};

export const UnauthenticatedRoutes: Story = {
  args: {
    routes: unauthenticatedNavRoutes,
  },
};
