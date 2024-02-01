import { NextApiRequest, NextApiResponse } from "next";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { lang, status } = req.query;

  const LANG = lang ? `/${lang}` : "";

  const webUrl = ["CHARGED", "PENDING"].includes(status as string)
    ? ` ${LANG}/order-summary?status=success`
    : ` ${LANG}/order-summary?status=failed`;

  res.writeHead(302, {
    Location: IS_DESKTOP ? webUrl : `${LANG}/order-summary?status=pending`,
  });

  return res.end();
};
