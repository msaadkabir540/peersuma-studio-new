import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "@/custom-hook/debounce";

import Input from "@/components/input";
import Modal from "@/components/modal";
import Button from "@/components/button";
import createNotification from "@/common/create-notification";

import { widgetEmailSend } from "@/api-services/widget";
import { userByEmailOrNumber } from "@/api-services/users";

import { TryNowFormInterface, TryNowModalInterface, defaultFormValues } from "./try-now-interface";

import styles from "./index.module.scss";

const TryNowModal = ({
  clientId,
  openModal,
  widgetName,
  buttonColor,
  setOpenModal,
  buttonTextColor,
}: TryNowModalInterface) => {
  const { watch, register, handleSubmit, setValue, reset } = useForm<TryNowFormInterface>({
    defaultValues: defaultFormValues,
  });
  const [isForm, setIsForm] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = ({ value }: { value: string }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return true;
    }
    return false;
  };

  const checkValidNumber = ({ value }: { value: string }) => {
    // Check if the input is a phone number with country code for Pakistan, USA, or Canada
    const phoneRegex = /^(\+?(92|1))?([1-9]\d{9})$/;
    if (phoneRegex.test(value)) {
      return true;
    }
    if (value === undefined) {
      return true;
    }
    return false;
  };

  const onSubmit = async () => {
    setIsLoading(true);

    const email = watch("email");
    const contactNumberData = watch("contactNumber");

    const isValid = validateEmailOrPhoneNumber({ value: email });
    const isNumber = checkEmailContact({ emailContact: contactNumberData });
    const emailContactNumber = isNumber && contactNumberData?.replace(/[^0-9]/g, "")?.slice(-10);

    const emailData = {
      ...watch(),
      widgetName,
      clientId,
      contactNumber: contactNumberData?.replace(/[^0-9]/g, "")?.slice(-10),
    };

    if (isValid && emailContactNumber) {
      try {
        setErrorMessage("");
        const resp = await widgetEmailSend({ data: emailData });
        if (resp.status === 200) {
          createNotification("success", resp.data.msg);
          setOpenModal(false);
          setIsLoading(false);
          reset();
        } else {
          setIsLoading(false);
          createNotification("error", resp.data?.msg);
          // setOpenModal(false);
          setErrorMessage(resp.data?.msg);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      if (!isValid) {
        setErrorMessage("Enter Valid Email");
        setIsLoading(false);
      } else if (!isNumber) {
        setErrorMessage("Enter Valid Contact Number");
        setIsLoading(false);
      }
    }
  };

  const debouncedFindUser = useDebounce({ value: inputValue, milliSeconds: 2000 });

  const validateEmailOrPhoneNumber = ({ value }: { value: string }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return true;
    }

    return false;
  };

  const checkEmailContact = useCallback(({ emailContact }: { emailContact: string }) => {
    if (emailContact === "") {
      return false;
    }
    const email = emailContact || "";
    const regex = /^[0-9()\-+]+$/;
    const checkEmail = regex.test(email);

    return !email.includes("@") && checkEmail;
  }, []);

  const handleCallApi = async ({ userValue }: { userValue: string }) => {
    const isValid = validateEmailOrPhoneNumber({ value: userValue });

    const isNumber = checkEmailContact({ emailContact: userValue });
    const emailContactNumber = isNumber
      ? userValue?.replace(/[^0-9]/g, "")?.slice(-10)
      : isValid
        ? userValue
        : "";

    if (emailContactNumber) {
      try {
        setErrorMessage("");
        setIsLoading(true);
        const res = await userByEmailOrNumber({ searchTerm: emailContactNumber });
        if (res.status === 200) {
          setValue?.("contactNumber", res?.data?._doc?.contactNumber);
          setValue?.("email", res?.data?._doc?.email);
          setIsDisable(false);
          setIsForm(false);
          setIsLoading(false);
        } else if (res.status === 404) {
          setValue?.("contactNumber", "");
          setValue?.("email", "");
          setIsDisable(false);
          setIsForm(true);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    } else {
      setIsLoading(false);
      if (userValue.includes("@")) {
        setErrorMessage("Enter Valid Email");
      } else {
        setErrorMessage("Enter valid 10-digit number");
      }
    }
  };

  useEffect(() => {
    if (debouncedFindUser != "") handleCallApi({ userValue: debouncedFindUser });
    if (debouncedFindUser === "") setIsDisable(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFindUser]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
  };

  useEffect(() => {
    if (isForm) {
      inputValue?.includes("@")
        ? setValue?.("email", inputValue)
        : setValue?.("contactNumber", inputValue);
    }
  }, [inputValue, isForm, setValue]);

  const isEmailOrNumber = inputValue?.includes("@");

  useEffect(() => {
    if (isEmailOrNumber && watch("email") === "") {
      setIsForm(false);
      setIsDisable(true);
      setValue?.("email", "");
    } else if (!isEmailOrNumber && watch("contactNumber") === "") {
      setIsForm(false);
      setIsDisable(true);
      setValue?.("contactNumber", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, isEmailOrNumber, watch("contactNumber"), watch("email")]);

  return (
    <div>
      <Modal
        {...{
          open: openModal,
        }}
        showCross={true}
        handleClose={() => setOpenModal(false)}
        className={`${styles.tryNowModal} `}
        iconClassName={styles.iconClassName}
      >
        <form onSubmit={handleSubmit(onSubmit)} className={styles.createContainer}>
          <div className={styles.heading}>Create your own video.</div>
          <div className={styles.nameFields}>
            <div className={styles.fields}>
              {!isForm && (
                <Input
                  label={"Enter Email or Phone Number *"}
                  required
                  name="name"
                  type="text"
                  onChange={handleChange}
                  className={styles.labelClass}
                  inputClass={styles.inputClass}
                  errorMessage={errorMessage}
                />
              )}

              {isForm && (
                <div className={`${styles.fields} ${styles.emailFields}`}>
                  <Input
                    isDisable={true}
                    label={isEmailOrNumber ? "Email *" : "Phone Number *"}
                    required
                    name={isEmailOrNumber ? "email" : "contactNumber"}
                    type="text"
                    register={register}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />
                  <Input
                    label={"Full Name *"}
                    required
                    name="name"
                    type="text"
                    register={register}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />

                  <Input
                    required
                    type="text"
                    name={!isEmailOrNumber ? "email" : "contactNumber"}
                    label={!isEmailOrNumber ? "Email *" : "Phone Number *"}
                    register={register}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                    errorMessage={errorMessage ? errorMessage : ""}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.btnGroup}>
            <Button
              type="submit"
              title="Submit"
              disabled={isDisable}
              isLoading={isLoading}
              titleStyles={{ color: buttonTextColor }}
              className={isDisable ? styles.disableClass : ""}
              styles={{ background: buttonColor, borderRadius: "5px" }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TryNowModal;
