import * as React from "react";

/* eslint-disable */

export interface GlammIconProps extends React.SVGProps<SVGSVGElement> {
  height?: string | number;
  width?: string | number;
  fill?: string;
  viewBox?: string;
}

export const FilterIcon = ({
  width = "14",
  height = "14",
  viewBox = "0 0 14 14",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg width={width} height={height} viewBox={viewBox} {...otherProps} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.55995 1H12.44C12.5606 1.04329 12.6698 1.11427 12.7595 1.20748C12.8491 1.3007 12.9167 1.41369 12.9571 1.53779C12.9974 1.66189 13.0096 1.79382 12.9925 1.92346C12.9754 2.0531 12.9296 2.17701 12.8585 2.28571L8.67386 7V13L5.32614 10.4286V7L1.14149 2.28571C1.07042 2.17701 1.0246 2.0531 1.00752 1.92346C0.990436 1.79382 1.00256 1.66189 1.04295 1.53779C1.08334 1.41369 1.15093 1.3007 1.24055 1.20748C1.33016 1.11427 1.43942 1.04329 1.55995 1Z"
      stroke="#0E0E0E"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SortIcon = ({
  width = "16",
  height = "12",
  viewBox = "0 0 16 12",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg width={width} height={height} viewBox={viewBox} {...otherProps} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 3.85714L4.05556 1L7.11111 3.85714M4.05556 1V11" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M14.7501 8.14286L11.6946 11L8.63901 8.14286M11.6946 11V1"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GiFbIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M304 418l78 0 0 94-78 0c-60 0-109-49-109-110l0-47-63 0 0-95 63 0 0-251 93 0 0 251 78 0 16 95-94 0 0 47c0 8 7 16 16 16z"
    />
  </svg>
);

export const GiInstagramIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M451 512l-390 0c-34 0-61-27-61-61l0-390c0-34 27-61 61-61l390 0c34 0 61 27 61 61l0 390c0 34-27 61-61 61z m-83-80c0 9 7 16 16 16l48 0c9 0 16-7 16-16l0-48c0-9-7-16-16-16l-48 0c-9 0-16 7-16 16z m-111-78c54 0 98-44 98-99 0-54-44-98-98-98-55 0-99 44-99 98 0 55 44 99 98 99 1 0 1 0 1 0z m207-290c0-9-7-16-16-16l-384 0c-9 0-16 7-16 16l0 240 64 0c-8-12-11-34-11-49 0-86 70-155 156-155 86 0 155 69 155 155 0 15-2 37-12 49l64 0z"
    />
  </svg>
);

export const GiPinterestIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M73 341c0 21 4 40 11 59 7 18 17 34 29 47 13 14 27 25 44 35 16 10 34 18 53 23 19 5 38 7 57 7 31 0 59-6 84-19 26-13 47-31 64-55 16-24 24-52 24-82 0-19-2-36-6-54-3-18-9-34-17-51-8-16-17-30-28-42-12-13-25-22-42-30-16-7-34-11-54-11-13 0-26 3-38 9-13 7-22 15-28 26-2-8-4-19-8-33-3-14-5-23-6-27-1-4-3-11-6-20-3-9-6-16-8-20-2-4-5-10-9-18-4-8-8-15-13-22-5-7-11-15-18-25l-4-1-2 2c-3 30-5 48-5 54 0 18 2 37 7 59 4 22 10 49 19 82 8 33 13 53 14 58-6 13-9 29-9 49 0 15 5 30 15 44 10 14 23 21 38 21 11 0 21-4 27-12 6-7 10-17 10-29 0-12-4-31-13-54-8-24-12-42-12-54 0-12 4-22 12-30 9-8 19-12 32-12 10 0 20 3 29 8 9 4 16 11 22 19 6 8 11 17 16 27 5 10 8 21 11 32 3 11 4 21 6 31 1 10 2 20 2 29 0 33-11 58-32 77-21 18-48 27-81 27-38 0-70-12-96-37-25-24-38-56-38-93 0-9 1-17 4-25 2-8 5-14 7-18 3-5 6-9 8-13 2-4 4-7 4-9 0-5-2-12-5-21-3-8-6-13-10-13-1 0-2 1-5 1-10 3-18 8-26 16-8 8-13 17-17 27-5 10-8 21-10 31-2 10-3 21-3 30z"
    />
  </svg>
);

export const GiCloseIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M434 35c13 0 24 3 33 11 9 8 14 17 14 27 0 8-3 15-10 22l-159 174 149 163c6 7 9 14 9 21 0 9-4 17-13 24-8 7-18 11-29 11-13 0-24-6-33-16l-134-148-134 146c-11 12-23 18-37 18-13 0-24-4-33-12-9-8-13-17-13-28 0-8 3-15 9-22l146-159-163-177c-6-6-8-12-8-19 0-10 4-18 13-25 9-8 19-11 31-11 12 0 22 5 31 15l147 162 148-161c9-11 22-16 36-16z"
    />
  </svg>
);

export const GiRewardLevelIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M254 9c-135 0-245 111-245 247 0 136 110 247 245 247 134 0 244-111 244-247 0-136-110-246-244-247z m0 453c-113 0-204-93-204-206 0-114 91-206 204-206 112 0 203 92 203 206 0 114-91 206-203 206z m-28-252c-21 20-74 149-74 149 0 0 127-54 147-75 9-9 15-22 15-36 0-15-6-28-15-38-10-9-23-15-37-15-14 0-27 6-36 15z m42 59c-15 10-34 19-53 27 6-18 15-37 26-55 4-5 12-7 19-5 7 1 12 7 14 14 2 7 0 14-6 19z"
    />
  </svg>
);

export const GiBag1Ico = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M215 46c0 5-4 10-10 10l-140 0c-25 0-45 20-45 44l0 292 61 0 0-38c0-6 5-11 10-11 6 0 10 5 10 11l0 38 122 0 0-38c0-6 4-11 10-11 6 0 10 5 10 10 0 1 0 1 0 1l0 38 61 0 0-20c0-6 5-10 10-10 6 0 10 4 10 10l0 30c0 5-4 10-10 10l-71 0c-2 43-37 78-81 78-43 0-79-35-81-78l-71 0c-6 0-10-5-10-10l0-302c0-35 29-64 65-64l140 0c6 0 10 4 10 10z m-53 423c33 0 59-25 61-57l-122 0c2 32 29 57 61 57z m139-183l0-11-55 0c-6 0-10-5-10-10l0-177c0-29 23-52 51-52l160 0c29 0 52 23 52 52l0 177c0 5-5 10-10 10l-56 0 0 11c0 37-29 67-66 67-36-1-66-30-66-67z m122-67c6 0 10 5 10 11l0 25 46 0 0-167c0-18-15-32-32-32l-160 0c-17 0-31 14-31 32l0 167 45 0 0-25c0-6 5-11 10-11 6 0 10 5 10 11l0 25 92 0 0-25c0-6 5-11 10-11z m-10 67l0-11-92 0 0 11c0 26 21 46 46 46 26 0 46-20 46-46z"
    />
  </svg>
);

export const GiGridIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M220 263l0 212c0 4-2 6-4 6l-182 0c-1 0-3-2-3-6l0-212c0-4 2-6 3-6l182 0c2 0 4 3 4 6z m20 0c0-14-10-26-24-26l-182 0c-13 0-24 12-24 26l0 212c0 15 11 27 24 27l182 0c14 0 24-12 24-27z m242 65l0 152c0 0-1 1-4 1l-181 0c-3 0-4-1-4-1l0-152c0 0 1-1 4-1l181 0c3 0 4 1 4 1z m21 0c0-12-12-21-25-21l-181 0c-13 0-25 9-25 21l0 152c0 12 12 22 25 22l181 0c13 0 25-10 25-22z m-283-297l0 152c0 0-1 1-4 1l-182 0c-2 0-3-1-3-1l0-152c0 0 1-1 3-1l182 0c3 0 4 1 4 1z m20 0c0-12-11-22-24-22l-182 0c-13 0-24 10-24 22l0 152c0 12 11 22 24 22l182 0c13 0 24-10 24-22z m242 5l0 212c0 4-2 6-4 6l-181 0c-2 0-4-2-4-6l0-212c0-4 2-6 4-6l181 0c2 0 4 2 4 6z m21 0c0-14-11-27-25-27l-181 0c-14 0-25 13-25 27l0 212c0 14 11 27 25 27l181 0c14 0 25-13 25-27z"
    />
  </svg>
);

export const GiDimondIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M94 445l322 0 57-106c4-6 11-8 17-5 4 2 7 7 7 11 0 2-1 5-2 6l-57 106c-2 11-11 14-24 14l-320 0c-13 0-22-3-24-14l-68-103c-1-2-2-5-2-7 0-5 2-9 5-11 2-1 5-2 7-2 5 0 9 2 11 6l69 105z m148-371c3-4 11-4 12-3l212 257-436 0z m-237 245c-7 9-7 21 2 28 6 5 14 7 23 7l436 0c10 0 18-2 23-7 9-7 10-19 2-28l-218-264c-12-15-38-12-50 2z m271-257l93 377c0 1 1 2 1 3 0 6-4 11-10 12-1 1-2 1-3 1-6 0-11-4-12-10l-93-376c-1-1-1-2-1-4 0-5 4-10 10-12 0 0 2 0 3 0 5 0 10 4 12 9z m-137 377l89-381c1-7 8-11 15-10 5 2 9 7 9 13 0 1 0 2 0 3l-89 381c-1 6-6 10-12 10-1 0-2 0-3-1-5-1-10-6-10-12 0-1 1-2 1-3z"
    />
  </svg>
);

export const GiFaqIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M193 35l1-1c4 5 7 9 11 13 9 11 19 22 29 33 8 9 15 17 23 26 11 12 22 25 33 37 2 2 3 2 5 3 10 0 19 0 28 0 25 0 49 5 72 18 13 9 25 18 36 30 7 10 15 20 20 31 9 18 15 37 16 58 0 16 1 33 0 50 0 37-12 70-33 97-10 11-21 21-33 29-23 15-48 21-74 21-48 0-96 1-143 0-29 0-57-7-81-25-12-9-22-19-31-31-12-16-21-35-26-55-8-31-6-61-4-92 2-33 17-62 39-87 12-13 27-23 42-31 18-9 38-13 59-13l11 0z m-30 80c-8 1-17 3-25 5-10 3-20 7-29 12-15 7-30 16-41 28-9 10-18 19-25 30-20 28-32 63-32 101 0 18 0 36 0 54 1 17 5 33 11 49 8 23 19 43 35 60 10 12 21 21 33 30 29 20 62 28 96 28 47 0 94 0 142 0 30 0 59-7 85-23 13-8 26-18 37-30 15-17 28-37 36-59 7-19 11-40 12-62 0-19 0-39-1-58-1-18-5-36-12-54-9-24-23-45-40-62-11-11-24-20-38-28-26-16-54-22-84-22-3 0-5 0-7 0-10 2-15-4-20-11-4-5-9-10-14-15l-36-41c-8-10-17-19-25-28-2-3-4-6-6-8-13-12-33-12-44 1-5 6-8 13-8 22 0 0 0 0 0 1 0 25 0 50 0 75z m15 280c13 14 28 24 45 31 22 9 44 8 66 3 11-3 21-7 30-15 13-11 18-27 19-44 0-1 0-2 0-4 0-10-2-20-6-28-5-10-13-18-23-23-6-4-12-8-19-11-11-7-20-16-20-31l-31 0c0 14 0 27 5 39 4 8 9 14 16 19 6 4 12 7 18 11 3 1 5 2 7 4 9 5 11 13 10 23-1 8-7 14-15 16-19 6-38 4-55-7-7-5-13-11-20-16z m99-178c0-13-10-23-23-23-12 0-23 10-23 23 0 14 10 24 23 24 13 0 23-10 23-24z"
    />
  </svg>
);

export const GiYoutubeBtnIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M255 88l46 0c44 0 88 2 132 6 12 1 25 4 34 14 9 8 12 20 15 31 6 29 7 59 8 88 1 40 1 79-3 119-1 17-3 35-9 52-6 18-19 28-37 31-33 4-67 6-100 6-87 0-174 3-261-5-28-2-42-13-49-40-8-30-8-60-9-90-1-42-1-83 2-124 2-17 4-34 9-50 7-18 19-28 38-31 21-3 43-4 65-5 40-2 80-2 119-2z m-8-21c-38-1-85 1-132 3-15 1-31 1-46 3-29 4-47 20-57 48-5 17-7 35-9 53-4 43-3 85-2 128 0 31 1 62 9 92 3 12 7 25 16 35 13 15 30 21 49 23 23 1 46 3 68 3 60 3 120 3 179 2 38-1 76-2 114-5 36-3 58-23 67-63 4-18 5-37 6-56 2-21 3-46 3-71 0-25-1-50-3-74-1-19-2-41-8-62-10-34-32-51-67-54-59-4-119-5-187-5z m-36 273l0-156c15 10 30 19 45 29 26 16 52 33 77 49-20 13-40 26-60 39l-25 15z m-21-168z m12-17c-2 0-4 1-6 2-4 2-7 6-6 15 0 52 0 105 0 157l0 30c0 0 0 0 0 1 0 4 2 7 5 9 2 1 4 1 5 1 3 0 4 0 6-1l78-50c23-15 46-30 70-44 2-2 8-6 8-13 0-7-6-11-8-13-29-18-58-36-86-54l-55-35-1-1c-4-3-7-4-10-4z"
    />
  </svg>
);

