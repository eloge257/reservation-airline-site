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

const initialForm = {
    name: "",
    obr_username:"",
    obr_password: "",
    tp_type:"",
    tp_TIN:"",
    tp_trade_number:"",
    tp_postal_number: "",
    tp_phone_number:"",
    tp_address_province: "",
    tp_address_commune:"",
    tp_address_quartier:"",
    tp_address_avenue:"",
    tp_address_rue:"",
    tp_address_number:"",
    tp_activity_sector:"",
    tp_fiscal_center: "",
    tp_legal_form:"",
    // device_prefix:"",

};
export default function AddCompanyPage({ visible, setVisible, fetchSalle }) {

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
     name: {
        required: true,
      },
      obr_username:{
        required: true,
      },
      obr_password: {
        required: true,
      },
      tp_TIN:{
        required: true,
      }
    },
    {
     firstname: {
        required: "champ obligatoire",
      },
      obr_username:{
        required: "champ obligatoire",
      },
      obr_password: {
        required: "champ obligatoire",
      },
      tp_TIN:{
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
        form.append("name", data.name);
        form.append("obr_username", data.obr_username);
        form.append("obr_password", data.obr_password);
        form.append("tp_type", data.tp_type);
        form.append("tp_trade_number", data.tp_trade_number);
        form.append("tp_postal_number", data.tp_postal_number);
        form.append("tp_TIN", data.tp_TIN);
        form.append("tp_phone_number", data.tp_phone_number);
        form.append("tp_address_province", data.tp_address_province);
        form.append("tp_address_commune", data.tp_address_commune);
        form.append("tp_address_quartier", data.tp_address_quartier);
        form.append("tp_address_avenue", data.tp_address_avenue);
        form.append("tp_address_rue", data.tp_address_rue);
        form.append("tp_address_number",data.tp_address_number);
        form.append("tp_activity_sector", data.tp_activity_sector);
        form.append("tp_fiscal_center", data.tp_fiscal_center);
        form.append("tp_legal_form", data.tp_legal_form);

       await fetchApi("/api/company", {
          method: "POST",
          body: form,
        });
        dispacth(
          setToastAction({
            severity: "success",
            summary: `Enregistrement`,
            detail: ``,
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
        header="Campany"
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
            <div className="form-group col-sm col-md-3">
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
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("name") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("name") ? getError("name") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-3">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    OBR Username
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="obr_username"
                    name="obr_username"
                    value={data.obr_username}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("obr_username") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("obr_username") ? getError("obr_username") : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    OBR Mot de passe
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="password"
                    id="obr_password"
                    name="obr_password"
                    value={data.obr_password}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("obr_password") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("obr_password") ? getError("obr_password") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Type
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="tp_type"
                    name="tp_type"
                    value={data.tp_type}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("tp_type") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("tp_type") ? getError("tp_type") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-3">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    TIN
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="tp_TIN"
                    name="tp_TIN"
                    value={data.tp_TIN}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("tp_TIN") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("tp_TIN") ? getError("tp_TIN") : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group col-sm col-md-3">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Phone
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="tp_phone_number"
                    name="tp_phone_number"
                    value={data.tp_phone_number}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("tp_phone_number") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("tp_phone_number") ? getError("tp_phone_number") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Province
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="tp_address_province"
                    name="tp_address_province"
                    value={data.tp_address_province}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("tp_address_province") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("tp_address_province") ? getError("tp_address_province") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Commune
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="tp_address_commune"
                    name="tp_address_commune"
                    value={data.tp_address_commune}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("tp_address_commune") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("tp_address_commune") ? getError("tp_address_commune") : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Quartier
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="tp_address_quartier"
                    name="tp_address_quartier"
                    value={data.tp_address_quartier}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("tp_address_quartier") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("tp_address_quartier") ? getError("tp_address_quartier") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-3">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Avenue
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="tp_address_avenue"
                    name="tp_address_avenue"
                    value={data.tp_address_avenue}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("tp_address_avenue") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("tp_address_avenue") ? getError("tp_address_avenue") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-3">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Rue
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="tp_address_rue"
                    name="tp_address_rue"
                    value={data.tp_address_rue}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("tp_address_rue") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("tp_address_rue") ? getError("tp_address_rue") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-3">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    Numero adresse
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="tp_address_number"
                    name="tp_address_number"
                    value={data.tp_address_number}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("tp_address_number") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("tp_address_number") ? getError("tp_address_number") : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Fiscal
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="tp_fiscal_center"
                    name="tp_fiscal_center"
                    value={data.tp_fiscal_center}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("tp_fiscal_center") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("tp_fiscal_center") ? getError("tp_fiscal_center") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-3">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Secteur
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="tp_activity_sector"
                    name="tp_activity_sector"
                    value={data.tp_activity_sector}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("tp_activity_sector") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("tp_activity_sector") ? getError("tp_activity_sector") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Legale
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="tp_legal_form"
                    name="tp_legal_form"
                    value={data.tp_legal_form}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100  is-invalid ${
                      hasError("tp_legal_form") ? "p-invalid" : ""
                    }`}
                    style={{ height: 45 }}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 10 }}
                  >
                    {hasError("tp_legal_form") ? getError("tp_legal_form") : ""}
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
