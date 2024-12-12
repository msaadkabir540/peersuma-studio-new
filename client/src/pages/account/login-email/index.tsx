import { useState } from "react";
import { useForm } from "react-hook-form";

import Input from "@/components/input";
import ScreenContainer from "../screen";
import Button from "@/components/button";
import SuccessModal from "../success-modal";

import { userLoginByEmailContact } from "@/api-services/users";

import createNotification from "@/common/create-notification";

import peersumaLogo from "@/assets/peersumaLogo.png";

import styles from "./index.module.scss";

interface LoginEmailInterface {
  emailNumber: string;
}

const LoginEmail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginEmailInterface>({
    defaultValues: {
      emailNumber: "",
    },
  });

  const [isLinkSend, setIsLinkSend] = useState(false);

  const onSubmit = async (data: LoginEmailInterface) => {
    const loginByEmailContact = {
      emailContact: data?.emailNumber,
      loginSide: "peersuma.studio",
    };
    const res = await userLoginByEmailContact({ data: loginByEmailContact });

    if (res?.status === 200) {
      setIsLinkSend(true);
    } else {
      createNotification("error", res?.data?.message || "Failed To Login.", 5000);
    }
  };

  return (
    <>
      <ScreenContainer>
        <form className={styles.formClass} onSubmit={handleSubmit(onSubmit)} id="clientForm">
          <div className={styles.activeTab}>
            <div className={styles.logoDiv}>
              <img src={peersumaLogo} alt="" />
              <div>
                <div className={styles.headingDiv}>Login</div>
                <div className={styles.textDiv}>Get into your account</div>
              </div>
            </div>
            {isLinkSend ? (
              <SuccessModal
                heading="Verification Link Sent"
                successMessage="Access your account through the link that has been sent to your email and contact number"
              />
            ) : (
              <>
                <div className={styles.inputContainer}>
                  <Input
                    required
                    type="text"
                    name="emailNumber"
                    register={register}
                    placeholder="Enter your email or phone number"
                    errorMessage={errors?.emailNumber?.message}
                  />
                </div>
                <div className={styles.loginButtonContainer}>
                  <Button
                    type="submit"
                    title={"Next"}
                    isLoading={isSubmitting}
                    loaderClass={styles.loaderClassAut}
                    titleClass={styles.titleTextClass}
                    className={`${styles.btn} ${styles.btnClassCommon}`}
                  />
                </div>
              </>
            )}
          </div>
        </form>
      </ScreenContainer>
    </>
  );
};

export default LoginEmail;
