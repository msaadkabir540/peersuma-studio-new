import { stagingFieldsInterface } from "../../interface";

export const types = {
  Open_Modal: "open_modal",
  Delete_Field: "delete_field",
  Close_Modal: "close_modal",
  Set_Label_Name: "set_label_name",
  Add_Field_Stage: "add_field_stage",
};

export const reducer = (
  state: {
    count?: number;
    name?: string;
    label?: string;
    moveValue?: unknown[];
    stageModal?: boolean;
    fieldStage?: stagingFieldsInterface[];
  },
  action: {
    type: string;
    text?: string;
    value?: unknown[];
    name?: string;
    label?: string;
    moveValue?: unknown[];
    fieldType?: string;
    fieldName?: string;
    delete_id?: string;
    value_id?: string;
  },
) => {
  switch (action.type) {
    case types.Open_Modal: //"open_modal":
      return { ...state, stageModal: true };
      break;
    case types.Set_Label_Name: // "set_label_name":
      return {
        ...state,
        name: action.name,
        label: action.label,
        moveValue: action?.moveValue?.[0],
      };
      break;
    case types.Close_Modal: // "close_modal":
      return { ...state, stageModal: false };
      break;
    case types.Add_Field_Stage: // "add_field_stage":
      return {
        ...state,
        fieldStage: [
          ...(state.fieldStage as stagingFieldsInterface[]),
          {
            id: Math.random().toString(36).substring(2),
            label: action.text,
            type: action.fieldType,
            name: action.fieldName,
            value: { leftValue: [], rightValue: [] },
            //  action.value,
          },
        ],
      };
      break;
    case types.Delete_Field: // "delete_field":
      return {
        ...state,
        fieldStage: state?.fieldStage?.filter((t) => t.id !== action.delete_id),
      };
      break;
    default:
      return state;
  }
};
