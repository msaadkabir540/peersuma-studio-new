import { useNavigate } from "react-router-dom";

import styles from "./index.module.scss";

type WidgetVideoCardInterface = {
  _id: string;
  name: string;
  description: string;
  videoUrl: string;
};

const WidgetVideoCard: React.FC<WidgetVideoCardInterface> = ({
  _id,
  name,
  description,
  videoUrl,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.cardContainer}>
      <div className={styles.videoIframeContainer}>
        <iframe
          src={`https://player.vimeo.com/video/${videoUrl?.split("/")?.[3]}?h=${videoUrl
            ?.split("/")
            .pop()}&title=0&amp;byline=0&amp;portrait=0&amp;autoplay=0&amp;loop=0`}
          frameBorder="0"
          width="95%"
          height="100%"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="New Digital Media Class at Amity Middle School Orange"
          data-ready="true"
        ></iframe>
      </div>
      <div className={styles.cardDetails}>
        <h4 aria-hidden="true" onClick={() => navigate(`/play?id=${_id}`)}>
          {name}
        </h4>
        <span>{description}</span>
      </div>
    </div>
  );
};

export default WidgetVideoCard;
