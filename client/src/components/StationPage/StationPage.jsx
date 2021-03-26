import React, {useEffect, useState} from 'react';
import s from './StationPage.module.sass';
import {DatePicker, Space} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {Line} from '@ant-design/charts';
import {
  selectLoading,
  setCurrentStationMeasurements,
  setCurrentStationThunk,
  selectCurrentStation,
} from '../../redux/features/stationsSlice';
import Loader from '../Loader/Loader';
import {formatChartObject, formatDate} from '../../util/util';
import moment from 'moment';

const {RangePicker} = DatePicker;

function StationPage({match}) {
  const [dateEnd, setDateEnd] = useState(moment(new Date(), dateFormat));
  const [dateStart, setDateStart] = useState(
    moment(new Date(), dateFormat).subtract(1, 'days')
  );
  const station = useSelector(selectCurrentStation);

  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  var dateFormat = 'YYYY-MM-DD HH:mm:ss';

  useEffect(async () => {
    await dispatch(
      setCurrentStationThunk(
        match.params.id,
        dateStart.format(dateFormat),
        dateEnd.format(dateFormat)
      )
    );
  }, []);

  const config = {
    data: station.measurementsFormated,
    xField: 'date',
    yField: 'value',
    padding: 'auto',
    xAxis: {tickCount: 5},
    slider: {
      start: 0.1,
      end: 0.5,
    },
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
  };

  const onPickDate = (date, dateString) => {
    dispatch(setCurrentStationMeasurements(dateString[0], dateString[1]));
  };

  if (loading) return <Loader />;

  return (
    <div className={s.stationPage}>
      <div className={s.stationPageTop}>
        <RangePicker
          onChange={onPickDate}
          showTime
          defaultValue={[dateStart, dateEnd]}
          format={dateFormat}
        />
      </div>
      <div className={s.stationPageBottom}>
        <div className={s.stationPageChart}>
          {station.measurementsFormated && <Line {...config} />}
        </div>
      </div>
    </div>
  );
}

export default StationPage;
