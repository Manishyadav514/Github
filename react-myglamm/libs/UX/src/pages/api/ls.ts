import { NextApiRequest, NextApiResponse } from "next";

import { WHITELISTED_WEBSITES } from "@libConstants/WhitelistSite.contant";

import Cors from "cors";

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);

  res.setHeader("content-type", "text/html; charset=utf-8");
  res.setHeader("Content-Security-Policy", `frame-ancestors 'self' ${WHITELISTED_WEBSITES().join(" ")}`);

  res.status(200).send(`
  <script>
    window.onmessage = function(event) {
      try {
        if(${JSON.stringify(WHITELISTED_WEBSITES())}.includes(event.origin)) {
          var payload = JSON.parse(event.data);
          localStorage.setItem(payload.key, payload.value);
        } else {
          return;
        }
      }catch{};
    }
  </script>
`);
};
