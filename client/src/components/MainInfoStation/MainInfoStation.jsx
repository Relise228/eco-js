import L from 'leaflet';
import Pin from 'leaflet/dist/images/marker-icon-2x.png';
import Shadow from 'leaflet/dist/images/marker-shadow.png';
import SaveEcoBot from '../../img/SaveEcoBot.png';
import OwnImg from '../../img/own.png';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import classNames from 'classnames';

const MainInfoStation = (props) => {
  const {s, station, globalStyle} = props;
  const dot = [station?.Latitude, station?.Longitude];

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
    <div className={classNames(s.stationPageMainInfo, globalStyle)}>
      <div className={s.stationPageStation}>
        <div className={s.stationPageName}>
          <b>Station</b>: {station.Name}
        </div>
        <div className={s.stationPageID}>ID Station: {station.ID_Station}</div>
        <div className={s.stationPageUnits}>
          Units: {station.units?.join(', ')}
        </div>
        <div className={s.stationPageType}>
          <img
            src={station.ID_SaveEcoBot ? SaveEcoBot : OwnImg}
            className={s.stationPageLogo}
          />
        </div>
        <div className={s.stationPageStatus} style={style}></div>
      </div>
      <div className={s.stationPageMap}>
        {dot[0] !== undefined && (
          <MapContainer
            center={dot}
            zoom={13}
            scrollWheelZoom={false}
            style={{width: '100%', height: '100%'}}
          >
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
            <Marker position={dot} icon={Icon}>
              <Popup>{station.Name}</Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default MainInfoStation;
