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
import axios from "axios";
import API_URL from "../../../constants/API_URL";


const initialForm = {
    name: "",
};

export default function EditUnitPage({ setElementEdit, elementEdit, visibleModal, setVisibleModal, fetchUnites }) {

    const intl = useIntl();
    const dispacth = useDispatch();
  
    const [data, handleChange, setData, setValue] = useForm(initialForm);


    useEffect(() => {
        setData({
            name: elementEdit?.name,
        })
    },[elementEdit])
    
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
                await fetchApi(`/api/unites/${elementEdit?.id}`, {
                    method: "PUT",
                    body: form,
                });
                dispacth(
                    setToastAction({
                        severity: "success",
                        summary: `Modification`,
                       
                        life: 3000,
                    })
                );
                fetchUnites();
                setVisibleModal(false)
            } else {
                setErrors(getErrors());
                console.log(getErrors());

                dispacth(
                    setToastAction({
                        severity: "error",
                        summary: `${intl.formatMessage({ id: "toast.validationError" })}`,
                        detail: `${intl.formatMessage({
                            id: "toast.DetailvalidationError",
                        })}`,
                        life: 3000,
                    })
                );
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
                header="Unité"
                visible={visibleModal}
                position={"top"}
                style={{ width: "45vw" }}
                onHide={() => {
                    if (!visibleModal) return;
                    setVisibleModal(false);
                }}
                draggable={false}
                resizable={false}
            >
                <form className="form w-100 mt-5" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="form-group col-sm col-md-12">
                            <div className="row">
                                <div className="col-md-12">
                                    <label htmlFor="name" className="label mb-1">
                                        {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                                        Nom
                                    </label>
                                </div>

                                <div className="col-sm col-md-12">
                                    <InputText
                                        type="text"
                                        placeholder="Nom.."
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        onBlur={checkFieldData}
                                        className={`w-100 is-invalid ${hasError("name") ? "p-invalid" : ""
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
                            <div className="row"></div>
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
                                      label="Modifier"
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
