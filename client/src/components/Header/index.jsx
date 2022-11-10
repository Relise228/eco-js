import React, { useCallback, useState } from "react"
import "./header.sass"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faChartLine,
  faChartPie,
  faCirclePlus,
  faPlusSquare,
  faRightFromBracket,
  faTable,
  faTowerBroadcast,
  faUserPlus,
  faXmark
} from "@fortawesome/free-solid-svg-icons"
import Logo from "../../img/logo.png"
import { NavLink } from "react-router-dom"
import { Offcanvas } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { setAuth } from "../../redux/features/authSlice"

const Header = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const dispatch = useDispatch()

  const onLogOut = useCallback(() => {
    dispatch(setAuth(false))
    localStorage.removeItem("token")
  }, [dispatch])

  return (
    <div className="header py-4 sticky-top" style={{ backgroundColor: "#fff" }}>
      <div className="container-xxl">
        <div className="header-wrapper d-flex align-items-center">
          <FontAwesomeIcon icon={faBars} size="2x" color="#8cc541" role="button" onClick={() => setIsOpenMenu(true)} />

          <div className="w-100 d-flex justify-content-center">
            <NavLink to="/stations/?order=idUp&onlyFav=false">
              <img src={Logo} alt="" className="header-logo justify-self-center" />
            </NavLink>
          </div>
        </div>
      </div>

      <Offcanvas restoreFocus={false} show={isOpenMenu} onHide={() => setIsOpenMenu(false)} placement="start">
        <Offcanvas.Header className="mt-4 d-flex justify-content-end">
          <FontAwesomeIcon icon={faXmark} color="#0099C9" size="2x" role="button" onClick={() => setIsOpenMenu(false)} />
        </Offcanvas.Header>
        <Offcanvas.Body className="position-relative">
          <ul className="offcanvas-tabs d-flex flex-column">
            <li className="offcanvas-tabs-tab">
              <NavLink activeClassName="active" to="/stations/?order=idUp&onlyFav=false">
                <div className="row">
                  <div className="col-2">
                    <FontAwesomeIcon icon={faTowerBroadcast} color="#0099C9" className="me-3" />
                  </div>
                  <div className="col-10">Stations</div>
                </div>
              </NavLink>
            </li>
            <li className="offcanvas-tabs-tab">
              <NavLink activeClassName="active" to="/compare">
                <div className="row">
                  <div className="col-2">
                    <FontAwesomeIcon icon={faCirclePlus} color="#0099C9" className="me-3" />
                  </div>
                  <div className="col-10">Compare</div>
                </div>
              </NavLink>
            </li>
            <li className="offcanvas-tabs-tab">
              <NavLink activeClassName="active" to="/reports">
                <div className="row">
                  <div className="col-2">
                    <FontAwesomeIcon icon={faChartPie} color="#0099C9" className="me-3" />
                  </div>
                  <div className="col-10">Reports</div>
                </div>
              </NavLink>
            </li>
            <li className="offcanvas-tabs-tab">
              <NavLink active="active" to="/map">
                <div className="row">
                  <div className="col-2">
                    <FontAwesomeIcon icon={faChartLine} color="#0099C9" fontSize="2rem" className="me-3" />
                  </div>
                  <div className="col-10">Map</div>
                </div>
              </NavLink>
            </li>
          </ul>

          <button className="btn btn-danger log-out-btn" onClick={onLogOut} type="button">
            <FontAwesomeIcon icon={faRightFromBracket} color="#fff" fontSize="1rem" className="me-3" />
            Log Out
          </button>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

export default Header
