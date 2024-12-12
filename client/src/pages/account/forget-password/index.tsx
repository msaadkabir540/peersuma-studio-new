import React, { memo, useState } from "react";
import { useForm } from "react-hook-form";
import "jsoneditor-react/es/editor.min.css";
import { useNavigate } from "react-router-dom";

import Input from "@/components/input";
import ScreenContainer from "../screen";
import Button from "@/components/button";
import SuccessModal from "../success-modal";

import { forgotPassword } from "@/api-services/users";
import createNotification from "@/common/create-notification";

import { ForgotPassWordFormInterface } from "@/interface/index";

import forgotPasswordLogo from "@/assets/forgot-password.png";

import styles from "./index.module.scss";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPassWordFormInterface>({
    defaultValues: {
      email: "",
    },
  });

  const [isLinkSend, setIsLinkSend] = useState(false);

  const onSubmit = async (data: ForgotPassWordFormInterface) => {
    const res = await forgotPassword({ data: data });

    if (res.status === 200) {
      setValue("email", "");
      setIsLinkSend(true);
      createNotification("success", "Reset password link sent to email");
    } else createNotification("error", res?.data?.message || "Failed To Login.", 5000);
  };

  return (
    <>
      <ScreenContainer>
        <form className={styles.formClass} onSubmit={handleSubmit(onSubmit)} id="clientForm">
          <div className={styles.activeTab}>
            <div className={styles.logoDiv}>
              <img src={forgotPasswordLogo} alt="" />
              <div>
                <div className={styles.headingDiv}>
                  {isLinkSend ? "Link Sent" : "Forgot Password?"}
                </div>
                <div className={styles.textDiv}>
                  {isLinkSend ? "Let’s begin with your video projects!" : "Reset your password"}
                </div>
              </div>
            </div>
            {isLinkSend ? (
              <SuccessModal
                heading="Reset Password Link Sent"
                successMessage="Reset password of your account through the link that has been sent to your email and contact number"
              />
            ) : (
              <>
                <div className={styles.inputContainer}>
                  <Input
                    required
                    type="text"
                    name="email"
                    register={register}
                    placeholder="Enter your email"
                    errorMessage={errors?.email?.message}
                  />
                </div>
                <div className={styles.loginButtonContainer}>
                  <Button
                    title={"Next"}
                    type="submit"
                    className={`${styles.btn} ${styles.btnClassCommon}`}
                    titleClass={styles.titleTextClass}
                    loaderClass={styles.loaderClassAut}
                    isLoading={isSubmitting}
                  />
                  <Button
                    title={"Back to login"}
                    titleClass={styles.titleTextClassTransparent}
                    className={`${styles.btnTransparent} ${styles.btnClassCommon}`}
                    handleClick={() => navigate("/sign-in")}
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

export default memo(ForgotPassword);
