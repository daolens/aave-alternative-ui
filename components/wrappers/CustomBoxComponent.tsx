import React, { ReactNode } from "react";
import Paper from "@mui/material/Paper";
import { useMediaQuery } from "@mui/material";
interface Props {
  children?: ReactNode;
  isWalletSet?: boolean;
}
function CustomBoxComponent({ children, isWalletSet }: Props) {
  const matches = useMediaQuery("(max-width:700px)");
  return (
    <>
      {" "}
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          backgroundColor: "#2A2E3F",
          height: "80%",
          width: matches ? "80%" : "60%",
        }}
      >
        {children}
      </Paper>
    </>
  );
}

export default CustomBoxComponent;
