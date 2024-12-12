import { useCallback, memo } from "react";

import Loading from "@/components/loading";

import { ButtonInterface } from "./button-interface";

import style from "./button.module.scss";

const Button: React.FC<ButtonInterface> = ({
  form, // form element to which the button belongs
  type, // type of the button (submit, button, etc)
  icon, // icon to be displayed inside the button
  title, // text to be displayed inside the button
  styles, // additional styles to be applied to the button
  tooltip, // for purpose of the button
  iconJsx, // icon to be displayed inside the button
  iconSize,
  disabled, // whether the button should be disabled
  isLoading, // whether the button is currently loading
  className, // additional className to be applied to the button
  ariaLabel,
  titleClass,
  titleStyles, // styles to be used for the button text
  handleClick, // function to be called when the button is clicked
  loaderClass, // className to be applied to the loading icon
}) => {
  const handleClickCallback = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.nativeEvent.stopPropagation();
      handleClick && handleClick(e);
    },
    [handleClick],
  );

  return (
    <button
      title={tooltip}
      className={`${style.btn} ${className}`} // apply the base class and additional className
      onClick={handleClickCallback}
      type={type}
      form={form && form}
      disabled={disabled || isLoading || false}
      aria-label={ariaLabel || ""}
      style={{
        pointerEvents: isLoading || disabled ? "none" : "auto",
        ...styles,
      }}
    >
      {!isLoading && icon && (
        <div className={style.arrow_icon}>
          <img
            src={icon}
            alt={"button icon"}
            width={iconSize?.width ?? 24}
            height={iconSize?.height ?? 24}
          />
        </div>
      )}
      {!isLoading && iconJsx && <div className={style.arrow_icon}>{iconJsx}</div>}
      {isLoading ? (
        <Loading loaderClass={`${style.loaderClass} ${loaderClass}`} />
      ) : (
        <p style={{ ...titleStyles }} className={`${style.btnTextClass} ${titleClass}`}>
          {title}
        </p>
      )}
    </button>
  );
};

Button.defaultProps = {
  type: "button",
};
export default memo(Button);
