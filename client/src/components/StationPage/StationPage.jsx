import React, {useEffect} from 'react';
import s from './StationPage.module.sass';
import {DatePicker, Space} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectLoading,
  setCurrentStationThunk,
} from '../../redux/features/stationsSlice';
import Loader from '../Loader/Loader';

const {RangePicker} = DatePicker;

function StationPage({match}) {
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentStationThunk(match.params.id));
  }, []);

  const onPickDate = (date, dateString) => {
    console.log(date, dateString);
  };

  if (loading) return <Loader />;

  return (
    <div className={s.stationPage}>
      <RangePicker onChange={onPickDate} showTime />
    </div>
  );
}

export default StationPage;
