// @ts-nocheck

import React from "react";
import Script from "next/script";

const FirebaseScript = () => {
  /* Only fetching the required firebase scripts if the firebase is not already fetched */
  if (typeof firebase === "undefined") {
    return (
      <>
        <Script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js" strategy="beforeInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js" strategy="beforeInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js" strategy="beforeInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js" strategy="beforeInteractive" />
      </>
    );
  }
  return null;
};

export default FirebaseScript;
