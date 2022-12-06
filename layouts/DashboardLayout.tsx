import Head from "next/head";
import React, { ReactNode, useState, createContext, useEffect } from "react";
import styles from "../styles/layoutStyles/dashboardLayout.module.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import HelpButton from "../components/buttons/HelpButton";
import ConnectWallet from "../components/buttons/ConnectWallet";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import HelpDrawer from "../components/HelpDrawer";
import { HelpDrawerContextProvider } from "../contexts/HelpDrawerContextProvider";
import { useRouter } from "next/router";
import Switch from "@mui/material/Switch";
interface Props {
  children?: ReactNode;
}
type Anchor = "top" | "left" | "bottom" | "right";

const HelpDrawerContext = createContext({});
function DashboardLayout({ children }: Props) {
  const router = useRouter();
  // ! Local states
  const [selectedMarket, setSelectedMarket] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedMarket(event.target.value);
  };
  const testnetsEnabledId = "testnetsEnabled";
  const [testnetsEnabled, setTestnetsMode] = useState(false);
  useEffect(() => {
    const testnetsEnabledLocalstorage =
      window.localStorage.getItem(testnetsEnabledId) === "true" || false;
    setTestnetsMode(testnetsEnabledLocalstorage);
  }, []);

  const toggleTestnetsEnabled = () => {
    const newState = !testnetsEnabled;
    setTestnetsMode(!testnetsEnabled);
    window.localStorage.setItem(testnetsEnabledId, newState ? "true" : "false");
    // Set window.location to trigger a page reload when navigating to the the dashboard
    // window.location.href = "/";
  };
  const label = {
    inputProps: {
      "aria-label": "Testnet",
      label: "Testnet",
    },
  };
  return (
    <div className={styles.container}>
      <HelpDrawerContextProvider>
        <>
          <Head>
            <title>Daolens | Aave interface</title>
            <meta
              name="description"
              content="A revamped interface for the Aave lending product"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="transparent">
              <Toolbar className={styles.toolbar}>
                <div className={styles.toolbar_left}>
                  <Image
                    src="/icons_svg/aave_logo.svg"
                    alt="Aave"
                    width={100}
                    height={50}
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push("/")}
                  />
                  <Typography
                    className={styles.toolbar_left__typography}
                    color="#ffffff"
                    variant="h4"
                    component="div"
                    sx={{ flexGrow: 1 }}
                    onClick={() => router.push("/")}
                  >
                    Home
                  </Typography>
                  {/* <Typography
                    className={styles.toolbar_left__typography}
                    color="#ffffff"
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                  >
                    Dashboard
                  </Typography> */}
                </div>
                <div className={styles.toolbar_right}>
                  <Typography
                    className={styles.toolbar_left__typography}
                    color="#ffffff"
                    variant="h4"
                    component="div"
                    sx={{ flexGrow: 1 }}
                    // onClick={() => router.push("/")}
                  >
                    Testnet
                  </Typography>
                  <Switch
                    checked={testnetsEnabled}
                    onChange={toggleTestnetsEnabled}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  <HelpButton />
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 100, transform: "translateY(-5px)" }}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                      sx={{
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Markets
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={selectedMarket}
                      onChange={handleChange}
                      label="Market"
                      sx={{ color: "#ffffff" }}
                    >
                      <MenuItem value={"Polygon 1"}>
                        <Image
                          src="/icons_svg/polygon_icon.svg"
                          alt="Polygon"
                          width={16}
                          height={16}
                          style={{ marginRight: "8px" }}
                        />{" "}
                        Polygon 1
                      </MenuItem>
                      <MenuItem value={"Polygon 2"}>
                        <Image
                          src="/icons_svg/polygon_icon.svg"
                          alt="Polygon"
                          width={16}
                          height={16}
                          style={{ marginRight: "8px" }}
                        />{" "}
                        Polygon 2
                      </MenuItem>
                      <MenuItem value={"Polygon 3"}>
                        <Image
                          src="/icons_svg/polygon_icon.svg"
                          alt="Polygon"
                          width={16}
                          height={16}
                          style={{ marginRight: "8px" }}
                        />{" "}
                        Polygon 3
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <ConnectWallet buttonText={"Connect Wallet"} />
                </div>
              </Toolbar>
            </AppBar>
          </Box>

          <HelpDrawer />
          <main className={styles.main}>{children}</main>
        </>
      </HelpDrawerContextProvider>
    </div>
  );
}

export default DashboardLayout;
