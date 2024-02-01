import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.url?.includes(".css")) {
    res.setHeader("content-type", "text/css; charset=UTF-8");
  }

  const filePath = path.resolve(".", (req.url as string).split("/api/")[1]);
  const syncBuffer = fs.readFileSync(filePath);

  res.send(syncBuffer);
};
