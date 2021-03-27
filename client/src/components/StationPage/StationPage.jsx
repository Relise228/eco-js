import React, {useEffect, useState} from 'react';
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

import moment from 'moment';
import BoxValue from './BoxValue/BoxValue';

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

  return (
    <div className={s.stationPage}>
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
