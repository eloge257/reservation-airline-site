import { lazy } from "react";
import { Route } from "react-router-dom";
import AchatPage from "../../pages/Ghoraire/achat/AchatPage";
import VentePage from "../../pages/Ghoraire/ventes/VentePage";
import ListesPage from "../../pages/Ghoraire/ventes/ListesPage";
import DetailVentes from "../../pages/Ghoraire/ventes/DetailVentes";
import ListeAchatPage from "../../pages/Ghoraire/achat/ListeAchatPage";
import DetailAchatPage from "../../pages/Ghoraire/achat/DetailAchatPage";
import ListeStockMvt from "../../pages/Ghoraire/stock_mvt/ListeStockMvt";
import ObrInvoice from "../../pages/Ghoraire/stock_mvt/ObrInvoice";
const horairePage = lazy(() => import("../../pages/Ghoraire/HorairePage"));

export const horaire_items = {
  anne_ac: {
    path: "horaire",
    name: "Gestion des Horaires",
    component: horairePage
  },

  achat: {
    path: "achatproduit",
    name: "Achat produit",
    component: AchatPage
  },

  ventes: {
    path: "ventesProduit",
    name: "Ventes produit",
    component: VentePage
  },
  listVentes: {
    path: "listVentes",
    name: "Listes des ventes",
    component: ListesPage
  },
  detailVente: {
    path: "detailVentes",
    name: "Detail des ventes",
    component: DetailVentes
  },
  listachat: {
    path: "listachat",
    name: "Listes des ventes",
    component: ListeAchatPage
  },
  detailAchat: {
    path: "detailAchat",
    name: "Detail des ventes",
    component: DetailAchatPage
  },
  liststockmvt: {
    path: "stockMvt",
    name: "Stock Mouvement",
    component: ListeStockMvt
  },
  obr_Invoice: {
    path: "invoice",
    name: "Obr invoice",
    component: ObrInvoice
  },
}
var horaire_routes = []
for (let key in horaire_items) {
  const route = horaire_items[key]
  horaire_routes.push(<Route path={route.path} Component={route.component} key={route.path} />)
}
export default horaire_routes