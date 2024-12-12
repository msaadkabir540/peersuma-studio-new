interface ModalInterface {
  open: boolean | undefined;
  children?: React.ReactNode;
  className?: string;
  bodyClass?: string;
  showCross?: boolean;
  bodyPadding?: string;
  modalWrapper?: string;
  iconClassName?: string;
  handleClose?: () => void;
  style?: React.CSSProperties;
}

export { ModalInterface };
