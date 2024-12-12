import { writeText } from "clipboard-polyfill";
import createNotification from "@/common/create-notification";

import linkIcon from "@/assets/link.svg";
import editIcon from "@/assets/edit-blue.svg";

import styles from "../index.module.scss";

type ShortLinkType = {
  shortLink: string;
  handleSetEditShortLink: () => void;
};

const ShortLink: React.FC<ShortLinkType> = ({ shortLink, handleSetEditShortLink }) => {
  return (
    <div className={styles.shortLinkOuter}>
      <div className={styles.label}>
        <label htmlFor="videoUrl">Short URL</label>
        <div
          aria-hidden="true"
          className={styles.editContainer}
          onClick={() => {
            handleSetEditShortLink();
          }}
        >
          <img src={editIcon} alt="edit-icon" />
        </div>
      </div>
      {shortLink && (
        <div className={styles.shortLinkContainer}>
          <a href={shortLink} target="_blank" rel="noreferrer">
            {shortLink}
          </a>
          <div className={styles.linkContainer}>
            <img
              aria-hidden="true"
              src={linkIcon}
              alt="link-icon"
              onClick={() => {
                writeText(shortLink);
                createNotification("success", "Short link copied to clipboard");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default ShortLink;
