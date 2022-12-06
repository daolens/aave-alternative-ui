import React, { ReactNode } from "react";
import Paper from "@mui/material/Paper";
interface Props {
  children?: ReactNode;
  isWalletSet?: boolean;
}
function CustomBoxComponent({ children, isWalletSet }: Props) {
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
          width: "60%",
        }}
      >
        {children}
      </Paper>
      
    </>
  );
}

export default CustomBoxComponent;
