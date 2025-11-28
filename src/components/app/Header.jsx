import "../../styles/app/header.css"
import { Button } from 'primereact/button';
import moment from 'moment'
import Image from '/images/user.webp'
import BreadCrumb from "./BreadCrumb";
import { useEffect, useRef, useState } from "react";
import { SlideMenu } from 'primereact/slidemenu';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../store/selectors/userSelector";
import { setUserAction } from "../../store/actions/userActions";
import removeUserDataAndCaches from "../../utils/removeUserDataAndCaches";
import { setLocaleAction } from "../../store/actions/appActions";
import { useIntl } from "react-intl";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Sidebar } from "primereact/sidebar";
import AppSideBar from "./SideBar";
import { jwtDecode } from "jwt-decode";
moment.updateLocale('fr', {
  weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Séptembre', 'Octoble', 'Novembre', 'Décembre']
})


export default function Header() {
  const menu = useRef(null);
  const user = useSelector(userSelector)
  const decode = jwtDecode(user?.token)

  const dispacth = useDispatch()
  const navigate = useNavigate()
  const intl = useIntl()
  const [asideVisible, setAsideVisible] = useState(false);

  const handleAccept = async () => {
    removeUserDataAndCaches(user.ID_UTILISATEUR, user.REFRESH_TOKEN)
    dispacth(setUserAction(null))
    localStorage.setItem('user', null)
    navigate('/login')
  }
  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    confirmDialog({
      headerStyle: { background: `#4156d1d7`, backgroundSize: 'cover' },
      headerClassName: "text-white",
      header: `Deconnexion`,
      // style: { width: '30vw' },
      message: (
        <div className="d-flex flex-column align-items-center">
          <>
            <div className="font-bold text-center my-2">
            </div>
            <div className="text-center">
              Voulez-vous se deconnecter
            </div>
          </>
        </div>
      ),
      acceptClassName: "p-button-danger",
      acceptLabel: `Oui`,
      rejectLabel: `Non`,
      accept: handleAccept,
    });
  };


  const items = [
    {
      template: () => {
        return (
          <>
            <div className="d-flex align-items-center w-100 px-2">
              <div className="avatar">
                <img src={Image} alt="" className="" />
              </div>
              <div className="usernames ml-2">
                <div className="font-bold white-space-nowrap">{decode?.user?.firstname} {decode?.user?.lastname}</div>
                <div className="texte-muted text-sm white-space-nowrap">{decode?.user?.username}</div>
              </div>
            </div>
            <hr className="mb-0 mt-2" />
          </>
        )
      }
    },
 
    {
      template: (deleteItem, options) => {
        return (
          <>
            <Link to={`#`} className="p-menuitem-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16" style={{ marginRight: "0.8rem" }}>
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
              </svg>
              <span className="p-menuitem-text">Parametre</span>
            </Link>
            <hr className="my-0" />
          </>
        )
      }
    },
    {
      template: (deleteItem, options) => {
        return (
          <Link to={`#`} className="p-menuitem-link" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16" style={{ marginRight: "0.8rem" }}>
              <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
              <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
            </svg>
            <span className="p-menuitem-text"> Se deconnecter</span>
          </Link>
        )
      }
    },
  ];

  return (
          <>
    <ConfirmDialog closable dismissableMask={true} />
          <Sidebar visible={asideVisible} onHide={() => setAsideVisible(false)} header={null} showCloseIcon={false} className="appMobileAside">
                    <AppSideBar isMobile={true} setAsideVisible={setAsideVisible} />
          </Sidebar>
    <header className="align-items-center justify-content-between px-4 " style={{  backgroundSize: 'cover' }}>
      <div className="d-flex align-items-center flex-1">
                              <Button size="small" severity="secondary"  outlined style={{  color: "dark", width: 40, height: 40, border: "none" }} rounded className="p-2 mr-2" id="mobileSidebarOpener" onClick={e => {
                                        e.preventDefault()
                                        setAsideVisible(true)
                              }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="dark" className="bi bi-list" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>
                              </Button>
     
      </div>

      <div className="flex align-items-center py-2 ">
        <SlideMenu ref={menu} model={items} popup viewportHeight={170} menuWidth={300} style={{ width: 300 }} className="mt-2" onHide={() => {
        }} />
        <Button text className="p-0 avatar " onClick={e => {
          menu.current.toggle(e)
        }}>
          <img src={Image} alt="" className="" />
        </Button>
      </div>
    </header>
    </>
  )
}