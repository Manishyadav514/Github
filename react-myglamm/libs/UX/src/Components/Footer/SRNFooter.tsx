import React from "react";

import FooterAppUrl from "@libComponents/Footer/FooterAppUrl";
import FooterCopyWrite from "@libComponents/Footer/FooterCopyWrite";
import FooterMenu from "@libComponents/Footer/FooterMenu";
import FooterSocialLinks from "@libComponents/Footer/FooterSocialLinks";

function SRNFooter({ websiteName }: { websiteName?: string }) {
  return (
    <footer className="relative inset-x-0 bottom-0 bg-black py-4 flex flex-col justify-center px-2">
      {/* ---- Footer Menu Url ----*/}
      <FooterMenu />

      {/* ----Social Page Links---- */}
      <FooterSocialLinks />

      <FooterAppUrl androidUrl="https://sr-n.in/8cQBanV4Eqb" iosUrl="https://sr-n.in/8cQBanV4Eqb" />

      {/* ---- Copyright ----*/}
      <FooterCopyWrite websiteName={websiteName} />
    </footer>
  );
}

export default SRNFooter;
