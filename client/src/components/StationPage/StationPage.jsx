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
  const [dataObj, setDataObj] = useState([
    {
      date: 'esa',
      value: 13,
    },
    {
      date: 'asdasd',
      value: 15,
    },
  ]);
  const [config, setConfig] = useState({});

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
    station.measurements &&
      (await setDataObj(formatChartObject(station.measurements)));
    dataObj && console.log(dataObj);
    dataObj &&
      setDataObj({
        data: dataObj,
        xField: 'date',
        yField: 'value',
        label: {},
        point: {
          size: 5,
          shape: 'diamond',
          style: {
            fill: 'white',
            stroke: '#5B8FF9',
            lineWidth: 2,
          },
        },
        tooltip: {showMarkers: false},
        state: {
          active: {
            style: {
              shadowColor: 'yellow',
              shadowBlur: 4,
              stroke: 'transparent',
              fill: 'red',
            },
          },
        },
        theme: {
          geometries: {
            point: {
              diamond: {
                active: {
                  style: {
                    shadowColor: '#FCEBB9',
                    shadowBlur: 2,
                    stroke: '#F6BD16',
                  },
                },
              },
            },
          },
        },
        interactions: [{type: 'marker-active'}],
      });
  }, []);

  const onPickDate = (date, dateString) => {
    console.log(date, dateString);
  };

  if (loading) return <Loader />;

  //   let data = [
  //     {
  //       year: '1991',
  //       value: 3,
  //     },
  //     {
  //       year: '1992',
  //       value: 4,
  //     },
  //     {
  //       year: '1993',
  //       value: 3.5,
  //     },
  //     {
  //       year: '1994',
  //       value: 5,
  //     },
  //     {
  //       year: '1995',
  //       value: 4.9,
  //     },
  //     {
  //       year: '1996',
  //       value: 6,
  //     },
  //     {
  //       year: '1997',
  //       value: 7,
  //     },
  //     {
  //       year: '1998',
  //       value: 9,
  //     },
  //     {
  //       year: '1999',
  //       value: 13.5,
  //     },
  //   ];

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
        {/* {config !== {} && <Line {...config} />} */}
      </div>
    </div>
  );
}

export default StationPage;
