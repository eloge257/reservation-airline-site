import { useEffect } from 'react'
import '../../styles/app/notFound.scss'
import { useSelector } from 'react-redux'
import { userSelector } from '../../store/selectors/userSelector'
// import {  } from 'react-router'
import { Link , useNavigate} from 'react-router-dom'
import { useIntl } from 'react-intl'

export default function NotFound() {
    const intl = useIntl()
    useEffect(() => {
        document.title = intl.formatMessage({ id: "NotFund.PageNonTrouve" })
    }, [])

    const user = useSelector(userSelector)
    const navigate = useNavigate()
    return (
        <div className='w-100' style={{ height: "calc(100vh - 75px)" }}>
            <div className={`notfound-content d-flex flex-column align-items-center justify-content-center w-100 h-100 ${!user ? 'absolute' : ''}`}>
                <div className="notfound-icon">
                    <div className="notfound-icon-content">
                        <div className="eyes">
                            <div className="left"></div>
                            <div className="right"></div>
                        </div>
                        <div className="mouth"></div>
                    </div>
                </div>
                <div className="notfound-detail text-center">
                    <h5>Hmm! <br /> {intl.formatMessage({ id: "NotFund.PageNonTrouve" })}</h5>
                </div>
                {!user ? <div className="quick-links mt-2">
                    <Link to={"/"} aria-label="Page d'acceuil" className="p-button p-component mr-2 p-button-sm p-button-info text-decoration-none">
                        <span className="p-button-label p-c">{intl.formatMessage({ id: "NotFund.Pageaccueil" })}</span>
                    </Link>
                    <Link to={"/"} aria-label="Page d'acceuil" className="p-button p-component p-button-sm p-button-info text-decoration-none">
                        <span className="p-button-label p-c">{intl.formatMessage({ id: "NotFund.seConnecter" })}</span>
                    </Link>
                </div> : null}
            </div>
        </div>
    )
}