import { Link, Outlet, useNavigate, useNavigation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
          setBreadCrumbItemsAction,
          setToastAction,
} from "../../store/actions/appActions";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Loading from "../app/Loading";
import { dashboard_routes_items } from "../../routes/dashboard/dashboard_routes";
import Totalrevenuedriver from "./Totalrevenuedriver";
import Coursedemande from "./Coursedemande";
import Courseannuler from "./Coursesannuler";
import moment from "moment";

import { Calendar } from 'primereact/calendar';
import Courseparcorporate from "./Courseparcorporate";
import Course_top_corporate from "./Courseparcorporate";
import Coursetopcorporate from "./Coursetopcorporate";
import Chauffeurenlgnehordesactivation from "./Chauffeurenlgnehordesactivation";
import { userSelector } from "../../store/selectors/userSelector";
import PROFILS from "../../constants/PROFILS";
import Rapport_corpoPerPeriod from "../corporate/Rapport_corpoPerPeriod";
import RapportCliCorpoPerCrs from "../corporate/RapportCliCorpoPerCrs";
import CorpoTBNbrCourse from "./CorpoTBNbrCourse";
import MotifModifTrajetsRapport from "./MotifModifTrajetsRapport";

export default function Dashboard({ dates, loading, setLoading,refresh,dates_=null,cliSelecteds = [],departement = null }) {
    const user = useSelector(userSelector)
          return (
                    <>
                              {/* <ConfirmDialog closable dismissableMask={true} />
                              <CorpoTBNbrCourse dates={dates_} loading={loading} setLoading={setLoading} refresh={refresh} cliSelecteds={cliSelecteds} /> : 
                              <Totalrevenuedriver dates={dates} loading={loading} setLoading={setLoading} refresh={refresh} /> 
                               <div className="row px-3">
                               <Coursedemande dates={dates} loading={loading} setLoading={setLoading} refresh={refresh} />
                               <Courseannuler dates={dates} refresh={refresh} /> 
                               <Courseparcorporate dates={dates} loading={loading} setLoading={setLoading} refresh={refresh} />
                               <Coursetopcorporate dates={dates} refresh={refresh} />
                               <Chauffeurenlgnehordesactivation dates={dates} loading={loading} setLoading={setLoading} refresh={refresh} /> 
                               <MotifModifTrajetsRapport dates={dates} loading={loading} setLoading={setLoading} refresh={refresh} /> 
                               
                     </div> */}
                          
                             
                    </>
          );
}
