import {Input, Select} from 'antd';

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getStations,
  selectAllStations,
} from '../../redux/features/stationsSlice';
import Station from './Station/Station';
import s from './StationsPage.module.sass';

const {Search} = Input;
const {Option} = Select;

function StationsPage() {
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('idUp');

  const stations = useSelector(selectAllStations);
  console.log(stations);

  const dispatch = useDispatch();

  useEffect(() => {
    let string = searchValue
      ? `?searchString=${searchValue}&order=${sortValue}`
      : `?order=${sortValue}`;
    dispatch(getStations(string));
  }, []);

  const onSearch = (value) => {
    setSearchValue(value);
    let string = searchValue
      ? `?searchString=${value}&order=${sortValue}`
      : `?order=${sortValue}`;
    dispatch(getStations(string));
  };

  function handleChange(value) {
    setSortValue(value);
    let string = searchValue
      ? `?searchString=${searchValue}&order=${sortValue}`
      : `?order=${value}`;
    dispatch(getStations(string));
  }

  return (
    <div className={s.stations}>
      <div className={s.funcButtons}>
        <div className={s.searchWrapper}>
          <Search
            placeholder='Search stations by name'
            onSearch={onSearch}
            className={s.search}
            value={searchValue}
            onChange={(e) => setSearchValue(e.currentTarget.value)}
          />
        </div>
        <div className={s.sortWrapper}>
          Sort
          <div>
            <Select
              defaultValue={sortValue}
              style={{width: 120}}
              onChange={handleChange}
              className={s.select}
            >
              <Option value='idDown'>Own</Option>
              <Option value='idUp'>Save EcoBot</Option>
            </Select>
          </div>
        </div>
      </div>
      <div className={s.stationsWrapper}>
        {stations && stations.map((s) => <Station station={s} />)}
      </div>
    </div>
  );
}

export default StationsPage;
