
import {
    Outlet,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    setBreadCrumbItemsAction,
} from "../../store/actions/appActions";
import { TabView, TabPanel } from 'primereact/tabview';
import ListUnitePage from "./unites/ListUnitePage";
import ListCategoriePage from "./categorie/ListCategoriePage";
import ListEmployePages from "./employee/ListEmployePages";
import ListClientPage from "./clients/ListClientPage";
import ListFournisseurPage from "./Fournisseur/ListFournisseurPage";
import ListProduitPage from "./produit/ListProduitPage";
import ListCompaniesPage from "./company/ListCompaniesPage";


export default function HorairePage() {
    const dispacth = useDispatch()
    useEffect(() => {
        dispacth(setBreadCrumbItemsAction([
            {
                path: '',
                name: "Données"
            },
        ]));


        return () => {
            dispacth(setBreadCrumbItemsAction([]));
        };
    }, []);

    return (
        <>
            <div className="px-4 py-3 main_content">

                <TabView>
                     <TabPanel header="Company">
                        <ListCompaniesPage />
                    </TabPanel>
                    <TabPanel header="Employés">
                        <ListEmployePages />
                    </TabPanel>
                         
                    <TabPanel header="Client">
                        
                        <ListClientPage />
                    </TabPanel>
                       <TabPanel header="Fournisseur">
                        {/* <Anne_academique_list /> */}
                        <ListFournisseurPage />

                    </TabPanel>
                    <TabPanel header="Unités">
                       <ListUnitePage />
                    </TabPanel>
                    <TabPanel header="Catégories">
                        <ListCategoriePage />
                    </TabPanel>
                    <TabPanel header="Produit">
                        <ListProduitPage />
                    </TabPanel>
                </TabView>

            </div>
            <Outlet />
        </>
    );
}
























