import { Meta, StoryObj } from "@storybook/react";

import { NavBar } from "../NavBar";
import { authenticatedNavRoutes, unauthenticatedNavRoutes } from "../navRoutes";

const meta = {
  title: "Layout/NavBar",
  component: NavBar,
  tags: ["autodocs"],
} satisfies Meta<typeof NavBar>;
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
