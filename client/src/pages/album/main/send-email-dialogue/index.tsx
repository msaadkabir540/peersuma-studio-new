import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import draftToHtml from "draftjs-to-html";
import { ContentState, EditorState, convertFromHTML, convertFromRaw, convertToRaw } from "draft-js";

import Input from "@/components/input";
import Modal from "@/components/modal";
import Button from "@/components/button";
import deleteIcon from "@/assets/delete.png";

import styles from "./index.module.scss";
import EditorContainer from "@/components/editor";
import { useSelector } from "react-redux";
import { invitationUserEmail } from "@/api-services/albumshot";
import { ClientsStateInterface } from "@/interface/user-selector-interface";
import {
  DataInterface,
  SendEmailDialogusInterface,
  SendEmailUserFieldSchema,
} from "../album-interface";
import { BodyInterface, EmailDataInterface } from "./send-email-interface";

const html = `<p data-slate-node="element"><span data-slate-node="text">Hi, Gyan!</span></p>
<p data-slate-node="element"><span data-slate-node="text">Welcome, you have been invited by District Test to collaborate on the Rafay Project project.</span></p>
<p data-slate-node="element"><span data-slate-node="text">Click on the button below to share your media to this project.</span></p>
<p data-slate-node="element">&nbsp;</p>
<div data-slate-node="element">
<div style="text-align: center;" data-slate-node="element" data-slate-void="true"><span style="color: #ffffff; background-color: #3366ff;"><a style="color: #ffffff; background-color: #3869d4;" href="{{shotUrl}}" target="_blank"><strong> <button> Upload Media </button></strong></a></span>
<div data-slate-spacer="true">&nbsp;</div>
</div>
</div>
<p data-slate-node="element"><span data-slate-node="text">Welcome aboard,</span></p>
<p data-slate-node="element"><span data-slate-node="text">The District Test team</span></p>
<div data-slate-node="element" data-slate-void="true"><hr />
<div data-slate-spacer="true">&nbsp;</div>
</div>
<p data-slate-node="element"><span data-slate-node="text">If you&rsquo;re having trouble with the button above, copy and paste the URL below into your web browser.</span></p>
<p data-slate-node="element">{{shotUrl}}</p>`;

const getLetter = (name: string | undefined) => {
  const firstLetter = name?.[0];
  const lastLetter = name?.[name?.length - 1];
  return `${firstLetter}${lastLetter}`;
};

const validateDescription = (value: BodyInterface) => {
  if (value?.blocks?.[0]?.text) {
    return true;
  }

  return "Kindly Provide Some value ";
};

const replaceTag = (key: string, data: DataInterface) => {
  const { user, client, album, currentShot } = data;
  const fullName = `${
    user?.firstName ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) : ""
  } ${user?.lastName ? user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1) : ""}`;

  const REPLACEMENTS: any = {
    "{{invitee_name}}": `${fullName}`,
    "{{client_name}}": `${client?.name}`,
    "{{project_name}}": `${album?.name}`,
    "{{client_full_name}}": `The ${client?.name} team`,
    "{{shotUrl}}": encodeURI(`${import.meta.env.VITE_ALBUM_SHORT_URL_BASE}${currentShot?.shotUrl}`),
  };

  return REPLACEMENTS[key];
};

