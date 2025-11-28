import { Dialog } from "primereact/dialog";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setToastAction,
} from "../../../store/actions/appActions";
import { Button } from "primereact/button";
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle";
import fetchApi, { API_URL } from "../../../helpers/fetchApi";
import { InputText } from "primereact/inputtext";
import { useIntl } from "react-intl";
import { useForm } from "../../../hooks/useForm";
import axios from "axios";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from "primereact/dropdown";
const initialForm = {
  // NIF: "",
  customer_name: "",
  customer_TIN: "",
  customer_address: "",
  phone: "",
  customer_type: null,
  statut_juridique: "",
  contact_personne: "",
};
export default function AddClientPage({ visible, setVisible, fetchSalle }) {

  const intl = useIntl();
  const dispacth = useDispatch();
  const [data, handleChange, setData, setValue] = useForm(initialForm);

  const [loadingName, setLoadingName] = useState(false);
  const checkNif = async () => {
    if (!data.customer_TIN) return; // Ne pas effectuer de requête si le champ NIF est vide

    try {
      setLoadingName(true);
      const response = await fetchApi(`/api/clientObr`, {
        method: "POST",
        body: JSON.stringify({
          nif: data.customer_TIN,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Mettre à jour le champ "Nom" avec le résultat de l'API
      setData((prevData) => ({
        ...prevData,
        customer_name: response.result?.taxpayer[0]?.tp_name || "",
      }));

      console.log(response.result?.taxpayer[0]?.tp_name, "Nom récupéré depuis l'API");
    } catch (error) {
      console.log(error);
      setData((prevData) => ({
        ...prevData,
        customer_name: error.msg,
      }));
    } finally {
      setLoadingName(false);
    }
  };

  // useEffect(() => {
  //   checkNif();
  // }, [checkNif]);


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
      // customer_TIN: {
      //   required: true,
      // },
      customer_address: {
        required: true,
      },
      phone: {
        required: true,
      }
    },
    {
      customer_name: {
        required: "champ obligatoire",
      },
      // customer_TIN: {
      //   required: "champ obligatoire",
      // },
      customer_address: {
        required: "champ obligatoire",
      },
      phone: {
        required: "champ obligatoire",
      }
    }
  );

  const type = [{
    name: "Particulier",
    code: 1
  }, {
    name: "Entreprise",
    code: 2
  },]

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (isValidate()) {
        setIsSubmitting(true);
        const form = new FormData();
        form.append("customer_name", data.customer_name);
        form.append("customer_TIN", data.customer_TIN);
        form.append("NIF", data.NIF);
        form.append("customer_address", data.customer_address);
        form.append("phone", data.phone);
  form.append("customer_type", data.customer_type?.code);
        form.append("statut_juridique", data.statut_juridique);
        form.append("contact_personne", data.contact_personne);
         

        await fetchApi("/api/client", {
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
        header="Client"
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
                    Type client
                  </label>
                </div>
                <div className="col-sm col-md-12">
                  <Dropdown
                    value={data.customer_type}
                    options={type}
                    onChange={(e) => setValue("customer_type", e.value)}
                    optionLabel="name"
                    id="customer_type"
                    filter
                    filterBy="name"
                    placeholder="Type.."
                    emptyFilterMessage="aucun element"
                    emptyMessage="aucun element"
                    name="customer_type"
                    // onHide={() => {
                    //   checkFieldData({ target: { name: "ID_TARGET_TYPE" } });
                    // }}
                    className={`w-100 ${hasError("customer_type") ? "p-invalid" : ""
                      }`}
                    showClear
                  />
                </div>
                <div
                  className="invalid-feedback"
                  style={{ minHeight: 21, display: "block" }}
                >
                  {hasError("customer_type") ? getError("customer_type") : ""}
                </div>
              </div>
            </div>
            {/* si type du client = 2 (entreprise) */}

            {
              data?.customer_type && data?.customer_type.code == 2 && (
                <>

                  <div className="form-group col-sm col-md-6">
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="DESCRIPTION" className="label mb-1">
                          {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                          NIF
                        </label>
                      </div>

                      <div className="col-sm col-md-8">
                        <InputText
                          type="text"
                          // name="description.."
                          id="customer_TIN"
                          name="customer_TIN"
                          value={data.customer_TIN}
                          onChange={handleChange}
                          onBlur={checkFieldData}
                          className={`w-100 is-invalid ${hasError("customer_TIN") ? "p-invalid" : ""
                            }`}
                        />
                        <div
                          className="invalid-feedback"
                          style={{ minHeight: 21, display: "block" }}
                        >
                          {hasError("customer_TIN") ? getError("customer_TIN") : ""}
                        </div>
                      </div>
                      <Button
                        type="button"
                        icon="pi pi-search"
                        className="col-sm col-md-2"
                        onClick={checkNif}
                        style={{ height: "48px" }}
                        disabled={loadingName || !data.customer_TIN}
                      />
                    </div>
                  </div>

                  {/* <div className="form-group col-sm col-md-6">
                    <div className="row">
                      <div className="col-md-12">
                        <label htmlFor="DESCRIPTION" className="label mb-1">
                          Numero
                        </label>
                      </div>

                      <div className="col-sm col-md-12">
                        <InputText
                          type="text"
                          id="customer_TIN"
                          name="customer_TIN"
                          value={data.customer_TIN}
                          onChange={handleChange}
                          onBlur={checkFieldData}
                          className={`w-100 is-invalid ${hasError("customer_TIN") ? "p-invalid" : ""
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
                  </div> */}
                </>
              )
            }
            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Nom
                    {
                      loadingName && <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                    }

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
                    className={`w-100 is-invalid ${hasError("customer_name") ? "p-invalid" : ""
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
            {
              data?.customer_type && data?.customer_type.code == 2 && (
                <>
             <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="statut_juridique" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Statut Juridique
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="statut_juridique"
                    name="statut_juridique"
                    value={data.statut_juridique}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${hasError("statut_juridique") ? "p-invalid" : ""
                      }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("statut_juridique") ? getError("statut_juridique") : ""}
                  </div>
                </div>
              </div>
            </div>
            </>)}
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
                    className={`w-100 is-invalid ${hasError("phone") ? "p-invalid" : ""
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
                    id="customer_address"
                    name="customer_address"
                    value={data.customer_address}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${hasError("customer_address") ? "p-invalid" : ""
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
 {
              data?.customer_type && data?.customer_type.code == 2 && (
                <>
            <div className="form-group col-sm col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Personne de contact
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="contact_personne"
                    name="contact_personne"
                    value={data.contact_personne}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${hasError("contact_personne") ? "p-invalid" : ""
                      }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("contact_personne") ? getError("contact_personne") : ""}
                  </div>
                </div>
              </div>
            </div>
</>)}
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
              style={{ color: "#14162e" }}
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
