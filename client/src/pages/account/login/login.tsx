import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Input from "@/components/input";
import ScreenContainer from "../screen";
import Button from "@/components/button";

import { signIn } from "@/api-services/users";

import createNotification from "@/common/create-notification";
import { addLoggedInUser, selectedClientOptions } from "@/reducers/index";

import { LoginFromInterface } from "@/interface/index";

import emailIcon from "@/assets/email.png";
import passwordIcon from "@/assets/password.svg";
import peersumaLogo from "@/assets/peersumaLogo.png";

import styles from "./index.module.scss";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFromInterface>({
    defaultValues: {
      emailContact: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFromInterface) => {
    const res = await signIn({ data });

    if (res.status === 200) {
      dispatch(addLoggedInUser({ loggedInUser: res.data }));
      res?.data?.clientId && dispatch(selectedClientOptions(res?.data?.clientId?.[0]?.clientId));
      localStorage.setItem("token", res?.data?.token);
      localStorage.setItem("user-role", res?.data?.roles[0]);
      res?.data?.roles[0] === "executive-producer" ? navigate("/album") : navigate("/");
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
            <div className={styles.inputContainer}>
              <Input
                required
                icon={emailIcon}
                iconClass={styles.iconClassAuthEmail}
                type="text"
                name="emailContact"
                register={register}
                placeholder="Type your email"
                errorMessage={errors?.emailContact?.message}
              />
              <Input
                required
                icon={passwordIcon}
                iconClass={styles.iconClassAuth}
                name="password"
                type={"password"}
                register={register}
                placeholder="Enter Password"
                errorMessage={errors?.password?.message}
              />
              <div className={styles.btnContainer}>
                <div
                  className={styles.forgetPassword}
                  onClick={() => {
                    navigate("/forgot-password");
                  }}
                >
                  Forgot Password?
                </div>
              </div>
            </div>
            <div className={styles.loginButtonContainer}>
              <Button
                type="submit"
                title={"Login"}
                isLoading={isSubmitting}
                titleClass={styles.titleTextClass}
                loaderClass={styles.loaderClassAut}
                className={`${styles.btn} ${styles.btnClassCommon}`}
              />
              {/* <Button
                handleClick={() => navigate("/sign-email")}
                title={"Login via email or phone number"}
                titleClass={styles.titleTextClassTransparent}
                className={`${styles.btnTransparent} ${styles.btnClassCommon}`}
              /> */}
            </div>
          </div>
        </form>
      </ScreenContainer>
    </>
  );
};

export default Login;
