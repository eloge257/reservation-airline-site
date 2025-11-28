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
    customer_name: "",
    customer_TIN:"",
    customer_address: "",
    phone:"",
};
export default function EditClientPage({ setElementEdit,elementEdit,visibleModal, setVisibleModal, fetchSalle }) {

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
     customer_name: {
        required: true,
      },
      customer_TIN:{
        required: true,
      },
      customer_address: {
        required: true,
      },
      phone:{
        required: true,
      }
    },
    {
     customer_name: {
        required: "champ obligatoire",
      },
      customer_TIN:{
        required: "champ obligatoire",
      },
      customer_address: {
        required: "champ obligatoire",
      },
      phone:{
        required: "champ obligatoire",
      }
    }
  );

useEffect(()=>{
 setData({
    customer_name: elementEdit?.customer_name,
    customer_TIN:elementEdit?.customer_TIN,
    customer_address: elementEdit?.customer_address,
    phone:elementEdit?.phone,
 })
},[elementEdit])

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (isValidate()) {
        setIsSubmitting(true);
        const form = new FormData();
        form.append("customer_name", data.customer_name);
        form.append("customer_TIN", data.customer_TIN);
        form.append("customer_address", data.customer_address);
        form.append("phone", data.phone);

       await fetchApi(`/api/client/${elementEdit?.id}`, {
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
        header="Catégorie"
        visible={visibleModal}
        position={"top"}
        style={{ width: "45vw" }}
        onHide={() => {
          if (!visibleModal) return;
          setVisibleModal(false);
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
                    id="customer_name"
                    name="customer_name"
                    value={data.customer_name}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("customer_name") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("customer_name") ? getError("customer_name") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Numero
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="customer_TIN"
                    name="customer_TIN"
                    value={data.customer_TIN}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("customer_TIN") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("customer_TIN") ? getError("customer_TIN") : ""}
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
                    id="customer_address"
                    name="customer_address"
                    value={data.customer_address}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("customer_address") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("customer_address") ? getError("customer_address") : ""}
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
