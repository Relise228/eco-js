import React, {useEffect, useState} from 'react';
import L from 'leaflet';
import s from './StationPage.module.sass';
import {DatePicker, Select} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {Line} from '@ant-design/charts';
import {
  selectLoading,
  setCurrentStationMeasurements,
  setCurrentStationThunk,
  selectCurrentStation,
  setLoading,
  setSelectedMeasuredId,
  setUnitInfo,
  selectSelectedUnitInfo,
  selectSelectedUnitInfoOptimal,
} from '../../redux/features/stationsSlice';
import Loader from '../Loader/Loader';

import SaveEcoBot from '../../img/SaveEcoBot.png';
import OwnImg from '../../img/own.png';

import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import moment from 'moment';
import BoxValue from './BoxValue/BoxValue';

import Pin from 'leaflet/dist/images/marker-icon-2x.png';
import Shadow from 'leaflet/dist/images/marker-shadow.png';

const {RangePicker} = DatePicker;
const {Option} = Select;

const StationPage = React.memo(({match}) => {
  var dateFormat = 'YYYY-MM-DD HH:mm:ss';
  const loading = useSelector(selectLoading);
  const station = useSelector(selectCurrentStation);
  const selectedUnitInfo = useSelector(selectSelectedUnitInfo);
  const selectedUnitInfoOptimal = useSelector(selectSelectedUnitInfoOptimal);

  const dispatch = useDispatch();

  const [dateEnd, setDateEnd] = useState(moment(new Date(), dateFormat));
  const [dateStart, setDateStart] = useState(
    moment(new Date(), dateFormat).subtract(1, 'days')
  );

  useEffect(async () => {
    dispatch(setLoading(true));
    await dispatch(
      setCurrentStationThunk(
        match.params.id,
        dateStart.format(dateFormat),
        dateEnd.format(dateFormat)
      )
    );
    dispatch(setLoading(false));
  }, []);

  const config = {
    data: station.measurementsFormated,
    tooltip: {
      formatter: (datum) => {
        const sign = station.fullUnits?.filter(
          (u) => u?.ID_Measured_Unit === station.selectedMeasuredId
        );
        return {name: 'Value', value: datum.value + ' ' + sign[0]?.Unit};
      },
    },
    xField: 'date',
    yField: 'value',
    padding: 'auto',
    xAxis: {tickCount: 5},
    slider: {
      start: 0,
      end: 1,
    },
    point: station.measurementsFormated?.length < 100 && {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
  };

  const onPickDate = async (date, dateString) => {
    dispatch(setLoading(true));
    setDateStart(moment(dateString[0], dateFormat));
    setDateEnd(moment(dateString[1], dateFormat));
    dispatch(
      setCurrentStationMeasurements(
        dateString[0],
        dateString[1],
        station.selectedMeasuredId
      )
    );
    dispatch(setLoading(false));
  };

  const handleChangeSelect = async (value) => {
    dispatch(setLoading(true));
    dispatch(setSelectedMeasuredId(value));
    dispatch(
      setCurrentStationMeasurements(
        dateStart.format(dateFormat),
        dateEnd.format(dateFormat),
        value
      )
    );
    dispatch(setUnitInfo());
    dispatch(setLoading(false));
  };

  if (loading) return <Loader />;

  const BlockInfo = () => {
    if (selectedUnitInfo === undefined) return '';
    else
      return (
        <div className={s.stationPageInfoHeader}>
          Optimal Value {selectedUnitInfo[0]?.Title},{' '}
          {selectedUnitInfo[0]?.Unit}
        </div>
      );
  };

  const BlockInfoOptimal = () => {
    if (
      selectedUnitInfoOptimal === undefined ||
      selectedUnitInfoOptimal.length === 0
    )
      return '';
    else
      return (
        <div className={s.stationPageInfoContent}>
          {selectedUnitInfoOptimal[0]?.map((o) => (
            <BoxValue
              Designation={o.Designation}
              Bottom_Border={o.Bottom_Border}
              Upper_Border={o.Upper_Border}
            />
          ))}
        </div>
      );
  };

  const BlockAllInfo = () => {
    if (
      selectedUnitInfoOptimal === undefined ||
      selectedUnitInfoOptimal.length === 0
    )
      return '';
    else
      return (
        <div className={s.stationPageInfo}>
          <BlockInfo />
          <BlockInfoOptimal />
        </div>
      );
  };

  const MainInfo = () => {
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
      <div className={s.stationPageMainInfo}>
        <div className={s.stationPageStation}>
          <div className={s.stationPageName}>
            <b>Station</b>: {station.Name}
          </div>
          <div className={s.stationPageID}>
            ID Station: {station.ID_Station}
          </div>
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

  return (
    <div className={s.stationPage}>
      <MainInfo />
      <div className={s.stationPageTop}>
        Select Date Range:{' '}
        <RangePicker
          onChange={onPickDate}
          showTime
          defaultValue={[dateStart, dateEnd]}
          format={dateFormat}
          className={s.stationPageDatePicker}
        />
        {station.selectedMeasuredId && (
          <div className={s.stationPageMeasur}>
            Select measurement:
            <Select
              defaultValue={station.selectedMeasuredId}
              style={{width: 170}}
              onChange={handleChangeSelect}
              className={s.select}
            >
              {station.fullUnits?.map((u) => (
                <Option
                  key={u.ID_Measured_Unit}
                  value={u.ID_Measured_Unit}
                  className={s.stationPageUnit}
                >
                  {u.Title}, {u.Unit}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </div>
      <div className={s.stationPageBottom}>
        <div className={s.stationPageChart}>
          {station.measurementsFormated && <Line {...config} />}
        </div>
        <BlockAllInfo />
      </div>
    </div>
  );
});

export default StationPage;
