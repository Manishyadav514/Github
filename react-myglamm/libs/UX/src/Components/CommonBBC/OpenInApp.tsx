import React from "react";
import Link from "next/link";

import { GAgenericEvent } from "@libUtils/analytics/gtm";

interface PropTypes {
  appLink: string;
  id: string;
}
const OpenInApp: React.FC<PropTypes> = ({ appLink, id }: PropTypes) => {
  return (
    <Link href={appLink} aria-label="open in app">
      <button
        type="button"
        className="text-10 font-medium text-white bg-cyan-400 fixed right-0 bottom-40 z-20 rounded-l-full p-1 sm:hidden"
        style={{ fontSize: "10px", padding: "3px 5px" }}
        onClick={() => {
          GAgenericEvent("engagement", "BBC Clicked On Open In App", id);
        }}
      >
        Open in App
      </button>
    </Link>
  );
};

export default React.memo(OpenInApp);
