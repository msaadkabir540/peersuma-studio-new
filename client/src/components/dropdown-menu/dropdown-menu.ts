type Option = {
  name: string;
  icon?: string;
  handleClick: () => void;
};

interface DropDownInterface {
  title?: string | React.ReactNode;
  options: Option[];
}

export { DropDownInterface };
