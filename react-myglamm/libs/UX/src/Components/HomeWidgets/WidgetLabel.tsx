import * as React from "react";
import clsx from "clsx";

const WidgetLabel = ({
  title,
  className,
  color = "var(--color2)",
  style,
}: {
  title: string;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}) =>
  title?.trim()?.length > 0 ? (
    <h1
      className={clsx("font-bold text-gray-800 mx-3 mb-2 mt-4", className || "")}
      style={{
        backgroundImage: `linear-gradient(180deg,transparent 77%,${color} 0)`,
        fontSize: "18px",
        backgroundSize: "100% 95%",
        backgroundRepeat: "no-repeat",
        transition: "background-size .4s",
        display: "inline-block",
        padding: " 0 2px",
        ...style,
      }}
    >
      {title}
    </h1>
  ) : null;

export default WidgetLabel;
