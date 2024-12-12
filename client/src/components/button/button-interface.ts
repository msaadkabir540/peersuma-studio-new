type ButtonTypes = "button" | "submit" | "reset";

interface ButtonInterface {
  form?: string;
  type?: ButtonTypes;
  icon?: string;
  title?: string;
  styles?: React.CSSProperties;
  tooltip?: string;
  iconJsx?: JSX.Element | JSX.Element[];
  iconSize?: {
    width: number;
    height: number;
  };
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  ariaLabel?: string;
  titleClass?: string;
  titleStyles?: React.CSSProperties;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loaderClass?: string;
}

export { ButtonInterface };
