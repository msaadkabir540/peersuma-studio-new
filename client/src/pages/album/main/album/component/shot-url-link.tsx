import { writeText } from "clipboard-polyfill";
import createNotification from "@/common/create-notification";

import linkIcon from "@/assets/link.svg";
import editIcon from "@/assets/edit-blue.svg";

import styles from "../index.module.scss";

type ShotLinkType = {
  shotUrl: string;
  handleSetEditAlbumShotLink: () => void;
};

const ShotUrlLink: React.FC<ShotLinkType> = ({ shotUrl, handleSetEditAlbumShotLink }) => {
  const shortAlbumLink = encodeURI(`${import.meta.env.VITE_ALBUM_SHORT_URL_BASE}${shotUrl}`);
  return (
    <div className={styles.shortLink}>
      <div className={styles.label}>
        <label htmlFor="videoUrl">Short URL</label>
        <div
          aria-hidden="true"
          className={styles.editContainer}
          onClick={() => {
            handleSetEditAlbumShotLink();
            // setEditAlbumShortLink(true);
          }}
        >
          <img src={editIcon} width={24} height={24} alt="edit-icon" />
        </div>
      </div>
      {shotUrl && (
        <div className={styles.linkContainer}>
          <div> Invite non-users to contribute by sharing</div>
          <a
            className={styles.shareLink}
            href={shortAlbumLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            this link
          </a>
          <img
            style={{ cursor: "copy" }}
            src={linkIcon}
            alt="link-icon"
            aria-hidden="true"
            onClick={() => {
              writeText(shortAlbumLink);
              createNotification("success", "Short link copied to clipboard");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ShotUrlLink;
