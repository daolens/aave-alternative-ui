import React, { ReactNode } from "react";
import Paper from "@mui/material/Paper";
import { useMediaQuery } from "@mui/material";
interface Props {
  children?: ReactNode;
  isWalletSet?: boolean;
}
function CustomBoxComponent({ children, isWalletSet }: Props) {
  const matches1 = useMediaQuery("(max-width:900px)");
  const matches2 = useMediaQuery("(max-width:600px)");
  const getWidth = () => {
    if (matches2) return "90%";
    if (matches1) return "80%";
    return "60%";
  };
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
          width: getWidth(),
          overflowY: "scroll",
        }}
      >
        {children}
      </Paper>
    </>
  );
}

export default CustomBoxComponent;
