import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { writeText } from "clipboard-polyfill";
import DropZone from "@/pages/library/main/widgetList/drop-zone";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Modal from "@/components/modal";
import Radio from "@/components/radio";
import Input from "@/components/input";
import Button from "@/components/button";
import TextArea from "@/components/textarea";
import WidgetMediaCard from "../widget-media-card";
import SelectBox from "@/components/multi-select-box";

import { updateMediaReOrdering } from "@/api-services/library";

import createNotification from "@/common/create-notification";

import { DragDropResult, FromSchema, WidgetListInterface } from "./widget-list-interface";
import { LibraryMediaInterface } from "../library-interface";

import menuIcon from "@/assets/menu-icon.svg";

import styles from "./index.module.scss";

const WidgetList: React.FC<WidgetListInterface> = ({
  watch,
  library,
  control,
  handleRemove,
  handleEmbedModal,
  handelSetLibrary,
  handleSelectedWidgetId,
  handleAddWidgetMediaOrder,
  handleAddWidgetMediaNewOrder,
  handleMoveWidgetMediaLibrary,
  handleRemoveWidgetMediaLibrary,
}) => {
  const { widgets, selectedWidget, embedModal } = library as LibraryMediaInterface;

  const {
    setValue,
    register,
    watch: innerWatch,
    control: innerControl,
  } = useForm<FromSchema>({
    defaultValues: {
      size: "799",
      width: "799",
      type: "responsive",
    },
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [embedIframe, setEmbedIframe] = useState<string>("");

  const onDragEnd = async (result: DragDropResult) => {
    if (!result.destination) return;

    const updatedWidget = { ...library.selectedWidget };
    const newMedia = [...updatedWidget.media];
    const [draggedItem] = newMedia.splice(result.source.index, 1);
    newMedia.splice(result.destination.index, 0, draggedItem);

    for (let i = 0; i < newMedia.length; i++) {
      newMedia[i].order = i + 1;
    }

    // Filter out media items without a "type" property
    updatedWidget.media = newMedia?.filter((item) => item.type !== "mediaDrop");
    handelSetLibrary({ updatedWidget });

    await updateMediaReOrdering({ id: library.selectedWidget?._id, media: updatedWidget as any });
  };

  const selectedWidgetResult = selectedWidget?.media?.sort((a: any, b: any) => a.order - b.order);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    watch("selectedWidgetId") === null && handleSelectedWidgetId({ updatedWidget: undefined });
  }, [watch("selectedWidgetId")]);

  useEffect(() => {
    innerWatch("size") && setValue("width", innerWatch("size"));
  }, [innerWatch("size")]);

  useEffect(() => {
    setValue("description", iframe({ id: embedIframe, innerWatch }));
  }, [innerWatch("width"), innerWatch("type")]);

  useEffect(() => {
    setValue("description", iframe({ id: embedIframe, innerWatch }));
  }, [embedIframe]);

  return (
    <div className={`${styles.container}  ${isSticky && !embedModal ? styles.sticky : ""}`}>
      <div className={styles.selectBox}>
        <SelectBox
          showSelected
          label="Widget"
          name="selectedWidgetId"
          control={control}
          placeholder={"Select"}
          options={widgets || []}
        />
        {/* options menu */}
        {selectedWidget?.media && (
          <div className={styles.menuList}>
            <img
              src={menuIcon}
              alt="menuIcon"
              aria-hidden="true"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
              <div className={styles.dropDown}>
                <ul>
                  <li
                    aria-hidden="true"
                    onClick={() => {
                      window.open(
                        `${import.meta.env.VITE_VIDEO_PROJECT_URL}/embed/${selectedWidget?._id}`,
                        "_blank",
                      );
                      setIsOpen(!isOpen);
                    }}
                  >
                    Preview widget
                  </li>
                  <li
                    aria-hidden="true"
                    onClick={() => {
                      window.open(`/showcase/${selectedWidget?._id}`, "_blank");
                      setIsOpen(!isOpen);
                    }}
                  >
                    Showcase link
                  </li>
                  <li
                    aria-hidden="true"
                    onClick={() => {
                      setEmbedIframe(selectedWidget?._id as string);
                      handleEmbedModal({ modalValue: true });
                      embedIframe && setIsOpen(!isOpen);
                    }}
                  >
                    Embed Code
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {/* drop video here cards */}
      {watch("selectedWidgetId") && (
        <DropZone
          {...{ library }}
          handleAddWidgetMediaOrder={handleAddWidgetMediaOrder}
          handleAddWidgetMediaNewOrder={handleAddWidgetMediaNewOrder}
        />
      )}
      {/* media cards  */}

      <DragDropContext onDragEnd={onDragEnd as () => Promise<void>}>
        <Droppable droppableId="widget-media-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {selectedWidgetResult?.map(({ _id, order, type }, index) => {
                return (
                  <>
                    <div key={index}>
                      {type === "mediaDrop" && handleAddWidgetMediaNewOrder ? (
                        <>
                          <DropZone
                            order={order}
                            library={library}
                            handleRemove={handleRemove}
                            handleAddWidgetMediaOrder={handleAddWidgetMediaOrder}
                            handleAddWidgetMediaNewOrder={handleAddWidgetMediaNewOrder}
                          />
                        </>
                      ) : (
                        <Draggable key={_id?._id} draggableId={_id?._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <WidgetMediaCard
                                _id={_id?._id}
                                name={_id?.name}
                                order={order}
                                widgetId={selectedWidget?._id}
                                thumbnailUrl={_id?.thumbnailUrl}
                                handleRemoveWidgetMediaLibrary={handleRemoveWidgetMediaLibrary}
                                handleMoveWidgetMediaLibrary={handleMoveWidgetMediaLibrary}
                              />
                            </div>
                          )}
                        </Draggable>
                      )}
                    </div>
                  </>
                );
              })}
              {provided.placeholder as React.ReactNode}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* iframe modal */}
      {embedIframe !== undefined && embedIframe !== null && (
        <Modal
          open={embedModal}
          className={styles.embedCodeModal}
          bodyClass={styles.modalBody}
          handleClose={() => {
            handleEmbedModal({ modalValue: false });
          }}
        >
          <div>
            <div className={styles.modalHeading}>Embed Code</div>
            <TextArea
              rows={10}
              readOnly={true}
              name="description"
              register={register}
              placeholder={iframe({ id: embedIframe, innerWatch })}
            />
            <div className={styles.iframeControls}>
              <Radio
                name="type"
                label="Responsive"
                register={register}
                radioValue="responsive"
                className={styles.radio}
              />
              <Radio
                name="type"
                label="Fixed"
                radioValue="fixed"
                register={register}
                className={styles.radio}
              />
              {innerWatch("type") === "fixed" && (
                <SelectBox
                  name="size"
                  showSelected
                  isClearable={false}
                  isSearchable={false}
                  control={innerControl}
                  wrapperClass={styles.select}
                  options={sizeOptions || []}
                />
              )}
            </div>
            {innerWatch("type") === "fixed" && (
              <div className={styles.iframeControls}>
                <span>Width:</span>
                <Input name="width" type="number" register={register} />
                <span className={styles.pixelClass}>pixels</span>
              </div>
            )}
          </div>
          <div className={styles.modalBtnContainer}>
            <Button
              title={"Copy"}
              className={styles.btnCopy}
              handleClick={() => {
                writeText(iframe({ id: embedIframe, innerWatch }));
                createNotification("success", "Embed code copied to clipboard.");
              }}
            />
            <Button
              title={"Close"}
              handleClick={() => {
                handleEmbedModal({ modalValue: false });
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WidgetList;

const iframe = ({ id, innerWatch }: { id: string; innerWatch: any }) =>
  innerWatch("type") === "fixed"
    ? `<iframe id='W4_4' allow='encrypted-media; accelerometer; gyroscope; picture-in-picture' src='${
        import.meta.env.VITE_CLIENT_BASE_URL
      }/embed/${id}' style='width:100%; height:1160px;  max-width: ${innerWatch(
        "width",
      )}px' allowfullscreen frameborder='0' allowtransparency='true' scrolling='yes'></iframe>
<script defer>window.addEventListener('message', function(e){var this_frame = document.getElementById('W4_4');if (this_frame.contentWindow === e.source) {this_frame.height = e.data.height + 'px';this_frame.style.height = e.data.height + 'px';}})</script>`
    : `<iframe id='W4_4'  style="height:1160px" allow='encrypted-media; accelerometer; gyroscope; picture-in-picture' src='${
        import.meta.env.VITE_CLIENT_BASE_URL
      }/embed/${id}' width='100%'  allowfullscreen frameborder='0' allowtransparency='true' scrolling='yes'></iframe>
<script defer>window.addEventListener('message', function(e){var this_frame = document.getElementById('W4_4');if (this_frame.contentWindow === e.source) {this_frame.height = e.data.height + 'px';this_frame.style.height = e.data.height + 'px';}})</script>`;

const sizeOptions = [
  { label: "Extra Small", value: "480" },
  { label: "Small", value: "635" },
  { label: "Medium", value: "799" },
  { label: "Large", value: "960" },
];