const defaultBody = `{"blocks":[{"key":"hbt","text":"Hi, {{invitee_name}}!","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":18,"style":"fontsize-1.5em"},{"offset":0,"length":18,"style":"fontsize-18"}],"entityRanges":[],"data":{}},{"key":"3t12k","text":"Welcome, you have been invited by {{client_name}} to collaborate on the {{project_name}} project.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"b3c94","text":"Click on the button below to share your media to this project.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"bok71","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{"text-align":"center"}},{"key":"8s7ot","text":"Upload ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":7,"style":"fontsize-30"},{"offset":0,"length":6,"style":"CODE"},{"offset":0,"length":6,"style":"color-rgb(41,105,176)"}],"entityRanges":[{"offset":0,"length":6,"key":0}],"data":{"text-align":"center"}},{"key":"8fl1q","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4r0kj","text":"Welcome aboard,","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4uecs","text":"{{client_full_name}}","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"c6vpa","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8prjr","text":"If you’re having trouble with the button above, copy and paste the URL below into your web browser.","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":99,"style":"fontsize-0.75em"}],"entityRanges":[],"data":{}},{"key":"7j6g0","text":"{{shotUrl}}","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{"0":{"type":"LINK","mutability":"MUTABLE","data":{"url":"{{shotUrl}}","targetOption":"_blank"}}}}`;
// const defaultBody = `{"blocks":[{"key":"bbd9i","text":"Hi, Gyan!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4avqq","text":"Welcome, you have been invited by District Test to collaborate on the Rafay Project project.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"fraju","text":"Click on the button below to share your media to this project.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"70hen","text":" Upload Media ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":15,"style":"BOLD"}],"entityRanges":[{"offset":0,"length":15,"key":0}],"data":{}},{"key":"adbpl","text":"Welcome aboard,","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"i515","text":"The District Test team","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9uod6","text":"If you’re having trouble with the button above, copy and paste the URL below into your web browser.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"6issb","text":"{{shotUrl}}","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{"0":{"type":"LINK","mutability":"MUTABLE","data":{"href":"{{shotUrl}}","target":"_blank","url":"https://8frxg.csb.app/%7B%7BshotUrl%7D%7D"}}}}`;

const keywords = [
  "{{invitee_name}}",
  "{{client_name}}",
  "{{project_name}}",
  "{{client_full_name}}",
  "{{shotUrl}}",
];

const getBody = (body: string, data: DataInterface) => {
  let description = body;
  keywords.forEach((key) => {
    const tag = replaceTag(key, data);
    description = description?.replaceAll(key, tag);
  });
  return JSON.parse(description);
};

const SendEmailDialogue: React.FC<SendEmailDialogusInterface> = ({
  user,
  albumData,
  currentShot,
  handleClose,
  open = false,
  handleInviteAdd,
  shotCrewEmailId,
}) => {
  const { control, register, watch, setValue, handleSubmit } = useForm<SendEmailUserFieldSchema>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const { selectedClient, clients } = useSelector((state: ClientsStateInterface) => state.clients);
  const client = clients.find((client) => client._id === selectedClient);

  const name = user?.fullName || user?.firstName || user?.username;

  useEffect(() => {
    setValue("subject", `Project Invitation - ${currentShot?.shotUrl}`);
    const blocksFromHTML = convertFromHTML(html);
    const initialContentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap,
    );

    setValue("body", getBody(defaultBody, { user, client, album: albumData, currentShot }));
  }, [shotCrewEmailId]);

  const submitHandler = async (data: EmailDataInterface) => {
    try {
      setLoading(true);
      const subject = data?.subject;
      const bodyParsed = data?.body;
      const body = draftToHtml(
        convertToRaw(
          EditorState.createWithContent(convertFromRaw(bodyParsed as any)).getCurrentContent(),
        ),
      );
      const resp = await invitationUserEmail({
        subject,
        body,
        albumshotId: currentShot?._id,
        userId: user?._id,
      });
      if (resp) {
        handleInviteAdd(user?._id);

        handleClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...{
        open,
        handleClose,
      }}
      className={styles.modal}
    >
      <div className={styles.topArea}>
        <div className="user-card-container" style={{ display: "flex", alignItems: "center" }}>
          {/* Avatar */}
          <div className={styles.userIcons} style={{ order: "1" }}>
            {getLetter(name)}
          </div>
          {/* Name and Email */}
          <div className={styles.details} style={{ order: "2" }}>
            <p className={styles.name}>{`${name}`}</p>
            <p className={styles.email}>{user.email}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className={styles.body}>
          <div className={styles.field}>
            <Input name="subject" placeholder="Subject" register={register} />
          </div>

          <div className={styles.field}>
            {watch("body") && (
              <EditorContainer
                name={"body"}
                label="Description *"
                control={control}
                placeholder="Write your mail..."
                defaultValue={watch("body")}
                rules={{
                  required: {
                    value: true,
                    message: "Main body Required",
                  },
                  validate: validateDescription,
                }}
              />
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            isLoading={loading}
            type="submit"
            title="Send Email"
            styles={{ background: "#1976d2" }}
            titleStyles={{ color: "white", fontWeight: "500" }}
          />
          <Button title="Close" titleStyles={{ fontWeight: "500" }} handleClick={handleClose} />
        </div>
      </form>
    </Modal>
  );
};

export default SendEmailDialogue;
