import { RadioInterface } from "./radio-interface";

import style from "./radio.module.scss";

const Radio: React.FC<RadioInterface> = ({
  id,
  name,
  error,
  label,
  checked,
  register,
  className,
  radioValue,
  handleClick,
  handleChange,
  defaultChecked,
}) => {
  return (
    <div>
      <label className={`${style.container} ${className}`} htmlFor={id}>
        <p>{label}</p>
        <input
          id={id}
          name={name}
          type="radio"
          checked={checked && checked}
          value={radioValue}
          onClick={handleClick}
          defaultChecked={defaultChecked && defaultChecked}
          onChange={handleChange}
          {...(register && !onchange && register(name))}
        />

        <span className={style.checkMark} style={{ borderColor: error ? "red" : "" }}></span>
      </label>
    </div>
  );
};

export default Radio;
