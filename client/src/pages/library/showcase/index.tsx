import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import WidgetVideoCard from "./video-card";
import TemplateShareSubscribe from "@/pages/widgets/edit-widget/widget-templates/components/template-share-subscribe";

import { getWidgetById } from "@/api-services/widget";

import {
  RouteParamsInterface,
  ShowcaseDataInterface,
  ShowcaseResponse,
} from "./showcase-interface";

import styles from "./index.module.scss";

const Showcase: React.FC = () => {
  const { id } = useParams<RouteParamsInterface>();

  const [showCase, setShoWCase] = useState<ShowcaseResponse>({
    data: {} as ShowcaseDataInterface,
  });
  const { data } = showCase as ShowcaseResponse;

  const handleGetWidgetById = async () => {
    try {
      const res = await getWidgetById({ _id: id as string });
      if (res?.status === 200) {
        setShoWCase((prev) => ({ ...prev, data: res?.data }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id && handleGetWidgetById();
  }, [id]);

  return (
    <div className={styles.showcaseContainer}>
      <div className={styles.ShowcaseHeader}>
        <TemplateShareSubscribe widget={data} classNameModalProps={styles.showCaseModal} />

        <h1>{data?.name}</h1>
      </div>
      <div>
        <div className={styles.WidgetVideoCard} id="videoCard">
          {data?.media?.map(({ _id }, index) => <WidgetVideoCard key={index} {...{ ..._id }} />)}
        </div>
      </div>
    </div>
  );
};

export default Showcase;
