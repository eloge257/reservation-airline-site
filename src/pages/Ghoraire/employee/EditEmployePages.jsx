import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setToastAction,
} from "../../../store/actions/appActions";
import { Button } from "primereact/button";
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle";
import fetchApi from "../../../helpers/fetchApi";
import { InputText } from "primereact/inputtext";
import { useIntl } from "react-intl";
import { useForm } from "../../../hooks/useForm";

const initialForm = {
    firstname: "",
    lastname:"",
    username: "",
    phone:"",
    address:"",
    type:"",

};
export default function EditEmployePages({setElementEdit,elementEdit, visibleModal, setVisibleModal, fetchSalle }) {

  const intl = useIntl();
  const dispacth = useDispatch();
  const [data, handleChange, setData, setValue] = useForm(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    hasError,
    getError,
    setErrors,
    getErrors,
    checkFieldData,
    isValidate,
    setError,
  } = useFormErrorsHandle(
    data,
    {
     firstname: {
        required: true,
      },
      lastname:{
        required: true,
      },
      username: {
        required: true,
      },
      phone:{
        required: true,
      }
    },
    {
     firstname: {
        required: "champ obligatoire",
      },
      lastname:{
        required: "champ obligatoire",
      },
      username: {
        required: "champ obligatoire",
      },
      phone:{
        required: "champ obligatoire",
      }
    }
  );

  useEffect(() => {
    setData({
        firstname: elementEdit?.firstname,
        lastname:elementEdit?.lastname,
        username:elementEdit?.username,
        phone:elementEdit?.phone,
        address: elementEdit?.address,
        type:elementEdit?.type
    })
  },[elementEdit])

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (isValidate()) {
        setIsSubmitting(true);
        const form = new FormData();
        form.append("firstname", data.firstname);
        form.append("lastname", data.lastname);
        form.append("username", data.username);
        form.append("phone", data.phone);
        form.append("address", data.address);
        form.append("type", data.type);
        form.append("password", 12345678);



       await fetchApi(`/api/employee/${elementEdit?.id}`, {
          method: "PUT",
          body: form,
        });
        dispacth(
          setToastAction({
            severity: "success",
            summary: `${intl.formatMessage({ id: "profil.profilEnregistre" })}`,
            detail: `${intl.formatMessage({
              id: "profil.profilEnregistreDetail",
            })}`,
            life: 3000,
          })
        );
        fetchSalle();
        setVisibleModal(false)
      }
    } catch (error) {
      console.log(error);
      if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
        setErrors(error.result);

        dispacth(
          setToastAction({
            severity: "error",
            summary: `${intl.formatMessage({
              id: "toast.problemeValidationdata",
            })}`,
            detail: `${intl.formatMessage({ id: "toast.corrigerError" })}`,
            life: 3000,
          })
        );
      
      } else {
        dispacth(
          setToastAction({
            severity: "error",
            summary: `${intl.formatMessage({ id: "toast.erreursyteme" })}`,
            detail: `${intl.formatMessage({
              id: "toast.erreursytemeRessayer",
            })}`,
            life: 3000,
          })
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        header="Employé"
        visible={visibleModal}
        position={"top"}
        style={{ width: "60vw" }}
        onHide={() => {
          if (!visibleModal) return;
          setVisibleModal(false);
        }}
        draggable={true}
        resizable={true}
      >
        <form className="form w-100 mt-2" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-12">
            <div className="row">
            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Nom
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="firstname"
                    name="firstname"
                    value={data.firstname}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("firstname") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("firstname") ? getError("firstname") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Prénom 
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="lastname"
                    name="lastname"
                    value={data.lastname}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("lastname") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("lastname") ? getError("lastname") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Username
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="username"
                    name="username"
                    value={data.username}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("username") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("username") ? getError("username") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Telephone
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="phone"
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("phone") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("phone") ? getError("phone") : ""}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Adresse
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="address"
                    name="address"
                    value={data.address}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100  is-invalid ${
                      hasError("address") ? "p-invalid" : ""
                    }`}
                    style={{ height: 45 }}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 10 }}
                  >
                    {hasError("address") ? getError("address") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Type
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="type"
                    name="type"
                    value={data.type}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100  is-invalid ${
                      hasError("type") ? "p-invalid" : ""
                    }`}
                    style={{ height: 45 }}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 10 }}
                  >
                    {hasError("type") ? getError("type") : ""}
                  </div>
                </div>
              </div>
            </div>
        
                
            </div>
            <div className="row  rounded-1 px-2 py-3" style={{background:"#ffa5a5"}}>
                <div>
                    <h4 className="" style={{color:"#bb2323"}}>
                        Danger zone
                    </h4>
                </div>
            <div className="form-group col-sm col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Ancien mot de passe
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="old_password"
                    name="old_password"
                    value={data.old_password}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("old_password") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("old_password") ? getError("old_password") : ""}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-group col-sm col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Nouveau mot de passe
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="new_password"
                    name="new_password"
                    value={data.new_password}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100  is-invalid ${
                      hasError("new_password") ? "p-invalid" : ""
                    }`}
                    style={{ height: 45 }}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 10 }}
                  >
                    {hasError("new_password") ? getError("new_password") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Confirmer mot de passe
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="confirm_password"
                    name="confirm_password"
                    value={data.confirm_password}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100  is-invalid ${
                      hasError("confirm_password") ? "p-invalid" : ""
                    }`}
                    style={{ height: 45 }}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 10 }}
                  >
                    {hasError("confirm_password") ? getError("confirm_password") : ""}
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>
          </div>
          <div
            style={{ marginTop: 30, right: 0 }}
            className="w-100 d-flex justify-content-end  pb-3  "
          >
            <Button
              label="Annuler"
              type="reset"
              outlined
              className="mt-3"
              size="small"
              style={{   color: "#14162e" }}
              onClick={(e) => {
                e.preventDefault();
                setData(initialForm);
                setErrors({});
              }}
            />
            <Button
              label="Enregistrer"
              type="submit"
              className="mt-3 ml-3"
              size="small"
              style={{ backgroundColor: "#14162e", borderColor: "#fff372", color: "#fefefe" }}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}
