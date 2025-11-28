import { Dialog } from "primereact/dialog";
import { useState } from "react";
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
import { Dropdown } from "primereact/dropdown";

const initialForm = {
    firstname: "",
    lastname:"",
    username: "",
    phone:"",
    address:"",
    type:null,

};
export default function AddEmployePages({ visible, setVisible, fetchSalle }) {

  const type = [{
    name:"Admin",
    code :"admin"
  },{
    name:"Employee",
    code :"employee"
  },]
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
        form.append("type", data.type.code);

       await fetchApi("/api/employee", {
          method: "POST",
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
        setVisible(false)
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
        visible={visible}
        position={"top"}
        style={{ width: "45vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        draggable={true}
        resizable={true}
      >
        <form className="form w-100 mt-2" onSubmit={handleSubmit}>
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
            <div className="form-group col-sm col-md-12">
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
            <div className="form-group col-sm col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Type
                  </label>
                </div>

                <div className="col-sm col-md-12">
                   <Dropdown
                                                         value={data.type}
                                                         options={type}
                                                         onChange={(e) => setValue("type", e.value)}
                                                         optionLabel="name"
                                                         id="type"
                                                         filter
                                                         filterBy="name"
                                                         placeholder="Type.."
                                                         emptyFilterMessage="aucun element"
                                                         emptyMessage="aucun element"
                                                         name="type"
                                                         // onHide={() => {
                                                         //   checkFieldData({ target: { name: "ID_TARGET_TYPE" } });
                                                         // }}
                                                         className={`w-100 ${hasError("type") ? "p-invalid" : ""
                                                             }`}
                                                         showClear
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
