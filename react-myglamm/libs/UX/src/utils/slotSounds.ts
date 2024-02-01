export const options = {
  sound: {
    win: "/global/sounds/win32.mp3",
    spin: "/global/sounds/spin32.mp3",
  },
};

export function playSound(url: any, option: any) {
  if (url) {
    const audio = new Audio();
    audio.src = url;
    audio.onerror = () => console.warn(`Failed to load audio: ${url}`);

    if (option === "play") {
      audio.play();
    } else {
      audio.pause();
    }
  }
}

export const slotImages: any = [
  {
    image: "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/Nailpolish@3x.png",
    id: 1,
  },
  {
    image: "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/Mascara@3x.png",
    id: 2,
  },
  {
    image: "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/Lipstick@3x_2.png",
    id: 3,
    winningSlot: true,
  },
  {
    image: "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/Compact-@3x.png",
    id: 4,
  },
];
const shuffle = (array: any) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

const generateSlotData = (slotImages: any) => {
  let nestedShuffledArray = [[], [], []];
  for (let i = 0; i < 50; i++) {
    let randomnumbers: any = new Set();
    while (randomnumbers.size < 3) {
      randomnumbers.add(slotImages[Math.floor(Math.random() * slotImages.length)]);
    }
    let shuffledArray: any = [...randomnumbers];
    for (let j = 0; j < 3; j++) {
      // @ts-ignore
      nestedShuffledArray[j].push(shuffledArray[j]);
    }
  }
  return nestedShuffledArray;
};

export const getSlotItems = (slotImages: any, shouldWin: boolean) => {
  const [shuffled1, shuffled2, shuffled3] = generateSlotData(slotImages);

  return [shuffled1, shuffled2, shuffled3].map((i: any) => {
    if (shouldWin) {
      i.pop();
      i.push(i.find((x: any) => x.winningSlot));
    }
    return i;
  });
};

export const vibrate = (ms: number) => {
  const canVibrate = window.navigator.vibrate;
  if (!!canVibrate) window.navigator.vibrate(ms);
};

export const blurElement = (element: any, px: any) => {
  element.style.transition = `1s -webkit-filter linear`;
  element.style.filter = `blur(${px}px)`;
  element.style.webkitFilter = `blur(${px}px)`;

  element.style.webkitBackdropFilter = `blur(${px}px)`;
};

export const buildThankYouURL = (pathname: any, query: any, version: any) => {
  let queryParams = "";
  if (location.search.startsWith("?")) {
    queryParams =
      "&" +
      location.search
        .toLowerCase()
        .split("?")[1]
        .split("&")
        .filter(i => i.startsWith("utm_"))
        .join("&");
  }
  let _url = `${pathname}-thankyou`;
  _url += `?doRedirect=true${version ? `&mb=${version}` : ""}` + queryParams;
  return _url;
};
