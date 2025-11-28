import { useEffect, useState } from "react";
import "../../styles/app/sidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

import 'primeicons/primeicons.css';
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { Button } from "primereact/button";
import { userSelector } from "../../store/selectors/userSelector";
import { jwtDecode } from "jwt-decode";


export default function SideBar({ isMobile, setAsideVisible }) {


  const user = useSelector(userSelector)
  const decode = jwtDecode(user?.token)
  console.log(decode?.user.type, "-------------------------------");


  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
  const location = useLocation();

  useEffect(() => {
    const main = document.querySelector(".main")
    if (isSidebarMinimized) {
      if (main) {
        main.classList.add("minimized")
      }
      const allShown = document.querySelectorAll(".collapse.show")
      if (allShown.length > 0) {
        allShown.forEach(element => {
          element.classList.remove("show")
        })
      }
      const allCollapsed = document.querySelectorAll(`.nav-item a[aria-expanded="true"]`)
      if (allCollapsed.length > 0) {
        allCollapsed.forEach(element => {
          element.classList.remove("collapsed")
          element.setAttribute("aria-expanded", false);
        })
      }
    } else {
      if (main) {
        main.classList.remove("minimized")
      }
    }
  }, [isSidebarMinimized])



  const showSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = "block";
    // sidebar.style.marginRight='100%';
    // Dsidebar.addEventListener('click', () => {
    // console.log("show");
    // });

  }



  useEffect(() => {
    const prevActive = document.querySelector("nav .nav-item.active");
    if (prevActive) {
      prevActive.classList.remove("active");
    }
    const url = location.pathname;
    const entrireUrl = location.pathname + location.search;
    const splits = url.split("/");
    var activeLink;
    const commonNavItem = document.querySelector(`nav a[href='/${splits[1]}']`);
    const exactNavitem = document.querySelector(`nav a[href='${entrireUrl}']`);
    if (exactNavitem) {
      activeLink = exactNavitem;
    } else {
      activeLink = commonNavItem;
    }

    if (activeLink) {
      const parent = activeLink.parentElement;
      parent.classList.add("active");
      const navLinkParent = parent.parentElement;
      if (navLinkParent.classList.contains("collapse")) {
        navLinkParent.classList.add("show");
        const navLinkParentId = navLinkParent.getAttribute("id");
        const toCollapsedElement = document.querySelector(
          `[aria-controls='${navLinkParentId}']`
        );
        if (toCollapsedElement) {
          toCollapsedElement.classList.add("collapsed");
          toCollapsedElement.setAttribute("aria-expanded", true);
        }
      }
    }
  }, [location]);




  return (
    <>
      <aside
        className={`sidebar  flex-column justify-content-between shadow z-1 ${isSidebarMinimized ? "minimized" : ""
          }`}
      >
        <div className="d-flex justify-content-between align-items-center" style={{ background: "#4156d1d7" }}>
          <Link
            to={"/"}
            className="d-flex align-items-center px-3 py-2 text-decoration-none link-dark"
          >
            {isMobile ? null : (
              <Button
                size="small"
                severity="secondary"
                outlined
                style={{
                  color: "white",
                  width: 40,
                  height: 40,
                  border: "none",
                }}
                rounded
                className="p-2 mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSidebarMinimized((b) => !b);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="dark  "
                  className="bi bi-list"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                  />
                </svg>
              </Button>
            )}
            {/* <div className="logo-container">
              <img src={Logo} alt="" className="logo" />
            </div> */}
            <div className="ml-0">
              <div className="d-flex align-items-center">
                <h5 className="mb-0 app-brandName text-white fs-2">SkyTravel</h5>
                {/* <h5 className="mb-0 brandSubName ml-2 text-white">DIGITAL</h5> */}
              </div>
              {/* <AppDateTime /> */}
            </div>
          </Link>
          {isMobile ? (
            <Button
              size="small"
              severity="secondary"
              outlined
              style={{
                color: "white",
                width: 40,
                height: 40,
                border: "none",
              }}
              rounded
              className="p-2 mr-2"
              onClick={(e) => {
                e.preventDefault();
                setAsideVisible(false);
              }}
              icon="pi pi-times"
            />
          ) : null}
        </div>

        {/* <hr className="mx-3 my-2" style={{ borderTopColor: "#fff" }} /> */}
        <nav className={`px-2 flex-fill`}>
          {/* <div className="nav-item">
            <Link
              to={"dashboard"}
              className="text-decoration-none rounded d-block "
            >
              <div className="d-flex align-items-center justify-content-between py-2 px-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="menu-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-speedometer2" viewBox="0 0 16 16">
                      <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4M3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.39.39 0 0 0-.029-.518z" />
                      <path fillRule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A8 8 0 0 1 0 10m8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3" />
                    </svg>
                  </div>
                  <span className="menu-title">
                    Tableau de bord
                  </span>

                </div>
              </div>
            </Link>
          </div> */}
          {
            decode?.user.type == 'admin' ?
              <>
                <div className="nav-item">
                  <Link
                    to={"horaire"}
                    className="text-decoration-none rounded d-block "
                  >
                    <div className="d-flex align-items-center justify-content-between py-2 px-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="menu-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-database" viewBox="0 0 16 16">
                            <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525" />
                          </svg>
                        </div>
                        <span className="menu-title">
                          Donnees
                        </span>

                      </div>
                    </div>
                  </Link>
                </div>
                {/* ventes */}
                <div className="nav-item">
                  <Link
                    to={"listVentes"}
                    className="text-decoration-none rounded d-block text-white"
                  >
                    <div className="d-flex align-items-center justify-content-between py-2 px-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="menu-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-bag" viewBox="0 0 16 16">
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                          </svg>
                        </div>
                        <span className="menu-title">
                          Ventes
                        </span>

                      </div>
                    </div>
                  </Link>
                </div>
                {/* achat */}
                <div className="nav-item">
                  <Link
                    to={"detailAchat"}
                    className="text-decoration-none rounded d-block text-white"
                  >
                    <div className="d-flex align-items-center justify-content-between py-2 px-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="menu-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-wallet2" viewBox="0 0 16 16">
                            <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                          </svg>
                        </div>
                        <span className="menu-title">
                          Achat
                        </span>

                      </div>
                    </div>
                  </Link>
                </div>
                {/* stock */}
                <div className="nav-item">
                  <Link
                    to={"stockMvt"}
                    className="text-decoration-none rounded d-block text-white"
                  >
                    <div className="d-flex align-items-center justify-content-between py-2 px-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="menu-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-journal-x" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6.146 6.146a.5.5 0 0 1 .708 0L8 7.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 8l1.147 1.146a.5.5 0 0 1-.708.708L8 8.707 6.854 9.854a.5.5 0 0 1-.708-.708L7.293 8 6.146 6.854a.5.5 0 0 1 0-.708" />
                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
                          </svg>
                        </div>
                        <span className="menu-title">
                          Mouvement stock
                        </span>

                      </div>
                    </div>
                  </Link>
                </div>
                <div className="nav-item">
                  <Link
                    to={"invoice"}
                    className="text-decoration-none rounded d-block text-white"
                  >
                    <div className="d-flex align-items-center justify-content-between py-2 px-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="menu-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-journal-x" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6.146 6.146a.5.5 0 0 1 .708 0L8 7.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 8l1.147 1.146a.5.5 0 0 1-.708.708L8 8.707 6.854 9.854a.5.5 0 0 1-.708-.708L7.293 8 6.146 6.854a.5.5 0 0 1 0-.708" />
                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
                          </svg>
                        </div>
                        <span className="menu-title">
                          Obr invoice
                        </span>

                      </div>
                    </div>
                  </Link>
                </div>
                
              </> :
              <>
                {/* ventes */}
                <div className="nav-item">
                  <Link
                    to={"listVentes"}
                    className="text-decoration-none rounded d-block text-white"
                  >
                    <div className="d-flex align-items-center justify-content-between py-2 px-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="menu-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-bag" viewBox="0 0 16 16">
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                          </svg>
                        </div>
                        <span className="menu-title">
                          Ventes
                        </span>

                      </div>
                    </div>
                  </Link>
                </div>
              </>
          }


        </nav>

      </aside>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          onClick={showSidebar}
          fill="black"
          className="bi bi-justify mx-3 mt-2 d-sidebar"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"
          />
        </svg>
      </div>
    </>
  );
}
