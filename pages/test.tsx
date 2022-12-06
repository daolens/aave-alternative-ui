import React, { useEffect } from "react";
import { useAppDataContext } from "src/hooks/app-data-provider/useAppDataProvider";
import { useWalletBalances } from "src/hooks/app-data-provider/useWalletBalances";
import { useProtocolDataContext } from "src/hooks/useProtocolDataContext";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";

function Test() {
  const { walletBalances } = useWalletBalances();
  const { reserves } = useAppDataContext();
  const {
    currentChainId: marketChainId,
    currentNetworkConfig,
    currentMarketData,
  } = useProtocolDataContext();
  const web3ContextData = useWeb3Context();
//   useEffect(() => {
//     console.log(
//       "testnetsEnabled",
//       window?.localStorage.getItem("testnetsEnabled")
//     );
//   }, []);

  console.log("chain data", currentNetworkConfig,reserves,currentMarketData);
  return <div>Test</div>;
}

export default Test;
