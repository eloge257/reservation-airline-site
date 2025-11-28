
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { useIntl } from "react-intl";
import moment from "moment";
import { setToastAction } from "../../../store/actions/appActions";
import fetchApi from "../../../helpers/fetchApi";
import Loading from "../../../components/app/Loading";
// import AddClientPage from "./AddClientPage";
import axios from "axios";
import API_URL from "../../../constants/API_URL";
import exportExcel from "../../../helpers/exportExcel";
import exportPdf from "../../../helpers/exportPdf";
// import EditClientPage from "./EditClientPage";

// import AddSalleModal from "./AddSalleModal";
// import EditSalleModal from "./EditSalleModal";


export default function DetailVentes() {
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(1);
    const [salle, setSalle] = useState([]);
    const [selectedItems, setSelectedItems] = useState(null);
    const [inViewMenuItem, setInViewMenuItem] = useState(null);
    const [globalLoading, setGloabalLoading] = useState(false);

    const location = useLocation();
    const state = location?.state;


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
            await fetchApi(`/api/produit/${itemsIds}`, {
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




    document.title = intl.formatMessage({ id: "vehiculemodeleaedit.liteedit" })
    const fetchSalle = useCallback(async () => {
        try {

            setLoading(true);
            const response = await axios.get(`${API_URL.LOCAL_URL}/api/findAllventes_invoiceId/${state}`);
            setSalle(response.data.result)
            setTotalRecords(response.data.result.length)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [lazyState]);


    useEffect(() => {
        fetchSalle();
    }, [lazyState]);

    const exportData = useCallback(async () => {
        try {
            setLoading(true);
            const baseurl = `/api/findAllventes_invoiceId/${state}`;

            const res = await fetchApi(baseurl, {
                timeout: 60 * 60 * 1000
            });
            const exportData = res.result.length > 0 ? res.result.map(col => ({
                Produit: col.description,
                Date: moment(col.datetime).format("DD/MM/YYYY"),
                Quantite: col.quantity,
                Prix: col.price,
                vat:col.vat,
                payable:col.payable
            })) : []
            exportExcel(exportData)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [
        lazyState,
    ]);


    const exportPdfData = useCallback(async () => {
        try {
            setLoading(true);
            setLoading(true);
            const baseurl = `/api/findAllventes_invoiceId/${state}`;
            const result =await fetchApi(`/api/company`);
            const qrcode =await fetchApi(`/api/findQrcode/${state}`);

            const company= result.result[0]
            
            const res = await fetchApi(baseurl);

            const exportData = res.result.length > 0 ? res.result.map(col => ({
                Produit: col.name,
                Date: moment(col.datetime).format("DD/MM/YYYY"),
                Quantite: col.quantity,
                Prix: col.price,
                Total:  col.total,
                vat:col.vat,
                payable:col.payable,
                customer_name :col.customer_name,
                customer_TIN:col.customer_TIN,
                customer_address:col.customer_address
            })) : []
            // console.log(exportData); 
            exportPdf(exportData,qrcode ,company);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <>
            {/* <ConfirmDialog closable dismissableMask={true} /> */}
            {globalLoading && <Loading />}
            <div className="px-3 py-3 main_content">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        {/* <Button
                        type="button"
                        label=""
                        className="rounded-0"
                        icon="pi pi-file-excel"
                        severity="success"
                        //   onClick={handleExportExcelEdrmsFail}
                        data-pr-tooltip="XLS"
                        size="large"

                        style={{ marginLeft: "10px" }}
                        /> */}
                        <Button disabled={salle.length == 0} size="large" type="button" icon="pi pi-file-excel"
                            severity="success" data-pr-tooltip="XLS"
                            tooltip tooltipOptions={{ position: 'bottom' }} onClick={e => {
                                e.preventDefault()
                                exportData()
                                // exportExcel(exportData)
                            }} />
                        <Button
                            type="button"
                            label=""
                            className="rounded-0"
                            icon="pi pi-file-pdf"
                            severity="danger"
                            onClick={(e) => {
                                e.preventDefault();
                                exportPdfData();
                            }}
                            data-pr-tooltip="PDF"
                            size="large"
                            style={{ marginLeft: "10px" }}
                        />
                    </div>

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
                                body={(item) => (item ? item.name : "-")}
                            />
                            <Column
                                field="Quantite"
                                header='Quantite'
                                sortable
                                body={(item) => (item ? item.quantity : "-")}
                            />

                            <Column
                                field="Prix"
                                header='Prix'
                                sortable
                                body={(item) => (item ? item.price : "-")}
                            />
                              <Column
                                field="TVA"
                                header='TVA payable'
                                body={(item) => (item ? item.vat : "-")}
                            />

                            <Column
                                field="Total"
                                header='Total'
                                sortable
                                body={(item) => (item ? item.total : "-")}
                            />

                            {/* <Column
                                field=""
                                header="Action"
                                alignFrozen="right"
                                frozen
                                body={(item) => {

                                    return (
                                        <div className="d-flex">
                                            <Button
                                                icon="pi pi-pencil"
                                                label="Detail"
                                                rounded
                                                outlined
                                                className="p-button-sm"
                                                onClick={() => editElement(item)}
                                            />
                                          
                                        </div>
                                    );
                                }}
                            /> */}
                        </DataTable>

                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
}