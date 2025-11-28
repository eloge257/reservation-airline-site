// import { useEffect } from "react";
import { useEffect,useState } from "react";
import { Link, useLocation } from "react-router-dom";
import fetchApi from "../../helpers/fetchApi";
import { Badge } from "primereact/badge";
import useQuery from "../../hooks/useQuery";
import { encodeId } from "../../utils/IdEncryption";

export default function StatutNav({ statut }) {
    const [countCourse, setCountCourse] = useState([])
const query = useQuery()
const location = useLocation()
    useEffect(() => {
        (async () => {
            try {
                const res =  await fetchApi(`/admin/courses/Countcourses/${statut.ID_STATUT}`)
                const toDisplay = res.result
                setCountCourse(toDisplay)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [query, location])

    return (
        <div className='nav-item'>
            <Link to={`/course?statut=${encodeId(statut.ID_STATUT)}`} className="text-decoration-none rounded d-block text-white">
                <div className="d-flex align-items-center justify-content-between py-2 px-3">
                    <div className='d-flex align-items-center justify-content-between'>
                        <div className="menu-icon">
                        </div>
                        <span className='menu-title'>{statut.NOM}</span>
                    </div>
                    {countCourse > 0 ? <Badge value={countCourse} className='rounded-5' severity="danger"></Badge> : null}
                </div>
            </Link>
        </div>
    )
}