export const GiLetterIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M390 236c-7 0-12-6-12-12l0-179c0-1-1-2-3-2l-338 0c-1 0-2 1-2 2l0 340 73 0c14 0 26 11 26 25l0 72 241 0c2 0 3-1 3-2l0-37c0-7 5-12 12-12 6 0 12 5 12 12l0 37c0 14-12 25-27 25l-253 0c-3 0-6-1-9-3l-99-97c-2-2-3-5-3-9l0-351c0-14 11-26 26-26l338 0c15 0 27 12 27 26l0 179c0 6-6 12-12 12z m-280 174c0-1-1-2-2-2l-56 0 58 57z m372 0l-14 14c-8 7-18 12-29 12-11 0-21-5-29-12l-111-110-195 0c-6 0-11-5-12-11 0-7 6-12 12-12l171 0-73-71-98 0c-6 0-11-5-12-12 0-6 6-11 12-11l74 0 0-1c-1-1-2-3-3-5l-18-65-53 0c-6 0-11-5-12-12 0-6 6-12 12-12l62 0c0 0 2 1 3 1l75 20c3 1 4 2 6 3l232 228c16 15 16 41 0 56z m-241-259l-37 37 191 188 38-37z m-48 15l25-25-35-10z m272 205l-15-15-38 37 15 14c3 3 8 5 12 5 5 0 9-2 12-5l14-14c3-2 5-6 5-11 0-4-2-9-5-11z"
    />
  </svg>
);

export const GiCashIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M12 96l486 0 0 220-486 0z m-12-9l0 238c3 2 6 4 9 4 6 1 12 0 18 0l14 0 0 49c0 9 2 11 11 11l31 0 0 7c0 14-1 29 0 43 0 7 1 9 8 9 137 0 274 0 411 0 4 0 7-1 9-4l0-4c-3-3-6-4-10-4-133 0-267 0-401 0l-5 0 0-47 162 0c81 0 162 0 243 0 5 0 9-1 11-6l0-2c-2-4-6-5-11-5-147 0-293 0-440 0l-6 0 0-47c1 0 3 0 4 0l120 0c108 0 215 0 323 0 4 0 7 0 10-4l0-238c-3-2-6-3-9-3-165-1-329-1-493 0-3 0-6 1-9 3z m79 271c0-6 0-11 0-16 0-5-2-7-6-7-5 0-6 3-6 7 0 7 0 13 0 20 0 5 2 7 7 7 15 0 30 0 45 0 4 0 6-1 7-5 0-5-3-6-7-6-12-1-23 0-34 0z m40 59c0-5 0-10 0-15 0-5-3-8-7-8-4 1-5 4-5 8 0 6 0 13 0 20 0 5 2 7 7 7 15 0 30 0 44 0 4 0 7-2 7-6 1-3-2-6-7-6-11 0-22 0-34 0z m354-126l-8 0c-19 0-39 0-58 0-3 0-5 1-7 2-1 2-2 5-1 6 1 2 4 4 6 4 9 1 18 0 26 0 15 0 31 0 46 0 6 0 9-2 9-8 0-16 0-32-1-48 0-2 0-5-1-6-1-2-5-3-6-2-2 1-4 4-4 6-1 8-1 15-1 23z m0-170l0 41c0 2 0 5 1 7 1 2 4 5 6 5 2 0 4-3 5-5 1-4 1-8 1-12l0-39c0-7-2-9-9-9-23 0-46 0-69 0l-2 0c-5 0-8 3-7 6 0 4 3 6 7 6z m-436 170l0-30c0-5 1-10 0-15 0-5-2-8-6-8-4 1-6 4-6 8 0 16 0 33 0 50 0 5 3 7 8 7 24 0 48 0 72 0 5 0 8-2 7-6 0-4-3-6-7-6-21 0-41 0-62 0z m0-170l69 0c4 0 6-2 6-6 0-4-2-6-6-6l-25 0c-16 0-32 0-48 0-6 0-8 2-8 8l0 50c1 4 2 7 7 7 4 0 5-3 5-7z m182 146c-2 0-3 1-4 2-1 1-2 2-2 3 0 2 1 3 2 4 1 1 2 1 4 1l80 0c2 0 4 0 4-1 1-1 2-2 2-4 0-1-1-2-2-3 0-1-2-2-4-2l-20 0c-1 0-1 0-1 0-4 0-7 0-11 1-2 0-4 0-6 0l0-1c2 0 4-1 6-2 2-2 4-3 5-5 2-2 4-5 6-7 1-3 2-6 3-9l18 0c2 0 4 0 4-1 1-1 2-2 2-4 0-1-1-2-1-3-1-1-3-2-5-2l-18 0c0-7-2-14-5-19-3-4-8-9-12-12-5-3-10-5-16-6-5-2-10-2-16-3l57-57c2-1 2-3 2-5 0-1 0-3-1-4-1-1-3-2-4-2-3 0-5 1-6 3l-63 63c-2 1-3 3-3 6 0 1 1 3 2 4 1 1 2 1 4 1l2 0c6 0 11 1 16 2 5 1 10 3 15 5 4 2 7 6 10 10 3 3 5 8 5 14l-49 0c-2 0-3 1-4 2-1 1-2 2-2 3 0 2 1 3 2 4 1 1 2 1 4 1l49 0c-2 8-6 14-13 18-7 3-16 5-26 5z"
    />
  </svg>
);

export const GiBulbIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M329 229c-30-38-46-83-47-127l-62 0c-1 48-18 91-46 126-14 17-23 40-23 65 0 54 43 100 96 102 1 0 3 0 4 0 27 0 52-11 70-29 19-18 30-44 30-73 0 0 0 0 0-1 0-24-8-46-22-63z m6 153c-21 21-51 35-84 35-2 0-3 0-5-1-64-2-116-57-117-123 0-30 11-58 29-80 25-30 40-70 40-114 0-43-2-19 11-19l84 0c14 0 11 19 11 19 0 41 14 81 42 117 17 21 26 47 26 76 0 0 0 1 0 1 0 35-14 66-37 89z m56 71c-2 2-5 3-8 3-3 0-5-1-7-3l-26-26c-2-2-3-5-3-8 0-3 1-6 3-8 2-2 5-3 7-3 3 0 6 1 8 3l26 27c2 2 3 4 3 7 0 3-1 6-3 8z m-98-388l-84 0c-6 0-11-5-11-10 0-1 0-1 0-1 0-6 5-10 11-10l84 0c6 0 11 4 11 10 0 6-5 11-11 11z m-16-41l-52 0c-6 0-11-4-11-10 0-6 5-11 11-11l52 0c6 0 11 5 11 11 0 6-5 10-11 10z m-26 429c6 0 11 5 11 11l0 37c0 6-5 11-11 11-6 0-11-5-11-11l0-37c0-6 5-11 11-11z m-99-42c2 2 3 5 3 8 0 3-1 6-3 7l-26 27c-2 2-4 3-7 3-3 0-6-1-8-3-2-2-3-5-3-8 0-3 1-5 3-7l26-27c2-2 5-3 8-3 2 0 5 1 7 3z m286-90l-36 0c-6 0-11-5-11-11 0-6 5-10 11-10l36 0c6 0 11 4 11 10 0 6-5 11-11 11z m-338 0l-36 0c-6 0-11-5-11-10 0-1 0-1 0-1 0-6 5-10 11-10l36 0c6 0 11 4 11 10 0 0 0 0 0 1 0 5-5 10-11 10z"
    />
  </svg>
);

export const GiShareIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M418 337c-26 0-50 13-66 33l-181-108c1-2 1-4 1-7 0-2-1-5-1-7l180-109c15 21 39 34 66 34 45 0 82-37 82-82 0-45-37-81-82-81-45 0-81 36-81 81 0 1 0 1 0 1 0 3 0 6 1 9l-181 107c-15-21-39-34-66-34-45 0-82 36-82 82 0 45 37 81 82 81 26 0 50-12 65-32l182 107c-1 2-1 5-1 7 0 46 36 82 82 82 45 0 82-36 82-82 0-45-37-82-82-82z m0-286c22 0 41 18 41 41 0 22-19 41-41 41-23 0-41-19-41-41 0-23 18-41 41-41z m-328 246c-22 0-41-19-41-41 0-23 19-41 41-41 23 0 41 18 41 41 0 22-18 41-41 41z m328 163c-23 0-41-18-41-41 0-22 18-41 41-41 22 0 41 19 41 41 0 23-19 41-41 41z"
    />
  </svg>
);

export const GiAttachmentIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M102 104c34-34 90-34 124 0l80 80 39-38-80-80c-56-56-146-55-202 0-55 56-56 146 0 202l80 80 38-39-80-80c-34-34-34-90 1-125z m102 62l-40 41 160 160 40-40z m59 302c55 55 146 55 201-1 56-55 56-146 1-201l-80-80-38 38 80 80c34 35 34 91-1 125-34 35-90 35-124 1l-81-81-38 39z"
    />
  </svg>
);

export const GiWhatsappIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M435 438c-46 46-109 74-179 74 0 0-1 0-1 0-140 0-254-114-254-254 0-44 12-88 34-127l-36-131 135 35c35-19 77-31 121-31 140 0 254 114 254 254 0 0 0 1 0 1 0 70-29 133-75 179z m-180-391c-40 0-77 11-108 30l-7 4-80-21 21 78-4 8c-21 32-33 70-33 112 0 117 95 211 211 211 57 0 110-22 149-62 38-38 62-90 62-148 0 0 0-1 0-1 0-116-95-211-211-211z m116 158c6-3 10-5 12-7 1-3 1-16-4-31-5-14-30-28-43-30-11-1-24-2-40 3-9 3-21 7-36 13-63 28-105 92-108 96-3 4-26 34-26 66 0 31 17 46 22 52 6 7 13 8 17 8 4 0 9 0 12 0 4 0 10 2 15-11 5-12 18-44 19-47 2-3 3-7 1-11-2-4-3-7-7-11-3-3-6-8-9-11-3-3-7-6-3-13 4-6 16-27 35-43 25-22 45-29 51-32 7-3 10-3 14 2 4 4 16 18 20 25 4 6 9 5 14 3 6-2 37-18 44-21z"
    />
  </svg>
);

export const GiMoreIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M316 256c0-32-26-59-58-59-33 0-59 27-59 59 0 32 26 59 59 59 32 0 58-27 58-59z m-190 0c0-32-26-59-59-59-32 0-58 27-58 59 0 32 26 59 58 59 33 0 59-27 59-59z m380 0c0-32-26-59-58-59-33 0-59 27-59 59 0 32 26 59 59 59 32 0 58-27 58-59z"
    />
  </svg>
);

export const GiForwardIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg
    id="noRotate"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width={width}
    height={height}
    viewBox={viewBox}
    {...otherProps}
  >
    <title>share icon</title>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M309 469l197-196-197-196 0 115c-140 0-239-45-309-144 28 141 112 281 309 309z"
    />
  </svg>
);

export const GiCustomerIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M399 0l42 0c-14 116-68 213-188 213-120 0-174-97-188-213l42 0c11 93 50 171 146 171 96 0 135-78 146-171z m-146 256c-71 0-128 57-128 128 0 71 57 128 128 128 71 0 128-57 128-128 0-71-57-128-128-128z m0 213c-47 0-85-38-85-85 0-47 38-85 85-85 47 0 86 38 86 85 0 47-39 85-86 85z"
    />
  </svg>
);

export const GiEditIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M3 117l292 292 99-99-292-292-99 0z m467 270l-48-48-99 99 48 48c5 5 11 8 19 8 7 0 14-3 18-8l62-62c5-5 8-11 8-18 0-8-3-14-8-19z"
    />
  </svg>
);

export const GiSelectArrowIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path transform="scale(1,-1) translate(0, -650)" fill={fill} d="M22 361l491 0-235-194z" />
  </svg>
);

export const GiWatchIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M251 497c-133 0-240-108-240-241 0-133 107-241 240-241 133 0 241 108 241 241 0 133-108 241-241 241z m0-434c-106 0-192 87-192 193 0 106 86 193 192 193 107 0 193-87 193-193 0-106-86-193-193-193z m13 313l-37 0 0-144 127-76 18 30-108 64z"
    />
  </svg>
);

export const GiCard1Ico = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M32 352l455 0c0 2 0 3 0 5-3 32-30 56-63 56-110 0-219 0-329 0-4 0-8-1-12-1-29-4-52-32-51-60z m455-41l-455 0c0-1 0-1 0-2 0-46-1-92 0-138 0-36 27-62 62-62 110 0 220 0 331 0 11 0 21 2 31 8 21 12 31 32 31 56z m-476-151l0 201c0 1 1 2 1 3 6 40 41 69 82 69l332 0c45 0 82-37 82-81 0-61 0-122 0-183 0-44-37-80-82-80l-333 0c-37 0-69 24-79 59-1 4-2 8-3 12z m62 50l165 0 0-20-165 0z m0 40l82 0 0-19-82 0z"
    />
  </svg>
);

export const GiRightIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M191 208c-8 8-14 14-20 21-27 26-53 54-81 79-23 23-61 18-80-9-16-22-13-51 9-72 47-48 95-96 143-144 19-18 39-18 57 0 32 32 64 64 96 96 57 57 114 115 172 172 20 20 23 49 6 71-20 28-58 31-83 6-71-71-142-142-213-213-2-2-3-4-6-7z"
    />
  </svg>
);

export const GiMessageIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M464 78l-408 0c-23 0-41 18-41 41l0 285c0 23 18 41 41 41l408 0c23 0 41-18 41-41l0-285c0-23-18-41-41-41z m-339 326l135-134 135 134z m339 0l-12 0-176-175c0-1-1-2-1-2-4-4-9-6-15-6-6 0-11 2-14 6-1 0-2 1-2 2l-176 175-12 0 0-285 408 0z"
    />
  </svg>
);

export const GiMinusIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path transform="scale(1,-1) translate(0, -650)" fill={fill} d="M505 183l-439 0 0 146 439 0z" />
  </svg>
);

