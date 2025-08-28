import React from "react";
import { Link } from "react-router-dom";

interface PrimaryButtonProps {
  to?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  outlined?: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  loadMargin?: number;
  type?: "button" | "submit" | "reset";
  color?: string; // Add color prop
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  to,
  onClick,
  children,
  className,
  outlined = false,
  disabled = false,
  icon,
  type = "button",
  isLoading = false,
  loadMargin = 4,
  color = "primary", // Destructure color prop with default value
}) => {
  const baseClassNames =
    "items-center justify-center rounded-md py-3 px-4 text-sm text-center items-center font-medium lg:px-6 xl:px-8";
  const primaryClassNames = `bg-${color} text-white hover:bg-strokedark cursor-pointer`;
  const disabledClassNames = `bg-gray-200 text-gray-400 cursor-not-allowed`;
  const outlinedClassNames = `border border-${color} text-${color} hover:${
    "bg-" + color
  } hover:text-white`;

  const finalClassNames = `${className} ${baseClassNames} ${
    disabled
      ? disabledClassNames
      : outlined
      ? outlinedClassNames
      : primaryClassNames
  }`;

  const content = (
    <div className="flex flex-row items-center justify-center">
      {icon && !isLoading && <span className="mr-2">{icon}</span>}
      {isLoading ? (
        <div
          className={`h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent mx-${loadMargin}`}
        />
      ) : (
        children
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className={finalClassNames}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={isLoading ? undefined : onClick}
      className={finalClassNames}
      type={type || "button"}
      disabled={isLoading || disabled}
    >
      {content}
    </button>
  );
};

export default PrimaryButton;
