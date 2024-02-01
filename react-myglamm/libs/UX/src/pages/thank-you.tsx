import * as React from "react";

import Link from "next/link";
import useTranslation from "@libHooks/useTranslation";

function ThankYou() {
  const { t } = useTranslation();

  return (
    <section className="min-h-screen flex flex-col items-center text-center justify-center">
      <img src="https://files.myglamm.com/site-images/original/customer-thank-you.png" alt="check-imgae" />
      <h1 className="mt-8 mb-16 text-2xl">{t("changesUpdated")}</h1>
      <Link href="/" className="rounded-sm inline-block bg-ctaImg text-white py-2 px-14" aria-label={t("continueShopping")}>
        {t("continueShopping")}
      </Link>
    </section>
  );
}

export default ThankYou;
