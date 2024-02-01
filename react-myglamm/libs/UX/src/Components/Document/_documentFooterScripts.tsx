import React from "react";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const DocFooterScripts = ({ __NEXT_DATA__ }: { __NEXT_DATA__: any }) => {
  const { NOTP } = __NEXT_DATA__.query;
  return (
    <>
      {!NOTP && GBC_ENV.NEXT_PUBLIC_OPT_CONTAINER_ID && (
        <script async defer src={`https://www.googleoptimize.com/optimize.js?id=${GBC_ENV.NEXT_PUBLIC_OPT_CONTAINER_ID}`} />
      )}
      {!NOTP && GBC_ENV.NEXT_PUBLIC_SPJS_LINK && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
            ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[]; p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments) };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1; n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script",'${GBC_ENV.NEXT_PUBLIC_SPJS_LINK}',"snowplow")); 
            `,
          }}
        />
      )}
    </>
  );
};

export default DocFooterScripts;
