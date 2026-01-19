import { FC } from "react";
import SVG from "react-inlinesvg";

interface InlineSVGProps {
  src: string;
  ariaHidden?: boolean;
  imgFluid?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

const InlineSVG: FC<InlineSVGProps> = ({
  src,
  className,
  width = 24,
  height = 24,
  ariaHidden = false,
  imgFluid = false,
  ...props
}) => {
  return (
    <SVG
      src={src}
      height={imgFluid ? "100%" : height}
      width={imgFluid ? "100%" : width}
      className={className}
      aria-hidden={ariaHidden}
      {...props}
    />
  );
};

export default InlineSVG;
