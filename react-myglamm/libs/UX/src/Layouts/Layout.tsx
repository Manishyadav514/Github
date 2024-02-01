import React, { ReactElement } from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import LazyHydrate from "react-lazy-hydration";

import useTranslation from "@libHooks/useTranslation";

import TopBanner from "@libComponents/Header/TopBanner";
import VendorDynamicComponent from "@libComponents/VendorDynamicComponent";

const Header = dynamic(() => import(/* webpackChunkName: "defaultHeader" */ "@libComponents/Header/Header"));
const SRNHeader = dynamic(() => import(/* webpackChunkName: "SRNHeader" */ "@libComponents/Header/SRNHeader"));
const ThemeHeader = dynamic(() => import(/* webpackChunkName: "defaultHeader" */ "@libComponents/Header/ThemeHeader"));

const Footer = dynamic(() => import(/* webpackChunkName: "MGPFooter" */ "@libComponents/Footer/Footer"));
const STBFooter = dynamic(() => import(/* webpackChunkName: "STBFooter" */ "@libComponents/Footer/STBFooter"));
const BBCFooter = dynamic(() => import(/* webpackChunkName: "BBCFooter" */ "@libComponents/Footer/BBCFooter"));
const SRNFooter = dynamic(() => import(/* webpackChunkName: "SRNFooter" */ "@libComponents/Footer/SRNFooter"));
const TMCFooter = dynamic(() => import(/* webpackChunkName: "TMCFooter" */ "@libComponents/Footer/TMCFooter"));
const ORHFooter = dynamic(() => import(/* webpackChunkName: "ORHFooter" */ "@libComponents/Footer/ORHFooter"));
const SRNFooterME = dynamic(() => import(/* webpackChunkName: "SRNMEFooter" */ "@libComponents/Footer/SRNFooterME"));

interface LayoutProps {
  header?: boolean;
  footer?: boolean;
  topBanner?: boolean;
  children: ReactElement;
}

const Layout = ({ children, header = true, footer = true, topBanner = true }: LayoutProps) => {
  const { t } = useTranslation();

  const { asPath } = useRouter();

  const SURVEY_PAGE = t("surveyUrl") && t("surveyUrl").find((x: string) => asPath.startsWith(x));

  return (
    <React.Fragment>
      {topBanner && !SURVEY_PAGE && (
        <LazyHydrate whenIdle>
          <TopBanner />
        </LazyHydrate>
      )}

      {header && !SURVEY_PAGE && (
        <VendorDynamicComponent default={<Header />} mnm={<ThemeHeader />} srn={<SRNHeader />} blu={<SRNHeader />} />
      )}

      {children}

      {footer && !SURVEY_PAGE && (
        <LazyHydrate whenVisible>
          <VendorDynamicComponent
            stb={<STBFooter />}
            orh={<ORHFooter />}
            bbc={<BBCFooter />}
            tmc={<TMCFooter />}
            default={<Footer />}
            srn-are={<SRNFooterME />}
            popxo={<Footer websiteName="PopXO" />}
            orb={<Footer websiteName="Oriental Botanics" />}
            mnm={<Footer websiteName="Manish Malhotra" />}
            twk={<Footer websiteName="Tweak India" />}
            srn={<SRNFooter websiteName="TheSirona" />}
            blu={<SRNFooter websiteName="Bleu" />}
          />
        </LazyHydrate>
      )}
    </React.Fragment>
  );
};

Layout.whyDidYouRender = true;

export default Layout;
