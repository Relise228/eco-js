import React from "react"
import L from "leaflet"
import "./Station.sass"
import StationBadge from "./StationBadge"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useNavigate } from "react-router-dom"
import Pin from "leaflet/dist/images/marker-icon-2x.png"
import Shadow from "leaflet/dist/images/marker-shadow.png"
import SaveEcoBot from "../../../img/SaveEcoBot.png"
import OwnImg from "../../../img/own.png"
import { useDispatch } from "react-redux"
import { updateFavorite } from "../../../redux/features/stationsSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"

import "leaflet/dist/leaflet.css"

const Station = React.memo(({ station, page, units = [], hideFavorite }) => {
  const dot = [station.Latitude, station.Longitude]
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const Icon = L.icon({
    iconUrl: Pin,
    shadowUrl: Shadow,
    iconSize: [38, 55], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 54], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -50] // point from which the popup should open relative to the iconAnchor
  })

  const { Name, ID_SaveEcoBot, Status, ID_Station, Favorite } = station

  const stationUnits = station.units?.length ? station.units : units

  return (
    <div className={`col-12 station ${page ? "station-on-page" : ""}`}>
      <div className="card position-relative">
        {Favorite && <div className="favorite"></div>}
        <div className="row">
          <div className="col-md-4 col-12">
            <MapContainer className="w-100" center={dot} zoom={10} scrollWheelZoom style={{ height: 200 }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={dot} icon={Icon}>
                <Popup>{Name}</Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="col-8 card-body position-relative">
            <div className="row">
              <div className="col-12 position-relative">
                <p className="station-name ms-2">{Name}</p>
                <>
                  <div className={`station-status d-none d-md-block ${Status === "enabled" ? "active-station" : "disabled"}`}>
                    {Status === "enabled" ? "Recording" : "Disabled"}
                  </div>
                  <div className={`station-status d-md-none hide ${Status === "enabled" ? "active-station" : "disabled"}`}></div>
                </>
              </div>
              <div className="col-12 station-badges">
                {stationUnits.map(unit => (
                  <StationBadge title={unit} />
                ))}
              </div>
              <div className="col-12 logo-wrapper">
                <a href={ID_SaveEcoBot ? "https://www.saveecobot.com/" : "/"} target="_blank" rel="noreferrer">
                  <img src={ID_SaveEcoBot ? SaveEcoBot : OwnImg} className="station-logo" alt="" />
                </a>
              </div>
              <div className="row station-buttons px-0" style={{ width: "fit-content" }}>
                {!page && (
                  <div className="d-flex">
                    {!hideFavorite && (
                      <button
                        onClick={() => dispatch(updateFavorite(station.ID_Station, !station.Favorite))}
                        className={`btn me-3 ${Favorite ? "btn-danger" : "btn-warning"}`}
                      >
                        <FontAwesomeIcon icon={faStar} className={page ? "me-2" : ""} />
                      </button>
                    )}
                    <button
                      className="btn btn-primary"
                      disabled={!stationUnits?.length}
                      onClick={() => navigate(`/station/${ID_Station}`)}
                    >
                      Go to station
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Station
