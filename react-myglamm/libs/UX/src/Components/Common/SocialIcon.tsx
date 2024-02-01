import React from "react";

const iconSet: any = {
  "fb-ico": {
    path: "M304 418l78 0 0 94-78 0c-60 0-109-49-109-110l0-47-63 0 0-95 63 0 0-251 93 0 0 251 78 0 16 95-94 0 0 47c0 8 7 16 16 16z",
  },
  "instagram-ico": {
    path: "M451 512l-390 0c-34 0-61-27-61-61l0-390c0-34 27-61 61-61l390 0c34 0 61 27 61 61l0 390c0 34-27 61-61 61z m-83-80c0 9 7 16 16 16l48 0c9 0 16-7 16-16l0-48c0-9-7-16-16-16l-48 0c-9 0-16 7-16 16z m-111-78c54 0 98-44 98-99 0-54-44-98-98-98-55 0-99 44-99 98 0 55 44 99 98 99 1 0 1 0 1 0z m207-290c0-9-7-16-16-16l-384 0c-9 0-16 7-16 16l0 240 64 0c-8-12-11-34-11-49 0-86 70-155 156-155 86 0 155 69 155 155 0 15-2 37-12 49l64 0z",
  },
  "twitter-ico": {
    path: "M481 395c-13-18-28-34-46-47 0-3 0-7 0-12 0-25-3-50-11-74-7-25-18-49-33-71-14-23-32-43-52-61-21-17-45-31-74-41-29-11-60-16-92-16-52 0-99 14-142 42 7-1 14-2 22-2 43 0 81 14 115 40-20 0-38 6-54 18-16 12-27 27-33 46 7-1 13-2 18-2 8 0 16 1 24 4-21 4-39 15-53 31-14 17-21 37-21 59l0 1c13-7 27-11 42-11-13 8-23 19-30 32-8 14-11 29-11 44 0 17 4 33 12 47 23-28 51-51 84-68 33-17 69-27 107-29-2 8-3 15-3 22 0 25 9 47 27 65 18 18 40 27 66 27 26 0 49-10 67-29 21 4 40 11 59 22-7-22-21-39-41-51 18 2 35 7 53 14z",
  },
};

const SocialIcon = ({
  socialLink,
  label,
  iconName,
  width = "50px",
  height = "50px",
  fill = "white",
  svgViewBox = "-250 0 1000 1000",
  ariaLabel = "social icon",
}: any) => (
  <div className="w-1/4 h-12 py-5 px-3 flex justify-center" role="listitem">
    <a href={socialLink} rel="noopener noreferrer" target="_blank" aria-label={label}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width={width}
        height={height}
        viewBox={svgViewBox}
        role="img"
        aria-labelledby={ariaLabel}
      >
        <title>{ariaLabel}</title>
        <path transform="scale(1,-1) translate(0, -650)" fill={fill} d={iconSet[iconName].path} />
      </svg>
    </a>
  </div>
);
export default SocialIcon;
