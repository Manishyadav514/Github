import { useRouter } from "next/router";
import * as React from "react";

const SearchLabel = ({ label, color = "color2", textSize, showButton = false, handleButtonClick }: any) => {
  const { pathname } = useRouter();

  return (
    <div
      className={`flex pb-4 pl-3 ${showButton ? " justify-between" : "justify-start"} ${
        textSize || (pathname === "/search" || pathname === "/find" ? "text-lg" : "text-xl")
      }`}
    >
      <span
        className="font-bold text-gray-800 inline-block bg-no-repeat pl-0.5"
        style={{
          backgroundSize: "100% 95%",
          backgroundImage: `linear-gradient(180deg,transparent 77%, var(--${color}) 0)`,
        }}
      >
        {label}
      </span>
      {showButton && (
        <button onClick={() => handleButtonClick()} className="text-color1 text-xs">
          Delete
        </button>
      )}
    </div>
  );
};

export default SearchLabel;
