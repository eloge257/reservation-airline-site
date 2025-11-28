
import { Outlet, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { useIntl } from "react-intl";

import { setToastAction } from "../../../store/actions/appActions";
import fetchApi from "../../../helpers/fetchApi";
import Loading from "../../../components/app/Loading";
// import AddClientPage from "./AddClientPage";
import axios from "axios";
import API_URL from "../../../constants/API_URL";


export default function ListeStockMvt() {
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(1);
    const [salle, setSalle] = useState([]);
    const [selectedItems, setSelectedItems] = useState(null);
    const [inViewMenuItem, setInViewMenuItem] = useState(null);
    const [globalLoading, setGloabalLoading] = useState(false);
    const [elementEdit, setElementEdit] = useState(null)
    const [visible, setVisible] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);

    const intl = useIntl()
    const navigate = useNavigate();

    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        search: "",
    });

    const dispacth = useDispatch();

    const onPage = (event) => {
        setlazyState(event);
    };

    const onSort = (event) => {
        setlazyState(event);
    };

    const onFilter = (event) => {
        event["first"] = 0;
        setlazyState(event);
    };

    const onSelectionChange = (event) => {
        const value = event.value;
        setSelectedItems(value);
        setSelectAll(value.length === totalRecords);
    };

    const onSelectAllChange = (event) => {
        const selectAll = event.checked;

        if (selectAll) {
            setSelectAll(true);
            setSelectedItems(vehicule);
        } else {
            setSelectAll(false);
            setSelectedItems([]);
        }
    };

    const deleteItems = async (itemsIds) => {
        try {
            setGloabalLoading(true);
            await fetchApi(`/api/fournisseur/${itemsIds}`, {
                method: "DELETE",
            });
            dispacth(
                setToastAction({
                    severity: "success",
                    summary: intl.formatMessage({ id: "cours.susssammrry" }),
                    detail: intl.formatMessage({ id: "cours.sussdetail" }),
                    life: 3000,
                })

            );
            fetchSalle();
            setSelectAll(false);
            setSelectedItems(null);
        } catch (error) {
            console.log(error);
            dispacth(
                setToastAction({
                    severity: "error",
                    summary: intl.formatMessage({ id: "corporateList.erreur_sys_sammary" }),
                    detail: intl.formatMessage({ id: "corporateList.erreur_sys_detail" }),
                    life: 3000,
                })
            );
        } finally {
            setGloabalLoading(false);
        }
    };

    const handleDeletePress = (e, itemsids) => {

        e.preventDefault();
        e.stopPropagation();
        confirmDialog({
            headerStyle: { background: `#4156d1d7`, backgroundSize: 'cover' },
            headerClassName: "text-white",
            header: intl.formatMessage({ id: "VehiculePage_list.delHeader" }),
            message: (
                <div className="d-flex flex-column align-items-center">
                    <div className="font-bold text-center my-2">
                        {inViewMenuItem?.DESCRIPTION}
                    </div>
                    <div className="text-center">
                        {intl.formatMessage({ id: "VehiculePage_list.delQst" })}
                    </div>
                </div>
            ),
            acceptClassName: "p-button-danger",
            acceptLabel: intl.formatMessage({ id: "VehiculePage_list.oui" }),
            rejectLabel: intl.formatMessage({ id: "VehiculePage_list.non" }),
            accept: () => {
                deleteItems(itemsids);
            },
        });
    };


    document.title = intl.formatMessage({ id: "vehiculemodeleaedit.liteedit" })
    const fetchSalle = useCallback(async () => {
        try {
            setLoading(true);
            let url = `${API_URL.LOCAL_URL}/api/stockMvt?`;
    
            // Ajout des paramètres de pagination, tri et recherche
            for (let key in lazyState) {
                const value = lazyState[key];
                if (value) {
                    url += `${key}=${encodeURIComponent(value)}&`;
                }
            }
            const response = await axios.get(url);
            setSalle(response.data.result);
            setTotalRecords(response.data.totalRecords); // Assurez-vous que l'API renvoie `totalRecords`
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [lazyState]);


    useEffect(() => {
        fetchSalle();
    }, [lazyState]);

    const show = () => {
        setVisible(true);
    };

    const editElement = (item) => {
        setElementEdit(item)
        setVisibleModal(true);

    }

    return (
        <>
            {/* <ConfirmDialog closable dismissableMask={true} /> */}
            {globalLoading && <Loading />}
            <div className="px-3 py-3 main_content">
                <div className="d-flex align-items-center justify-content-between">
                   
                    <div className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            type="search"
                            placeholder="Rechercher ....."
                            className="p-inputtext-sm"
                            style={{ minWidth: 300 }}
                            onInput={(e) =>
                                setlazyState((s) => ({ ...s, search: e.target.value }))
                            }
                        />
                    </div>

                </div>

                <div className="content">
                    <div className="rounded mt-3 pr-1 bg-white">
                        <DataTable
                            lazy
                            value={salle}
                            tableStyle={{ minWidth: "52rem" }}
                            className=""
                            paginator
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate={` {first} - {last} dans ${totalRecords} élément`}
                            emptyMessage="Aucun élément trouvé"
                            // paginatorLeft={paginatorLeft}
                            // paginatorRight={paginatorRight}
                            first={lazyState.first}
                            rows={lazyState.rows}
                            totalRecords={totalRecords}
                            onPage={onPage}
                            onSort={onSort}
                            sortField={lazyState.sortField}
                            sortOrder={lazyState.sortOrder}
                            onFilter={onFilter}
                            filters={lazyState.filters}
                            loading={loading}
                            selection={selectedItems}
                            onSelectionChange={onSelectionChange}
                            selectAll={selectAll}
                            onSelectAllChange={onSelectAllChange}
                            reorderableColumns
                            resizableColumns
                            columnResizeMode="expand"
                            paginatorClassName="rounded"
                            scrollable
                            size="Small"
                        // showGridlines
                        >
                            <Column
                                field="Produit"
                                header='Produit'
                                sortable
                                body={(item) => (item ? item.name_product : "-")}
                            />

                            <Column
                                field="Device"
                                header='Device'
                                sortable
                                body={(item) => (item ? item.system_or_device_id : "-")}
                            />



                            <Column
                                field="Code"
                                header='Code'
                                sortable
                                body={(item) => (item ? item.item_code : "-")}
                            />

                            <Column
                                field="Quantite"
                                header='Quantite'
                                sortable
                                body={(item) => (item ? item.item_quantity : "-")}
                            />

<Column
                                field="Unite"
                                header='Unite'
                                sortable
                                body={(item) => (item ? item.item_measurement_unit : "-")}
                            />
                            <Column
                                field="Prix"
                                header='Prix'
                                sortable
                                body={(item) => (item ? item.item_cost_price : "-")}
                            />
                            <Column
                            field="Devise"
                            header='Devise'
                            sortable
                            body={(item) => (item ? item.item_cost_price_currency : "-")}
                        />
                        <Column
                            field="Barcode"
                            header='Barcode'
                            sortable
                            body={(item) => (item ? item.barcode : "-")}
                        />

                        
                        </DataTable>

                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
}