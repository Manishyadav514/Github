import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const glammVideUrls: any = {
    "basic-eye-course": [
      {
        name: ".glamm-video-1",
        url: "U75UI0UNOss?rel=0&amp;autoplay=1",
      },
      {
        name: ".glamm-video-2",
        url: "xiDpF3mWtCg?rel=0&amp;autoplay=1",
      },
      {
        name: ".glamm-video-3",
        url: "rbCRbR8BjvY?rel=0&amp;autoplay=1",
      },
      {
        name: ".glamm-video-4",
        url: "j2QlzMsh-TA?rel=0&amp;autoplay=1",
      },
      {
        name: ".glamm-video-5",
        url: "lHpa_m_Eodc?rel=0&amp;autoplay=1",
      },
      {
        name: ".glamm-video-6",
        url: "Zr3-Oq5lmKs?rel=0&amp;autoplay=1",
      },
      {
        name: ".glamm-video-7",
        url: "tj4_K0v2Y0o?rel=0&amp;autoplay=1",
      },
    ],
    "face-makeup-course": [
      {
        name: ".glamm-video-1",
        url: "Jyz-PPusTEk?start=3&autoplay=1&end=29",
      },
      {
        name: ".glamm-video-2",
        url: "Jyz-PPusTEk?start=36&autoplay=1&end=93",
      },
      {
        name: ".glamm-video-3",
        url: "Jyz-PPusTEk?start=95&autoplay=1&end=280",
      },
      {
        name: ".glamm-video-4",
        url: "Jyz-PPusTEk?start=279&autoplay=1&end=435",
      },
      {
        name: ".glamm-video-5",
        url: "Jyz-PPusTEk?start=435&autoplay=1&end=575",
      },
      {
        name: ".glamm-video-6",
        url: "Jyz-PPusTEk?start=576&autoplay=1&end=597",
      },
    ],
    "grooming-tutorial-for-men": [
      {
        name: ".glamm-video-1",
        url: "zYGRzdC6iCE",
      },
      {
        name: ".glamm-video-2",
        url: "3GwTIZuaQMU",
      },
      {
        name: ".glamm-video-3",
        url: "NatNJpLUYv0",
      },
      {
        name: ".glamm-video-4",
        url: "5mj9nCKUe68",
      },
    ],
    "bridal-makeup-course": [
      {
        name: ".glamm-video-1",
        url: "JVwIQ5se5d8?start=9s",
      },
      {
        name: ".glamm-video-2",
        url: "BQP4vfF1Dpk?t=7s",
      },
      {
        name: ".glamm-video-3",
        url: "wyyzA_cYLKw?t=9s",
      },
      {
        name: ".glamm-video-4",
        url: "SaYRbbwtj9M",
      },
      {
        name: ".glamm-video-5",
        url: "ARFqm8BPNog",
      },
      {
        name: ".glamm-video-6",
        url: "WEcyXr1y-BU",
      },
      {
        name: ".glamm-video-7",
        url: "632tsG5_jKQ",
      },
      {
        name: ".glamm-video-8",
        url: "s-lw-zY_QwQ",
      },
    ],
    "celebrity-inspired-makeup-course": [
      {
        name: ".glamm-video-1",
        url: "7d-xgWdOxl8",
      },
      {
        name: ".glamm-video-2",
        url: "aZUj7cNV5ww",
      },
      {
        name: ".glamm-video-3",
        url: "uG2zx_bsoRk",
      },
      {
        name: ".glamm-video-4",
        url: "lb2tUBSYBKk",
      },
      {
        name: ".glamm-video-5",
        url: "_59iyUxMycA",
      },
      {
        name: ".glamm-video-6",
        url: "D8qTPIVaxIQ",
      },
      {
        name: ".glamm-video-7",
        url: "GB7L-uYy7co",
      },
      {
        name: ".glamm-video-8",
        url: "jY_Dtofkemk",
      },
    ],
    "basic-makeup-tips-for-beauties-with-dusky-skin-tone": [
      {
        name: ".glamm-video-1",
        url: "GMQ-HcBFG9k?start=04&autoplay=1&end=63",
      },
      {
        name: ".glamm-video-2",
        url: "uH0faOyJucA?start=04",
      },
      {
        name: ".glamm-video-3",
        url: "m3YHoyd8Ons?start=04",
      },
      {
        name: ".glamm-video-4",
        url: "XG9qfHCB_o0",
      },
    ],
    "essential-makeup-techniques": [
      {
        name: ".glamm-video-1",
        url: "Jyz-PPusTEk",
      },
      {
        name: ".glamm-video-2",
        url: "lHpa_m_Eodc",
      },
      {
        name: ".glamm-video-3",
        url: "ACkrb2u8xI4",
      },
      {
        name: ".glamm-video-4",
        url: "rbCRbR8BjvY",
      },
      {
        name: ".glamm-video-5",
        url: "j2QlzMsh-TA",
      },
    ],
    "back-to-basics": [
      {
        name: ".glamm-video-1",
        url: "CqAvjhcORYY",
      },
      {
        name: ".glamm-video-2",
        url: "tj4_K0v2Y0o",
      },
      {
        name: ".glamm-video-3",
        url: "xiDpF3mWtCg",
      },
      {
        name: ".glamm-video-4",
        url: "8pdSVeVrUIk",
      },
      {
        name: ".glamm-video-5",
        url: "k2R9foM5YME",
      },
      {
        name: ".glamm-video-6",
        url: "ZIrpZKzSLy4",
      },
    ],
    "festive-makeup": [
      {
        name: ".glamm-video-1",
        url: "WVQjKjImois",
      },
      {
        name: ".glamm-video-2",
        url: "f9yD8HmaPdI",
      },
      {
        name: ".glamm-video-3",
        url: "Gnx3D-IqkFA",
      },
      {
        name: ".glamm-video-4",
        url: "U1-jvHhB24M",
      },
      {
        name: ".glamm-video-5",
        url: "50Fwe-fwGoo",
      },
      {
        name: ".glamm-video-6",
        url: "SlZ84l0Baa4",
      },
      {
        name: ".glamm-video-7",
        url: "kpi_-lpiSGc",
      },
      {
        name: ".glamm-video-8",
        url: "NBD_RXxEk5w",
      },
    ],
    "ask-namrata": [
      {
        name: ".glamm-video-1",
        url: "b3cwhoKeGXg",
      },
      {
        name: ".glamm-video-2",
        url: "1E33Kfvb2nc",
      },
      {
        name: ".glamm-video-3",
        url: "nfhmXUT6ZHI",
      },
      {
        name: ".glamm-video-4",
        url: "U75UI0UNOss",
      },
      {
        name: ".glamm-video-5",
        url: "0khDYwdEKvw",
      },
      {
        name: ".glamm-video-6",
        url: "Zr3-Oq5lmKs",
      },
      {
        name: ".glamm-video-7",
        url: "vACghOuL28Y",
      },
      {
        name: ".glamm-video-8",
        url: "hQkTVd_IVKQ",
      },
    ],
  };

  if (req.method === "GET" && req.query) {
    const { course }: any = req.query;

    res.status(200).send({ data: glammVideUrls[course] });
  } else {
    res.status(404).send({ message: "Invalid Request" });
  }
};
