import { setToastAction } from "../../store/actions/appActions";
import Bg from "../../../public/images/perso_bg.png";
import folderImg from "../../../public/images/numerisation/best-2.png";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import configurations from "../../config/configurations";
import { LOGIN } from "../../store/actions/numerisation_action";
import fetchApi from "../../helpers/fetchApi";
import { jwtDecode } from "jwt-decode";
import { userSelector } from "../../store/selectors/userSelector";
import { setUserAction } from "../../store/actions/userActions";

const LoginPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [visiblePassowrd, setVisiblePassword] = useState(false);

  const initialForm = {
    password: "",
    email: "",
  };

  // GAGE  TOKEN IN SESSION LOCALS STORAGE
  const setSession = (serviceToken) => {
    if (serviceToken) {
      localStorage.setItem("ServiceToken", serviceToken);
    } else {
      localStorage.removeItem("ServiceToken");
    }
  };

  // Authentification fonction
  const Authentification = async (credentialsLogin) => {
    setSession(null);
    await fetchApi("/auth/login", {
      method: "POST",
      body: credentialsLogin,
    })
      .then((response) => {
        setIsSubmitting(false);

        const currentData = response?.result;
        const token = currentData.token;
        setSession(token);
        const decoded = jwtDecode(token);
        const { user, access, shiftInterval } = decoded;
     
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("roles", JSON.stringify(access));
        localStorage.setItem("shift",JSON.stringify(shiftInterval))
        localStorage.setItem("ServiceToken", JSON.stringify(token));
        dispatch(setUserAction(user));
      
        dispatch(
          setToastAction({
            severity: "success",
            summary: "Connexion reussie",
            detail: response.message,
            life: 7000,
            position: "top-right",
          })
        );
        dispatch({
          type: LOGIN,
          payload: {
            isLoggedIn: true,
            user,
          },
        });
        // navigate(configurations.defaultPath, { replace: true });
        navigate("/traitement", { replace: true });
      })
      .catch((error) => {
        setIsSubmitting(false);

        if (error.code === "ERR_NETWORK") {
          dispatch(
            setToastAction({
              severity: "error",
              summary: "Vérifie votre réseau..",
              detail: error?.message,
              life: 5000,
            })
          );
        } else {
          setIsSubmitting(false);
          dispatch(
            setToastAction({
              severity: "error",
              summary: "Erreurs d'authentification",
              detail: error?.message,
              life: 5000,
            })
          );
        }
      });
  };

  const validateSchema = Yup.object().shape({
    email: Yup.string()
      .email(`${intl.formatMessage({ id: "required-email-validate" })}`)
      .required(`${intl.formatMessage({ id: "required-field" })}`),
    password: Yup.string()
      .trim()
      .required(`${intl.formatMessage({ id: "required-field" })}`),
  });

  const formik = useFormik({
    initialValues: initialForm,
    validationSchema: validateSchema,
    enableReinitialize: true,
    onSubmit: async (data) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("NOM_UTILISATEUR", data.email);
        formData.append("MOT_DE_PASSE", data.password.trim());
        Authentification(formData);
      } catch (error) {
        setIsSubmitting(false);
        if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
          setIsSubmitting(false);

          console.log(error.res);
        } else if (error.httpStatus == "NOT_FOUND") {
          setIsSubmitting(false);
          console.log("net", error);
          dispatch(
            setToastAction({
              severity: "error",
              summary: "Network error",
              detail: error?.response?.data?.message,
              life: 5000,
            })
          );
        } else {
          console.log("TYPE ERROR ==<>", error);
          setIsSubmitting(false);
          dispatch(
            setToastAction({
              severity: "error",
              summary: intl.formatMessage({ id: "error-system" }),
              detail: error?.response?.data?.message,
              life: 5000,
            })
          );
        }
      }
    },
  });

  useEffect(() => {
    // Disable scrolling on mount
    document.body.style.overflow = "hidden";

    // Re-enable scrolling on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div
        className="p-5 row"
        style={{
          background: `url(${Bg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          zIndex: "999",
          height: "125vh",
        }}
      >
        <div className="col-md-3 m-3" />
        <div className="col-md-5" style={{ margin: "30px" }}>
          <Card
            className="p-shadow-5 p-justify-center rounded-0"
            style={{
              minHeight: "400px",
              minWidth: "300px",
              overflow: "hidden",
            }}
          >
            

            <div className="p-d-flex p-flex-column mt-5">
              <div className="w-100 d-flex  justify-content-center">
                <label className="text-center" style={{ fontWeight: "700" }}>
                  <h4>{intl.formatMessage({ id: "login_connexion" })}</h4>
                </label>
              </div>
            </div>

            <div className="w-100 d-flex align-items-center justify-content-center bg-white">
              <form
                action=""
                method="POST"
                className="form w-75"
                onSubmit={formik.handleSubmit}
              >
                <div className="form-group w-100">
                  <label htmlFor="NOM_UTILISATEUR" className="label mb-1">
                    {`${intl.formatMessage({ id: "email"})}`}
                  </label>
                  <div className="col-sm">
                    <InputText
                      type="text"
                      placeholder="Nom d'utilisateur"
                      id="email"
                      name="email"
                      value={formik.values.email}
                      style={{ borderRadius: "0px" }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-100 is-invalid ${
                        formik.errors.email ? "p-invalid" : ""
                      }`}
                    />
                    <div
                      className="invalid-feedback"
                      style={{ minHeight: 0, display: "block" }}
                    >
                      {formik.errors.email ? formik.errors.email : ""}
                    </div>
                  </div>
                </div>
                <div className="form-group w-100 mt-3">
                  <label htmlFor="MOT_DE_PASSE" className="label mb-1">
                    {/* {`${intl.formatMessage({ id: "password" })}`} */}
                    Mot de passe
                  </label>
                  <div className="col-sm">
                    <span className="p-input-icon-right w-100">
                      <InputText
                        type={visiblePassowrd ? "text" : "password"}
                        style={{ borderRadius: "0px", width: "100%" }}
                        placeholder={`Mot de passe`}
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-100 is-invalid ${
                          formik.errors.password ? "p-invalid" : ""
                        }`}
                      />
                      {!visiblePassowrd ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-eye cursor-pointer"
                          viewBox="0 0 16 16"
                          onClick={() => setVisiblePassword((b) => !b)}
                        >
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-eye-slash cursor-pointer"
                          viewBox="0 0 16 16"
                          onClick={() => setVisiblePassword((b) => !b)}
                        >
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                        </svg>
                      )}
                    </span>
                    <div
                      className="invalid-feedback"
                      style={{ minHeight: 0, display: "block" }}
                    >
                      {formik.errors.password ? formik.errors.password : ""}
                    </div>
                  </div>
                </div>
                {/* <Link
                  to="/email-verification"
                  className="d-block text-decoration-none my-3 text-right"
                >
                  {`${intl.formatMessage({ id: "forgot-password" })}`}
                </Link> */}
                <center>
                  <Button
                    label="Se connecter"
                    icon={
                      isSubmitting ? `pi pi-spin pi-spinner` : `pi pi-sign-in`
                    }
                    type="submit"
                    className="center rounded-0 mt-3"
                    severity="info"
                    size="small"
                    disabled={isSubmitting}
                  />
                </center>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