export const GiCalendarCheckOIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M478 428l-444 0 0-394 444 0z m29-396c0-15-12-27-27-27l-448 0c-15 0-27 12-27 27l0 398c0 15 12 27 27 27l448 0c15 0 27-12 27-27z m-475 288l448 0c8 0 15 7 15 15 0 8-7 15-15 15l-448 0c-8 0-15-7-15-15 0-8 7-15 15-15z m104 172l0-99c0-8 7-15 15-15 8 0 15 7 15 15l0 99c0 8-7 15-15 15-8 0-15-7-15-15z m240-99l0 99c0 8-7 15-15 15-8 0-15-7-15-15l0-99c0-8 7-15 15-15 8 0 15 7 15 15z m-205-200c-3 3-6 4-10 4-9 0-15-6-15-14 0-4 1-8 4-10l67-69c2-3 6-5 10-5 4 0 8 2 10 4l132 125c3 2 5 6 5 10 0 9-7 15-15 15-4 0-7-1-10-4l-121-114z"
    />
  </svg>
);

export const GiRightSlimIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path transform="scale(1,-1) translate(0, -650)" fill={fill} d="M169 146l-116 118-40-40 156-158 337 340-40 40z" />
  </svg>
);

export const GiAddSlimIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <title>Plus Icon</title>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M360 248l0 19-84 0 0 93-20 0 0-93-85 0 0-19 85 0 0-96 20 0 0 96z"
    />
  </svg>
);

export const GiCancelAppointmentIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M186 106l-27 27 61 62-61 62 27 27 61-62 62 62 27-27-62-62 62-62-27-27-62 62z m245 355l-25 0 0 51-51 0 0-51-203 0 0 51-50 0 0-51-26 0c-28 0-50-23-50-50l0-355c0-28 22-51 50-51l355 0c28 0 51 23 51 51l0 355c0 27-23 50-51 50z m0-405l-355 0 0 278 355 0z"
    />
  </svg>
);

export const GiMinusSlimIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path transform="scale(1,-1) translate(0, -650)" fill={fill} d="M316 247l0 18-132 0 0-18z" />
  </svg>
);

export const GiLocationIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M123 340c0-71 59-128 132-128 72 0 131 57 131 128 0 71-59 128-131 128-73 0-132-57-132-128z m132 172c97 0 177-77 177-172 0-52-24-98-61-130-81-77-116-210-116-210 0 0-36 133-117 210-37 32-60 78-60 130 0 95 79 172 177 172z m-4-134l-57-46c-1-1-2-2-4-3l0-66 45 0 0 35c0 5 4 9 8 9l17 0c4 0 7-4 7-9l0-35 45 0 0 66c-1 1-2 2-3 3z m76-18l-68 54c-2 2-5 3-8 3-3 0-5-1-7-3l-68-54c-3-2-4-5-4-9 0-3 1-5 3-7 4-5 11-5 16-1l60 48 61-48c2-2 4-3 7-3 4 0 7 2 9 4 2 2 3 4 3 7 0 4-2 7-4 8z"
    />
  </svg>
);

export const GiLockIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M256 122c-26 0-47 22-47 49 0 26 21 48 47 48 26 0 47-22 47-48 0-27-21-49-47-49z m141 219l-23 0 0 49c0 67-53 122-118 122-65 0-118-55-118-122l0-49-24 0c-26 0-47-22-47-48l0-244c0-27 21-49 47-49l283 0c26 0 48 22 48 49l0 244c0 26-22 48-48 48z m-214 49c0 42 33 76 73 76 40 0 73-34 73-76l0-49-146 0z m214-341l-283 0 0 244 283 0z"
    />
  </svg>
);

export const Gi49Ico = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M288 480c0-18-14-32-32-32-18 0-32 14-32 32 0 18 14 32 32 32 18 0 32-14 32-32z m0-112c0-18-14-32-32-32-18 0-32 14-32 32 0 18 14 32 32 32 18 0 32-14 32-32z m0-112c0-18-14-32-32-32-18 0-32 14-32 32 0 18 14 32 32 32 18 0 32-14 32-32z m0-112c0-18-14-32-32-32-18 0-32 14-32 32 0 18 14 32 32 32 18 0 32-14 32-32z m0-112c0-18-14-32-32-32-18 0-32 14-32 32 0 18 14 32 32 32 18 0 32-14 32-32z"
    />
  </svg>
);

export const GiEnvelopeIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M20 420l-1 0c1 0 1-1 1-1 0 0 0 0 0 1z m20-5c-1-1-2-2-3-2-2-1-3 0-3 0 0-1 1-1 1-1 2 1 3 2 5 3z m3-326c0-2 0-3 0-5l439 0c0 2 0 3 0 5l0 323-439 0z m0 341c0 0 0 1 0 1z m-14 8c4 1 6 1 10 0l447 0c14 0 22-5 22-20l0-329c0-16-6-30-22-30l-447 0c-16 0-22 14-22 30l0 329c0 7 0 10 4 15 2 3 2 4 7 4 0 0 1 0 1 1z m11-4l-1 1z m-11 3c1 0 2 0 3 0 0 0-1 0-2 0 0 0-1 0-1 0z m-9-21l183-176c34-32 88-32 121 0l181 175-17 18-181-175c-24-22-62-22-86 0l-183 176z m487-326l-149 198-21-15 149-198z m-469-15l152 197-20 16-152-198z"
    />
  </svg>
);

export const GiCustomersIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M392 221c-48 0-86 40-86 89 0 49 38 89 86 89 47 0 86-40 86-89 0-49-39-89-86-89z m0 143c-29 0-52-24-52-54 0-30 23-54 52-54 28 0 51 24 51 54 0 30-23 54-51 54z m-146-238c6 11 13 21 21 30-24 41-69 66-116 65-96 0-140-82-151-179l34 0c9 78 40 143 117 143 40 2 77-22 94-59z m-95 130c-57 0-103 48-103 108 0 59 46 107 103 107 57 0 103-48 103-107 0-60-46-108-103-108z m0 179c-38 0-69-32-69-71 0-40 31-72 69-72 38 0 69 32 69 72 0 39-31 71-69 71z m241-250c-76 0-110-65-118-143l34 0c6 58 28 107 84 107 55 0 78-49 84-107l34 0c-9 78-43 143-118 143z"
    />
  </svg>
);

export const GiCard2Ico = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M474 341c0 8 0 15 0 22 0 18-11 29-30 29l-303 0c-27 0-53 0-79 0-14 0-25-7-27-19-2-10-2-21-2-32z m-441-47l0-25c0-40 0-79 0-118 0-15 8-26 20-29 5-1 9-1 14-1 125 0 251 0 377 0 19 0 30 11 30 30 0 45 0 90 0 135 0 3 0 5 0 8z m221 132c64 0 127 0 191 0 36-1 62-27 62-63 0-71 0-142 0-213 0-36-26-62-62-62-127 0-254 0-381 0-38 0-64 26-64 64 0 70 0 141 0 211 0 31 19 55 48 61 5 1 10 1 16 1 0 0 1 0 1 0 63 1 126 1 189 1z m133-190c-4 0-9 0-13 0-17 0-29-12-29-27 0-5-1-10-1-15 0-5 1-10 1-14 0-16 12-28 29-28 9 0 17 0 26 0 15 0 27 10 28 24 1 6 1 12 1 18 0 6 0 12-1 17-1 15-13 25-28 25-4 0-9 0-13 0z m-266-84c15 0 30 0 44 0 5 0 8 2 8 7 0 6 0 11 0 16 0 5-2 7-7 7l-90 0c-5 0-7-3-7-7 0-5 0-10 0-15 0-6 2-8 9-8 14 0 29 0 43 0z"
    />
  </svg>
);

export const GiBackIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M116 290l121 117c12 12 13 32 2 43-12 11-32 11-45-2l-184-178c-13-13-13-32-2-43l170-165c12-11 32-11 45 2 12 12 13 31 1 43l-124 120 380 0c18 0 32 14 32 31 0 18-15 32-33 32z m-63-61z"
    />
  </svg>
);

export const GiDashboard2Ico = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M263 9c-137 0-248 111-248 247 0 136 111 247 248 247 136 0 247-111 247-247 0-136-111-247-247-247z m0 71c97 0 176 79 176 176 0 97-79 176-176 176-98 0-177-79-177-176 0-97 79-176 177-176z m-7 159l9 25c8 20 16 41 25 61 8 17 18 34 30 48 7 9 18 8 25-2 3-5 3-10 3-16-1-10-4-18-6-27-10-37-19-73-28-109-3-11-6-23-7-34-1-8-2-17-2-25 0-2 0-5 0-7-1-5-5-7-10-6-5 1-9 4-12 8-5 8-6 17-7 26 0 13 3 25 6 37 7 24 14 47 21 71 3 9 6 17 8 27 0 0 0 0 0 1 0 1 0 2-1 3-1 0-2-1-3-2 0-1-1-2-2-3-10-19-18-38-27-58-10-25-20-51-32-77-1-2-2-4-3-6-5-8-14-9-20-2-3 4-4 8-5 12-1 6 0 12 1 17 3 22 8 44 13 65 3 13 6 26 9 39 0 2 0 3 0 5 0 1 0 2-1 3-1 0-2-1-3-1-2-2-3-4-4-5-5-9-11-19-17-29-9-17-16-33-24-49-4-8-8-16-13-23-2-4-5-7-8-9-7-4-13-1-14 6-1 6 0 12 2 17 7 33 15 66 23 99 3 11 6 21 7 32 1 4 1 9 0 13 0 1 0 1 0 2 0 2 1 3 1 5 1 3 3 4 6 4 1 0 2 0 2 0 5-1 9-5 11-9 5-7 7-14 7-22 0-11-2-21-5-31 0-1-1-2-1-3 0-1 0-1 0-1 1 0 1 1 2 1 9 13 19 27 29 39 3 5 7 9 13 10 7 1 12-2 16-7 6-7 7-15 6-23-2-11-5-20-8-30-5-19-9-39-13-58l0-2z"
    />
  </svg>
);

export const GiDashboard3Ico = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M256 0c-141 0-256 115-256 256 0 141 115 256 256 256 141 0 256-115 256-256 0-141-115-256-256-256z m0 120c75 0 136 61 136 136 0 75-61 136-136 136-75 0-136-61-136-136 0-75 61-136 136-136z"
    />
  </svg>
);

export const GiCash2Ico = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M25 115c-6 0-11 5-11 11l0 251c0 6 5 11 11 11l471 0c6 0 11-5 11-11l0-251c0-6-5-11-11-11z m461 21l0 231-451 0 0-231z m-225 23c-40 0-71 42-71 93 0 50 31 92 71 92 39 0 70-42 70-92 0-51-31-93-70-93z m0 21c26 0 49 32 49 72 0 39-23 71-49 71-27 0-50-32-50-71 0-40 23-72 50-72z m-140-43c0 47-38 86-84 86-6 0-11-5-11-10 0-6 5-11 11-11 35 0 63-29 63-65 0-6 5-11 11-11 5 0 10 5 10 11z m300 0c0 36 28 65 63 65 6 0 11 5 11 11 0 5-5 10-11 10-46 0-84-39-84-86 0-6 5-11 10-11 6 0 11 5 11 11z m-321 229c0-36-28-65-63-65-6 0-11-5-11-11 0-5 5-10 11-10 46 0 84 39 84 86 0 6-5 11-10 11-6 0-11-5-11-11z m300 0c0-47 38-86 84-86 6 0 11 5 11 10 0 6-5 11-11 11-35 0-63 29-63 65 0 6-5 11-11 11-5 0-10-5-10-11z m-260-141c-14 0-26 12-26 27 0 14 12 26 26 26 15 0 26-12 26-26 0-15-11-27-26-27z m0 21c3 0 5 3 5 6 0 3-2 5-5 5-2 0-5-2-5-5 0-3 3-6 5-6z m241-21c-15 0-27 12-27 27 0 14 12 26 27 26 14 0 26-12 26-26 0-15-12-27-26-27z m0 21c2 0 4 3 4 6 0 3-2 5-4 5-3 0-5-2-5-5 0-3 2-6 5-6z"
    />
  </svg>
);

export const GiTagIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M238 63l200 201-189 188-183-17-17-183z m-230 183l19 210c1 10 9 17 18 18l210 19c1 0 1 0 2 0 6 0 11-2 14-6l210-209c4-4 6-9 6-14 0-6-2-11-6-15l-229-228c-3-4-8-6-14-6-6 0-11 2-14 6l-210 209c-4 4-6 9-6 14 0 1 0 2 0 2z m192 45c-10-10-24-17-39-17-30 0-54 25-54 54 0 15 6 29 17 39 9 10 23 16 38 16 29 0 54-24 54-54 0-15-6-28-16-38z"
    />
  </svg>
);

export const GiCloseCircleIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M335 358l-79-79-79 79-23-23 79-79-79-79 23-23 79 79 79-79 23 23-79 79 79 79z m-79 154c-141 0-256-115-256-256 0-141 115-256 256-256 141 0 256 115 256 256 0 141-115 256-256 256z m0-472c-119 0-216 97-216 216 0 119 97 216 216 216 119 0 216-97 216-216 0-119-97-216-216-216z"
    />
  </svg>
);

export const GiMinusCircleIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M256 464c115 0 208-93 208-208 0-115-93-208-208-208-115 0-208 93-208 208 0 115 93 208 208 208z m0-399c105 0 191 86 191 191 0 105-86 191-191 191-105 0-191-86-191-191 0-105 86-191 191-191z m-128 182l0 17 256 0 0-17z"
    />
  </svg>
);

export const GiAddCircleIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M256 464c115 0 208-93 208-208 0-115-93-208-208-208-115 0-208 93-208 208 0 115 93 208 208 208z m0-399c105 0 191 86 191 191 0 105-86 191-191 191-105 0-191-86-191-191 0-105 86-191 191-191z m8 319l0-120 120 0 0-17-120 0 0-119-17 0 0 119-119 0 0 17 119 0 0 120z"
    />
  </svg>
);

export const GiRightCircleIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M211 205l-51 51-32-32 83-80 173 192-32 32z m45 307c-141 0-256-115-256-256 0-141 115-256 256-256 141 0 256 115 256 256 0 141-115 256-256 256z m0-472c-119 0-216 97-216 216 0 119 97 216 216 216 119 0 216-97 216-216 0-119-97-216-216-216z"
    />
  </svg>
);

