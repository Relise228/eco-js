import React, {useEffect, useState} from 'react';
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
  const [onlySave, setOnlySave] = useState(false);
  const [onlyOwn, setOnlyOwn] = useState(false);

  console.log(stations);
  const dispatch = useDispatch();
  const [array, setArray] = useState([...stations]);

  useEffect(() => {
    if (onlySave) {
      setArray(stations.filter((s) => s.ID_SaveEcoBot !== null));
      console.log(array, 'firrrrs');
    } else if (onlyOwn) {
      setArray(stations.filter((s) => !s.ID_SaveEcoBot));
    } else {
      setArray(stations);
    }
  }, [onlySave, onlyOwn]);

  console.log(array, 'array');

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
        zoom={6}
        scrollWheelZoom={true}
        className={s.map}
      >
        {array.map((station) => {
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
      <div className={s.menuWrapper}>
        <fieldset>
          <input
            type='checkbox'
            id='inputCheckSaveEco'
            checked={onlySave}
            onChange={() => setOnlySave(!onlySave)}
            disabled={onlyOwn}
          />
          <label htmlFor='inputCheckSaveEco'>
            Show only SaveEcoBot stations
          </label>
        </fieldset>
        <fieldset>
          <input
            type='checkbox'
            id='inputCheckOwn'
            checked={onlyOwn}
            onChange={() => setOnlyOwn(!onlyOwn)}
            disabled={onlySave}
          />
          <label htmlFor='inputCheckOwn'>Show only own stations</label>
        </fieldset>
      </div>
    </div>
  );
}

export default MapPage;
