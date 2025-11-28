
import { Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { useIntl } from "react-intl";

import { setToastAction } from "../../../store/actions/appActions";
import Loading from "../../../components/app/Loading";
import AddUnitPage from "./AddUnitPage";
import axios  from "axios";
import API_URL from "../../../constants/API_URL";
import EditUnitPage from "./EditUnitPage";

// import AddSalleModal from "./AddSalleModal";
// import EditSalleModal from "./EditSalleModal";


export default function ListUnitePage() {
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(null);
    const [selectedItems, setSelectedItems] = useState(null);
    const [globalLoading, setGloabalLoading] = useState(false);
    const [elementEdit, setElementEdit] = useState(null)
    const [visible, setVisible] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);


    const [unites, setUnites] = useState([])

    const intl = useIntl()

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
        setlazyState((prevState) => ({
            ...prevState,
            first: event.first,
            rows: event.rows,
        }));
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
            setSelectedItems(unites);
        } else {
            setSelectAll(false);
            setSelectedItems([]);
        }
    };

    const deleteItems = async (id) => {
        try {
            setGloabalLoading(true);
           await axios.delete(`${API_URL.LOCAL_URL}/api/unites/${id}`)
            dispacth(
                setToastAction({
                    severity: "success",
                    summary: 'Succès',
                    detail: 'Suppression réussie !',
                    life: 3000,
                })

            );
            fetchUnites();
            setSelectAll(false);
            setSelectedItems(null);
        } catch (error) {
            console.log(error);
            dispacth(
                setToastAction({
                    severity: "error",
                    summary: 'Erreur',
                    detail: 'Erreur lors de la suppression !',
                    life: 3000,
                })
            );
        } finally {
            setGloabalLoading(false);
        }
    };

    const handleDeletePress = (e, item) => {

    e.preventDefault();
        e.stopPropagation();
        confirmDialog({
            headerStyle: { background: `#4156d1d7`, backgroundSize: 'cover' },
            headerClassName: "text-white",
            header: "Confirmation",
            message: (
                <div className="d-flex flex-column align-items-center">
                    <div className="font-bold text-center my-2">
                        {item?.name}
                    </div>
                    <div className="text-center">
                        Voulez-vous supprimer cette element?
                    </div>
                </div>
            ),
            acceptClassName: "p-button-danger",
            acceptLabel: "Oui",
            rejectLabel: "Non",
            accept: () => {
                deleteItems(item.id);
            },
        });
    };


    document.title = "SkyTravel"
    const fetchUnites = useCallback(async () => {
        try {
            setLoading(true);
            let url = `${API_URL.LOCAL_URL}/api/unites?`;
    
            // Ajout des paramètres de pagination, tri et recherche
            for (let key in lazyState) {
                const value = lazyState[key];
                if (value) {
                    url += `${key}=${encodeURIComponent(value)}&`;
                }
            }
    
            const response = await axios.get(url);
            setUnites(response.data.result);
            setTotalRecords(response.data.totalRecords); // Assurez-vous que l'API renvoie `totalRecords`
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [lazyState]);
    useEffect(() => {
        fetchUnites();
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
            <div className="">
                <div className="d-flex align-items-center justify-content-between">
                    {/* <h1 className="mb-0">Utilisateurs </h1> */}
                    <Button
                        label=""
                        icon="pi pi-plus"
                        size="small"
                        style={{ backgroundColor: "#14162e", borderColor: "#fff372", color: "#fefefe" }}
                        onClick={() => show()}
                    />
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
                            value={unites}
                            tableStyle={{ minWidth: "52rem" }}
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
                                field="name"
                                header='Nom'
                                // sortable
                                body={(item) => (item ? item.name : "-")}
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
                                                rounded
                                                outlined
                                                className="p-button-sm"
                                                onClick={() => editElement(item)}
                                            />
                                            <Button
                                                icon="pi pi-trash"
                                                rounded
                                                outlined
                                                severity="danger"
                                                className="ml-2"
                                                onClick={(e) => handleDeletePress(e, item)}
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

            {/* ******* modal pour ajouter les salle  ******* */}
            <AddUnitPage setVisible={setVisible} visible={visible} fetchUnites={fetchUnites} />
            {/* ********modal pour editer un elemnt ******** */}
            <EditUnitPage setElementEdit={setElementEdit} elementEdit={elementEdit} setVisibleModal={setVisibleModal} visibleModal={visibleModal} fetchUnites={fetchUnites} />
        </>
    );
}