export const GiCupIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M280 204c0-1 1-1 1-2l0-145 62 0c12 0 21-9 21-20 0-12-9-21-21-21l-166 0c-1 0-1 0-1 0-11 0-20 9-20 21 0 11 9 20 21 20l62 0 0 145c0 1 0 1 0 2-91 15-146 130-146 225l0 83 333 0 0-83c0-95-54-210-146-225z m-145 267l0-42c0-80 44-186 125-186 80 0 125 106 125 186l0 42z"
    />
  </svg>
);

export const GiWorldOutlineIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M394 136l-38-78c35 18 64 43 86 78z m-325 240c16 0 29 0 43 0 7-1 9 2 12 8 7 18 15 36 24 54 2 5 6 10 10 15-37-17-66-42-89-77z m287 78l38-77 48 0c-22 34-51 60-86 77z m-287-318c23-35 52-60 87-78l-38 78z m-20 205l-16-67 69 0 8 67z m353 1l8-68 69 0c-5 21-10 41-16 61 0 3-4 6-7 6-18 1-36 1-54 1z m-353-170l61 0-8 66-69 0z m414-1l16 67-69 0-8-67z m-306-35c7-34 44-94 81-98l0 98z m200 0l-83 0 0-100c46 18 66 57 83 100z m-83 240l81 0c-7 34-44 95-81 98z m-36 99c-37-6-75-66-81-98l82 0 0 92c0 2 0 4-1 6z m36-201l102 0-9 68-93 0z m102-36l-102 0 0-67 93 0z m-240 1l9-67 93 0 0 67z m0 35l102 0 0 67-93 0z m376 2l0-39c-1-3-2-5-2-8-10-105-88-195-190-220-15-4-30-6-45-9l-38 0c-2 1-5 2-7 2-102 10-189 81-218 179-6 18-8 37-12 56l0 39c2 10 3 21 5 32 27 128 147 216 276 203 107-11 197-88 223-192 3-14 5-29 8-43z"
    />
  </svg>
);

export const GiDownloadIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M61 50l0 96c0 10-8 19-18 19-10 0-18-9-18-19l0-114c0-10 8-18 18-18l414 0c10 0 19 8 19 18l0 114c0 10-9 19-19 19-10 0-18-9-18-19l0-96z m281 192l65 61c4 4 6 9 6 14 0 10-8 18-18 18-5 0-10-2-13-5l-126-119 1 277c0 10-8 18-18 18-10 0-18-8-18-18l-1-269-116 111c-3 3-8 5-12 5-11 0-19-8-19-18 0-5 2-10 6-13 3-4 98-104 143-148 2-2 3-3 5-3 2-2 6-3 9-3 6-2 18 1 23 6 4 4 63 62 83 86z"
    />
  </svg>
);

export const GiPhoneIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M364 179c-8 3-18 0-26-5l-59-59c-74 37-135 101-175 175l59 59c7 8 10 18 5 26-8 28-13 60-13 93 0 16-11 27-27 27l-93 0c-16 0-26-11-26-27 0-249 201-451 451-451 16 0 26 11 26 27l0 93c0 15-10 26-26 26-34 0-67 6-98 17z"
    />
  </svg>
);

export const GiTargetIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M256 345c49 0 89-40 89-89 0-49-40-89-89-89-49 0-89 40-89 89 0 49 40 89 89 89z m199-67c-11 93-84 166-176 177l-1 46-44 0 0-46c-93-11-166-84-177-176l-46-1 0-44 46 0c11-93 84-166 176-177l1-46 44 0 0 46c93 11 166 84 177 176l46 1 0 44z m-199-178c-86 0-156 70-156 156 0 86 70 156 156 156 86 0 156-70 156-156 0-86-70-156-156-156z"
    />
  </svg>
);

export const GiAddBagIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M68 58c0-17 16-30 37-30l180 0c22 0 37 13 37 31l24 249-301 0z m217-54l-180 0c-33 0-61 23-60 53l-25 258c0 12 9 17 20 17l310 0c11 0 20-7 20-20l-24-254c0-31-27-54-61-54z m-145 316l0 29c0 40 28 71 65 71 36 0 65-31 65-71l0-29c0-6 5-12 12-12 6 0 12 6 12 12l0 29c0 53-39 95-89 95-50 0-89-42-89-95l0-29c0-6 5-12 12-12 7 0 12 6 12 12z m268 21c5 0 8 1 11 4 2 4 4 7 4 12l0 55 57 0c5 0 9 1 12 4 3 2 5 6 5 10 0 5-2 8-5 10-3 3-7 4-11 4 0 0-1 0-1 0l-57 0 0 56c0 4-2 8-4 11-3 3-6 5-10 5 0 0-1 0-1 0-4 0-8-2-10-5-3-3-4-7-4-11l0-56-58 0c-4 0-8-1-11-4-3-2-5-6-5-9 0-1 0-1 0-1 0-4 2-8 5-10 3-3 7-4 11-4l58 0 0-55c0-5 1-9 4-12 2-3 6-4 10-4z"
    />
  </svg>
);

export const GiPaytmIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M376 180l5 0c0 0 1 0 1 0 15 2 19 7 19 22 0 23 0 47 0 71 0 3 0 6 2 9 2 4 6 4 10 4 4-1 5-3 6-6 1-3 1-6 1-8 0-1 0-1 0-1 0-28 0-56 0-84 0-3 0-5 0-7l19 0c14 3 18 7 18 22l0 70c0 2 0 4 0 6 1 6 4 9 11 8 5 0 8-3 8-10 0-29 0-58 0-88 0-8 0-8 8-8 3 0 6 0 9 0 9 0 15 4 19 12l0 102c-6 18-18 27-35 26-9 0-16-4-21-10-2-2-3-3-5-1-13 14-32 15-47 3-1-1-1-2-3-2-1 8-1 8-9 8l-20 0c-8 0-8 0-8-7l0-122c0-10 0-9 9-9 1 0 2 0 3 0z m-343 85l0-13c0-7 0-7 8-7 1 0 3 0 4 0 4 1 6 3 6 7 0 8 0 17 0 25 0 4-2 7-7 7-2 0-4 1-6 1-3 0-5-1-5-5 0-5 0-10 0-15z m-33 32c5 16 13 21 29 21 8 0 15 0 22 0 21 0 32-9 33-29 2-17 2-34 0-51-2-16-13-26-29-26-5 0-10 0-15 0-7 0-7 0-7-8 0-4 0-7-1-11-1-7-7-12-14-13-6 0-12 0-18 1z m327-117l9 0c1 2 1 5 1 8 0 28 0 57 0 85 0 14-2 12 12 12 0 0 1 0 2 0 3 0 5 1 5 4 0 8 0 16 0 25 0 3-2 4-5 4-4 0-7 0-11 0-3 0-4 1-4 4 0 4 0 9 0 13 0 8-2 9-10 7-5-2-9-7-12-11-8-8-17-13-28-13-4 0-5-2-5-6 0-7 0-14 0-22 0-4 1-5 5-5 13 0 13-1 13-14 0-23 0-46 1-69 0-14 5-20 20-22 2 0 4 1 7 0z m-185 48l0 6c0 9 0 9-9 8-6 0-8-2-8-8 0-4 0-9 0-14 0-5 4-7 13-7 5 0 4 4 4 7 0 3 0 5 0 8z m34 24c0-15 1-29 0-44 0-8-1-15-7-21-4-4-9-6-14-6-13-1-25-2-38 0-15 1-23 11-25 28-1 12-2 25 0 38 3 16 14 26 30 26 5 0 10 0 14 0 4 0 6 2 7 6 0 4-3 6-7 6-1 0-3 0-5 0-3 0-5 0-8 0-12 0-19 6-19 18 0 18-2 15 14 15 12 0 24 0 37 0 13 0 21-8 21-22 0-14 0-29 0-44z m94 8c0 17 0 35 0 52 0 4-1 6-5 6-7 0-14 0-21 0-7 0-7-1-7-7 0-15 0-30 0-44 0-7-3-9-9-9-6 0-8 2-9 9 0 2 0 5 0 8 0 12 0 24 0 37 0 4-2 6-7 6-6 0-12 0-18 0-8 0-8 0-9-8 0-5 0-9 0-14 0-15 1-29 1-41 1-17 13-30 31-30 5 0 10-1 15-1 4 0 5-3 5-6-1-4-4-5-7-5-5-1-11 0-16-1-8 0-13-4-15-12-1-4 0-9-1-14 0-4 2-6 6-6 11 0 22 0 33 0 21 0 33 12 33 33 0 15 0 31 0 47z"
    />
  </svg>
);

export const GiCirclePlayIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M256 512c-141 0-256-115-256-256 0-141 115-256 256-256 141 0 256 115 256 256 0 141-115 256-256 256z m0-495c-132 0-239 107-239 239 0 132 107 239 239 239 132 0 239-107 239-239 0-132-107-239-239-239z m85 239c0-3-1-6-4-7l0 0-85-55c-1-1-3-1-4-1-5 0-9 4-9 8 0 3 2 6 4 7l0 0 74 48-95 61 0-138c0-5-4-8-9-8-4 0-8 3-8 8l0 154c0 5 4 8 8 8 2 0 4 0 5-1l0 0 119-77c3-1 4-4 4-7z"
    />
  </svg>
);

export const GiSliderArrowLeftIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path transform="scale(1,-1) translate(0, -650)" fill={fill} d="M349 12l58 57-187 187 187 187-58 57-244-244z" />
  </svg>
);

export const GiSliderArrowRightIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path transform="scale(1,-1) translate(0, -650)" fill={fill} d="M163 500l-58-57 187-187-187-187 58-57 244 244z" />
  </svg>
);

export const GiNextIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <title>Join us icon</title>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M396 219l-121-125c-12-13-13-34-1-46 11-12 31-11 44 2l184 191c13 14 14 34 2 46l-170 177c-12 12-32 11-45-2-12-13-13-34-1-46l124-129-379 0c-19 0-33-15-33-34 0-18 15-34 33-34l363 0z m76 57l1 1 0-1c0 0-1 0-1 0l0 0z"
    />
  </svg>
);

export const GiDownArrowIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path transform="scale(1,-1) translate(0, -650)" fill={fill} d="M500 346l-55 56-181-180-181 180-55-56 236-236z" />
  </svg>
);

export const DownArrowIcon = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg width={width} height={height} {...otherProps} viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.35313 0.146043C5.27028 0.0633787 5.16106 0.0123985 5.04449 0.0019841C4.92792 -0.00843033 4.8114 0.0223814 4.71521 0.0890509L4.64522 0.146043L0.145803 4.64546C0.0631385 4.7283 0.0121593 4.83752 0.00174475 4.95409C-0.00866985 5.07066 0.0221405 5.18719 0.08881 5.28338L0.145803 5.35337L4.64522 9.85278C4.7334 9.94135 4.85155 9.99369 4.9764 9.99946C5.10125 10.0052 5.22373 9.96405 5.31971 9.884C5.4157 9.80395 5.47821 9.69086 5.49495 9.567C5.51168 9.44314 5.48142 9.31751 5.41012 9.21486L5.35313 9.14487L1.20667 4.99941L5.35313 0.853951C5.39968 0.807512 5.43662 0.752343 5.46182 0.691606C5.48703 0.630869 5.5 0.565756 5.5 0.499997C5.5 0.434238 5.48703 0.369126 5.46182 0.308388C5.43662 0.247651 5.39968 0.192483 5.35313 0.146043Z"
      fill={fill}
    />
  </svg>
);

export const GiDeleteIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M209 453l90 0c-4 21-25 35-47 34-21-1-41-17-43-34z m46-72c54 0 108 0 162 0 17 0 30 11 31 26 0 13-13 24-31 24-32 0-64 0-97 0-75 0-151 0-226 0-10 0-19-2-25-9-7-8-8-17-4-26 5-10 14-15 26-15z m10 129c20-5 38-13 49-30 3-5 7-11 8-16 2-10 7-12 17-12 27 1 54 0 81 0 30 0 53-21 52-47-1-26-23-46-53-46l-329 0c-31 0-52 19-51 47 0 27 21 46 51 46 27 0 54 1 81 0 8 0 12 1 14 9 9 26 27 42 55 47 1 1 2 1 3 2l22 0z m182-307c0-40 2-79-1-119-2-37-35-66-72-66-70-1-140-1-210 0-40 0-73 33-73 73l0 0c-1 75 0 150 0 225 0 9 2 16 13 16 7-1 11-4 11-11 1-8 0-16 0-24l1-198c0-37 20-57 57-57l193 0c36 0 57 21 57 57 0 72 0 143 0 215 0 4 0 10 3 13 3 3 9 5 13 3 4-1 8-6 8-10 1-9 1-18 1-28l0-89-1 0z m-280-12c0 34 0 67 0 100-1 9 2 16 12 16 10 0 13-7 13-16 0-66 0-132 0-198 0-9-2-16-13-16-11-1-12 7-12 15 0 33 0 66 0 99z m179 2c0 32 0 65 0 98 0 9 2 16 12 16 11 0 13-7 13-16 0-66 0-132 0-198 0-9-3-16-13-16-11-1-12 7-12 16 0 33 0 66 0 100z m-65-1l0-96c0-3 1-7 0-9-3-4-8-10-12-10-4-1-9 5-12 9-2 3-1 7-1 11l0 189c0 3 0 6 1 9 0 8 5 13 13 12 7 0 11-5 11-12 0-3 0-6 0-9l0-94z"
    />
  </svg>
);

