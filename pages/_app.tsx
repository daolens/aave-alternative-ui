import "../styles/globals.css";
import type { AppProps } from "next/app";
import { EmotionCache } from "@emotion/cache";
import { providers } from "ethers";
import createEmotionCache from "src/createEmotionCache";
import { NextPage } from "next";
import { CacheProvider } from "@emotion/react";
import { LanguageProvider } from "src/libs/LanguageProvider";
import { Web3ReactProvider } from "@web3-react/core";
import { ModalContextProvider } from "src/hooks/useModal";
import { Web3ContextProvider } from "src/libs/web3-data-provider/Web3Provider";
import { AppGlobalStyles } from "src/layouts/AppGlobalStyles";
import { AppDataProvider } from "src/hooks/app-data-provider/useAppDataProvider";
import { GasStationProvider } from "src/components/transactions/GasStation/GasStationProvider";
import { PermissionProvider } from "src/hooks/usePermissions";
import { BackgroundDataProvider } from "src/hooks/app-data-provider/BackgroundDataProvider";
import { AddressBlocked } from "src/components/AddressBlocked";
import { useEffect, useState } from "react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

function getWeb3Library(provider: any): providers.Web3Provider {
  const library = new providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}
export default function App(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page: React.ReactElement) => page);
 
  
  return (
    <CacheProvider value={emotionCache}>
      {/*@ts-ignore */}
      <LanguageProvider>
        <Web3ReactProvider getLibrary={getWeb3Library}>
          <Web3ContextProvider>
            <AppGlobalStyles>
              <AddressBlocked>
                {/*@ts-ignore */}
                <PermissionProvider>
                  {/*@ts-ignore */}
                  <ModalContextProvider>
                    {/*@ts-ignore */}
                    <BackgroundDataProvider>
                      {/*@ts-ignore */}
                      <AppDataProvider>
                        {/*@ts-ignore */}
                        <GasStationProvider>
                          {getLayout(<Component {...pageProps} />)}
                        </GasStationProvider>
                      </AppDataProvider>
                    </BackgroundDataProvider>
                  </ModalContextProvider>
                </PermissionProvider>
              </AddressBlocked>
            </AppGlobalStyles>
          </Web3ContextProvider>
        </Web3ReactProvider>
      </LanguageProvider>
    </CacheProvider>
  );
}
