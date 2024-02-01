export const BABY_NAMES_CATEGORIES = {
  origin: {
    title: "Baby Names By Origin",
    image: "https://files.babychakra.com/site-images/original/name-by-origin.png",
    class: {
      card: "bg-sky-50",
      strip: "border-solid border-b-2 border-sky-100 lg:border-none",
    },
    list: [
      {
        text: "Hindu Names",
        link: "/baby-names/hindu-names",
      },
      {
        text: "Muslim	Names",
        link: "/baby-names/muslim-names",
      },
      {
        text: "Sanskrit Names",
        link: "/baby-names/sanskrit-names",
      },
      {
        text: "Bengali Names",
        link: "/baby-names/bengali-names",
      },
      {
        text: "Sikh Names	",
        link: "/baby-names/sikh-names",
      },
      {
        text: "South Indian Names	",
        link: "/baby-names/south-indian-names",
      },
    ],
  },
  regional: {
    title: "Baby Names By Region",
    image: "https://files.babychakra.com/site-images/original/name-by-religion.png", // name to be changed
    class: {
      card: "bg-cyan-50 ",
      strip: "border-solid border-b-2 border-cyan-100 lg:border-none",
    },
    list: [
      {
        text: "Tamil Names",
        link: "/baby-names/tamil-names",
      },
      {
        text: "Telugu	Names",
        link: "/baby-names/telugu-names",
      },
      {
        text: "Marathi Names",
        link: "/baby-names/marathi-names",
      },
      {
        text: "Punjabi Names",
        link: "/baby-names/punjabi-names",
      },
      {
        text: "Gujrati Names",
        link: "/baby-names/gujrati-names",
      },
      {
        text: "Kannada Names",
        link: "/baby-names/kannada-names",
      },
      {
        text: "Malayalam Names",
        link: "/baby-names/malayalam-names",
      },
    ],
  },

  dynamic: {
    title: "Most Searched in Baby Names",
    image: "https://files.babychakra.com/site-images/original/name-by-most-search.png", // name to be changed
    class: {
      card: "bg-yellow-100 ",
      strip: "border-solid border-b-2 border-yellow-200 lg:border-none",
    },
    list: [
      // {
      //   text: "Trending Girl Names",
      //   link: "/baby-names/girls",
      // },
      // {
      //   text: "Trending Boy Names",
      //   link: "/baby-names/boys",
      // },
      // {
      //   text: "Unique Girl Names",
      //   link: "/baby-names/girls",
      // },
      // {
      //   text: "Unique Baby Names",
      //   link: "/baby-names/boys",
      // },
      {
        text: "Baby Boy Names",
        link: "/baby-names/boys",
      },
      {
        text: "Baby Girl Names",
        link: "/baby-names/girls",
      },
      // {
      //   text: "Unisex Names",
      //   link: "/baby-names/unisex",
      // },
    ],
  },

  dynamic2: {
    title: "Other Popular Categories",
    image: "https://files.babychakra.com/site-images/original/name-by-other-categories.png", // name to be changed
    class: {
      card: "bg-pink-100 ",
      strip: "border-solid border-b-2 border-pink-200 lg:border-none",
    },
    list: [
      {
        text: "Baby Names Starting with A",
        link: "/baby-names/starting-with-a",
      },
      {
        text: "Baby Names Starting with H",
        link: "/baby-names/starting-with-h",
      },
      {
        text: "Baby Names Starting with P",
        link: "/baby-names/starting-with-p",
      },
      {
        text: "Baby Names Starting with R",
        link: "/baby-names/starting-with-r",
      },
      {
        text: "Baby Names Starting with S",
        link: "/baby-names/starting-with-s",
      },
    ],
  },
};

export const ORIGIN_LIST = ["HINDU", "MUSLIM", "SANSKRIT", "BENGALI", "SOUTH INDIAN", "SIKH", "SOUTH-INDIAN"];
export const REGIONAL_LIST = ["TAMIL", "TELUGU", "MARATHI", "PUNJABI", "GUJRATI", "KANNADA", "MALAYALAM"];

export const KEYS_TO_BE_SHOWN = ["name", "meaning", "gender", "region", "religion", "origin"];

export const RandomAlphabets = {
  A: ["B", "F", "J", "N", "R", "V"],
  B: ["C", "G", "K", "O", "S", "W"],
  C: ["D", "H", "L", "P", "T", "X"],
  D: ["E", "I", "M", "Q", "U", "Y"],
  E: ["F", "J", "N", "R", "V", "Z"],
  F: ["A", "G", "K", "O", "S", "W"],
  G: ["B", "H", "L", "P", "T", "X"],
  H: ["C", "I", "M", "Q", "U", "Y"],
  I: ["D", "J", "N", "R", "V", "Z"],
  J: ["A", "E", "K", "O", "S", "W"],
  K: ["B", "F", "L", "P", "T", "X"],
  L: ["C", "G", "M", "Q", "U", "Y"],
  M: ["D", "H", "N", "R", "V", "Z"],
  N: ["A", "E", "I", "O", "S", "W"],
  O: ["B", "F", "J", "P", "T", "X"],
  P: ["C", "G", "K", "Q", "U", "Y"],
  Q: ["D", "H", "L", "R", "V", "Z"],
  R: ["A", "E", "I", "M", "S", "W"],
  S: ["B", "F", "J", "N", "T", "X"],
  T: ["C", "G", "K", "O", "U", "Y"],
  U: ["D", "H", "L", "P", "V", "Z"],
  V: ["A", "E", "I", "M", "Q", "W"],
  W: ["B", "F", "J", "N", "R", "X"],
  X: ["C", "G", "K", "O", "S", "Y"],
  Y: ["D", "H", "L", "P", "T", "Z"],
  Z: ["A", "E", "I", "M", "Q", "U"],
};

export const ALPHABETS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
];

export const LAST_TWO_ALPHABETS = ["Y", "Z"];

export const ALL_ALPHABETS = [...ALPHABETS, ...LAST_TWO_ALPHABETS];

export const GENDER = ["BOYS", "GIRLS", "UNISEX"];
