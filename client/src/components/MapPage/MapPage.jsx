import React, {useEffect} from 'react';
import s from './MapPage.module.sass';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectAllStations,
  setCurrentPageIndex,
} from '../../redux/features/stationsSlice';
import L from 'leaflet';
import Pin from 'leaflet/dist/images/marker-icon-2x.png';
import Shadow from 'leaflet/dist/images/marker-shadow.png';
import {Link} from 'react-router-dom';

function MapPage() {
  const stations = useSelector(selectAllStations);

  const dispatch = useDispatch();

  const Icon = L.icon({
    iconUrl: Pin,
    shadowUrl: Shadow,

    iconSize: [38, 55], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 54], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -50], // point from which the popup should open relative to the iconAnchor
  });

  useEffect(() => {
    dispatch(setCurrentPageIndex(['3']));
  }, []);
  return (
    <div className={s.mapWrapper}>
      <MapContainer
        center={[50.44034956835362, 30.542987368886138]}
        zoom={12}
        scrollWheelZoom={true}
        className={s.map}
      >
        {stations.map((station) => {
          const dot = [station?.Latitude, station?.Longitude];
          const path = `/station/${station.ID_Station}`;

          return (
            <Marker position={dot} icon={Icon}>
              <Popup>
                <Link to={path}>{station.Name}</Link>
              </Popup>
            </Marker>
          );
        })}
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      </MapContainer>
    </div>
  );
}

export default MapPage;
