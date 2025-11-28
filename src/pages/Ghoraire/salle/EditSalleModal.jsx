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
    DESCRIPTION: "",
};

export default function EditSalleModal({ setElementEdit, elementEdit, visibleModal, setVisibleModal, fetchSalle }) {

    const intl = useIntl();
    const dispacth = useDispatch();
  
    const [data, handleChange, setData, setValue] = useForm(initialForm);


    useEffect(() => {
        setData({
            DESCRIPTION: elementEdit?.DESCRIPTION,
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
            DESCRIPTION: {
                required: true,
            },
        },
        {
            DESCRIPTION: {
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
                form.append("DESCRIPTION", data.DESCRIPTION);

                await fetchApi(`/admin/salle/${elementEdit?.ID_SALLE}`, {
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
                header="Cours"
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
                                    <label htmlFor="DESCRIPTION" className="label mb-1">
                                        {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                                        Description
                                    </label>
                                </div>

                                <div className="col-sm col-md-12">
                                    <InputText
                                        type="text"
                                        placeholder="description.."
                                        id="DESCRIPTION"
                                        name="DESCRIPTION"
                                        value={data.DESCRIPTION}
                                        onChange={handleChange}
                                        onBlur={checkFieldData}
                                        className={`w-100 is-invalid ${hasError("DESCRIPTION") ? "p-invalid" : ""
                                            }`}
                                    />
                                    <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 21, display: "block" }}
                                    >
                                        {hasError("DESCRIPTION") ? getError("DESCRIPTION") : ""}
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
                            label={intl.formatMessage({ id: "utilisateurs.reinitialiser" })}
                            type="reset"
                            outlined
                            className="mt-3"
                            size="small"
                            onClick={(e) => {
                                e.preventDefault();
                                setData(initialForm);
                                setErrors({});
                            }}
                        />
                        <Button
                            label={intl.formatMessage({ id: "utilisateurs.envoyer" })}
                            type="submit"
                            className="mt-3 ml-3"
                            size="small"
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </Dialog>
        </>
    );
}
