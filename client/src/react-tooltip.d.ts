declare module "react-tooltip" {
  import { FC } from "react";

  interface TooltipProps {
    id: string;
    place?: "top" | "right" | "bottom" | "left";
    effect?: "float" | "solid";
    variant?: "info" | "success" | "warning" | "error" | "custom";
    className?: string;
    style?: React.CSSProperties;
  }

  const Tooltip: FC<TooltipProps>;
  export { Tooltip };
}
