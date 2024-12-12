import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { removeWidgetMedia } from "@/api-services/library";

import { WidgetMediaCardInterface } from "./widget-media-card-interface";

import editIcon from "@/assets/edit.svg";
import sortDown from "@/assets/sortDown.svg";
import removeIcon from "@/assets/del-icon.svg";

import styles from "./index.module.scss";

const WidgetMediaCard: React.FC<WidgetMediaCardInterface> = ({
  _id,
  name,
  order,
  widgetId,
  thumbnailUrl,
  handleMoveWidgetMediaLibrary,
  handleRemoveWidgetMediaLibrary,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleRemoveWidgetMedia = async () => {
    try {
      const res = await removeWidgetMedia({ params: { id: widgetId, mediaId: _id } });
      if (res.status === 200) {
        handleRemoveWidgetMediaLibrary({ widgetID: _id });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoveWidgetMedia = () => {
    handleMoveWidgetMediaLibrary({ order });
  };

  return (
    <>
      <div className={styles.widgetMediaContainer}>
        <div
          className={styles.widgetMedia}
          aria-hidden="true"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <img className={styles.thumbnailImg} src={thumbnailUrl} alt="" />
          <span>{name}</span>
          <img className={styles.arrow} src={sortDown} alt="sortDown" width="30px" />
        </div>
        {isOpen && (
          <div className={`${styles.dropDownBox} `}>
            <button aria-hidden="true" onClick={() => navigate(`/library/${_id}`)}>
              <img src={editIcon} alt="editIcon" /> Edit
            </button>
            <button onClick={handleRemoveWidgetMedia}>
              <img src={removeIcon} alt="removeIcon" /> Remove
            </button>
            <button onClick={handleMoveWidgetMedia}>
              <img src={sortDown} alt="sortDown" />
              Shift Down
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WidgetMediaCard;