export const GiTruckIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <title>free shipping</title>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M204 183c0 16 13 29 30 29 0 0 0 0 0 0l0 0c16 0 30-15 30-30 0-17-14-31-31-30-17 0-29 13-29 31z m5 0c0-15 10-26 24-26 14 0 25 11 26 25 0 13-12 25-25 25 0 0 0 0 0 0-14 0-25-11-25-24z m44 177l100 0c10 0 11-1 11-10l0-141c0-11-1-13-12-13l-40 1c-14 0-27 0-39 0-5 0-9 1-12 5-15 19-40 19-56 0-2-3-6-5-9-5-10 0-20 0-34 0l-11 0c-9 0-10 1-10 10 0 16 0 33 0 51 0 16 0 33 0 49l0-3 0 30c0 2 0 3 0 5l0 1c0 5 0 8 0 11-1 6 3 10 9 9 22 0 39 0 77 0l26 0z m0-5l-26 0c-38 0-55 0-77 0-4 0-4 0-4-4 0-3 0-6 0-12l0 0c0-2 0-3 0-5 0-25 0-47 0-69l0 6c0-25 0-44 0-64 0-6-1-5 5-5l12 0c13 0 23 0 33 0 2 0 4 2 5 3 17 22 48 22 64 0 2-2 4-3 8-3 12 0 25 0 39 0l40 0c8 0 7-1 7 7l0 141c0 6 1 5-6 5z m-1 10l-103 0c-9 0-13-4-13-13 0-48 0-98 0-148 0-8 4-12 12-12 8 0 14 0 27 0 6 0 8 0 12 0 11 0 12-1 13-12l0 0c0-17 15-32 32-33 20-1 37 16 36 36 0 7 3 10 9 9 5 0 10 0 19 0l1 0c4 0 6 0 8 0 2 0 3 0 4 0 8 0 16 0 23 0l-1 0c10 0 18 0 26 0 9 0 11 3 11 12 0 2 0 3 0 6 0 2 0 4 0 6l0 0 0 68c0 34 0 49 0 68 0 10-2 13-13 13z m0 5l103 0c13 0 19-5 19-18 0-19 0-34-1-68l0-68c0-2 0-3 0-6 1-3 1-4 1-6-1-12-6-17-17-17-8 0-16 0-26 0 0 0-1 0-1 0-9 0-17 0-26 0l1 0c-2 0-4 0-8 0l-1 0c-2 0-4 0-6 0-5 0-9 0-14 0l1 0c-4 0-4 0-4-3 1-24-19-43-42-42-19 1-36 18-37 38l0 0c0 8 1 7-7 7-4 0-6 0-12 0-13 0-19 0-27 0-11 0-17 6-17 17 0 50 0 100 0 148 0 12 6 18 18 18 15 0 33 0 51 0 17 0 35 0 53 0l-3 0 3 0z m195-185c0 13-11 24-25 24-13 0-24-11-24-25 0-13 11-24 24-24 14 0 25 11 25 25z m5 0c0-17-13-30-30-30-16 0-29 13-29 29 0 16 13 30 29 30 17 0 30-13 30-29z m3 22c1-1 3-2 5-2 5-1 8-1 17-1l2 0c5 0 8 0 12 0 3 0 3 1 3 4 0 6 0 11 0 22 0 11 0 15 0 21 0 4-1 7-2 10-16 27-27 44-38 62l5-9c-1 2-4 3-5 3-13 0-24 0-43 0l-15 0c-5 0-5 1-5-5 0-29 0-55 0-80 0-4 0-9 0-14 0-4 0-7 0-11l0 0c15 23 49 22 64 0z m-67-3l-2 0 0 8c0 10 0 14 0 20 0 25 0 51 0 80 0 9 2 11 10 11l15 0c19 0 31 0 43-1 3 0 8-2 9-5 7-9 18-27 28-44l5-10c2-3 3-7 3-12 0-6 1-10 0-21 0-2 0-4 0-7 0-5 1-10 1-16l0 1c0-6-3-9-10-9-2 0-5 0-8 0-1 0-2 0-3 0l0 0-2 0c-9 0-13 0-17 0-4 0-7 2-9 5-14 19-42 20-56 0-1-1-1-1-3-2 0 0 0 0-1-1l-1 0-3 0z m3 0l0 3c0 0-1 0-2-1 0 0 0 0-1 0l1 0c-1 0-1 0-1-1l0 0 2-2 1 3c9-3 8-2 8-2l-10 2-1-2z m36 125l0 3 6 0 3 0c2 0 4 0 7 0 6 0 11 0 17 0l-1 0c4 0 7-2 9-4 3-5 16-25 29-46l9-17c2-3 3-7 3-10 0-12 0-22 0-44l0-5c0-10-6-16-16-16-4 0-9 0-14 0-5 0-10 0-14 0l0 0c-3 0-4 0-3-4 1-17-11-33-28-39-23-8-50 10-51 34 0 1 0 2 0 3 0 7 0 10-4 13-2 1-2 5-2 9-1 34-1 69 0 109 0 11 6 17 17 17 4 0 10 0 16 0l17 0 0-3z m0 0l0-2c-1 0-1 0-1 0-6 0-11 0-17 0l1 0c-6 0-11 0-16 0-8 0-12-4-12-12 0-40 0-75 0-109 0-3 0-5 1-6 5-4 6-7 6-16 0-1 0-2 0-3 0-20 24-36 44-29 14 5 25 19 23 34 0 6 3 9 9 9 9 0 18 0 28 0 7 0 11 4 11 11l0 5c0 22 0 32 0 44 0 3-1 5-2 7-22 38-35 59-48 79l10-16c-1 1-3 2-5 2-5 0-11 0-16 0-3 0-5 0-8 0l1 0-9 0z m-360-11c11 0 21 0 31 0l-2 0 1 0c6 0 10-1 9-6 0-6-3-7-10-7-24 0-50 0-81 0-7 0-10 2-10 7 0 5 3 6 10 6 7 0 15 0 24 0 5 0 11 0 17 0l-1 0z m-12 0l0-5-10 0c-15 0-22 0-30 0-4 0-5-1-5-1 0-1 1-1 5-1 31 0 57 0 81 0 4 0 5 0 5 1 0 0 0 1-4 1l-1 0c-6 0-12 0-20 0l-21 0 0 5z m21 10c-12 0-17 0-24 0l-1 0c-6 0-9 1-9 6 0 5 3 6 8 6l2 0c10 0 22 0 34 0 9 0 19 0 29 0l-2 0 7 0c6 0 9-1 9-6 0-5-4-6-10-6-6 0-13 0-19 0-5 0-10 0-15 0l1 0-10 0z m10 5l33 0c4 0 5 0 5 1 0 1-1 1-4 1l-7 0c-3 0-8 0-13 0-17 0-34 0-51 0l2 0-1 0c-2 0-3 0-3-1 0-1 1-1 4-1l1 0c6 0 13 0 19 0 5 0 11 0 16 0z m0-5z m0-45l9 0c12 0 18 0 24 0 3 0 5 0 5-1 0-1-2-1-5-1-19 0-38 0-68 0-3 0-4 0-4 1 0 1 1 1 4 1l35 0 0 5-35 0c-6 0-9-1-9-6 0-5 3-6 9-6 30 0 49 0 68 0 6 0 10 1 10 6 0 5-4 6-10 6-6 0-12 0-24 0l-9 0 0-5z"
    />
  </svg>
);

export const GiGiftBoxIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <title>gift with purchase</title>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M266 285l154 0c9 0 13 4 13 13 0 7 0 15 0 22 0 11-4 15-15 15l-152 0z m0-261c1 0 2 0 2 0 42 0 83 0 125 0 9 0 13 5 13 14l0 229 0 5-140 0z m152 248l0-235c0-12-6-21-17-24-2-1-5-1-7-1-44 0-88 0-132 0-7 0-8 2-8 8l0 318c0 7 1 9 9 9l157 0c16 0 25-10 25-26 0-7 0-15 0-23 0-16-9-25-25-25 0 0-1-1-2-1z m-187-248l0 248-141 0c0-1 0-3 0-4 0-76 0-153 0-229 0-11 4-15 15-15z m-153 248c-2 0-4 0-6 1-12 2-21 11-21 23l0 0c0 4 0 9 0 14 0 4 0 9 0 14l0-1c1 14 11 24 24 24 5 0 10 0 15 0 3 0 5-2 6-6 0-4-3-6-6-6-5 0-9 0-14 0-8 0-13-5-13-13 0-8 0-17 0-25 0-8 5-12 12-12 51 0 102 0 153 0 1 0 2 0 3 0l0 50c-2 0-3 0-4 0l-95 0c-2 0-3 0-4 0-4 0-6 2-6 6 0 4 2 6 6 6l108 0c5 0 7-2 7-7 0-25 0-51 0-77 0-10 0-19 0-29l0-212c0-9-1-10-9-10l-130 0c-16 0-26 10-26 26l0 234z m132 86c-13 11-26 22-38 35-15 15-26 34-30 56l0 1c-3 15-2 30 7 43 14 22 43 25 65 9 15-13 24-29 30-48 5-13 7-26 11-40l2 4c7 15 16 29 29 39 12 9 25 14 40 10 23-6 35-28 27-52-6-17-17-30-31-41-6-4-13-8-19-12-2-1-4-2-7-4 3 0 4 0 5 0 29 0 58 0 87 0 4 0 8 1 11 3 7 5 8 13 3 20 0 0 0 1 0 1l0 0c-3 3-3 6 0 9 2 3 6 2 9-1 8-10 8-25 0-34-5-7-13-10-22-10 0 0 0 0 0 0l0 0c-39 0-79 0-119 0-1 0-1 0-2 0-4 0-7 2-7 6 1 2 3 5 5 6l0 0c6 3 12 5 17 8 18 8 35 17 47 33 5 6 8 12 11 19l0 1c4 9 4 19-3 27-8 9-18 13-29 9-7-2-13-6-18-10l0 0c-16-13-24-30-31-49-1-5-3-10-4-15-1-4-3-6-7-6-5 1-5 4-5 8 0 23-3 46-11 67-5 15-12 28-23 39-9 8-19 12-31 10-16-2-26-15-27-32-1-19 6-35 16-50 13-21 32-36 52-50 4-2 8-5 12-8 3-2 5-5 4-8-2-2-5-4-7-5-1-1-3 0-4 0-30 0-60 0-90 0-10 0-18-7-17-16 0-3 2-6 3-8 3-4 3-7 0-10-2-2-6-1-9 2-12 15-4 38 15 43 2 0 5 1 8 1 24 0 48 0 72 0l2 0z"
    />
  </svg>
);

export const GiRabitIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <title>cruelty free</title>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M452 107c3 13 5 29 5 44 0 1 0 2 0 2l0 0c0 8-1 16-2 24 15-2 27-17 27-35 0-19-14-35-30-35z m-44-59c-26-22-64-33-115-33-65 0-95 36-100 69-6 33 10 62 38 73 2 0 4 2 4 5 0 0-1 1-1 2l0 0c0 2-2 3-5 3 0 0-1 0-2 0l0 0c-32-12-51-47-45-85 4-19 15-41 36-56l-83 0c-11-1-18 1-22 4-2 2-3 5-3 10 0 6 6 15 21 16 2 0 3 1 4 2l0 0c1 1 1 2 1 3 0 1 0 1 0 2l0 0-33 109c-1 3-3 4-6 4 0 0 0 0 0 0l0 0c-27-1-49 10-61 29-21 35-2 85 42 113 21 13 45 19 68 17 21-2 39-13 48-29 8-13 13-24 13-36 0-2 1-4 3-5 0 0 1 0 2 0 1 0 2 0 3 0l0 0c16 11 36 22 65 24 50 3 95-12 126-43 26-25 40-58 40-93 0-47-13-82-39-105z m-268 372c6 24 14 46 25 61 8 13 17 20 24 18 10-2 17-32 10-77-3-3-5-7-7-11-15-23-27-47-32-67-4 1-8 2-13 2l0 0c-3 0-7 1-11 1 0 0-1 0-1 0l0 0c-2 18 0 45 5 73z m69-3c29 43 59 61 67 55 4-3 8-14 3-34-4-21-14-44-29-67-12-19-29-37-51-53-7 10-17 17-28 22l-1 0c5 19 16 43 31 65 2 4 5 8 7 11l1 1z m243-229c-7 26-20 49-38 66l0 0c-34 33-82 49-135 46-27-2-46-11-62-20-2 9-6 19-12 29 23 16 41 36 54 56 15 24 26 48 31 70 4 23 2 39-8 46-16 11-45-11-70-42 3 40-5 67-21 71-11 2-23-6-35-23-11-16-20-39-26-65-6-28-8-56-6-76-17-2-35-9-52-19-48-31-69-88-45-127 13-22 38-35 67-35l30-99c-16-3-24-15-24-26 0-5 0-12 6-18 5-5 15-8 29-7l100 0c1 0 1 0 2 0l0 0c15-7 34-11 56-11 54 0 94 12 121 36 17 14 28 33 35 56 1 0 2 0 3 0 22 0 40 21 40 46 0 25-17 46-40 46z m-364 94c-10 0-18-7-18-17 0-10 8-18 18-18 9 0 17 8 17 18 0 10-8 17-17 17z"
    />
  </svg>
);

export const GiTwitterIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M481 395c-13-18-28-34-46-47 0-3 0-7 0-12 0-25-3-50-11-74-7-25-18-49-33-71-14-23-32-43-52-61-21-17-45-31-74-41-29-11-60-16-92-16-52 0-99 14-142 42 7-1 14-2 22-2 43 0 81 14 115 40-20 0-38 6-54 18-16 12-27 27-33 46 7-1 13-2 18-2 8 0 16 1 24 4-21 4-39 15-53 31-14 17-21 37-21 59l0 1c13-7 27-11 42-11-13 8-23 19-30 32-8 14-11 29-11 44 0 17 4 33 12 47 23-28 51-51 84-68 33-17 69-27 107-29-2 8-3 15-3 22 0 25 9 47 27 65 18 18 40 27 66 27 26 0 49-10 67-29 21 4 40 11 59 22-7-22-21-39-41-51 18 2 35 7 53 14z"
    />
  </svg>
);

