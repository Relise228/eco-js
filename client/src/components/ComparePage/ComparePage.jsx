import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Area, Line} from '@ant-design/charts';
import {
  getStations,
  selectAllStations,
  selectLoading,
  setCurrentPageIndex,
  setLoading,
} from '../../redux/features/stationsSlice';
import s from './ComparePage.module.sass';
import {Select, DatePicker} from 'antd';
import Loader from '../Loader/Loader';
import {
  selectFullUnits,
  selectMeasurements,
  setCompareUnits,
  setStationsMeasurements,
  selectSelectedMeasuredId,
  setSelectedMeasuredId,
} from '../../redux/features/compareSlice';
import ss from '../StationPage/StationPage.module.sass';
import moment from 'moment';
import MainInfoStation from '../MainInfoStation/MainInfoStation';
const {Option} = Select;
const {RangePicker} = DatePicker;

function ComparePage() {
  const loading = useSelector(selectLoading);
  const stations = useSelector(selectAllStations);

  const fullUnits = useSelector(selectFullUnits);
  const selectedMeasuredId = useSelector(selectSelectedMeasuredId);

  const [first, setFirst] = useState(stations[0]);
  const [second, setSecond] = useState(stations[1]);

  var dateFormat = 'YYYY-MM-DD HH:mm:ss';
  const [dateEnd, setDateEnd] = useState(moment(new Date(), dateFormat));
  const [dateStart, setDateStart] = useState(
    moment(new Date(), dateFormat).subtract(1, 'days')
  );

  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(setCurrentPageIndex(['2']));
    await dispatch(setCompareUnits(first.ID_Station, second.ID_Station));
    dispatch(
      setStationsMeasurements(
        dateStart.format(dateFormat),
        dateEnd.format(dateFormat),
        first.ID_Station,
        second.ID_Station,
        first.Name,
        second.Name
      )
    );
  }, []);

  const handleChangeFirst = async (value) => {
    dispatch(setLoading(true));
    const newStation = [...stations.filter((s) => s.ID_Station === value)];
    console.log('new >>', newStation);
    setFirst(...newStation);
    //// UPDATE MEASUREMENTS ON EACH BUTTON
    await dispatch(setCompareUnits(value, second.ID_Station));
    dispatch(
      setStationsMeasurements(
        dateStart.format(dateFormat),
        dateEnd.format(dateFormat),
        newStation[0].ID_Station,
        second.ID_Station,
        newStation[0].Name,
        second.Name
      )
    );
    dispatch(setLoading(false));
  };

  const handleChangeSecond = async (value) => {
    dispatch(setLoading(true));
    const newStation = [...stations.filter((s) => s.ID_Station === value)];
    setSecond(...newStation);
    await dispatch(setCompareUnits(first.ID_Station, value));
    dispatch(
      setStationsMeasurements(
        dateStart.format(dateFormat),
        dateEnd.format(dateFormat),
        first.ID_Station,
        newStation[0].ID_Station,
        first.Name,
        newStation[0].Name
      )
    );
    dispatch(setLoading(false));
  };

  const handleChangeUnit = (value) => {
    dispatch(setLoading(true));
    dispatch(setSelectedMeasuredId(value));
    dispatch(
      setStationsMeasurements(
        dateStart.format(dateFormat),
        dateEnd.format(dateFormat),
        first.ID_Station,
        second.ID_Station,
        first.Name,
        second.Name
      )
    );
    dispatch(setLoading(false));
  };

  const onPickDate = async (date, dateString) => {
    dispatch(setLoading(true));
    setDateStart(moment(dateString[0], dateFormat));
    setDateEnd(moment(dateString[1], dateFormat));
    dispatch(
      setStationsMeasurements(
        dateString[0],
        dateString[1],
        first.ID_Station,
        second.ID_Station,
        first.Name,
        second.Name
      )
    );
    dispatch(setLoading(false));
  };

  console.log(first);
  if (loading) return <Loader />;

  return (
    <div className={s.compare}>
      <div className={s.compareHeader}>
        <div className={s.firstStation}>
          Select first Station:
          <Select
            style={{width: 220, marginLeft: 30}}
            onChange={handleChangeFirst}
            className={s.select}
            defaultValue={first.ID_Station}
          >
            {stations.map((s) => (
              <Option key={s.ID_Station} value={s.ID_Station}>
                {s.Name}
              </Option>
            ))}
          </Select>
        </div>
        <div className={s.secondStation}>
          Select second Station:
          <Select
            style={{width: 220, marginLeft: 30}}
            onChange={handleChangeSecond}
            className={s.select}
            defaultValue={second.ID_Station}
          >
            {stations.map((s) => (
              <Option key={s.ID_Station} value={s.ID_Station}>
                {s.Name}
              </Option>
            ))}
          </Select>
        </div>

        <div className={s.stationUnits}>
          Select Unit:
          <Select
            style={{width: 220, marginLeft: 30}}
            onChange={handleChangeUnit}
            className={s.select}
            defaultValue={selectedMeasuredId}
          >
            {fullUnits?.compareUnits?.map((u) => (
              <Option key={u.ID_Measured_Unit} value={u.ID_Measured_Unit}>
                {u.Title}, {u.Unit}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          Select Date Range:{' '}
          <RangePicker
            onChange={onPickDate}
            showTime
            defaultValue={[dateStart, dateEnd]}
            format={dateFormat}
            className={s.stationPageDatePicker}
          />
        </div>
      </div>
      <div className={s.compareContent}>
        <CompareChart />
      </div>
      <div>
        <MainInfoStation
          station={first}
          s={ss}
          globalStyle={s.compareStationGlobal}
        />
        <MainInfoStation
          station={second}
          s={ss}
          globalStyle={s.compareStationGlobal}
        />
      </div>
    </div>
  );
}

const CompareChart = () => {
  const dataChart = useSelector(selectMeasurements);

  let full_data = [];

  if (dataChart) {
    for (let ob of dataChart.measurements_first) {
      for (let ob2 of dataChart.measurements_second) {
        if (ob.date === ob2.date) {
          full_data.push(ob);
          full_data.push(ob2);
        }
      }
    }
  }

  console.log('fullll', full_data);

  var config = {
    data: [...full_data] || [],
    xField: 'date',
    yField: 'value',
    seriesField: 'name',
    point: full_data.length < 100 && {
      size: 2,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return ''.concat(s, ',');
          });
        },
      },
    },
  };

  return (
    <div className={s.compareChart}>
      <Line {...config} />
    </div>
  );
};

export default ComparePage;
