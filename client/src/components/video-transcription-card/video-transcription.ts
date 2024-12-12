interface ContextMenuInterface {
  handleMenuOpen:
    | (({
        id,
        fieldName,
        label,
        name,
      }: {
        id: string;
        fieldName: string | undefined;
        label: string | undefined;
        name: string | undefined;
      }) => void)
    | undefined;
  handleClipDelete: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleClipClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleReadyToDraft?: (e: React.MouseEvent<Element, MouseEvent>) => void;
  setIsOpen: (argu: boolean) => void;
  id: string;
  fieldName: string | undefined;
  label: string | undefined;
  name: string | undefined;
  stagingHandleEvent: () => void;
  renameAllow: boolean | undefined;
  isStaging?: boolean | undefined;
  readyToDraft?: boolean | undefined;
  activeTab?: boolean;
  getMenuPosition: React.CSSProperties | undefined;
}

export { ContextMenuInterface };