export const GiStarIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M257 112l-151-79 29 167-122 119 168 25 76 152 75-152 169-25-122-119 28-167z"
    />
  </svg>
);

export const GiDotIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M500 256c0-135-109-244-244-244-135 0-244 109-244 244 0 135 109 244 244 244 135 0 244-109 244-244z"
    />
  </svg>
);

export const GiCalenderIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M454 11c22 0 41 18 41 41l0 367c0 23-19 41-41 41l-41 0 0-41 41 0 0-367-409 0 0 367 41 0 0 41-41 0c-23 0-41-18-41-41l0-367c0-23 18-41 41-41z m-102 143c-12 0-21-9-21-21 0-11 9-20 21-20l40 0c12 0 21 9 21 20 0 12-9 21-21 21z m0 82c-12 0-21-10-21-21 0-11 9-20 21-20l40 0c12 0 21 9 21 20 0 11-9 21-21 21z m40 40c12 0 21 10 21 21 0 11-9 20-21 20l-40 0c-12 0-21-9-21-20 0-11 9-21 21-21z m-20 103c11 0 20 9 20 20l0 82c0 11-9 20-20 20-11 0-20-9-20-20l0-82c0-11 9-20 20-20z m-82 81l0-41 41 0 0 41z m-61-306c-11 0-21-9-21-21 0-11 10-20 21-20l41 0c11 0 20 9 20 20 0 12-9 21-20 21z m0 82c-11 0-21-10-21-21 0-11 10-20 21-20l41 0c11 0 20 9 20 20 0 11-9 21-20 21z m41 40c11 0 20 10 20 21 0 11-9 20-20 20l-41 0c-11 0-21-9-21-20 0-11 10-21 21-21z m-21 103c12 0 21 9 21 20l0 82c0 11-9 20-21 20-11 0-20-9-20-20l0-82c0-11 9-20 20-20z m-81 81l0-41 40 0 0 41z m-62-306c-11 0-20-9-20-21 0-11 9-20 20-20l41 0c11 0 21 9 21 20 0 12-10 21-21 21z m0 82c-11 0-20-10-20-21 0-11 9-20 20-20l41 0c11 0 21 9 21 20 0 11-10 21-21 21z m41 40c11 0 21 10 21 21 0 11-10 20-21 20l-41 0c-11 0-20-9-20-20 0-11 9-21 20-21z m-20 103c11 0 20 9 20 20l0 82c0 11-9 20-20 20-12 0-21-9-21-20l0-82c0-11 9-20 21-20z"
    />
  </svg>
);

export const GiPercentageIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M427 412c-1 12-4 15-16 14-8-1-15-3-22-5-20-6-29 0-30 21 0 8-1 16-4 24l1-1c-4 11-9 14-19 8-9-6-17-12-25-18-13-9-24-7-31 8-4 7-8 15-13 22-8 11-15 11-23 0-5-7-9-15-13-22-2-3-3-5-4-7-8-8-18-8-28-1-8 6-16 13-25 18-9 5-15 3-18-7-2-8-4-18-4-28l0 0c-1-13-10-21-23-18-5 1-10 3-15 4-5 1-12 2-18 3l0 0c-8 0-11-3-11-11 0-5 1-10 2-15 1-6 4-12 5-19 3-11-3-19-15-21-9-1-18-1-27-3-13-2-17-10-10-22 4-7 9-13 14-19 13-17 11-27-8-37-8-4-15-7-22-12-8-6-8-12-1-20 2-1 3-3 5-4l0 0c8-4 16-9 24-13 9-4 13-10 11-20-1-4-4-9-7-13-6-9-13-17-18-26-4-7-2-12 6-15 8-2 16-4 25-5 21-1 27-10 21-30-2-7-4-14-5-22l0-1c-1-10 3-14 13-12 10 1 20 4 30 6 12 3 21-3 22-16 1-4 1-7 2-11 1-7 1-13 3-19 2-7 7-9 15-7 4 2 8 4 11 7 7 5 14 10 20 15 3 2 7 4 11 4 5 0 10-3 13-7l1 0c2-4 4-8 7-12 4-7 7-14 11-20 7-10 14-10 21 0 5 6 10 14 13 22 7 16 21 23 37 9 7-7 15-12 23-17 8-5 14-3 17 7 3 9 4 18 5 28 1 12 9 19 21 18 2 0 4-1 6-1 7-2 13-4 20-5 16-3 21 3 17 18-1 9-4 17-5 25-2 11 4 19 15 21 3 1 7 1 11 1 7 2 15 3 22 5 6 2 8 6 6 12-2 5-4 9-6 13l0-1c-5 7-11 14-16 21-8 12-6 21 7 28 8 5 16 8 23 13 14 9 14 17 0 27-7 4-14 7-21 11-14 8-16 17-7 30 2 3 5 6 7 9 3 4 6 7 9 12 8 14 6 20-10 24-9 2-18 2-27 3-8 1-15 8-15 17 0 1 0 2 1 3l0 0c1 6 3 11 5 17 1 5 2 10 3 15z m11-279c1-3 1-6 2-8 4-9 4-18 4-28 0-18-8-27-27-28-1 0-2 0-4 0-5 0-10 0-16 1l1 0c-6 1-12 3-18 5-2-9-3-19-5-28-7-26-20-33-47-21-7 3-13 8-19 13-3 2-6 5-9 7-6-10-11-19-17-28-3-5-7-9-12-12l0 0c-11-7-22-7-32 2-11 9-19 21-24 34l-2 5c-4-4-7-6-11-9-9-9-20-15-33-17-12-2-20 1-26 12-7 11-8 23-9 36-1 1-1 3-1 6-3-1-5-2-8-3-11-4-22-5-34-4-12 0-23 12-23 24 0 11 0 21 4 31 1 3 2 6 3 9l-27 4c-1 1-1 1-2 1-26 7-33 20-22 46 2 7 8 12 12 18 3 4 6 8 9 12-10 6-21 12-30 19-3 1-5 4-7 6-10 11-11 24-1 36 8 11 19 17 31 23 2 1 4 2 7 3-2 2-4 4-6 7-9 10-16 21-19 35-3 11 1 21 12 27 10 6 22 9 34 9 3 0 6 0 8 0-2 10-4 20-5 29-1 3-1 6-1 9 0 3 0 5 0 8l0-1c2 13 13 22 25 22 14 0 28-2 40-7 2 11 3 22 6 33 7 21 21 28 41 20 10-5 19-12 28-19 2-1 3-2 5-4 3 5 6 10 9 15 4 7 8 14 14 20 11 12 28 12 39 0 9-8 14-19 21-29 1-2 1-4 2-6 6 5 12 9 17 14 10 7 20 11 33 12 0 0 0 0 1 0 7 0 14-4 18-11l0 0c8-11 9-25 10-38 1-2 0-5 0-7 10 2 19 5 29 6 7 1 14 0 21-1 11-3 17-11 17-22 1-12 0-24-5-36 0-1-1-2-1-3 0-1 0-2 0-3 10-1 19-2 29-4 4-1 7-2 10-4 14-7 19-18 15-33-3-13-11-24-20-34l-3-4c8-5 16-10 23-15 4-2 8-5 11-9 11-12 12-28-1-39-9-8-21-14-32-21-1-1-2-1-4-2 4-5 8-9 12-14 9-10 14-21 15-34 1-10-4-16-12-22-9-5-20-8-30-10-5 0-9-1-13-1z m-137 75l1 0c0-8-1-15 0-22 1-10 6-17 14-18 7 0 14 6 15 16 1 15 1 30 1 45 0 2-1 4-1 5-3 9-8 13-15 13-7 0-12-5-13-13-1-9-1-18-2-26z m55-1l0-20c0-27-21-44-47-39-17 3-27 12-30 29-2 9-3 20-3 31 0 11 1 21 3 31l0-1c3 20 15 29 36 30 12 0 23-2 31-11 6-8 10-16 10-26 0-8 0-16 0-24z m-153 107l-1 0c0 6 1 11 0 17 0 5-1 9-3 13l0 0c-2 5-7 7-13 7-5 0-9-3-11-9-1-3-3-7-3-11 0-14 0-28 1-43 1-9 7-15 14-15 8 0 13 6 14 16 1 8 1 16 2 25z m-56 0c1 10 1 20 2 29 4 19 17 29 36 28 4 0 8 1 12 0 15-2 23-11 27-25 4-17 4-34 2-51 0-8-2-16-5-23l0 1c-4-13-14-19-27-19-2 0-3 0-5 0-3 0-5 0-8 0l1 0c-15 0-28 10-31 24l0 0c-1 3-2 7-3 11l0 0c0 9-1 17-1 25z m157 58c-6 0-9-1-13 0-5 0-7-2-9-6-22-59-44-119-67-178l-15-40 19 0 85 224z"
    />
  </svg>
);

export const GiTruck2Ico = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M413 165c-17 0-30-14-31-30l0 0c0 0 0 0 0 0 0-17 14-31 31-31 0 0 0 0 0 0 17 0 30 14 30 31l0 0c0 16-13 30-30 30z m-322 0c0 0 0 0 0 0-17 0-31-14-31-31 0-16 14-30 30-30l0 0c1 0 1 0 1 0 16 0 30 14 30 30 0 17-13 31-30 31z m251-21c6 0 11 1 16 0 4 0 6 1 7 6 6 19 23 33 44 34l0 0c23 1 42-10 50-30 4-10 4-10 15-10 8 0 10 2 10 10 0 38 0 77 0 115 0 0 0 0 0 0 0 3-1 5-2 8l0 0c-11 21-22 42-32 64-2 3-5 5-9 5-31 0-63 0-94 0-2 0-3 0-5 0l0-202z m-171 283l-138 0c-13 0-13 0-13-13 0-62 0-123 0-184l0-78c0-6 2-8 8-8 3 0 6 0 9 0 3 0 5 1 6 4 6 22 25 36 47 36 0 0 1 0 1 0 23 0 42-15 48-35l0 0c1-4 2-5 6-5 57 0 114 0 171 0 7 0 7 0 7 7l-1 267c0 7-1 9-8 9z m-171-2c0 1 1 2 1 2 4 14 12 20 27 20 36 0 73 0 110 0l172 0c4 0 7 0 11-1 12-2 21-11 21-24 0-15 0-31 0-46l0-10c2 0 4 0 6 0 31 0 62 0 93 0 12 0 21-5 26-16 11-21 22-43 33-65 1-2 2-5 4-8l0-132c-1-1-1-1-2-2-3-12-12-18-25-18-3 0-6-1-9 0-4 0-6-1-7-6-7-20-26-35-48-35 0 0 0 0 0 0l0 0c-23 0-42 15-48 36l0 0c-1 1-1 3-2 4l-223 0-1-4c-6-19-23-34-44-36l0 0c-1 0-3 0-4 0-20 0-36 11-45 27l0 0c-2 5-3 11-7 13-3 2-9 0-14 1-10 0-18 5-22 13l0 0c-1 2-2 5-3 7z m81-124c1-1 2-2 3-4l44-46c7-7 11-7 18 0 31 33 62 65 93 98 1 1 3 2 4 3-6 5-10 10-15 15l-91-96-42 44z m303 6l0-41 55 0c-7 13-13 26-20 39 0 1-2 1-3 1-10 1-21 1-32 1z m30-61l-39 0c-8 0-11 3-11 11 0 20 0 39 0 59 0 7 4 11 10 11 17 0 33 0 50 0 5 0 8-3 10-7 10-19 20-39 30-59 3-8-1-15-10-15-13 0-26 0-40 0z"
    />
  </svg>
);

export const GiInstaLikeFillIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M256 37c-5 0-9 1-13 5l-178 172c-2 1-4 4-8 7-3 4-8 10-16 19-7 9-13 18-19 28-6 9-11 21-15 34-5 14-7 27-7 40 0 42 12 74 36 98 24 24 58 35 101 35 11 0 23-2 36-6 12-4 23-9 34-16 11-7 20-14 27-20 8-6 15-12 22-19 7 7 14 13 22 19 7 6 16 13 27 20 11 7 22 12 34 16 13 4 25 6 36 6 43 0 77-11 101-35 24-24 36-56 36-98 0-42-22-85-65-129l-178-171c-4-4-8-5-13-5z"
    />
  </svg>
);

export const GiLinkAttachIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M202 136c5 5 10 7 17 7 7 0 13-2 19-7 10-11 10-23 0-36 0 0-22-20-22-20-19-19-42-29-68-29-26 0-49 10-68 29-19 19-29 42-29 67 0 27 10 50 29 69 0 0 76 76 76 76 24 23 48 36 73 39 26 3 47-4 66-22 5-5 8-11 8-18 0-7-3-13-8-19-12-11-24-11-36 0-17 17-40 11-68-17 0 0-75-75-75-75-9-9-14-20-14-33 0-13 5-23 14-31 9-9 19-14 32-14 13 0 23 5 32 14 0 0 22 20 22 20m230 294c19-19 29-42 29-68 0-26-10-49-29-68 0 0-81-81-81-81-25-25-51-37-77-37-21 0-40 9-57 26-5 5-7 10-7 17 0 7 2 13 7 19 5 4 11 7 18 7 7 0 13-3 18-7 17-17 38-13 62 12 0 0 81 80 81 80 10 9 15 20 15 32 0 13-5 24-15 32-8 9-17 14-28 16-11 2-22-2-31-11 0 0-26-25-26-25-5-5-11-7-18-7-7 0-13 2-18 7-11 11-11 23 0 36 0 0 26 25 26 25 18 19 40 27 65 26 25-1 47-11 66-31"
    />
  </svg>
);

