"use client";

import React, { createContext, useContext, useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type SwitchSize = "small" | "medium" | "large";

const SwitchContext = createContext<{
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
} | null>(null);

interface SwitchProps {
  children: React.ReactNode;
  name?: string;
  size?: SwitchSize;
  style?: React.CSSProperties;
}

interface SwitchControlProps {
  label?: string;
  value: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  name?: string;
  size?: SwitchSize;
  icon?: React.ReactNode;
  onSelect?: (value: string) => void;
}

type SwitchComponent = React.FC<SwitchProps> & {
  Control: React.FC<SwitchControlProps>;
};

const SwitchControl = ({
  label,
  value,
  defaultChecked,
  disabled = false,
  name,
  size = "medium",
  icon,
  onSelect,
}: SwitchControlProps) => {
  const context = useContext(SwitchContext);
  const checked = value === context?.value;

  return (
    <label
      className={clsx("flex h-full flex-1", disabled && "pointer-events-none cursor-not-allowed")}
      onClick={() => {
        context?.setValue(value);
        onSelect?.(value);
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        readOnly
        className="hidden"
      />
      <span
        className={twMerge(
          clsx(
            "flex flex-1 cursor-pointer items-center justify-center rounded-sm font-sans font-semibold transition-all duration-150",
            checked
              ? "bg-surface text-ink shadow-sm"
              : "text-ink-muted hover:bg-surface/60 hover:text-ink",
            disabled && "text-ink-muted/60",
            !icon && size === "small" && "px-3 text-xs",
            !icon && size === "medium" && "px-3 text-sm",
            !icon && size === "large" && "px-4 text-base",
            icon && size === "small" && "px-2 py-1",
            icon && size === "medium" && "px-3 py-2",
            icon && size === "large" && "p-3",
          ),
        )}
      >
        {icon ? <span className={clsx(size === "large" && "scale-125")}>{icon}</span> : label}
      </span>
    </label>
  );
};

export const Switch: SwitchComponent = ({ children, name = "default", size = "medium", style }) => {
  const [value, setValue] = useState<string | null>(() => {
    const defaultControl = React.Children.toArray(children).find(
      (child) => React.isValidElement<SwitchControlProps>(child) && child.props.defaultChecked,
    );

    return React.isValidElement<SwitchControlProps>(defaultControl)
      ? defaultControl.props.value
      : null;
  });

  return (
    <SwitchContext.Provider value={{ value, setValue }}>
      <div
        className={clsx(
          "flex border border-line bg-bg p-1",
          size === "small" && "h-8 rounded-md",
          size === "medium" && "h-10 rounded-md",
          size === "large" && "h-12 rounded-lg",
        )}
        style={style}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement<SwitchControlProps>(child)) {
            return child;
          }

          return React.cloneElement(child, { size, name });
        })}
      </div>
    </SwitchContext.Provider>
  );
};

Switch.Control = SwitchControl;
