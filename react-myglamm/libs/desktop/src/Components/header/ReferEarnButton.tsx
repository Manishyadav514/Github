import React from "react";
import Link from "next/link";

const ReferEarnButton = ({ t }: any) => (
  <li className="hide-for-mob" style={{ marginRight: "4rem" }}>
    <Link href="/refer">
      <a className="btn btn-primary btn-store-locator clevrtap" target="_blank" style={{ margin: "0px" }}>
        {t("referEarn")}
      </a>
    </Link>
  </li>
);

export default ReferEarnButton;
