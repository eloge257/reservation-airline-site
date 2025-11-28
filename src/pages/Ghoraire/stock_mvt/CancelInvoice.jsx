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
import axios from "axios";
import API_URL from "../../../constants/API_URL";

const initialForm = {
    name: "",
};
export default function CancelInvoice({ visible, setVisible, fetchSalle,dataItem }) {
console.log(dataItem);

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
    },
    {
        name: {
        required: "champ obligatoire",
      },
    }
  );

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (isValidate()) {
        setIsSubmitting(true);
        const form = new FormData();
        form.append("name", data.name);
        form.append("commentaire",dataItem.invoice_identifier)
     
      const insert = await axios.post(`${API_URL.LOCAL_URL}/api/cancelInvoice`,{
        commentaire:data.name,
        invoice_identifier:dataItem.invoice_identifier,
        invoiceId:dataItem.invoiceId,
        invoice_number:dataItem.invoice_number,
      })
        dispacth(
          setToastAction({
            severity: "success",
            summary: insert?.data?.message,
            life: 3000,
          })
        );
        fetchSalle();
        setVisible(false)
        setData(initialForm);
      }
    } catch (error) {
      console.log(error);
        dispacth(
          setToastAction({
            severity: "error",
            // summary: `${intl.formatMessage({ id: "toast.erreursyteme" })}`,
            detail: `Erreur du systeme`,
            life: 3000,
          })
        );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        header="Annule Facture"
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
                    Commentaire
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
