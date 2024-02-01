import React, { ReactElement } from "react";

import dynamic from "next/dynamic";

import VendorDynamicComponent from "@libComponents/VendorDynamicComponent";

const Header = dynamic(() => import("../header/header"));
const HeaderTheme = dynamic(() => import("../header/headerTheme"));

const FooterBBC = dynamic(() => import("../footer/FooterBBC"));
const FooterMGP = dynamic(() => import("../footer/FooterMGP"));
const FooterORH = dynamic(() => import("../footer/FooterORH"));
const FooterSTB = dynamic(() => import("../footer/FooterSTB"));
const FooterTMC = dynamic(() => import("../footer/FooterTMC"));
const FooterMenu = dynamic(() => import("../footer/FooterMenu"));
const FooterSirona = dynamic(() => import("../footer/FooterSirona"));

interface LayoutProps {
  footer?: boolean;
  children: ReactElement;
}

const Layout = ({ footer = true, children }: LayoutProps) => (
  <>
    <VendorDynamicComponent default={<Header />} mnm={<HeaderTheme />} />

    <div className="px-2">{children}</div>

    {footer && (
      <footer className="bg-white w-full list-none px-2">
        <VendorDynamicComponent
          bbc={<FooterBBC />}
          mgp={<FooterMGP />}
          lit={<FooterMGP />}
          mnm={<FooterMGP />}
          orh={<FooterORH />}
          stb={<FooterSTB />}
          orb={<FooterSTB />}
          tmc={<FooterTMC />}
          srn={<FooterSirona />}
          blu={<FooterSirona />}
          default={<FooterMenu />}
        />
      </footer>
    )}
  </>
);

export default Layout;