export const GiInstaLikeIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M475 342c0 15-2 29-6 41-4 11-9 21-15 28-7 7-15 12-24 17-9 4-18 7-27 9-8 1-18 2-28 2-9 0-20-3-32-7-11-5-22-11-31-19-10-7-18-14-25-20-7-7-12-13-17-18-3-4-8-6-14-6-6 0-11 2-14 6-5 5-10 11-17 18-7 6-15 13-25 20-9 8-20 14-31 19-12 4-23 7-32 7-10 0-20-1-28-2-9-2-18-5-27-9-9-5-17-10-24-17-6-7-11-17-15-28-4-12-6-26-6-41 0-32 17-66 53-102l166-160 166 160c36 36 53 70 53 102z m37 0c0-42-22-85-65-129l-178-171c-4-4-8-5-13-5-5 0-9 1-13 5l-178 172c-2 1-4 4-8 7-3 4-8 10-16 19-7 9-13 18-19 28-6 9-11 21-15 34-5 14-7 27-7 40 0 42 12 74 36 98 24 24 58 35 101 35 11 0 23-2 36-6 12-4 23-9 34-16 11-7 20-14 27-20 8-6 15-12 22-19 7 7 14 13 22 19 7 6 16 13 27 20 11 7 22 12 34 16 13 4 25 6 36 6 43 0 77-11 101-35 24-24 36-56 36-98z"
    />
  </svg>
);

export const GiGiftboxIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M225 387c-15 28-45 59-67 73-12 7-25 12-40 10-18-2-26-13-22-32 6-29 26-42 49-46 26-4 52-4 80-5z m54-1c21 0 39-1 57 1 15 2 31 7 45 14 12 5 20 16 24 30 7 24-4 42-28 39-12-2-24-6-34-12l1 0c-27-16-46-42-65-72z m-12-97l200 0 0 65-200 0 0-65z m-232 0l201 0 0 65-201 0z m31-247c3 0 5-1 7-1 51 0 103 0 154 0 10 0 10 5 10 13 0 63 0 126 0 190 0 10-2 13-12 13-49-1-99 0-148 0-4 0-7-1-11-1z m201-1l171 0 0 215-171 0 0-215z m-232 216l-31 0c0 34-1 68 0 101 1 17 15 28 33 28 15 1 30 0 48 0-4 5-6 9-8 12-22 31-21 91 27 101 15 4 32 2 47-3 35-11 60-39 83-69 5-7 11-15 16-22 18 20 34 42 53 61 21 21 45 35 75 36 52 2 70-46 54-87-2-5-4-10-7-14l0 0c-2-4-5-8-9-15l46 0c25 0 37-12 37-39 0-29 0-59 0-90l-29 0c0-6-1-10-1-14l0-193c0-28-11-40-37-40-121 0-242 0-363 0-23 0-34 12-34 38 0 65 0 130 0 194l0 15z"
    />
  </svg>
);

export const GiCash2Ico1 = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M93 432c-1-3-2-7-2-10 0-4 13-5 164-5l163 0 0 7-1 6-160 0c-123 0-160 1-161 3-1 2-2 2-3-1z m-43-44c-1-1-2-4-2-7 0-5 9-5 207-5l206 0-1 7-1 6-203 1c-112 0-205-1-206-2z m-41-171l0-131 245 0 245 1 1 131 1 130-492 0z m477 3c0-80 0-113-3-116-4-5-451-6-457 0-2 2-3 31-3 114 0 62 1 113 2 113 1 2 105 2 231 2l229-1z m-395 80c0-11-8-20-20-23l-10-2 0-117 7 0c10-2 22-14 24-23l0-8 325 0 1 7c1 10 14 22 23 24l7 0 0 117-10 2c-12 3-20 12-20 23l0 8-327 0z m316-18c3-6 11-13 16-16l9-5 0-84-34-34-287 0-34 34 0 84 9 5c6 3 13 10 16 16l6 12 293 0z m-176-22c-12-5-23-22-25-36-2-12 3-29 13-40 25-28 71-17 83 20 6 21-5 47-24 56-13 7-35 6-47 0z m47-22c16-18 10-42-13-52-29-12-56 26-35 51 14 17 33 18 48 1z m-137-16c-2-8 2-14 9-14 8 0 14 9 9 14-5 4-16 4-18 0z m209 0c-4-5 2-14 10-14 6 0 10 6 8 14-2 4-13 4-18 0z"
    />
  </svg>
);

export const GiBankIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M160 440c-45-28-99-62-120-76-39-24-40-25-40-40 0-13 1-15 11-16 7-1 13-5 17-14 4-6 10-12 15-13 28-4 26 5 26-91 0-94 1-92-23-92-7 0-11-3-15-13-3-6-11-15-18-19-12-8-13-10-13-31l0-22 244 1 244 1 1 16c2 19-5 33-17 36-4 1-11 8-14 16-5 9-10 13-19 15l-12 2-1 88c-1 69 0 89 4 90 3 1 10 3 16 4 7 2 12 6 15 15 4 9 7 12 17 12 11 0 12 1 12 14 0 13-2 15-35 37-82 53-200 126-207 129-5 1-35-16-88-49z m132 5c26-16 64-41 87-55 80-51 91-58 91-61 0-3-98-4-225-4-128 0-225 1-225 4 0 2 46 32 103 68 56 36 105 68 110 71 4 3 9 7 11 7 1 0 23-14 48-30z m152-144c0-6-25-7-199-5-109 1-199 2-200 3 0 0 0 3 2 5 1 3 62 4 199 4 172-1 198-2 198-7z m-241-109c1-52 0-88-2-90-3-2-11-4-19-4-29 0-28-4-28 91 0 65 1 87 5 89 3 1 13 1 23 1l19-1z m135-3l0-89-48 0-2 85c0 47 0 87 2 90 1 4 9 5 25 4l23-1z m-202-2l0-87-49 0-1 83c-1 45 0 85 1 88 1 4 9 5 25 4l24-1z m133 0l0-87-20-1c-14-1-22 1-25 4-2 3-3 39-2 89l2 85 23-2 22-1z m138 83c1-4 2-43 2-87 0-88 1-85-26-85-28 0-27-4-27 89 0 46 2 85 3 86 2 2 12 3 24 3 16 0 22-1 24-6z m37-192c0-5-26-6-197-8-116 0-198 1-200 3-11 12 5 13 199 12 172-1 198-2 198-7z m32-31c1-3 1-9 0-12-2-5-32-6-231-6-221 0-228 1-230 8-1 4 0 10 2 12 4 3 74 4 230 4 197 0 227 0 229-6z m-260 378c-30-30-10-76 33-76 22 0 43 21 43 45 0 13-3 19-14 31-11 11-17 13-31 13-14 0-19-2-31-13z m51-11c5-4 8-13 8-20 0-7-3-16-8-21-17-17-48-4-48 21 0 15 13 28 28 28 7 0 16-4 20-8z"
    />
  </svg>
);

export const GiNotificationIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M234 499c-38-2-76-27-97-64-13-21-15-30-20-77-9-109-24-149-73-204-25-28-30-35-29-47l2-13 78-3c78-2 89-4 89-15 0-9 22-33 37-41 16-9 48-8 66 1 13 6 27 22 39 44 4 9 10 9 79 10 68 1 76 2 84 10 7 7 7 9 2 9-4 0-7 4-7 10 0 5-8 19-19 30-30 33-38 45-49 74-18 44-20 55-26 121-6 70-12 89-39 117-31 31-63 42-117 38z m78-37c22-14 42-39 42-50 0-4 3-8 5-10 3-1 4-18 4-37 0-34 9-96 18-125 9-31 30-66 55-93 14-15 25-29 23-31-3-2-400 2-404 5-1 1 9 13 21 27 22 26 43 62 51 89 9 29 17 87 17 120 0 29 2 39 12 58 14 28 21 36 41 49 34 21 84 20 115-2z m-17-380c2-11-18-37-31-42-17-6-34 4-46 26-12 22-6 26 40 24 28 0 36-2 37-8z"
    />
  </svg>
);

export const GiHomeIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M200 467c-69-63-188-183-194-195-9-17-7-27 9-43 11-12 17-16 29-16l16 0 0-101c0-74 1-103 5-107 7-7 339-7 363 0l16 4 0 100c0 105 0 107 19 105 5 0 14 4 21 10 11 8 13 12 13 30 0 21 0 22-41 64l-42 43-1 55-1 55-39 0c-36 0-38 0-39-9-1-5-4-10-6-10-3 0-16 11-29 23-22 20-27 22-44 23-19 2-21 0-55-31z m173-93c63-63 113-115 113-118 0-8-13-21-21-21-3 0-51 44-104 98-76 75-101 98-108 97-5-1-49-41-106-96-55-55-100-95-104-95-10 0-19 10-17 19 3 10 218 228 227 228 4 0 53-45 120-112z m20 51c0-15-2-29-4-30-2-1-11 4-20 12-11 12-15 18-15 30 0 15 0 15 19 15l20 0z m-50-108l84-83 0-100c0-86-1-100-7-106-4-4-10-6-13-5-4 1-23 3-43 3l-35 0 0 69c0 38-2 72-4 75-3 4-20 5-72 4l-67-1-1-64c-2-92 3-84-52-83l-46 2-1 104-1 104 80 82c44 45 83 82 88 82 3 1 43-35 90-83z m-42-227l0-62-45-2c-26 0-45 1-47 3-2 4-2 87 0 119 0 5 11 6 46 5l46-2z m-73 229c-18-11-31-32-31-50 0-26 31-56 58-56 27 0 56 31 56 58 0 20-16 43-38 52-19 8-25 7-45-4z m41-20c4-3 11-11 15-17 5-11 5-14-1-25-8-17-26-24-41-16-22 12-27 35-9 51 11 12 23 13 36 7z"
    />
  </svg>
);

export const GiShieldIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M238 490c-18-19-122-64-160-69-29-3-27 3-26-121l1-107 13-27c21-43 70-88 147-137 19-12 34-20 40-20 22 0 131 80 167 123 9 10 20 27 25 37l8 19 0 114-1 113-31 7c-50 12-124 44-149 66-7 7-16 12-19 12-3 0-9-4-15-10z m71-46c30-15 63-28 87-34 11-3 25-6 31-8l12-3-1-104-1-105-9-16c-12-21-41-52-72-77-24-20-77-56-94-65l-10-5-25 15c-55 34-108 78-132 112-23 33-23 33-22 146l1 100 21 6c45 11 112 39 144 61l15 11 17-12c9-6 26-16 38-22z m-23-170c-33-42-60-76-61-76-2 0-12 10-23 23-20 23-27 26-33 16-3-4 2-10 24-34 19-22 29-29 33-29 7 1 133 159 133 166 0 3-9 11-13 10 0 0-28-34-60-76z"
    />
  </svg>
);

export const GiGiftBoxTwoIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M106 489c-1-2-5-4-9-4-11 0-31-26-34-45-6-39 7-67 42-92l20-14-99 0 1-36c1-35 1-36 11-36l10 0 4-241 202-1 203-1 1 121 1 122 13 2 13 2-1 31c0 18-2 32-5 33-3 2-25 4-50 4l-47 0 25 16c30 20 42 41 42 72 0 23-3 32-19 48-19 21-49 28-78 18-23-9-41-22-69-52-15-16-29-29-31-29-2 0-5 3-6 7-6 20-59 64-88 74-17 6-49 6-52 1z m48-12c3-1 11-5 17-8 18-8 62-54 72-75 11-20 15-22 20-9 2 5 10 18 18 28 45 59 97 82 132 59 28-20 33-55 12-86-24-36-46-41-167-41-121 1-150 7-172 40-7 11-9 19-9 38 0 27 8 42 26 52 12 6 41 8 51 2z m318-160c5-5 6-29 1-37-3-3-25-5-102-4l-98 1-1 21-2 20 81 1c44 1 88 1 99 2 9 1 19-1 22-4z m-230-20l0-20-202 0-1 15c-3 28-8 26 103 25l100-1z m7-38c3-3-33-59-43-68-7-6-34 9-31 17 3 7 34 49 39 53 6 4 33 3 35-2z m61-20c10-13 19-26 19-28 0-3-5-6-11-7-5-2-12-5-14-9-4-4-8 1-27 28-25 36-25 42 1 40 11-1 16-5 32-24z m-131 6c1-2-6-14-17-28-10-14-19-26-19-28 0-2 7-3 16-3 18 0 27-6 32-22 1-5 4-9 6-9 2 0 11 11 20 24 10 13 19 24 21 23 2 0 4-31 4-83l0-82-175 0-1 100c0 56 0 103 1 106 1 4 15 5 56 5 30 0 55-1 56-3z m266-103l0-107-86 1-86 1-1 79c-2 86 0 92 18 62 6-8 11-15 12-15 2 0 6 6 11 13 6 11 10 14 19 14 20 0 22 11 6 34-7 11-13 21-13 22 0 1 27 2 60 2l60 0z m-336 312c-12-8-13-9-13-31 0-21 1-24 13-36 17-17 45-23 95-22l35 2-17 25c-37 55-84 80-113 62z m56-22c23-15 49-48 43-54-4-4-66 4-80 12-22 11-27 46-9 55 12 6 20 4 46-13z m195 25c-17-6-63-49-76-72-5-10-9-18-9-19 0-3 71-1 90 3 25 6 39 15 47 31 12 24 5 46-16 57-10 5-18 5-36 0z m37-17c11-11 12-17 4-32-8-16-20-22-49-27-38-7-50-6-50 3 0 10 47 56 63 61 19 6 22 6 32-5z"
    />
  </svg>
);

