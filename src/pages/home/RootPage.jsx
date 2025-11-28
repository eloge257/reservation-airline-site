import { Outlet } from "react-router-dom";
import { useIntl } from "react-intl";
import HorairePage from "../Ghoraire/HorairePage";
import { userSelector } from "../../store/selectors/userSelector";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import VentePage from "../Ghoraire/ventes/VentePage";
import ListesPage from "../Ghoraire/ventes/ListesPage";


const RootPage = () => {
       const user = useSelector(userSelector)
        const decode = jwtDecode(user?.token)
   
    
    return (
        <>
            <>
                <div className="px-4 py-3 main_content">
                    <h1 className="mb-3">{decode?.user.type == "admin" ?  "Données" : "Ventes" }    </h1>
                    <div className="content">
                        {decode?.user.type == "admin" ? 
                        <HorairePage/>
                        :
                        <ListesPage/>
                        }
                    </div>
                </div>
                <Outlet />
            </>
        </>
    )
}

export default RootPage