import { useForm } from "react-hook-form";
import "jsoneditor-react/es/editor.min.css";
import { memo, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Input from "@/components/input";
import Button from "@/components/button";
import ScreenContainer from "../screen";

import { resetPassword } from "@/api-services/users";
import createNotification from "@/common/create-notification";

import passwordIcon from "@/assets/password.svg";
import peersumaLogo from "@/assets/forgot-password.png";

import { ResetPasswordFromInterface } from "@/interface/index";

import styles from "./index.module.scss";

const ResetPassword: React.FC = () => {
  const { id = "", token = "" } = useParams<{
    id: string;
    token: string;
  }>();

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFromInterface>({
    defaultValues: {
      password: "",
      password2: "",
    },
  });

  const [showHide, setShowHide] = useState<boolean>(false);

  const navigate = useNavigate();

  const onSubmit = async (data: ResetPasswordFromInterface) => {
    const res = await resetPassword({
      id,
      data: {
        password: data.password,
      },
      token,
    });

    if (res.status === 200) navigate("/sign-in");
    else if (!res)
      createNotification("error", res?.data?.message || "Invalid link or expired.", 5000);
  };

  const passwordsMatch = useMemo(() => {
    const password = watch("password");
    const password2 = watch("password2");
    return password === password2;
  }, [watch("password"), watch("password2")]);

  return (
    <>
      <ScreenContainer>
        <form className={styles.formClass} onSubmit={handleSubmit(onSubmit)} id="clientForm">
          <div className={styles.activeTab}>
            <div className={styles.logoDiv}>
              <img src={peersumaLogo} alt="" />
              <div>
                <div className={styles.headingDiv}>Reset Password</div>
                <div className={styles.textDiv}>Create new password</div>
              </div>
            </div>
            <div className={styles.inputContainer}>
              <Input
                icon={passwordIcon}
                iconClass={styles.iconClassAuth}
                name={"password"}
                register={register}
                placeholder="Enter Password"
                type={showHide ? "text" : "password"}
                errorMessage={errors?.password?.message}
              />
              <Input
                icon={passwordIcon}
                iconClass={styles.iconClassAuth}
                name="password2"
                register={register}
                placeholder="Confirm Password"
                type={showHide ? "text" : "password"}
                errorMessage={errors?.password?.message}
              />
              <div className={styles.showPassword}>
                <div className={styles.forgetPassword}>
                  <div>
                    <input
                      type={"checkbox"}
                      onChange={() => {
                        setShowHide(!showHide);
                      }}
                    />
                  </div>
                  <div>Show Password</div>
                </div>
              </div>
            </div>

            <div className={styles.loginButtonContainer}>
              <Button
                type="submit"
                title={"Submit"}
                isLoading={isSubmitting}
                disabled={!passwordsMatch}
                loaderClass={styles.loaderClassAut}
                titleClass={styles.titleTextClass}
                className={`${styles.btn} ${styles.btnClassCommon}`}
              />
            </div>
          </div>
        </form>
      </ScreenContainer>
    </>
  );
};

export default memo(ResetPassword);
