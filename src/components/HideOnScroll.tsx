import { Slide, useScrollTrigger } from "@mui/material";
import React from "react";

export interface HideOnScrollProps {
  children: React.ReactElement;
}

export function HideOnScroll(props: HideOnScrollProps) {
  const { children } = props;

  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
