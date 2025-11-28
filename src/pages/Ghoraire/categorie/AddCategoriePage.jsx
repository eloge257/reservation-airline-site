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
    type: "",
    description:""
};
export default function AddCategoriePage({ visible, setVisible, fetchSalle }) {

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
        type: {
        required: true,
      },
      description:{
        required: true,
      }
    },
    {
        type: {
        required: "champ obligatoire",
      },
      description:{
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
        form.append("type", data.type);
        form.append("description", data.description);
       await fetchApi("/api/categorie", {
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
        header="Catégorie"
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
        <form className="form w-100 mt-5" onSubmit={handleSubmit}>
          <div className="row">
            <div className="form-group col-sm col-md-12">
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
                    className={`w-100 is-invalid ${
                      hasError("type") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("type") ? getError("type") : ""}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group col-sm col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="DESCRIPTION" className="label mb-1">
                    {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                    Description
                  </label>
                </div>

                <div className="col-sm col-md-12">
                  <InputText
                    type="text"
                    // name="description.."
                    id="description"
                    name="description"
                    value={data.description}
                    onChange={handleChange}
                    onBlur={checkFieldData}
                    className={`w-100 is-invalid ${
                      hasError("description") ? "p-invalid" : ""
                    }`}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ minHeight: 21, display: "block" }}
                  >
                    {hasError("description") ? getError("description") : ""}
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
