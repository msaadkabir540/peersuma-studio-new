import { TextAreaInterface } from "./text-area-interface";

import style from "./input.module.scss";

const TextArea: React.FC<TextAreaInterface> = ({
  label,
  name,
  value,
  required,
  register,
  rows = 2,
  readOnly,
  className,
  onChange,
  inputClass,
  placeholder,
  errorMessage,
}) => {
  return (
    <>
      <div className={`${style.inputContainer} ${className}`} ref={null}>
        {label && (
          <label
            style={{
              color: errorMessage ? "#ff5050" : " #252733",
            }}
          >
            {label}
          </label>
        )}
        {/* render input and icon */}
        <div style={{ display: "flex" }}>
          <textarea
            required={required}
            rows={rows}
            name={name || ""}
            className={inputClass}
            value={value && value}
            readOnly={readOnly || false}
            placeholder={placeholder || ""}
            onChange={onChange || (() => {})}
            {...(register && !onChange && register(name || ""))}
            style={{
              border: errorMessage ? "1px solid #ff5050" : "1px solid #C0C0C0",
            }}
          ></textarea>
        </div>
        {/*  if errorMessage is passed, render an error message element, otherwise render an info message element */}
        {errorMessage && <span className={`${style.errorMessage}`}>{errorMessage}</span>}
      </div>
    </>
  );
};

export default TextArea;
