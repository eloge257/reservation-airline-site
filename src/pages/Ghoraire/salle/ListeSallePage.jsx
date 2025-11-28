
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

import AddSalleModal from "./AddSalleModal";
import EditSalleModal from "./EditSalleModal";


export default function ListeSallePage() {
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
            const form = new FormData();
            form.append("ids", JSON.stringify(itemsIds));
            await fetchApi("/admin/salle/delete", {
                method: "POST",
                body: form,
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
            const baseurl = `/admin/salle?`;
            var url = baseurl;
            for (let key in lazyState) {
                const value = lazyState[key];
                if (value) {
                    if (typeof value == "object") {
                        url += `${key}=${JSON.stringify(value)}&`;
                    } else {
                        url += `${key}=${value}&`;
                    }
                }
            }
            const res = await fetchApi(url);
            setSalle(res.result.data);
            setTotalRecords(res.result.totalRecords);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [lazyState]);

    // useEffect(() => {
    //     dispacth(setBreadCrumbItemsAction([
    //         {
    //             path: 'horaire',
    //             name: "Gestion des Horaires"
    //         }
    //     ]));


    //     return () => {
    //         dispacth(setBreadCrumbItemsAction([]));
    //     };
    // }, [intl.locale]);


    useEffect(() => {
        fetchSalle();
    }, [lazyState]);

    const show = () => {
        setVisible(true);
    };

    const editElement = (item) => {
        console.log(item, "fffffffffff");

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
                        label={intl.formatMessage({ id: "liste.nouveau" })}
                        icon="pi pi-plus"
                        size="small"
                        style={{ backgroundColor: "#fff372", borderColor: "#fff372", color: "black" }}
                        onClick={() => show()}
                    />
                    <div className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            type="search"
                            placeholder={intl.formatMessage({ id: "VehiculePage_list.searche" })}
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
                            currentPageReportTemplate={` {first} - {last} ${intl.formatMessage({ id: "corporateList.dans" })} ${totalRecords} ${intl.formatMessage({ id: "corporateList.elements" })}`}
                            emptyMessage={intl.formatMessage({ id: "SkyTravelListePage.UcunElementTrouver" })}
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
                                field="Nom"
                                header='Nom'
                                sortable
                                body={(item) => (item ? item.DESCRIPTION : "-")}
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
                                                onClick={(e) => handleDeletePress(e, [item.ID_SALLE])}
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
            <AddSalleModal setVisible={setVisible} visible={visible} fetchSalle={fetchSalle} />
            {/* ********modal pour editer un elemnt ******** */}
            <EditSalleModal setElementEdit={setElementEdit} elementEdit={elementEdit} setVisibleModal={setVisibleModal} visibleModal={visibleModal} fetchSalle={fetchSalle} />
        </>
    );
}
























