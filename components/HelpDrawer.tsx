import React, { useState, useContext } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { HelpDrawerContext } from "../contexts/HelpDrawerContextProvider";
import styles from "../styles/componentStyles/helpDrawer.module.css";
import Image from "next/image";
function HelpDrawer() {
  // ! Context for the drawer
  const drawerContext = useContext(HelpDrawerContext);
  // ! Local states
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  // console.log("selectedTab", selectedTab);
  return (
    <React.Fragment key={"right"}>
      <SwipeableDrawer
        anchor={"right"}
        open={drawerContext.anchorPosition["right"]}
        onClose={drawerContext.toggleDrawer("right", false) as any}
        onOpen={drawerContext.toggleDrawer("right", true) as any}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <Image
              src="/icons_svg/back_icon.svg"
              alt="back_btn"
              height={12}
              width={12}
              style={{ cursor: "pointer" }}
              onClick={drawerContext.toggleDrawer("right", false) as any}
            />
            <Image
              src="/icons_svg/aave_mascot_small.svg"
              alt="back_btn"
              height={32}
              width={32}
              style={{ margin: "0 10px" }}
            />
            <span className={styles.headerText}>Aave help</span>
          </div>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            aria-label="disabled tabs example"
            sx={{ justifyContent: "space-between !important" }}
          >
            <Tab
              label="General"
              sx={{ textDecoration: "none", color: "#fff" }}
            />
            <Tab
              label="Lend"
              sx={{ textDecorationStyle: "none", color: "#fff" }}
            />
            <Tab
              label="Borrow"
              sx={{ textDecoration: "none", color: "#fff" }}
            />
          </Tabs>

          <Accordion
            disableGutters
            sx={{
              backgroundColor: "transparent",
              borderBottom: "1px solid #3F424F",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ padding: "0" }}
            >
              <Typography sx={{ color: "#EAEBEF" }}>What is aave?</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "0 0 20px 0" }}>
              <Typography sx={{ color: "#ffffff" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            disableGutters
            sx={{
              backgroundColor: "transparent",
              borderBottom: "1px solid #3F424F",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
              aria-controls="panel2a-content"
              id="panel2a-header"
              sx={{ padding: "0" }}
            >
              <Typography sx={{ color: "#EAEBEF" }}>
                What is a wallet? How to setup
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "0 0 20px 0" }}>
              <Typography sx={{ color: "#ffffff" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            disableGutters
            sx={{
              backgroundColor: "transparent",
              borderBottom: "1px solid #3F424F",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
              aria-controls="panel3a-content"
              id="panel3a-header"
              sx={{ padding: "0" }}
            >
              <Typography sx={{ color: "#EAEBEF" }}>
                How to buy crypto?
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "0 0 20px 0" }}>
              <Typography sx={{ color: "#ffffff" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            disableGutters
            sx={{
              backgroundColor: "transparent",
              borderBottom: "1px solid #3F424F",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
              aria-controls="panel4a-content"
              id="panel4a-header"
              sx={{ padding: "0" }}
            >
              <Typography sx={{ color: "#EAEBEF" }}>
                What is a token?
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "0 0 20px 0" }}>
              <Typography sx={{ color: "#ffffff" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </SwipeableDrawer>
    </React.Fragment>
  );
}

export default HelpDrawer;
