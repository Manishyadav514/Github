import React, { Fragment } from "react";
import Link from "next/link";

import { BreadCrumbData } from "@typesLib/PDP";

import useTranslation from "@libHooks/useTranslation";
import { BASE_URL } from "@libConstants/COMMON.constant";

const Breadcrumbs = ({ navData }: { navData: BreadCrumbData[] }) => {
  const { t } = useTranslation();

  const breadCrumbs = navData.filter(x => !x.slug?.includes("home")); // remove home key

  if (navData?.[0]?.name) {
    /** Breadcrumb Schema */
    const breadcrumbSchema: any = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [],
    };

    breadCrumbs?.slice(0, breadCrumbs.length - 1).map((bd, index) => {
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        position: index + 1,
        name: bd.name,
        item: `${BASE_URL()}${bd.slug}`,
      });
    });

    return (
      <div className="uppercase py-3 border-b border-gray-300 text-xs flex items-center justify-center rounded tracking-widest">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        <Link href="/">{t("home")}</Link>

        {breadCrumbs.map((nav, index) => (
          <Fragment key={nav.slug || nav.name}>
            <p className="px-2 text-gray-300 font-bold">/</p>
            {nav.slug && index < breadCrumbs.length - 1 ? <Link href={nav.slug}>{nav.name}</Link> : <strong>{nav.name}</strong>}
          </Fragment>
        ))}
      </div>
    );
  }

  return null;
};

export default Breadcrumbs;
