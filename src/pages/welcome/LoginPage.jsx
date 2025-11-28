import "../../styles/welcome/login.css"
import { InputText } from 'primereact/inputtext';
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import { Button } from "primereact/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToastAction } from "../../store/actions/appActions";
import Loading from "../../components/app/Loading";
import fetchApi from "../../helpers/fetchApi";
import { setUserAction } from "../../store/actions/userActions";
import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [data, handleChange] = useForm({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const intl = useIntl()
  const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
    username: {
      required: true,
      length: [1, 200]
    },
    password: {
      required: true
    },
  }, {
    username: {
      required: intl.formatMessage({ id: "CourseEditPage.required" }),
      length: intl.formatMessage({ id: "Corp_corporatePageAdd.Email_invalide" })
    },
    password: {
      required: intl.formatMessage({ id: "CourseEditPage.required" })
    },
  })
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!isValidate()) return false
      setLoading(true)
      setErrors({})
      const form = new FormData()
      form.append("username", data.username)
      form.append("password", data.password)
      const res = await fetchApi("/api/login", {
        method: 'POST',
        body: form
      })
      const user = res.result
      dispatch(setUserAction(user))
      localStorage.setItem('user', JSON.stringify(user))
      navigate("/")
      // dispatch(setToastAction({ severity: 'success', summary: intl.formatMessage({ id: "LoginPage.Vous_êtes_connecté" }), detail: intl.formatMessage({ id: "LoginPage.Vos_identifiants_sont_corrects" }), life: 3000, position: 'top-left' }))
    } catch (error) {
      console.log(error)
      if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
        setErrors(error.result)
      } else if (error.httpStatus == "NOT_FOUND") {
        dispatch(setToastAction({ severity: 'error', summary: intl.formatMessage({ id: "LoginPage.Identifiants_incorrent" }), detail: intl.formatMessage({ id: "LoginPage.Vérifier_votre_email_ou_mot_de_passe" }), life: 3000 }));
      } else {
        dispatch(setToastAction({ severity: 'error', summary: intl.formatMessage({ id: "LoginPage.Erreur_du_système" }), detail: intl.formatMessage({ id: "LoginPage.Erreur_du_système,_réessayez_plus_tard" }), life: 3000 }));
      }
    } finally {
      setLoading(false)
    }
  }
  const [visiblePassowrd, setVisiblePassword] = useState(false)
  const styles = `
          body {
                    overflow-y: scroll !important
          }
          `
  return (
    <>
      <style>{styles}</style>
      {loading && <Loading />}
      <div className="" style={{ backgroundColor: '#eff3f8' }}>
        <div className="container">
          <div className="d-flex justify-content-center">
            <div className="w-50 d-flex justify-content-center bg-white flex-column relative py-6 form_left rounded">
              <div className="align-self-center w-75 d-flex align-items-center flex-column form_left_container">
                <div className="d-flex align-items-center">
                 
                  <div className="block ml-2">
                    <h5 className="mb-1">Authentification</h5>
                  </div>
                </div>
                <form action="" method="POST" className="form w-100" onSubmit={handleSubmit}>
                  {/* <h1 className="mb-0">{intl.formatMessage({ id: "LoginPage.Se_connecter" })}</h1> */}
                  <div className="form-group w-100">
                    <label htmlFor="username" className="label mb-1">Nom d'utilisateur</label>
                    <div className="col-sm">
                      <InputText type="text" placeholder="Nom d'utilisateur" id="username" name="username" value={data.username} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('username') ? 'p-invalid' : ''}`} />
                      <div className="invalid-feedback" style={{ minHeight: 0, display: 'block' }}>
                        {hasError('username') ? getError('username') : ""}
                      </div>
                    </div>
                  </div>
                  <div className="form-group w-100 mt-3">
                    <label htmlFor="password" className="label mb-1">Mot de passe </label>
                    <div className="col-sm">
                      <span className="p-input-icon-right w-100">
                        <InputText type={visiblePassowrd ? "text" : "password"} placeholder="Mot de passe" id="password" name="password" value={data.password} onChange={handleChange} onBlur={checkFieldData} className={`w-100 is-invalid ${hasError('password') ? 'p-invalid' : ''}`} />
                        {!visiblePassowrd ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye cursor-pointer" viewBox="0 0 16 16" onClick={() => setVisiblePassword(b => !b)}>
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                        </svg> :
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash cursor-pointer" viewBox="0 0 16 16" onClick={() => setVisiblePassword(b => !b)}>
                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                          </svg>}
                      </span>
                      <div className="invalid-feedback" style={{ minHeight: 0, display: 'block' }}>
                        {hasError('password') ? getError('password') : ""}
                      </div>
                    </div>
                  </div>
                  {/* <a href="/forgetpwd" ></a> */}
                  <Link to={"#"} className="d-block text-decoration-none my-3 text-right">
                      Mot de passe oublié
                  </Link>
                  <Button label="Se connecter" style={{background:"#4156d1d7"}} className="w-100" disabled={!isValidate()} loading={loading} />
                </form>
              </div>
            </div>
            <div className="psr-collage  d-flex align-items-center justify-content-center" style={{ borderLeftWidth: 0.5, borderLeftColor: '#c4c4c4' }}>
             
            </div>
          </div>
        </div>
      </div>
    </>
  )
}