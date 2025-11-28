import { useCallback, useEffect, useState } from "react";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { FileUpload } from "primereact/fileupload";
import { Panel } from "primereact/panel";
// import Camera_user_modal from "./Camera_user_modal";
import fetchApi from "../../../helpers/fetchApi";
import { setBreadCrumbItemsAction, setToastAction } from "../../../store/actions/appActions";
import axios from "axios";
import API_URL from "../../../constants/API_URL";

const AchatPage = () => {
    const intl = useIntl();
    const location = useLocation();
    const navigate = useNavigate();
    const dispacth = useDispatch();
    const state = location?.state;
    const [currentState] = useState(state && state);
    const [loading, setLoading] = useState(false);
    // const [currentType, setCurrentType] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputIntitule, setInputIntitule] = useState([]);
    const [inputs, setInputs] = useState([])


    const initialForm = {
        FOURNISSEUR_ID: currentState
            ? ""
            : "",
            DEVISE: currentState?.DEVISE,
        OPERATION: currentState?.OPERATION,
    };
    const validateSchema =  Yup.object().shape({
            FOURNISSEUR_ID: Yup.object().required(
                `${intl.formatMessage({ id: "required-field" })}`
            ),
            DEVISE: Yup.object().required(
                `${intl.formatMessage({ id: "required-field" })}`
            ),
            OPERATION: Yup.object().required(
                `${intl.formatMessage({ id: "required-field" })}`
            ),
        });

      const handleInputChange = async(index, event) => {
            
            const { name, value } = event.target; // Récupère le nom et la valeur du champ
            const updatedInputs = [...inputs]; // Copie du tableau `inputs`
           
            // Met à jour la clé correspondante dans l'objet à l'index donné
            updatedInputs[index] = {
                ...updatedInputs[index],
                [name]: value, // Met à jour dynamiquement la clé basée sur le nom du champ
            };
        ///api/findproduit/3
          
            const getInfoProduct = await fetchApi(`/api/findproduit/${updatedInputs[index].PRODUIT_ID}`)
            // updatedInputs[index].QAUNTITE_DISPONIBLE = getInfoProduct.result[0]?.quantity
            // updatedInputs[index].PRIX = getInfoProduct.result[0]?.price
            updatedInputs[index].UNITE_ID = getInfoProduct.result[0]?.unitId
            updatedInputs[index].UNITE_NAME = getInfoProduct.result[0]?.nomunite
            updatedInputs[index].PRODUCT_NAME = getInfoProduct.result[0]?.productName
    
            const TVA_uniteur=(getInfoProduct.result[0]?.price*(getInfoProduct.result[0]?.vat_rate/100))
    
            const TVA_payable= parseFloat(TVA_uniteur) * parseFloat(getInfoProduct.result[0]?.quantity)
            updatedInputs[index].TVA = TVA_payable
    
                  if (updatedInputs[index].QUANTITE && getInfoProduct.result[0].quantity) {
                            console.log(getInfoProduct.result[0].quantity,'---------------------'); 
                        updatedInputs[index].QAUNTITE_DISPONIBLE = parseFloat(getInfoProduct.result[0].quantity) - parseFloat(updatedInputs[index].QUANTITE);
                  }
           
              // Calculer le prix total si les champs nécessaires sont disponibles
              if (updatedInputs[index].QUANTITE && updatedInputs[index].PRIX) {
                  updatedInputs[index].NET_PAY = (parseFloat(updatedInputs[index].QUANTITE) * parseFloat(updatedInputs[index].PRIX))
                  updatedInputs[index].TVA = ((getInfoProduct.result[0]?.vat_rate* updatedInputs[index].NET_PAY)/100)
                  updatedInputs[index].PRIX_TOTAL = (updatedInputs[index].NET_PAY-updatedInputs[index].TVA);
            }
    
            // if (updatedInputs[index].QUANTITE >getInfoProduct.result[0].quantity ) {
            //     dispacth(
            //         setToastAction({
            //             severity: "info",
            //             summary: "Validation",
            //             detail: `Quantites est superieur a quantite disponible Ligne ${updatedInputs[index].id+1}`,
            //             life: 5000,
            //         })
            //     );
            //     setValidationError(false)
            //     // return null;
                
            // }
        
            setInputs(updatedInputs); // Met à jour l'état `inputs`
            
        };

    const formik = useFormik({
        initialValues: initialForm,
        validationSchema: validateSchema,
        enableReinitialize: true,
        onSubmit: async (data) => {
            try {
                setIsSubmitting(true);
                const form = new FormData();
                inputs.map((item) => {
                    form.append(`PRODUIT_ID${item.id}`, item.PRODUIT_ID)
                    form.append(`QUANTITE${item.id}`, item.QUANTITE)
                    form.append(`PRIX${item.id}`, item.PRIX)
                    form.append(`COUT${item.id}`, item.COUT)
                    form.append(`UNITE_ID${item.id}`, item.UNITE_ID)
                    form.append(`PRIX_TOTAL${item.id}`, item.PRIX_TOTAL)
                    form.append(`QAUNTITE_DISPONIBLE${item.id}`, item.QAUNTITE_DISPONIBLE)
                    form.append(`PRODUCT_NAME${item.id}`,item.PRODUCT_NAME)
                    form.append(`UNITE_NAME${item.id}`,item.UNITE_NAME)
                })
                form.append("FOURNISSEUR_ID", data.FOURNISSEUR_ID.code);
                form.append("OPERATION", data.OPERATION.code);
                form.append("DEVISE", data.DEVISE.code);
                // inputIntitule.map((item) => {
                //     form.append(`DATA_INTITULE${item.id}`, item.code)
                // })

                    const res = await fetchApi("/api/achat", {
                        method: "POST",
                        body: form,
                    });
                    dispacth(
                        setToastAction({
                            severity: "success",
                            summary: " Enregistrement",
                            detail: res.message,
                            life: 5000,
                        })
                    );
                    navigate("/detailAchat");
            } catch (error) {
                console.log(error);
                if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
                    // const currentError = currentManagerError(error?.result);
                    dispacth(
                        setToastAction({
                            severity: "error",
                            summary: intl.formatMessage({ id: "error-validation" }),
                            detail: error?.result,
                            life: 5000,
                        })
                    );
                } else {
                    dispacth(
                        setToastAction({
                            severity: "error",
                            summary: intl.formatMessage({ id: "error-system" }),
                            detail: error?.response?.data?.message,
                            life: 5000,
                        })
                    );
                }
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const currentType = [
        {
            code: 1, name: 'kk',
        },
        {
            code: 3, name: 'jj'
        }
    ]


    // FETCHING DATA END POINT
    const getLoadingDetail_equipement = useCallback(async () => {
        try {
            setLoading(true);
            const baseurl = `/equipement/equipement_detail?`;
            const res = await fetchApi(baseurl);
            const filter_detail = res?.result.filter((r) => r.ID_EQUIPEMENT == currentState?.ID_EQUIPEMENT)
            setInputs(
                filter_detail.map((t, index) => {
                    return {
                        INTUTILE: t.INTITULE,
                        id: index,
                    };
                })
            )
            setLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);


    //pour ajouter  une ligne 
    const handleAdd = (e) => {
        e.preventDefault
        const newId = inputs.length > 0 ? inputs[inputs.length - 1].id + 1 : 0;
        const newInputs = [...inputs, { id: newId }];

        setInputs(newInputs);
    };

    //pour supprimer une ligne
    const handleRemove = (e, id) => {
        e.preventDefault
        const newInputs = inputs.filter((input) => input.id !== id);
        setInputs(newInputs);
    };

    useEffect(() => {
        document.title = "Traitement des equipements";
        // getLoadingData()
        getLoadingDetail_equipement()
        // dispacth(setBreadCrumbItemsAction([pos_routes_items.ajoutModif]));
        return () => {
            dispacth(setBreadCrumbItemsAction([]));
        };
    }, []);
    const [produits,setProduits] = useState([])
    const fetchproduit = useCallback(async () => {
        try {
            
            setLoading(true);
            const response = await axios.get(`${API_URL.LOCAL_URL}/api/produits`);
            setProduits(response.data.result)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    });
    const [unites, setUnites] = useState([])

    const fetchunit =async () => {
        try {
            
            setLoading(true);
            const response = await axios.get(`${API_URL.LOCAL_URL}/api/unites`);
            setUnites(response.data.result)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchproduit();
        fetchunit()
    }, []);
    const [fournisseur, setFournisseur] = useState([])
 
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


        const devises = [
            {  code : "BIF" , name:"BIF" },
            {  code : "USD" , name:"USD" },
            {  code : "EUR" , name:"EUR" }

        ]
    return (
        <>
            <div className="px-4 py-3 main_content">
                <form onSubmit={formik.handleSubmit} className="">
                  
                    <div className="row">
                        <div className="col-md-4 col-sm">
                            <label htmlFor="FO" className="label mb-1">
                                Fournisseur
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <Dropdown
                                value={formik.values.FOURNISSEUR_ID}
                                options={fournisseur}
                                onChange={formik.handleChange}
                                optionLabel="name"
                                id="FOURNISSEUR_ID"
                                disabled={loading}
                                filter
                                filterBy="name"
                                placeholder={`Fournisseur`}
                                emptyFilterMessage={`${intl.formatMessage({
                                    id: "no-items-found",
                                })}`}
                                emptyMessage={`${intl.formatMessage({
                                    id: "no-items-found",
                                })}`}
                                name="FOURNISSEUR_ID"
                                onHide={() => {
                                    // checkFieldData({ target: { name: "PLAQUE" } });
                                }}
                                className={`w-100 is-invalid ${formik.touched.FOURNISSEUR_ID &&
                                    Boolean(formik.errors.FOURNISSEUR_ID)
                                    ? "p-invalid"
                                    : ""
                                    }`}
                                showClear
                            />
                            <div
                                className="invalid-feedback"
                                style={{ minHeight: 10, display: "block" }}
                            >
                                {formik.touched.FOURNISSEUR_ID &&
                                    Boolean(formik.errors.FOURNISSEUR_ID)
                                    ? formik.errors.FOURNISSEUR_ID
                                    : ""}
                            </div>
                        </div>
                        <div className="col-md-4 col-sm">
                            <label htmlFor="DEVISE" className="label mb-1">
                                Devise
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <Dropdown
                                value={formik.values.DEVISE}
                                options={devises}
                                onChange={formik.handleChange}
                                optionLabel="name"
                                id="DEVISE"
                                disabled={loading}
                                filter
                                filterBy="name"
                                placeholder={`Devise`}
                                emptyFilterMessage={`${intl.formatMessage({
                                    id: "no-items-found",
                                })}`}
                                emptyMessage={`${intl.formatMessage({
                                    id: "no-items-found",
                                })}`}
                                name="DEVISE"
                                onHide={() => {
                                    // checkFieldData({ target: { name: "PLAQUE" } });
                                }}
                                className={`w-100 is-invalid ${formik.touched.DEVISE &&
                                    Boolean(formik.errors.DEVISE)
                                    ? "p-invalid"
                                    : ""
                                    }`}
                                showClear
                            />
                            <div
                                className="invalid-feedback"
                                style={{ minHeight: 10, display: "block" }}
                            >
                                {formik.touched.DEVISE &&
                                    Boolean(formik.errors.DEVISE)
                                    ? formik.errors.DEVISE
                                    : ""}
                            </div>
                        </div>
                        <div className="col-md-4 col-sm">
                            <label htmlFor="OPERATION" className="label mb-1">
                                Operation
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <Dropdown
                                value={formik.values.OPERATION}
                                options={currentType}
                                onChange={formik.handleChange}
                                optionLabel="name"
                                id="OPERATION"
                                disabled={loading}
                                filter
                                filterBy="name"
                                placeholder={`Operation`}
                                emptyFilterMessage={`${intl.formatMessage({
                                    id: "no-items-found",
                                })}`}
                                emptyMessage={`${intl.formatMessage({
                                    id: "no-items-found",
                                })}`}
                                name="OPERATION"
                                onHide={() => {
                                    // checkFieldData({ target: { name: "PLAQUE" } });
                                }}
                                className={`w-100 is-invalid ${formik.touched.OPERATION &&
                                    Boolean(formik.errors.OPERATION)
                                    ? "p-invalid"
                                    : ""
                                    }`}
                                showClear
                            />
                            <div
                                className="invalid-feedback"
                                style={{ minHeight: 10, display: "block" }}
                            >
                                {formik.touched.OPERATION &&
                                    Boolean(formik.errors.OPERATION)
                                    ? formik.errors.OPERATION
                                    : ""}
                            </div>
                        </div>

                        <a className={` ml-auto mr-2 mb-2 btn btn-success rounded-0 text-light`} style={{width:50}} onClick={(e) => handleAdd(e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                        </a>
                            <div className="col-md-12">
                                <table className="table table-bordered table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Produit</th>
                                            <th>Quantite</th>
                                            <th>Prix</th>
                                            <th>Cout</th>
                                            <th>Unite</th>
                                            <th>PT</th>
                                            <th>Quantite disponible</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inputs.map((input, index) => {
                                            const isLastRow = index === inputs.length - 1;
                                            return (
                                                <tr key={index}>
                                                    <td>#</td>
                                                    <td>
                                                        <div className="col-md-12 col-sm-12">
                                                            <select name="PRODUIT_ID" id="PRODUIT_ID" onChange={(e) =>  handleInputChange(index, e)} className="form-control rounded-0">
                                                                    <option value="">--Produit--${index} </option>
                                                                    {produits.map((produit) => {
                                                                        return (
                                                                            <option key={produit.idproduct} value={produit.idproduct}>
                                                                                {produit.productName}
                                                                            </option>)
                                                                            })}
                                                            </select>
                                                            <input
                                                                className="form-control rounded-0"
                                                                type="hidden"
                                                                name="PRODUCT_NAME"
                                                                value={input.PRODUCT_NAME}
                                                                onChange={(e) => handleInputChange(index, e)}
                                                            />
                                                            <div
                                                                className="invalid-feedback"
                                                                style={{ minHeight: 10, display: "block" }}
                                                            >
                                                                {formik.touched.INTITULE && Boolean(formik.errors.INTITULE)
                                                                    ? formik.errors.INTITULE
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="col-md-12 col-sm-12">
                                                            <input
                                                                className="form-control rounded-0"
                                                                type="text"
                                                                name="QUANTITE"
                                                                placeholder={`Quantité_${index}`}
                                                                value={input.QUANTITE}
                                                                onChange={(e) => handleInputChange(index, e)}
                                                            />
                                                            <div
                                                                className="invalid-feedback"
                                                                style={{ minHeight: 10, display: "block" }}
                                                            >
                                                                {formik.touched.QUANTITE && Boolean(formik.errors.QUANTITE)
                                                                    ? formik.errors.QUANTITE
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="col-md-8 col-sm-8">
                                                            <input
                                                                className="form-control rounded-0"
                                                                type="text"
                                                                name="PRIX"
                                                                placeholder={`Prix_${index}`}
                                                                value={input.PRIX}
                                                                onChange={(e) =>  handleInputChange(index, e)}
                                                            />
                                                            <div
                                                                className="invalid-feedback"
                                                                style={{ minHeight: 10, display: "block" }}
                                                            >
                                                                {formik.touched.PRIX && Boolean(formik.errors.PRIX)
                                                                    ? formik.errors.PRIX
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="col-md-8 col-sm-8">
                                                            <input
                                                                className="form-control rounded-0"
                                                                type="text"
                                                                name="COUT"
                                                                placeholder={`Cout_${index}`}
                                                                value={input.COUT}
                                                                onChange={(e) => handleInputChange(index, e)}
                                                            />
                                                            <div
                                                                className="invalid-feedback"
                                                                style={{ minHeight: 10, display: "block" }}
                                                            >
                                                                {formik.touched.COUT && Boolean(formik.errors.COUT)
                                                                    ? formik.errors.COUT
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="col-md-12 col-sm-12">
                                                        <select name="UNITE_ID" id="UNITE_ID" onChange={(e) => handleInputChange(index, e)} className="form-control rounded-0">
                                                                    <option value="">--Unite--</option>
                                                                    {unites.map((unit) => {
                                                                        return (
                                                                            <option key={unit.id} value={unit.id}>
                                                                                {unit.name}
                                                                            </option>)
                                                                            })}
                                                            </select>
                                                            <input
                                                                className="disabled form-control rounded-0"
                                                                type="hidden"
                                                                name="UNITE_NAME"
                                                                placeholder={`Unite_${index}`}
                                                                value={input.UNITE_NAME}
                                                                onChange={(e) =>  handleInputChange(index, e)}
                                                                readOnly
                                                            />
                                                            <div
                                                                className="invalid-feedback"
                                                                style={{ minHeight: 10, display: "block" }}
                                                            >
                                                                {formik.touched.UNITE_ID && Boolean(formik.errors.UNITE_ID)
                                                                    ? formik.errors.UNITE_ID
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="col-md-8 col-sm-8">
                                                            <input
                                                                className="form-control rounded-0"
                                                                type="text"
                                                                name="PRIX_TOTAL"
                                                                readOnly
                                                                placeholder={`Prix Total_${index}`}
                                                                value={input.PRIX_TOTAL}
                                                                onChange={(e) => handleInputChange(index, e)}
                                                            />
                                                            <div
                                                                className="invalid-feedback"
                                                                style={{ minHeight: 10, display: "block" }}
                                                            >
                                                                {formik.touched.PRIX_TOTAL && Boolean(formik.errors.PRIX_TOTAL)
                                                                    ? formik.errors.PRIX_TOTAL
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="col-md-8 col-sm-12">
                                                            <input
                                                                className="form-control rounded-0"
                                                                type="text"
                                                                name="QAUNTITE_DISPONIBLE"
                                                                placeholder={`Qte disponible_${index}`}
                                                                value={input.QAUNTITE_DISPONIBLE}
                                                                onChange={(e) => handleInputChange(index, e)}
                                                                readOnly
                                                            />
                                                            <div
                                                                className="invalid-feedback"
                                                                style={{ minHeight: 10, display: "block" }}
                                                            >
                                                                {formik.touched.QAUNTITE_DISPONIBLE && Boolean(formik.errors.QAUNTITE_DISPONIBLE)
                                                                    ? formik.errors.QAUNTITE_DISPONIBLE
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="col-md-12 col-sm-1 d-flex">
                                                        {
                                                            isLastRow ?
                                                                <span className="btn btn-success rounded-0 text-light mr-3" onClick={(e) => handleAdd(e)}>
                                                                    +
                                                                </span> : null
                                                        }
                                                        <span className="btn btn-danger rounded-0 text-light" onClick={(e) => handleRemove(e, input.id)}>
                                                            X
                                                        </span>
                                                        </div>
                                                        
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        }
                                    </tbody>
                                </table>


                            </div>
                    </div>

                    <div
                        style={{ borderTop: "1px " }}
                        className=" shaddow mt-2 -mb-5 d-flex justify-content-end pb-3 pr-4 bg-white"
                    >
                        <Button
                            label="Reinitialiser"
                            type="reset"
                            outlined
                            icon="pi pi-replay"
                            className="mt-3"
                            size="small"
                            style={{ color: "#0c2448" }}
                            onClick={(e) => formik.resetForm(e)}
                        />

                        <Button
                            icon={isSubmitting ? `pi pi-spin pi-spinner` : `pi pi-save`}
                            label={`${currentState?.ID_UTILISATEUR
                                ? intl.formatMessage({ id: "modify" })
                                : intl.formatMessage({ id: "save" })
                                }`}
                            style={{ backgroundColor: "#0c2448" }}
                            type="submit"
                            className="mt-3 ml-3"
                            size="small"
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default AchatPage;
