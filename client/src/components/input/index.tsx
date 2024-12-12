import { memo, KeyboardEvent, useCallback } from "react";

import { InputInterface } from "./input-interface";

import style from "./input.module.scss";

const Input: React.FC<InputInterface> = ({
  id,
  min,
  max,
  type,
  step,
  name,
  icon,
  label,
  value,
  accept,
  onClick,
  readOnly,
  infoText,
  register,
  required,
  onChange,
  isDisable,
  className,
  labelClass,
  iconClass,
  errorClass,
  inputClass,
  placeholder,
  iconEleClass,
  errorMessage,
  errorMessagefield,
  isContactNumber = false,
}) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "e" || event.key === "E") event.preventDefault();
    },
    [type],
  );

  const getValidationRules = useCallback(() => {
    if (required) {
      return { required: "Required." };
    } else if (isContactNumber) {
      return {
        required: "Contact number must be 10 digits",
        minLength: {
          value: 10,
          message: "Contact number must be 10 digits",
        },
        maxLength: {
          value: 10,
          message: "Contact number must be 10 digits",
        },
      };
    } else {
      return {};
    }
  }, [required, isContactNumber]);

  return (
    <div className={`${style.inputContainer} ${className}`}>
      {/* if label is passed, render a label element, otherwise don't render */}

      {label && (
        <label
          style={{
            color: errorMessagefield ? "#ff5050" : " #252733",
          }}
          className={labelClass}
        >
          {label}
        </label>
      )}

      {/* render input and icon */}
      <div style={{ position: "relative" }}>
        <input
          id={id && id}
          min={min ?? undefined}
          max={max ?? undefined}
          name={name || ""}
          step={step || 1}
          type={type || "text"}
          className={inputClass}
          value={value && value}
          accept={accept || ""}
          readOnly={readOnly || false}
          disabled={isDisable || false}
          placeholder={placeholder || ""}
          onChange={onChange || (() => {})}
          {...(register && !onChange && register(name || "", getValidationRules()))}
          onKeyDown={type === "number" ? handleKeyPress : () => {}}
          style={{
            border: errorMessagefield ? "1px solid #ff5050" : "1px solid #C0C0C0",
            ...style,
          }}
        />
        {/* if icon is passed, render an icon element, otherwise don't render */}
        {icon && (
          <div className={`${style.icon} ${iconClass}`}>
            <img
              className={`${iconEleClass}`}
              style={{ cursor: "pointer" }}
              src={icon}
              alt="icon"
              width={28}
              height={28}
              onClick={onClick}
            />
          </div>
        )}
      </div>
      {/*  if errorMessage is passed, render an error message element, otherwise render an info message element */}
      {errorMessage ? (
        <span className={`${style.errorMessage} ${errorClass}`}>{errorMessage}</span>
      ) : (
        <span className={style.message}>{infoText}</span>
      )}
    </div>
  );
};

export default memo(Input);
