import React, { useState } from "react";
import { useRouter } from "next/router";
import useTranslation from "@libHooks/useTranslation";
import useScroll from "../../hooks/useScroll";
import SearchIconGrey from "../../../public/svg/searchicon-grey.svg";
import LazyHydrate from "react-lazy-hydration";
import dynamic from "next/dynamic";
import { SHOP } from "@libConstants/SHOP.constant";

const SearchBar = dynamic(() => import("@libComponents/Header/SearchBar"), { ssr: false });
const TYPING_SPEED = 150;
const DELETING_SPEED = 30;
interface HomeSearchTyperProps {
  typingText: any;
}
interface HomeSearchTyperState {
  text: string;
  isDeleting: boolean;
  loopNum: number;
  typingSpeed: number;
}
// @ts-ignore
class HomeSearchTyper extends React.Component<HomeSearchTyperProps, HomeSearchTyperState> {
  constructor(props: HomeSearchTyperProps) {
    super(props);
    this.state = {
      text: "",
      isDeleting: false,
      loopNum: 0,
      typingSpeed: TYPING_SPEED,
    };
  }

  componentDidMount() {
    // initiate fancy stuff late on page load to keep main thread silent
    setTimeout(() => {
      window.requestIdleCallback(this.handleType);
    }, 3000);
  }

  handleType = () => {
    const { typingText } = this.props;

    if (typingText) {
      const { isDeleting, loopNum, text, typingSpeed } = this.state;
      const i = loopNum % typingText.length;
      const fullText = typingText[i];

      this.setState({
        text: isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1),
        typingSpeed: isDeleting ? DELETING_SPEED : TYPING_SPEED,
      });
      if (!isDeleting && text === fullText) {
        setTimeout(() => this.setState({ isDeleting: true }), 500);
      } else if (isDeleting && text === "") {
        this.setState({
          isDeleting: false,
          loopNum: loopNum + 1,
        });
      }
      if (text === typingText[typingText.length - 1]) {
        return false;
      }
      setTimeout(this.handleType, typingSpeed);
    }
  };

  render() {
    return (
      <div className="p-3 text">
        &nbsp;<span>{this.state.text}</span>
      </div>
    );
  }
}

const SearchBarContainer = () => {
  return <SearchBar />;
};

const HomeSearch = ({ source = "home", themed }: any) => {
  const { t, isConfigLoaded } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [down, setDown] = useState(false);
  const router = useRouter();
  const MINIMUM_SCROLL = 50;
  const TIMEOUT_DELAY = 50;

  useScroll((callbackData: any) => {
    const { previousScrollTop, currentScrollTop } = callbackData;
    const isScrolledDown = previousScrollTop < currentScrollTop;
    const isMinimumScrolled = currentScrollTop > MINIMUM_SCROLL;
    if (!isMinimumScrolled) {
      setDown(false);
    }

    setTimeout(() => {
      if (isMinimumScrolled) {
        setDown(isScrolledDown);
      }
    }, TIMEOUT_DELAY);
  });

  return (
    <LazyHydrate whenIdle>
      <div
        id="homesearch"
        className={`flex-col homesearch flex w-full p-3 relative z-[-1] shadow ${SHOP.SITE_CODE === "srn" ? "pt-2" : "pt-0"} ${
          themed ? "bg-color1" : "bg-white"
        }`}
        tabIndex={0}
        aria-label="search for your favourite products"
      >
        {router.pathname === "/" && <SearchBarContainer />}

        <div className="bg-white w-full rounded shadow-inner border border-gray-400">
          <div
            // change text color text-gray-400 to text-gray-500 for sufficient color contrast
            className="relative flex items-center justify-between text-gray-500 font-sm w-full text-xs outline-none"
            onClick={() => {
              router.push("/search");
            }}
          >
            {isConfigLoaded && source !== "collection" ? (
              <HomeSearchTyper typingText={t("homeSearchBoxItems")} />
            ) : (
              <div className="p-2 text">
                <span>{t("homeSearchBoxItems")?.[t("homeSearchBoxItems")?.length - 1]}</span>
              </div>
            )}
            <p className="font-semibold text-xs">
              <span className="w-auto flex justify-end items-center text-gray-500 p-2">
                <SearchIconGrey role="img" aria-labelledby="search" title="search" />
              </span>
            </p>
          </div>
        </div>
      </div>
    </LazyHydrate>
  );
};

export default React.memo(HomeSearch);