export const GiWalletIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M303 478c-14-7-42-22-62-33l-36-20-77-2c-82-2-86-3-102-24-7-10-8-18-9-175-1-153 0-164 6-177 16-30 14-29 217-29 198 0 202 0 217 23 5 8 7 22 9 61l2 52 11 1 11 1 0 117-11 1-11 1-2 57c-1 33-4 60-7 65-8 13-24 22-41 22-24 0-28 2-46 33-9 17-20 30-28 34-6 3-12 6-13 6 0 0-13-6-28-14z m36-22c2-4 11-21 21-38 9-17 16-34 15-36-4-4-173-4-181 0-2 2 14 13 36 25 117 65 105 60 109 49z m-209-70c-7-6-15-8-37-8-30 0-40-5-31-17 4-6 23-7 189-8l184-1 0-77-37-1c-29 0-41-2-51-8-36-21-38-77-2-103 10-7 20-9 52-11l40-2 0-44c0-36-1-46-6-53-6-6-18-7-188-7-182 0-182 0-190 9-8 9-8 13-8 166 0 189-5 174 55 174l40-1z m299 2c4-4 4-6-1-8-9-3-19 1-19 8 0 8 14 9 20 0z m31-174l0-32-41-1c-48-2-60 2-69 20-6 12-6 14 0 26 4 8 11 16 15 18 6 2 29 3 52 2l43 0z m-92 14c-5-6-7-11-6-17 1-5 3-10 3-11 0-2 5-5 12-8 16-7 32 3 32 20 0 22-25 32-41 16z"
    />
  </svg>
);

export const GiLogoutIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M239 489c-1-6-3-52-3-102-1-89-1-91 9-97 9-6 11-6 20 3 9 10 9 11 6 102-2 50-4 94-6 97-4 11-23 8-26-3z m-107-61c-81-52-120-149-99-239 18-74 72-133 150-164 24-9 109-9 136 1 25 8 59 27 69 36 3 3 10 10 16 15 6 4 15 15 21 23 6 9 12 17 14 18 1 1 7 11 13 23 9 17 11 26 13 85 0 37 0 70-2 74-2 5-4 12-5 16-4 23-23 53-50 80-33 32-58 49-75 49-9 0-11-2-11-14 0-10 3-14 17-20 44-21 93-86 102-134 24-132-102-254-228-220-69 19-112 58-141 130-9 22-6 89 5 118 17 45 48 82 90 104 11 6 15 11 16 22 1 13 0 14-12 14-8 0-24-7-39-17z"
    />
  </svg>
);

export const GiCallIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M405 151c-6-18-31-32-50-37-14-2-31-5-90 20-66 27-158 125-158 189 0 33 19 72 53 72 16 0 19 0 24-13 7-15 22-52 23-55 8-16-7-25-18-38-3-4-7-9-3-16 4-8 20-32 42-52 28-25 51-33 60-37 6-2 13-2 18 3 5 6 13 16 20 26 5 8 11 9 18 6 5-2 63-29 65-33 2-3 2-18-4-35z m-149 361l0 0c-141 0-256-115-256-256 0-56 18-108 49-150l-32-95 98 31c40-26 88-42 141-42 0 0 0 0 0 0l0 0c141 0 256 115 256 256 0 141-115 256-256 256z"
    />
  </svg>
);

export const Gi15OffIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M0 347l39 0 0-242 50 0 0 318-34 0c-7-22-16-40-55-40z m148-140l0-26c0-51 25-80 75-80 49 0 75 29 75 80l0 71c0 47-19 73-56 73-20 0-34-9-44-24l-1 0 5 76 87 0 0 46-132 0-9-185 47 0 0 10c0 23 10 31 26 31 16 0 26-8 26-31l0-70c0-23-10-31-26-31-16 0-26 8-26 31l0 29z m228 54l0-68c0-9 4-13 10-13 7 0 10 4 10 13l0 68c0 9-3 13-10 13-6 0-10-4-10-13z m-19-67l0 66c0 20 10 32 29 32 20 0 30-12 30-32l0-66c0-20-10-32-30-32-19 0-29 12-29 32z m29-103l77 199 18 0-77-199z m87 97l0-68c0-9 3-13 10-13 6 0 9 4 9 13l0 68c0 9-3 13-9 13-7 0-10-4-10-13z m-20-67l0 66c0 20 10 32 30 32 19 0 29-12 29-32l0-66c0-20-10-32-29-32-20 0-30 12-30 32z"
    />
  </svg>
);

export const Gi6Ico = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M45 239c10 0 17 7 17 17 1 9-7 17-17 17-10 0-17-7-17-17 0-10 7-17 17-17z m369 161c0 11-10 21-21 21-11 0-20-10-21-21l0 0c0-12 10-21 21-21l0 0c12 0 21 9 21 21z m70-144c0 0 0 0 0 0 0 17-14 30-31 31l0 0c-17 0-31-15-31-31 1-17 14-31 31-31 17 1 31 14 31 31z m-91-174c16-1 31 13 31 30 0 16-13 30-30 31-16 0-31-13-31-29-1-18 12-32 30-32z m-174-29c0 0 0 0 0-1 0-16 13-30 30-30l0 0c17 0 31 14 31 30 0 17-14 31-31 31 0 0 0 0 0 0-17 0-30-13-30-30z m-114 29c0 0 0 0 0 0 17 0 30 13 31 30l0 0c0 17-15 31-31 31-17 0-31-14-31-31l0 0c0 0 0 0 0 0 0-17 14-30 31-30 0 0 0 0 0 0l0 0z m1 348c-17 1-31-12-32-29 0 0 0-1 0-1 0-17 14-30 30-31l0 0c17 0 31 14 32 30 0 17-13 31-30 31z m113 30c0 0 0 0 0-1 0-16 13-30 30-30l0 0c17 0 31 14 31 31 0 16-14 30-31 30l0 0c0 0 0 0 0 0-17 0-30-14-30-30l0 0z m106-204c1 42-33 76-75 76-1 0-1 0-1 0-42 0-76-34-76-76l0 0c-1-41 34-76 75-76 1 0 1 0 1 0 42 0 76 34 76 76z m-68 256c10-3 19-6 27-13 24-21 23-61-2-80-5-4-12-7-18-10-3-1-4-2-4-5 0-15 0-31 0-47 0-1 2-4 3-4 17-3 33-9 46-19l-1 0c1 0 2-1 2-1 15 15 30 30 45 45-1 6-3 11-4 17-3 26 16 47 42 48 19 0 36-12 42-33 5-17-4-38-20-47-13-7-26-8-40-2-2 1-4 1-5 0-15-14-29-29-44-44 11-15 18-31 21-50 15 0 29 0 44 0 3 0 7-1 9 0 3 2 3 6 4 9 9 21 31 35 53 32 24-2 43-19 48-42 6-34-22-66-56-62-24 2-39 15-47 38 0 1-2 3-3 3-17 0-34 0-51 0-3-9-5-18-8-26-4-8-9-16-13-25l22-22c4-4 9-9 13-13 2-2 3-2 6-1 23 12 48 7 65-12 14-15 17-39 7-57-9-19-29-31-50-29-39 3-61 43-43 77l2 3-38 38c-11-5-22-11-33-16-5-1-9-2-14-3-3 0-4-1-4-4 0-16 0-32 0-48 0-3 2-4 4-4 23-8 38-28 38-52-1-38-44-63-77-45-19 10-29 27-28 49 1 21 12 38 32 45 8 4 9 8 9 16 0 12 0 25 0 37 0 4-1 6-5 6-15 3-27 8-38 16l0-1c-3 3-6 4-8 6l0 0c-3-4-6-7-9-11-9-8-17-17-26-25-2-2-3-4-1-7 17-32-1-69-36-76-38-8-71 28-61 65 7 22 24 37 48 39 10 0 19-2 28-7 1 0 4-1 5 0 12 12 25 24 37 37-11 14-18 31-21 50l0 0-16 0c-16 0-32 0-48 0-3 0-4-1-6-4-7-17-26-28-44-23-20 4-32 21-31 41 2 18 15 33 32 36 19 3 36-7 44-24 0-2 2-4 4-4 21 0 43 0 64 0 0 0 1 0 1 0 3 18 9 34 19 48 1 1 1 3 0 4-11 12-23 23-34 35-3 2-4 1-6 0-27-15-61-4-73 24-8 20-6 39 8 55 14 18 33 23 54 17 21-5 33-20 38-41 2-13-1-26-7-37l39-39c10 8 23 15 36 18l1 0c0 0 1 1 1 1 4 0 9 0 10 2 2 3 1 8 1 11 0 13 0 26 0 39 0 3-1 4-4 5-34 11-48 49-29 79 8 12 19 20 33 23 2 0 3 1 4 1l15 0z"
    />
  </svg>
);

export const GiGlammMoneyIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M363 353c-3 7-12 13-19 10-3-1-5-4-7-6-28-35-42-79-59-120 4 23 9 46 16 69 2 8 5 17 3 26-2 8-11 16-20 14-6-2-10-7-13-11l-28-36c3 10 6 19 7 29 0 10-2 21-10 28-3 3-8 6-12 3-3-2-2-7-2-11 1-8-2-17-4-25-6-18-14-52-23-87l-3-16c-1-5-1-13 4-15 5-3 11 2 14 6 6 6 9 14 13 21 3 7 6 13 10 19 7 13 12 25 20 37 5 8 11 19 15 18 4 0 0-13-1-15-2-9-4-19-7-29-5-20-10-40-12-60-1-5 0-11 3-16 3-5 9-8 15-5 3 1 5 5 7 8 10 22 19 45 29 67 5 10 9 20 14 30 5 10 9 17 13 24l-1-2c0 1 2 5 5 4 1 0 1-3-1-10-6-20-21-65-23-72-5-18-7-23-7-34-1-11 1-22 9-30 3-3 10-6 14-3 3 2 2 8 2 12 1 11 1 19 3 28 6 27 33 122 34 127 2 7 4 15 2 23z m90-200c-53-62-118-92-196-93-79 0-145 31-198 93 23-59 104-122 210-117 87 5 161 59 184 117z m-205-67c64 1 115 19 159 57 72 62 87 167 33 246-37 56-91 85-155 93-78 9-144-14-198-73-51-54-63-137-30-203 42-82 112-115 191-120z m250 170c2-40-1-79-20-115-32-64-84-103-151-121-85-23-165-9-235 48-50 40-77 93-78 160 0 25-1 50 0 76 4 56 29 102 69 139 55 51 120 72 194 66 81-7 146-43 190-114 19-29 31-66 31-104 0-1 0-1 0-1l0 0c0-11 0-23 0-34z m-431 27c4 60 32 104 79 134 29 18 60 27 93 28 11 0 17-4 17-13 0-8-6-13-17-13-56-4-103-27-133-81-11-20-15-41-15-64 0-10-1-17-11-18-8-1-12 5-13 18 0 3 0 6 0 9z"
    />
  </svg>
);

export const GiDropboxIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M0 544l24 0 0-24-24 0z m254-226l-71 82 32 0c4 0 7 4 7 8l0 93 64 0 0-93c0-4 3-8 7-8l32 0z m93 92c-1 3-3 5-6 5l-40 0 0 94c0 3-4 7-8 7l-78 0c-3 0-7-4-7-7l0-94-40 0c-3 0-6-2-7-5-1-2-1-5 1-7l87-101c1-2 3-3 5-3 3 0 4 1 6 3l86 101c2 2 3 5 1 7z m-38-203l-43 55 158 45 41-46z m110-76l-158-59 0 173 39-51c2-2 4-3 6-3 1 0 2 0 2 0l111 39z m-172-59l-157 59 0 99 110-39c1 0 2 0 3 0 2 0 4 1 5 3l39 51z m-204 189l42 46 157-45-42-55z m440 1l-51 58c0 0-1 0-1 0 0 1-1 2-2 2 0 0 0 0-1 0l-98 28-11-12 81-23-146-41-145 41 80 23-10 12-99-28c-1 0-2-1-3-2l-52-58c-1-1-2-4-1-6 0-3 2-5 4-5l47-16c0 0 0 0 0-1l0-108c0-3 2-6 5-7l172-65c0 0 1 0 2 0 1 0 2 0 3 0l172 65c3 1 5 4 5 7l0 108c0 1 0 1 0 1l46 16c3 0 4 2 5 5 1 2 0 5-2 6z"
    />
  </svg>
);

export const GiDoneIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M256 9c-136 0-247 111-247 247 0 136 111 247 247 247 136 0 247-111 247-247 0-136-111-247-247-247z m0 18c126 0 229 103 229 229 0 126-103 229-229 229-126 0-229-103-229-229 0-126 103-229 229-229z m159 292l-183-185c-4-4-9-6-14-6-6 0-11 2-15 6l-106 107c-3 4-6 9-6 15 0 6 2 11 6 15l29 29c4 4 9 6 15 6 5 0 10-2 14-6l63-64 139 142c4 4 9 6 14 6 6 0 11-2 15-6l29-29c4-4 6-9 6-15 0-6-2-11-6-15z"
    />
  </svg>
);

export const GiAirplaneIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M161 488c-2-3 29-115 48-174 4-10 5-19 4-21-1-2-30-4-64-4l-62 0-19 27c-16 21-21 26-31 26-24 0-24-1-11-48l11-43-11-44-12-43 9-3c20-5 28 0 46 26l17 25 63 0c34 0 63-1 64-3 1-2-6-28-15-58-27-95-39-135-39-138 0-4 41-4 47 0 2 2 29 45 59 96 30 51 57 96 60 98 3 4 23 5 72 5 75 1 83 3 94 25 6 13 6 15-1 28-10 22-19 24-94 24-48 0-68 1-71 5-3 3-28 45-58 94-28 49-55 93-59 97-6 7-43 10-47 3z"
    />
  </svg>
);

export const GiPlusIco = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M482 316l0-90-184 0 0-201-93 0 0 201-185 0 0 90 185 0 0 196 93 0 0-196z"
    />
  </svg>
);

export const GiLocation2Ico = ({
  height = "50px",
  width = "50px",
  viewBox = "0 0 1000 1000",
  fill = "#000",
  ...otherProps
}: GlammIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={width} height={height} viewBox={viewBox} {...otherProps}>
    <path
      transform="scale(1,-1) translate(0, -650)"
      fill={fill}
      d="M256 480c-80 0-144-64-144-144 0-112 144-304 144-304 0 0 144 192 144 304 0 80-64 144-144 144z m0-191c-26 0-47 21-47 47 0 26 21 47 47 47 26 0 47-21 47-47 0-26-21-47-47-47z"
    />
  </svg>
);
