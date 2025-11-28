import { Dialog } from "primereact/dialog";
import { useCallback, useEffect, useState } from "react";
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
import API_URL from "../../../constants/API_URL";
import axios from "axios";

const initialForm = {
    categoryId: null,
    supplierId: null,
    name: "",
    price: "",
    vat_rate: "",
    description: "",
    cost: "",
    quantity: "",
    is_storable: {code:1,name:"oui"},
    unitId: null
};
export default function AddProduitPage({ visible, setVisible, fetchSalle }) {

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
            price: {
                required: true,
            }
        },
        {
            name: {
                required: "champ obligatoire",
            },
            price: {
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
                form.append("categoryId", data.categoryId?.code);
                form.append("supplierId", data.supplierId?.code);
                form.append("unitId", data.unitId?.code);
                form.append("price", data.price);
                form.append("cost", data.cost);
                form.append("quantity", data.quantity);
                form.append("vat_rate", data.vat_rate?.code);
                form.append("description", data.description);
                form.append("is_storable", data.is_storable?.code);

                await fetchApi("/api/produit", {
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

    const [categories, setCategories] = useState([]);
    const [unit, setUnit] = useState([]);
    const [fournisseur, setFournisseur] = useState([])
    const category = async () => {
        try {
            const category = await fetchApi("/api/categorie", {
                method: "GET",
            });
            setCategories(category.result.map((item) => {
                return {
                    code: item.id,
                    name: item.description
                }
            }));
        } catch (error) {
            console.log(error)
        }
    }
    const unity = async () => {
        try {
            const unit = await fetchApi("/api/unites", {
                method: "GET",
            });
            setUnit(unit.result.map((item) => {
                return {
                    code: item.id,
                    name: item.name
                }
            }));
        } catch (error) {
            console.log(error)
        }
    }
    const fetchfournisseur = useCallback(async () => {
        try {

            const response = await axios.get(`${API_URL.LOCAL_URL}/api/fournisseur`);
            setFournisseur(response.data.result.map((item) => {
                return {
                    code: item.id,
                    name: item.name
                }
            }))
        } catch (error) {
            console.log(error);
        }
    });


    useEffect(() => {
        fetchfournisseur();
    }, []);
    useEffect(() => {
        category()
        unity()
    }, [])

    const isStorable = [
        { name: "oui", code: 1 },
        { name: "non", code: 0 },
    ];

    const vat_rate = [
        { name: "0", code: 0 },
        { name: "10", code: 10 },
        { name: "18", code: 18 },
    ];

    return (
        <>
            <Dialog
                header="Catégorie"
                visible={visible}
                position={"top"}
                style={{ width: "50vw" }}
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                }}
                draggable={true}
                resizable={true}
            >
                <form className="form w-100 mt-2" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="form-group col-md-12">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="profile" className="label mb-1">
                                        Stockable ?
                                    </label>
                                </div>
                                <div className="col-sm col-md-12">
                                    <Dropdown
                                        value={data.is_storable}
                                        options={isStorable}
                                        onChange={(e) => setValue("is_storable", e.value)}
                                        optionLabel="name"
                                        id="is_storable"
                                        filter
                                        filterBy="name"
                                        placeholder="is_storable.."
                                        emptyFilterMessage="aucun element"
                                        emptyMessage="aucun element"
                                        name="is_storable"
                                        // onHide={() => {
                                        //   checkFieldData({ target: { name: "ID_TARGET_TYPE" } });
                                        // }}
                                        className={`w-100 ${hasError("is_storable") ? "p-invalid" : ""
                                            }`}
                                        showClear
                                    />
                                    <div
                                        className="invalid-feedback"
                                        style={{ minHeightN: 21, display: "block" }}
                                    >
                                        {hasError("is_storable")
                                            ? getError("is_storable")
                                            : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
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
                        </div>
                        <div className="form-group col-md-6">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="profile" className="label mb-1">
                                        Fournisseur
                                    </label>
                                </div>
                                <div className="col-sm col-md-12">
                                    <Dropdown
                                        value={data.supplierId}
                                        options={fournisseur}
                                        onChange={(e) => setValue("supplierId", e.value)}
                                        optionLabel="name"
                                        id="supplierId"
                                        filter
                                        filterBy="name"
                                        placeholder="Fournisseur.."
                                        emptyFilterMessage="aucun element"
                                        emptyMessage="aucun element"
                                        name="supplierId"
                                        // onHide={() => {
                                        //   checkFieldData({ target: { name: "ID_TARGET_TYPE" } });
                                        // }}
                                        className={`w-100 ${hasError("supplierId") ? "p-invalid" : ""
                                            }`}
                                        showClear
                                    />
                                    <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 21, display: "block" }}
                                    >
                                        {hasError("supplierId")
                                            ? getError("supplierId")
                                            : ""}
                                            {/* <h4>{data.is_storable}</h4> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            data.is_storable?.code == 1 ?
                        <>
                        <div className="form-group col-md-6">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="profile" className="label mb-1">
                                        Categorie
                                    </label>
                                </div>
                                <div className="col-sm col-md-12">
                                    <Dropdown
                                        value={data.categoryId}
                                        options={categories}
                                        onChange={(e) => setValue("categoryId", e.value)}
                                        optionLabel="name"
                                        id="categoryId"
                                        filter
                                        filterBy="name"
                                        placeholder="categoryId.."
                                        emptyFilterMessage="aucun element"
                                        emptyMessage="aucun element"
                                        name="categoryId"
                                        // onHide={() => {
                                        //   checkFieldData({ target: { name: "ID_TARGET_TYPE" } });
                                        // }}
                                        className={`w-100 ${hasError("categoryId") ? "p-invalid" : ""
                                            }`}
                                        showClear
                                    />
                                    <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 21, display: "block" }}
                                    >
                                        {hasError("categoryId")
                                            ? getError("categoryId")
                                            : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                        <div className="form-group col-md-6">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="profile" className="label mb-1">
                                        Unite
                                    </label>
                                </div>
                                <div className="col-sm col-md-12">
                                    <Dropdown
                                        value={data.unitId}
                                        options={unit}
                                        onChange={(e) => setValue("unitId", e.value)}
                                        optionLabel="name"
                                        id="unitId"
                                        filter
                                        filterBy="name"
                                        placeholder="unitId.."
                                        emptyFilterMessage="aucun element"
                                        emptyMessage="aucun element"
                                        name="unitId"
                                        // onHide={() => {
                                        //   checkFieldData({ target: { name: "ID_TARGET_TYPE" } });
                                        // }}
                                        className={`w-100 ${hasError("unitId") ? "p-invalid" : ""
                                            }`}
                                        showClear
                                    />
                                    <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 21, display: "block" }}
                                    >
                                        {hasError("unitId")
                                            ? getError("unitId")
                                            : ""}
                                    </div>
                                </div>
                            </div>
                        </div>  </> : null
                        }
                      
                        <div className="form-group col-sm col-md-6">
                            <div className="row">
                                <div className="col-md-12">
                                    <label htmlFor="DESCRIPTION" className="label mb-1">
                                        {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                                        Prix
                                    </label>
                                </div>

                                <div className="col-sm col-md-12">
                                    <InputText
                                        type="text"
                                        // name="description.."
                                        id="price"
                                        name="price"
                                        value={data.price}
                                        onChange={handleChange}
                                        onBlur={checkFieldData}
                                        className={`w-100 is-invalid ${hasError("price") ? "p-invalid" : ""
                                            }`}
                                    />
                                    <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 21, display: "block" }}
                                    >
                                        {hasError("price") ? getError("price") : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group col-md-6">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="profile" className="label mb-1">
                                        TVA
                                    </label>
                                </div>
                                <div className="col-sm col-md-12">
                                    <Dropdown
                                        value={data.vat_rate}
                                        options={vat_rate}
                                        onChange={(e) => setValue("vat_rate", e.value)}
                                        optionLabel="name"
                                        id="vat_rate"
                                        filter
                                        filterBy="name"
                                        placeholder="TVA.."
                                        emptyFilterMessage="aucun element"
                                        emptyMessage="aucun element"
                                        name="vat_rate"
                                        // onHide={() => {
                                        //   checkFieldData({ target: { name: "ID_TARGET_TYPE" } });
                                        // }}
                                        className={`w-100 ${hasError("vat_rate") ? "p-invalid" : ""
                                            }`}
                                        showClear
                                    />
                                    <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 21, display: "block" }}
                                    >
                                        {hasError("vat_rate")
                                            ? getError("vat_rate")
                                            : ""}
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
                                        className={`w-100 is-invalid ${hasError("description") ? "p-invalid" : ""
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
                        {
                            data.is_storable?.code == 1 ?
                        <>
                        <div className="form-group col-sm col-md-4">
                            <div className="row">
                                <div className="col-md-12">
                                    <label htmlFor="DESCRIPTION" className="label mb-1">
                                        {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                                        Cout
                                    </label>
                                </div>

                                <div className="col-sm col-md-12">
                                    <InputText
                                        type="text"
                                        // name="description.."
                                        id="cost"
                                        name="cost"
                                        value={data.cost}
                                        onChange={handleChange}
                                        onBlur={checkFieldData}
                                        className={`w-100 is-invalid ${hasError("cost") ? "p-invalid" : ""
                                            }`}
                                    />
                                    <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 21, display: "block" }}
                                    >
                                        {hasError("cost") ? getError("cost") : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group col-sm col-md-8">
                            <div className="row">
                                <div className="col-md-12">
                                    <label htmlFor="DESCRIPTION" className="label mb-1">
                                        {/* {intl.formatMessage({ id: "sidebar.administration.profil" })} */}
                                        Quantite
                                    </label>
                                </div>

                                <div className="col-sm col-md-12">
                                    <InputText
                                        type="text"
                                        // name="description.."
                                        id="quantity"
                                        name="quantity"
                                        value={data.quantity}
                                        onChange={handleChange}
                                        onBlur={checkFieldData}
                                        className={`w-100 is-invalid ${hasError("quantity") ? "p-invalid" : ""
                                            }`}
                                    />
                                    <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 21, display: "block" }}
                                    >
                                        {hasError("quantity") ? getError("quantity") : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                        </>: null}



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
