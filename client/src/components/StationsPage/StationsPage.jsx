import {Input, Select, Pagination} from 'antd';

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getStations,
  selectAllStations,
  selectLoading,
  selectPage,
  setCurrentPageIndex,
  setPage,
} from '../../redux/features/stationsSlice';
import Loader from '../Loader/Loader';
import Station from './Station/Station';
import s from './StationsPage.module.sass';

const {Search} = Input;
const {Option} = Select;

function StationsPage() {
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('idUp');
  let pageSize = 10;
  const page = useSelector(selectPage);

  const stations = useSelector(selectAllStations);
  const loading = useSelector(selectLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentPageIndex(['1']));
    let string = searchValue
      ? `?searchString=${searchValue}&order=${sortValue}`
      : `?order=${sortValue}`;
    dispatch(getStations(string));
  }, []);

  useEffect(() => {
    dispatch(setPage(1));
  }, [stations]);

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

  let portionStation = stations?.slice(page * 10 - 10, page * pageSize);
  useEffect(() => {
    if (stations !== undefined) {
      portionStation = stations.slice(page * 10 - 10, page * pageSize);
    }
  }, [page]);

  const onChangePage = (page, pageSize) => {
    dispatch(setPage(page));
    window.scrollTo(0, 0);
  };

  if (loading) return <Loader />;

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
        {portionStation &&
          portionStation.map((s) => <Station key={s.ID_Station} station={s} />)}
        <Pagination
          className={s.pagination}
          defaultCurrent={page}
          total={stations?.length}
          onChange={onChangePage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}

export default StationsPage;
