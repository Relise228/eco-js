import React from 'react';
import L from 'leaflet';

import s from './Station.module.sass';

import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import {Link} from 'react-router-dom';

import 'leaflet/dist/leaflet.css';
import Pin from 'leaflet/dist/images/marker-icon-2x.png';
import Shadow from 'leaflet/dist/images/marker-shadow.png';
import SaveEcoBot from '../../../img/SaveEcoBot.png';
import OwnImg from '../../../img/own.png';

function Station({station}) {
  const dot = [station.Latitude, station.Longitude];

  const Icon = L.icon({
    iconUrl: Pin,
    shadowUrl: Shadow,

    iconSize: [38, 55], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 54], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -50], // point from which the popup should open relative to the iconAnchor
  });

  const style =
    station.Status === 'enabled'
      ? {
          backgroundColor: 'rgb(125, 238, 20)',
        }
      : {};

  return (
    <div className={s.station}>
      <div className={s.stationMap}>
        <MapContainer
          center={dot}
          zoom={10}
          scrollWheelZoom={false}
          style={{maxWidth: 300, width: '100%', height: 200}}
        >
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <Marker position={dot} icon={Icon}>
            <Popup>{station.Name}</Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className={s.stationInfo}>
        <div className={s.stationInfoTop}>
          <div className={s.stationInfoId}>
            ID Station: {station.ID_Station}
          </div>
          <div className={s.stationInfoName}>{station.Name}</div>
          <div className={s.stationInfoStatus} style={style}></div>
        </div>
        <div className={s.stationInfoBottom}>
          <div className={s.stationInfoSave}>
            <img
              src={station.ID_SaveEcoBot ? SaveEcoBot : OwnImg}
              className={s.stationInfoLogo}
            />
          </div>
          <div className={s.stationInfoValues}>{station?.units?.join(',')}</div>
          <div className={s.stationInfoView}>
            {station?.units?.length > 0 && (
              <Link to={`/station/${station.ID_Station}`}>View</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Station;
