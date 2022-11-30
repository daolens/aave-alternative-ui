import React, { createContext, ReactNode, useState } from "react";
type Anchor = "top" | "left" | "bottom" | "right";
export const HelpDrawerContext = createContext({
  toggleDrawer: (anchor: Anchor, open: boolean) => {
    return;
  },
  drawerState: "",
  anchorPosition: { right: true },
});

interface Props {
  children?: ReactNode;
}
export const HelpDrawerContextProvider: any = ({ children }: Props) => {
  const [anchorPosition, setAnchorPosition] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  // ! Local handlers
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setAnchorPosition({ ...anchorPosition, [anchor]: open });
    };
  return (
    <HelpDrawerContext.Provider
      value={{
        toggleDrawer: toggleDrawer,
        drawerState: "",
        anchorPosition: anchorPosition,
      }}
    >
      {children}
    </HelpDrawerContext.Provider>
  );
};
