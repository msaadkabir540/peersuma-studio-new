import DraftGridCard from "../draft-grid-card";

import { DraftVideoInterface } from "@/interface/video-draft-interface";

import styles from "./index.module.scss";

const CardContainer = ({ media }: { media: DraftVideoInterface[] }) => {
  return (
    <div className={styles.backgroundColor}>
      <div className={styles.cardsBody}>
        <DraftGridCard name={media[0]?.name} imageUrl={media[0]?.thumbnailUrl} />
      </div>
    </div>
  );
};

export default CardContainer;
