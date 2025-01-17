import { Button, ButtonProps } from "@mui/material";
import {
  Box,
  BoxProps,
  ButtonBase,
  ButtonBaseProps,
  CardActionArea,
  CardActionAreaProps,
  IconButton,
  IconButtonProps,
  ListItemButton,
  ListItemButtonProps,
  Tab,
  TabProps,
} from "@mui/material";
import { LinkComponent, createLink } from "@tanstack/react-router";
import { forwardRef } from "react";

type MuiListItemButtonLinkProps = Omit<
  ListItemButtonProps<"a">,
  "href" | "component"
>;
const MuiListItemButtonLinkComponent = forwardRef<
  HTMLAnchorElement,
  MuiListItemButtonLinkProps
>((props, ref) => {
  return <ListItemButton component={"a"} ref={ref} {...props} />;
});
const CreatedListItemButtonLink = createLink(MuiListItemButtonLinkComponent);
export const ListItemLink: LinkComponent<
  typeof MuiListItemButtonLinkComponent
> = (props) => {
  return <CreatedListItemButtonLink preload={"intent"} {...props} />;
};

type MuiBoxLinkProps = Omit<BoxProps<"a">, "href" | "component">;
const MuiBoxLinkComponent = forwardRef<HTMLAnchorElement, MuiBoxLinkProps>(
  (props, ref) => {
    return <Box component={"a"} ref={ref} {...props} />;
  },
);
const CreatedBoxLink = createLink(MuiBoxLinkComponent);
export const BoxLink: LinkComponent<typeof MuiBoxLinkComponent> = (props) => {
  return <CreatedBoxLink preload={"intent"} {...props} />;
};

type MuiButtonBaseLinkProps = Omit<ButtonBaseProps<"a">, "href" | "component">;
const MuiButtonBaseLinkComponent = forwardRef<
  HTMLAnchorElement,
  MuiButtonBaseLinkProps
>((props, ref) => {
  return <ButtonBase component={"a"} ref={ref} {...props} />;
});
const CreatedButtonBaseLink = createLink(MuiButtonBaseLinkComponent);
export const ButtonBaseLink: LinkComponent<
  typeof MuiButtonBaseLinkComponent
> = (props) => {
  return <CreatedButtonBaseLink preload={"intent"} {...props} />;
};

type MuiCardActionAreaLinkProps = Omit<
  CardActionAreaProps<"a">,
  "href" | "component"
>;
const MuiCardActionAreaLinkComponent = forwardRef<
  HTMLAnchorElement,
  MuiCardActionAreaLinkProps
>((props, ref) => {
  return <CardActionArea component={"a"} ref={ref} {...props} />;
});
const CreatedCardActionAreaLink = createLink(MuiCardActionAreaLinkComponent);
export const CardActionAreaLink: LinkComponent<
  typeof MuiCardActionAreaLinkComponent
> = (props) => {
  return <CreatedCardActionAreaLink preload={"intent"} {...props} />;
};

type MuiTabLinkProps = Omit<TabProps<"a">, "href" | "component">;
const MuiTabLinkComponent = forwardRef<HTMLAnchorElement, MuiTabLinkProps>(
  (props, ref) => {
    return <Tab component={"a"} ref={ref} {...props} />;
  },
);
const CreatedTabLink = createLink(MuiTabLinkComponent);
export const TabLink: LinkComponent<typeof MuiTabLinkComponent> = (props) => {
  return <CreatedTabLink preload={"intent"} {...props} />;
};

type MuiIconLinkProps = Omit<IconButtonProps<"a">, "href" | "component">;
const MuiIconLinkComponent = forwardRef<HTMLAnchorElement, MuiIconLinkProps>(
  (props, ref) => {
    return <IconButton component={"a"} ref={ref} {...props} />;
  },
);
const CreatedIconLink = createLink(MuiIconLinkComponent);
export const IconLink: LinkComponent<typeof MuiIconLinkComponent> = (props) => {
  return <CreatedIconLink preload={"intent"} {...props} />;
};

export type MuiButtonLinkProps = Omit<ButtonProps<"a">, "href" | "component">;
const MuiButtonLinkComponent = forwardRef<
  HTMLAnchorElement,
  MuiButtonLinkProps
>((props, ref) => {
  return <Button component={"a"} ref={ref} {...props} />;
});
const CreatedButtonLink = createLink(MuiButtonLinkComponent);
export const ButtonLink: LinkComponent<typeof MuiButtonLinkComponent> = (
  props,
) => {
  return <CreatedButtonLink preload={"intent"} {...props} />;
};
