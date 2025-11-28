import { useCallback, useEffect, useState } from "react";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
// import Camera_user_modal from "./Camera_user_modal";
import fetchApi from "../../../helpers/fetchApi";
import { setBreadCrumbItemsAction, setToastAction } from "../../../store/actions/appActions";
import axios from "axios";
import API_URL from "../../../constants/API_URL";
import { userSelector } from "../../../store/selectors/userSelector";
import { jwtDecode } from "jwt-decode";

const VentePage = () => {
    const intl = useIntl();
    const location = useLocation();
    const dispacth = useDispatch();
    const navigate = useNavigate()
    const state = location?.state;
    const [currentState] = useState(state && state);
    const [loading, setLoading] = useState(false);
    // const [currentType, setCurrentType] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState(true)
    const [quantiteTotal, setQuantiteTotal] = useState(0)
    const [TVATotal, setTVATotal] = useState(0)
    const [PTTotal, setPTTotal] = useState(0)
    const [inputs, setInputs] = useState([])

    const user = useSelector(userSelector)
    const decode = jwtDecode(user?.token)


    const initialForm = {
        CLIENT_ID: currentState
            ? ""
            : "",
        DEVISE: currentState?.DEVISE,
        TYPE_PAIEMENT: currentState?.TYPE_PAIEMENT,
    };
    const validateSchema = Yup.object().shape({
        CLIENT_ID: Yup.object().required(
            `${intl.formatMessage({ id: "required-field" })}`
        ),
        DEVISE: Yup.object().required(
            `${intl.formatMessage({ id: "required-field" })}`
        ),
        TYPE_PAIEMENT: Yup.object().required(
            `${intl.formatMessage({ id: "required-field" })}`
        ),
    });
    const calculateTotals = () => {
        const totals = inputs.reduce(
            (acc, input) => {
                const quantite = parseFloat(input.QUANTITE) || 0;
                const tva = parseFloat(input.TVA) || 0;
                const prixTotal = parseFloat(input.PRIX_TOTAL) || 0;

                acc.quantiteTotal += quantite;
                acc.TVATotal += tva;
                acc.PTTotal += prixTotal;

                return acc;
            },
            { quantiteTotal: 0, TVATotal: 0, PTTotal: 0 } // Initialisation des totaux
        );
        console.log(totals.quantiteTotal);

        setQuantiteTotal(totals.quantiteTotal);
        setTVATotal(totals.TVATotal);
        setPTTotal(totals.PTTotal);
    };

    const handleInputChange = async (index, event) => {

        const { name, value } = event.target; // Récupère le nom et la valeur du champ
        const updatedInputs = [...inputs]; // Copie du tableau `inputs`

        // Met à jour la clé correspondante dans l'objet à l'index donné
        updatedInputs[index] = {
            ...updatedInputs[index],
            [name]: value, // Met à jour dynamiquement la clé basée sur le nom du champ
        };
        ///api/findproduit/3

        const getInfoProduct = await fetchApi(`/api/findproduit/${updatedInputs[index].PRODUIT_ID}`)
        updatedInputs[index].QAUNTITE_DISPONIBLE = getInfoProduct.result[0]?.quantity
        updatedInputs[index].PRIX = getInfoProduct.result[0]?.price
        updatedInputs[index].UNITE_ID = getInfoProduct.result[0]?.unitId
        updatedInputs[index].UNITE_NAME = getInfoProduct.result[0]?.nomunite
        updatedInputs[index].PRODUCT_NAME = getInfoProduct.result[0]?.productName

        const TVA_uniteur = (getInfoProduct.result[0]?.price * (getInfoProduct.result[0]?.vat_rate / 100))

        const TVA_payable = parseFloat(TVA_uniteur) * parseFloat(getInfoProduct.result[0]?.quantity)
        updatedInputs[index].TVA = TVA_payable


        // Calculer le prix total si les champs nécessaires sont disponibles
        if (updatedInputs[index].QUANTITE && updatedInputs[index].PRIX) {
            updatedInputs[index].NET_PAY = (parseFloat(updatedInputs[index].QUANTITE) * parseFloat(updatedInputs[index].PRIX))
            updatedInputs[index].TVA = ((getInfoProduct.result[0]?.vat_rate * updatedInputs[index].NET_PAY) / 100)
            updatedInputs[index].PRIX_TOTAL = (updatedInputs[index].NET_PAY - updatedInputs[index].TVA);
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
        const totalQuantite = updatedInputs[index].QUANTITE + updatedInputs[index].QUANTITE
        setQuantiteTotal(totalQuantite)
        calculateTotals()
        setInputs(updatedInputs); // Met à jour l'état `inputs`

    };

    useEffect(() => {
        calculateTotals();
    }, [inputs]);
    const formik = useFormik({
        initialValues: initialForm,
        validationSchema: validateSchema,
        enableReinitialize: true,
        onSubmit: async (data) => {
            try {
                setIsSubmitting(true);
                const form = new FormData();
                inputs.map((item) => {
                    if (item.QUANTITE > item.QAUNTITE_DISPONIBLE) {
                        dispacth(
                            setToastAction({
                                severity: "info",
                                summary: "Validation",
                                detail: `Quantites est superieur a quantite disponible Ligne ${item.id + 1}`,
                                life: 5000,
                            })
                        );
                        return  item.id
                    }

                    form.append(`PRODUIT_ID${item.id}`, item.PRODUIT_ID)
                    form.append(`QUANTITE${item.id}`, item.QUANTITE)
                    form.append(`PRIX${item.id}`, item.PRIX)
                    form.append(`UNITE_ID${item.id}`, item.UNITE_ID)
                    form.append(`PRIX_TOTAL${item.id}`, item.PRIX_TOTAL)
                    form.append(`QAUNTITE_DISPONIBLE${item.id}`, item.QAUNTITE_DISPONIBLE)
                    form.append(`TVA${item.id}`, item.TVA)
                    form.append(`PRODUCT_NAME${item.id}`, item.PRODUCT_NAME)
                    form.append(`UNITE_NAME${item.id}`, item.UNITE_NAME)

                })
                form.append("CLIENT_ID", data.CLIENT_ID.code);
                form.append("TYPE_PAIEMENT", data.TYPE_PAIEMENT.code);
                form.append("DEVISE", data.DEVISE.code);
                form.append("employe", decode?.user?.id)
                form.append("quantiteTotal", quantiteTotal);
                form.append("TVATotal", TVATotal);
                form.append("PTTotal", PTTotal)
                // inputIntitule.map((item) => {
                //     form.append(`DATA_INTITULE${item.id}`, item.code)
                // })

                const res = await fetchApi("/api/Vente", {
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
                navigate("/listVentes");
            } catch (error) {

                console.log(error.message, "------------------------------------");
                dispacth(
                    setToastAction({
                        severity: "error",
                        summary: intl.formatMessage({ id: "error-system" }),
                        detail: error.message,
                        life: 5000,
                    })
                );
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const currentType = [
        {
            code: 1, name: 'En espèce',
        },
        {
            code: 2, name: 'Banque'
        },
        {
            code: 3, name: 'A crédit'
        },
        {
            code: 4, name: 'Autres'
        }
    ]



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


    const [produits, setProduits] = useState([])
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

    const fetchunit = async () => {
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

            const response = await axios.get(`${API_URL.LOCAL_URL}/api/client`);
            setFournisseur(response.data.result.map((item) => {
                return {
                    code: item.id,
                    name: item.customer_name
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
        { code: "BIF", name: "BIF" },
        { code: "USD", name: "USD" },
        { code: "EUR", name: "EUR" }
    ]

    return (
        <>
            <div className="px-4 py-3 main_content">
                <form onSubmit={formik.handleSubmit} className="container-fluid">

                    <div className="row align-items-end mb-3">
                        <div className="col-lg-4 col-md-6 mb-2">
                            <label htmlFor="CLIENT_ID" className="label mb-1">
                                Client <span className="text-danger">*</span>
                            </label>
                            <Dropdown
                                id="CLIENT_ID"
                                name="CLIENT_ID"
                                value={formik.values.CLIENT_ID}
                                options={fournisseur}
                                optionLabel="name"
                                onChange={formik.handleChange}
                                placeholder={intl.formatMessage({ id: "select-client", defaultMessage: "Sélectionner un client" })}
                                disabled={loading}
                                filter
                                filterBy="name"
                                className={`w-100 ${formik.touched.CLIENT_ID && formik.errors.CLIENT_ID ? "p-invalid" : ""}`}
                                showClear
                            />
                            <div className="invalid-feedback" style={{ minHeight: 18, display: "block" }}>
                                {formik.touched.CLIENT_ID && formik.errors.CLIENT_ID ? formik.errors.CLIENT_ID : ""}
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 mb-2">
                            <label htmlFor="DEVISE" className="label mb-1">
                                Devise <span className="text-danger">*</span>
                            </label>
                            <Dropdown
                                id="DEVISE"
                                name="DEVISE"
                                value={formik.values.DEVISE}
                                options={devises}
                                optionLabel="name"
                                onChange={formik.handleChange}
                                placeholder={intl.formatMessage({ id: "select-currency", defaultMessage: "Sélectionner une devise" })}
                                disabled={loading}
                                className={`w-100 ${formik.touched.DEVISE && formik.errors.DEVISE ? "p-invalid" : ""}`}
                                showClear
                            />
                            <div className="invalid-feedback" style={{ minHeight: 18, display: "block" }}>
                                {formik.touched.DEVISE && formik.errors.DEVISE ? formik.errors.DEVISE : ""}
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 mb-2">
                            <label htmlFor="TYPE_PAIEMENT" className="label mb-1">
                                Type de paiement <span className="text-danger">*</span>
                            </label>
                            <Dropdown
                                id="TYPE_PAIEMENT"
                                name="TYPE_PAIEMENT"
                                value={formik.values.TYPE_PAIEMENT}
                                options={currentType}
                                optionLabel="name"
                                onChange={formik.handleChange}
                                placeholder={intl.formatMessage({ id: "payment-type", defaultMessage: "Type de paiement" })}
                                disabled={loading}
                                className={`w-100 ${formik.touched.TYPE_PAIEMENT && formik.errors.TYPE_PAIEMENT ? "p-invalid" : ""}`}
                                showClear
                            />
                            <div className="invalid-feedback" style={{ minHeight: 18, display: "block" }}>
                                {formik.touched.TYPE_PAIEMENT && formik.errors.TYPE_PAIEMENT ? formik.errors.TYPE_PAIEMENT : ""}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="m-0">Lignes de produits</h5>
                        <div className="d-flex align-items-center">
                            <Button
                                type="button"
                                icon="pi pi-plus"
                                label="Ajouter une ligne"
                                className="p-button-sm p-button-success mr-2"
                                onClick={handleAdd}
                            />
                            <small className="text-muted">Ajoutez au moins une ligne avant d'enregistrer</small>
                        </div>
                    </div>

                    <div className="table-responsive mb-3">
                        <table className="table table-bordered table-hover table-sm">
                            <thead className="thead-light">
                                <tr>
                                    <th style={{ width: 40 }}>#</th>
                                    <th style={{ minWidth: 180 }}>Produit</th>
                                    <th style={{ width: 110 }}>Quantité</th>
                                    <th style={{ width: 120 }}>Prix (U)</th>
                                    <th style={{ width: 120 }}>Unité</th>
                                    <th style={{ width: 140 }}>Disponibilité</th>
                                    <th style={{ width: 140 }}>TVA payable</th>
                                    <th style={{ width: 140 }}>Prix total</th>
                                    <th style={{ width: 140 }}>Net à payer</th>
                                    <th style={{ width: 110 }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inputs.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="text-center text-muted py-4">
                                            Aucune ligne ajoutée — cliquez sur "Ajouter une ligne" pour commencer
                                        </td>
                                    </tr>
                                )}

                                {inputs.map((input, index) => {
                                    const isLastRow = index === inputs.length - 1;
                                    return (
                                        <tr key={input.id ?? index}>
                                            <td className="align-middle text-center">{index + 1}</td>

                                            <td>
                                                {/* <select
                                                    name="PRODUIT_ID"
                                                    id={`PRODUIT_ID_${input.id}`}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    className="form-control form-control-sm"
                                                    aria-label={`Produit ${index + 1}`}
                                                >
                                                    <option value="">{`-- Produit ${index + 1} --`}</option>
                                                    {produits.map((produit) => (
                                                        <option key={produit.idproduct} value={produit.idproduct}>
                                                            {produit.productName}
                                                        </option>
                                                    ))}
                                                </select> */}
                                             {/* // Dans ton composant : */}
{/* // inputs = état tableau des lignes, ex: [{id: 1, PRODUIT_ID: '' }, ...] */}
                                                {/* // produits = liste des produits */}

                                                {/* // SELECT dans le render */}
                                                <select
                                                    name="PRODUIT_ID"
                                                    id={`PRODUIT_ID_${input.id}`}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    className="form-control form-control-sm"
                                                    aria-label={`Produit ${index + 1}`}
                                                    value={input.PRODUIT_ID ?? ""}            // <-- valeur contrôlée importante
                                                >
                                                    <option value="">{`-- Produit ${index + 1} --`}</option>
                                                    {produits.map((produit) => {
                                                        // Vérifie si ce produit est déjà sélectionné dans une autre ligne
                                                        const isSelected = inputs.some(
                                                            (item, i) => i !== index && String(item.PRODUIT_ID) === String(produit.idproduct)
                                                        );

                                                        return (
                                                            <option
                                                                key={produit.idproduct}
                                                                value={produit.idproduct}
                                                                disabled={isSelected}               // <-- boolean correct
                                                            >
                                                                {produit.productName}
                                                            </option>
                                                        );
                                                    })}
                                                </select>



                                                <input
                                                    type="hidden"
                                                    name="PRODUCT_NAME"
                                                    value={input.PRODUCT_NAME || ""}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    className="form-control form-control-sm text-right"
                                                    type="number"
                                                    min="0"
                                                    step="any"
                                                    name="QUANTITE"
                                                    placeholder="0"
                                                    value={input.QUANTITE || ""}
                                                    onChange={(e) => handleInputChange(index, e)}
                                                    aria-label={`Quantité ${index + 1}`}
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    className="form-control form-control-sm text-right bg-light"
                                                    type="text"
                                                    name="PRIX"
                                                    placeholder="Prix unitaire"
                                                    value={input.PRIX ?? ""}
                                                    readOnly
                                                    aria-readonly
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    className="form-control form-control-sm bg-light"
                                                    type="text"
                                                    name="UNITE_NAME"
                                                    placeholder="Unité"
                                                    value={input.UNITE_NAME ?? ""}
                                                    readOnly
                                                />
                                                <input type="hidden" name="UNITE_ID" value={input.UNITE_ID ?? ""} />
                                            </td>

                                            <td>
                                                <input
                                                    className="form-control form-control-sm bg-light text-right"
                                                    type="text"
                                                    name="QAUNTITE_DISPONIBLE"
                                                    value={input.QAUNTITE_DISPONIBLE ?? ""}
                                                    readOnly
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    className="form-control form-control-sm bg-light text-right"
                                                    type="text"
                                                    name="TVA"
                                                    value={input.TVA ? Number(input.TVA).toFixed(2) : ""}
                                                    readOnly
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    className="form-control form-control-sm bg-light text-right"
                                                    type="text"
                                                    name="PRIX_TOTAL"
                                                    value={input.PRIX_TOTAL ? Number(input.PRIX_TOTAL).toFixed(2) : ""}
                                                    readOnly
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    className="form-control form-control-sm bg-light text-right"
                                                    type="text"
                                                    name="NET_PAY"
                                                    value={input.NET_PAY ? Number(input.NET_PAY).toFixed(2) : ""}
                                                    readOnly
                                                />
                                            </td>

                                            <td className="text-center align-middle">
                                                <div className="d-flex justify-content-center">
                                                    {isLastRow && (
                                                        <Button
                                                            type="button"
                                                            icon="pi pi-plus"
                                                            className="p-button-rounded p-button-success p-button-sm mr-2"
                                                            aria-label="Ajouter ligne"
                                                            onClick={handleAdd}
                                                        />
                                                    )}
                                                    <Button
                                                        type="button"
                                                        icon="pi pi-trash"
                                                        className="p-button-rounded p-button-danger p-button-sm"
                                                        aria-label="Supprimer ligne"
                                                        onClick={(e) => {
                                                            if (window.confirm("Confirmer la suppression de cette ligne ?")) {
                                                                handleRemove(e, input.id);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4 mb-2">
                            <div className="p-card p-component p-card-compact">
                                <div className="p-card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="text-muted">Quantité totale</div>
                                        <div className="font-weight-bold">{(quantiteTotal || 0).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-2">
                            <div className="p-card p-component p-card-compact">
                                <div className="p-card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="text-muted">TVA totale</div>
                                        <div className="font-weight-bold">{TVATotal.toLocaleString("fr-FR", {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-2">
                            <div className="p-card p-component p-card-compact">
                                <div className="p-card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="text-muted">Prix total</div>
                                        <div className="font-weight-bold">{(PTTotal || 0).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end align-items-center bg-white p-3 shadow-sm" style={{ borderTop: "1px solid #e9ecef" }}>
                        <Button
                            label="Réinitialiser"
                            type="reset"
                            outlined
                            icon="pi pi-replay"
                            className="p-button-sm"
                            onClick={() => formik.resetForm()}
                        />

                        <Button
                            icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-save"}
                            label={currentState?.ID_UTILISATEUR ? intl.formatMessage({ id: "modify" }) : intl.formatMessage({ id: "save" })}
                            style={{ backgroundColor: "#0c2448", borderColor: "#0c2448" }}
                            type="submit"
                            className="p-button-sm ml-3"
                            disabled={isSubmitting || inputs.length === 0}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default VentePage;
