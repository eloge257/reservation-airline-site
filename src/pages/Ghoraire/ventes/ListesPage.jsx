
import { Outlet, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useIntl } from "react-intl";
import Loading from "../../../components/app/Loading";
// import AddClientPage from "./AddClientPage";
import axios from "axios";
import API_URL from "../../../constants/API_URL";
import { userSelector } from "../../../store/selectors/userSelector";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
// import EditClientPage from "./EditClientPage";

// import AddSalleModal from "./AddSalleModal";
// import EditSalleModal from "./EditSalleModal";


export default function ListesPage() {
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(1);
    const [salle, setSalle] = useState([]);
    const [selectedItems, setSelectedItems] = useState(null);
    const [globalLoading, setGloabalLoading] = useState(false);

    const user = useSelector(userSelector)
    const decode = jwtDecode(user?.token)

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


    document.title = intl.formatMessage({ id: "vehiculemodeleaedit.liteedit" })
    const fetchSalle = useCallback(async () => {
        try {

            setLoading(true);
            const response = await axios.get(`${API_URL.LOCAL_URL}/api/findAllInvoice`);
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



    return (
        <>
            {/* <ConfirmDialog closable dismissableMask={true} /> */}
            {globalLoading && <Loading />}
            <div className="px-3 py-3 main_content">
                <div className="d-flex align-items-center justify-content-between">
                    {/* <h1 className="mb-0">Utilisateurs </h1> */}
                    {/* <Button
                        label=""
                        icon="pi pi-plus"
                        size="small"
                        onClick={() => show()}
                    /> */}
                    {decode?.user.type == 'admin' ?

                        <a href="ventesProduit"
                            className="px-3 py-3 rounded-2"
                            style={{ backgroundColor: "#14162e", borderColor: "#fff372", color: "#fefefe" }}

                        > <i className="pi pi-plus"></i> </a> :
                        <></>
                    }
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
                                field="Client"
                                header='Client'
                                sortable
                                body={(item) => (item ? item.customer_name : "-")}
                            />

                            <Column
                                field="Total"
                                header='Total'
                                sortable
                                body={(item) => (item ? item.total : "-")}
                            />

                            <Column
                                field="TVA"
                                header='TVA'
                                sortable
                                body={(item) => (item ? item.vat : "-")}
                            />

                            <Column
                                field="Date"
                                header='Date'
                                sortable
                                body={(item) => (item ? moment(item.datetime).format("YYYY-MM-DD") : "-")}
                            />



                            <Column
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
                                            onClick={() => navigate("/detailVentes", { state: item.invoice_id })}
                                            // onClick={() => console.log(item)}

                                            />

                                        </div>
                                    );
                                }}
                            />
                        </DataTable>

                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
}