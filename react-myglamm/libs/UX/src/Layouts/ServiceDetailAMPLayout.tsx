import BBCAMPHeader from "@libComponents/AMP/BBCAMPHeader";
import React, { ReactElement } from "react";

export default function ServiceDetailAMPLayout({ children }: { children: ReactElement }) {
  return (
    <>
      <BBCAMPHeader />
      {children}
      <footer>
        <p>
          © Sanghvi Technologies Pvt. Ltd
          <br />
          Sanghvi House, 105/2, Shivajinagar, Pune- 411 005
          <br />
          CIN NO - U72200MH2014PTC253152
          <br />
          Customer Support No - 7710080003 Mon-Fri (10am-7pm)
        </p>
      </footer>
    </>
  );
}
