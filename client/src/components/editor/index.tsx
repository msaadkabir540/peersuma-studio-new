import { useState, useEffect, memo } from "react";
import { Controller } from "react-hook-form";
import { Editor } from "react-draft-wysiwyg";
import {
  convertFromRaw,
  EditorState,
  RichUtils,
  ContentState,
  ContentBlock,
  DraftHandleValue,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { EditorContainerProps } from "./editor-interface";

import style from "./editor.module.scss";

const EditorContainer: React.FC<EditorContainerProps> = ({
  name,
  label,
  rules,
  control,
  className,
  labelClass,
  placeholder,
  errorMessage,
  defaultValue,
  colorPickerClass,
}) => {
  const [hasList, setHasList] = useState<boolean>(false);
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  const onEditorStateChange: (editorState: EditorState) => void = (editorState) => {
    setEditorState(editorState);
  };

  useEffect(() => {
    const contentState: ContentState = editorState.getCurrentContent();

    const hasBulletList: boolean = contentState
      .getBlockMap()
      .some((block?: ContentBlock) => block?.getType() === "unordered-list-item");

    const hasNumberList: boolean = contentState
      .getBlockMap()
      .some((block?: ContentBlock) => block?.getType() === "ordered-list-item");

    setHasList(hasBulletList || hasNumberList);
  }, [editorState]);

  const handleKeyCommand: (command: string, editorState: EditorState) => DraftHandleValue = (
    command,
    editorState,
  ) => {
    if (command === "backspace") {
      const selection = editorState.getSelection();
      const content = editorState.getCurrentContent();
      const block = content.getBlockForKey(selection.getStartKey());
      if (
        block.getType().startsWith("ordered-list-item") ||
        block.getType().startsWith("unordered-list-item")
      ) {
        if (selection.getStartOffset() === 0 && selection.getEndOffset() === 0) {
          const newContent = RichUtils.tryToRemoveBlockStyle(editorState);
          if (newContent) {
            setEditorState(EditorState.push(editorState, newContent, "change-block-type"));
            return "handled";
          }
        }
      }
    }
    return "not-handled";
  };

  useEffect(() => {
    if (defaultValue) {
      const data = defaultValue;
      Object.keys(data).length &&
        setEditorState(EditorState.createWithContent(convertFromRaw(defaultValue)));
    }
  }, []);

  return (
    <>
      {label && (
        <label
          className={`${style.label} ${labelClass}`}
          style={{ color: errorMessage ? " #ff5050" : "" }}
        >
          {label}
        </label>
      )}
      <div
        className={`${style.editor} ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          rules={rules}
          render={({ field }) => {
            return (
              <Editor
                placeholder={hasList ? "" : placeholder ? placeholder : "Enter Description"}
                editorState={editorState}
                toolbarClassName={style.edit}
                editorClassName={`${style.editorStyle} ${style.customListStyle}`}
                editorStyle={{
                  border: errorMessage ? "2px solid #ff5050" : "",
                }}
                handleKeyCommand={handleKeyCommand}
                onEditorStateChange={onEditorStateChange}
                onChange={(e) => field.onChange(e)}
                toolbar={{
                  options: [
                    "inline",
                    "blockType",
                    "fontSize",
                    "fontFamily",
                    "list",
                    "textAlign",
                    "colorPicker",
                    "link",
                    "emoji",
                    "remove",
                    "history",
                  ],
                  inline: {
                    options: [
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "monospace",
                      "superscript",
                      "subscript",
                    ],
                    bold: { className: style.borderLess },
                    italic: { className: style.borderLess },
                    underline: { className: style.borderLess },
                    strikethrough: { className: style.borderLess },
                    monospace: { className: style.borderLess },
                    superscript: { className: style.borderLess },
                    subscript: { className: style.borderLess },
                  },
                  blockType: {
                    inDropdown: true,
                    options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6", "Blockquote", "Code"],
                  },
                  fontSize: {
                    // icon: fontSize,
                    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                  },
                  fontFamily: {
                    options: [
                      "Poppins",
                      "Arial",
                      "Georgia",
                      "Impact",
                      "Tahoma",
                      "Times New Roman",
                      "Verdana",
                    ],
                  },

                  list: {
                    options: ["unordered", "ordered", "indent", "outdent"],
                    ordered: { className: style.borderLess },
                    unordered: {
                      className: style.borderLess,
                    },
                  },

                  textAlign: {
                    inDropdown: false,
                    options: ["left", "center", "right", "justify"],
                    left: { className: style.borderLess },
                    center: { className: style.borderLess },
                    right: { className: style.borderLess },
                  },
                  colorPicker: {
                    colors: [
                      "rgb(97,189,109)",
                      "rgb(26,188,156)",
                      "rgb(84,172,210)",
                      "rgb(44,130,201)",
                      "rgb(147,101,184)",
                      "rgb(71,85,119)",
                      "rgb(204,204,204)",
                      "rgb(65,168,95)",
                      "rgb(0,168,133)",
                      "rgb(61,142,185)",
                      "rgb(41,105,176)",
                      "rgb(85,57,130)",
                      "rgb(40,50,78)",
                      "rgb(0,0,0)",
                      "rgb(247,218,100)",
                      "rgb(251,160,38)",
                      "rgb(235,107,86)",
                      "rgb(226,80,65)",
                      "rgb(163,143,132)",
                      "rgb(239,239,239)",
                      "rgb(255,255,255)",
                      "rgb(250,197,28)",
                      "rgb(243,121,52)",
                      "rgb(209,72,65)",
                      "rgb(184,49,47)",
                      "rgb(124,112,107)",
                      "rgb(209,213,216)",
                    ],
                    popupClassName: colorPickerClass,
                  },
                  link: {
                    inDropdown: false,
                    showOpenOptionOnHover: true,
                    defaultTargetOption: "_self",
                    options: ["link", "unlink"],
                    link: { className: style.linkDecorator },
                    unlink: { className: style.borderLess },
                  },
                  emoji: {
                    emojis: [
                      "😀",
                      "😁",
                      "😂",
                      "😃",
                      "😉",
                      "😋",
                      "😎",
                      "😍",
                      "😗",
                      "🤗",
                      "🤔",
                      "😣",
                      "😫",
                      "😴",
                      "😌",
                      "🤓",
                      "😛",
                      "😜",
                      "😠",
                      "😇",
                      "😷",
                      "😈",
                      "👻",
                      "😺",
                      "😸",
                      "😹",
                      "😻",
                      "😼",
                      "😽",
                      "🙀",
                      "🙈",
                      "🙉",
                      "🙊",
                      "👼",
                      "👮",
                      "🕵",
                      "💂",
                      "👳",
                      "🎅",
                      "👸",
                      "👰",
                      "👲",
                      "🙍",
                      "🙇",
                      "🚶",
                      "🏃",
                      "💃",
                      "⛷",
                      "🏂",
                      "🏌",
                      "🏄",
                      "🚣",
                      "🏊",
                      "⛹",
                      "🏋",
                      "🚴",
                      "👫",
                      "💪",
                      "👈",
                      "👉",
                      "👉",
                      "👆",
                      "🖕",
                      "👇",
                      "🖖",
                      "🤘",
                      "🖐",
                      "👌",
                      "👍",
                      "👎",
                      "✊",
                      "👊",
                      "👏",
                      "🙌",
                      "🙏",
                      "🐵",
                      "🐶",
                      "🐇",
                      "🐥",
                      "🐸",
                      "🐌",
                      "🐛",
                      "🐜",
                      "🐝",
                      "🍉",
                      "🍄",
                      "🍔",
                      "🍤",
                      "🍨",
                      "🍪",
                      "🎂",
                      "🍰",
                      "🍾",
                      "🍷",
                      "🍸",
                      "🍺",
                      "🌍",
                      "🚑",
                      "⏰",
                      "🌙",
                      "🌝",
                      "🌞",
                      "⭐",
                      "🌟",
                      "🌠",
                      "🌨",
                      "🌩",
                      "⛄",
                      "🔥",
                      "🎄",
                      "🎈",
                      "🎉",
                      "🎊",
                      "🎁",
                      "🎗",
                      "🏀",
                      "🏈",
                      "🎲",
                      "🔇",
                      "🔈",
                      "📣",
                      "🔔",
                      "🎵",
                      "🎷",
                      "💰",
                      "🖊",
                      "📅",
                      "✅",
                      "❎",
                      "💯",
                    ],
                  },

                  remove: {
                    className: undefined,
                    component: undefined,
                  },
                  history: {
                    inDropdown: false,

                    options: ["undo", "redo"],
                  },
                }}
              />
            );
          }}
        />
      </div>
      {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
    </>
  );
};

export default memo(EditorContainer);
