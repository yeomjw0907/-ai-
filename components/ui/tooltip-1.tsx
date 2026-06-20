"use client";

import React, { useMemo } from "react";
import clsx from "clsx";
import { type PlacesType, Tooltip as ReactTooltip } from "react-tooltip";

const types = {
  success: "!bg-primary !text-white",
  warning: "!bg-yellow-500 !text-black",
  error: "!bg-red-600 !text-white",
  violet: "!bg-purple-700 !text-white",
  default: "!bg-ink !text-white",
};

interface TooltipProps {
  children: React.ReactNode;
  text: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: boolean;
  boxAlign?: "left" | "right" | "center";
  type?: keyof typeof types;
  tip?: boolean;
  center?: boolean;
  className?: string;
}

export const Tooltip = ({
  children,
  text,
  position = "top",
  delay = true,
  boxAlign = "center",
  type = "default",
  tip = true,
  center = true,
  className,
}: TooltipProps) => {
  const id = useMemo(() => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join(
      "",
    );
  }, []);

  return (
    <div>
      <div id={id} className={clsx("font-sans", className)}>
        {children}
      </div>
      <ReactTooltip
        anchorSelect={`#${id}`}
        place={`${position}${{ left: "-start", right: "-end", center: "" }[boxAlign]}` as PlacesType}
        delayShow={delay ? 500 : 0}
        opacity={1}
        noArrow={!tip}
        className={clsx(
          "!max-w-52 !rounded-lg !font-sans !text-[13px]",
          types[type],
          center ? "text-center" : "text-start",
        )}
      >
        {text}
      </ReactTooltip>
    </div>
  );
};
