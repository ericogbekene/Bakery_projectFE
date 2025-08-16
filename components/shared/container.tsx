import { cn } from "@/lib/utils";
import { CSSProperties, ReactNode } from "react";

const Container = ({
  children,
  className = "",
  style = {},
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <div
      className={cn("container mx-auto max-w-[1280px] px-4 lg:px-8", className)}
      style={style}
    >
      {children}
    </div>
  );
};

export default Container;
