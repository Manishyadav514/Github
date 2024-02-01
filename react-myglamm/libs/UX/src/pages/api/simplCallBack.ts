import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { lang, q } = req.query;
  const URL = req.headers.host?.includes("localhost:3000") ? "http://localhost:3000" : q;

  const redirectURL = lang
    ? `${URL}/${lang}/payment?simplToken=${req.body.token}`
    : `${URL}/payment?simplToken=${req.body.token}`;

  res.setHeader("Content-Type", "text/html");

  return res.send(
    `<!DOCTYPE html><html> <head> <title>Simpl</title> </head> <body> <h1>Redirect to MyGlamm</h1> <form name="frm" method="post"><input type="hidden" id="response" name="responseField" value="${req.body.token}"/> </form> <script>function response(){var token=document.getElementById("response").value; if(token){return window.location.href="${redirectURL}";}return console.log(token);}response(); </script> </body> </html>`
  );
};
