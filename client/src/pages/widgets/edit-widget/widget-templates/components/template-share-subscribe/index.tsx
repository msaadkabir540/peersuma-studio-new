import ShareDropDown from "@/pages/widgets/edit-widget/widget-templates/components/share-dropdown";

import style from "./index.module.scss";

interface showWidget {
  name: string;
  buttonColor: string;
  buttonTextColor: string;
  shareColor: string;
  enableShare: boolean;
}

interface TemplateShareSubscribeInterface {
  classNameModalProps?: string;
  widget: showWidget;
}

const TemplateShareSubscribe: React.FC<TemplateShareSubscribeInterface> = ({
  widget,
  classNameModalProps,
}) => {
  return (
    <div className={style.container}>
      <div className={style.containerInner}>
        {widget?.enableShare && (
          <ShareDropDown
            video_name={widget?.name}
            video_url={window.location.href}
            buttonColor={widget?.buttonColor}
            shareColor={widget?.shareColor}
            buttonTextColor={widget?.buttonTextColor}
            classNameModalProps={classNameModalProps}
          />
        )}
      </div>
    </div>
  );
};

export default TemplateShareSubscribe;
