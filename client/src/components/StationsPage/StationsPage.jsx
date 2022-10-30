import React, { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { Select, Pagination, Checkbox } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { debounce } from "lodash"
import { getStations, selectAllStations, selectLoading, selectPage, setPage } from "../../redux/features/stationsSlice"
import Loader from "../Loader/Loader"
import Station from "./Station/Station"
import "./StationsPage.sass"

const { Option } = Select

const StationsPage = React.memo(() => {
  let [searchParams, setSearchParams] = useSearchParams({
    order: "idUp",
    onlyFav: false
  })
  const [searchString, setSearchString] = useState(searchParams.get("searchString") ?? "")

  const dispatch = useDispatch()
  const stations = useSelector(selectAllStations)
  const page = useSelector(selectPage)
  const loading = useSelector(selectLoading)

  const onChangeOrder = useCallback(
    value => {
      searchParams.set("order", value)
      setSearchParams(searchParams)
    },
    [setSearchParams, searchParams]
  )

  const onChangeFavorite = useCallback(
    e => {
      searchParams.set("onlyFav", e.target.checked)
      setSearchParams(searchParams)
    },
    [setSearchParams, searchParams]
  )

  const onChangePage = page => {
    dispatch(setPage(page))
    window.scrollTo(0, 0)
  }

  const onChangeSearchString = e => {
    setSearchString(e.target.value)
  }

  const debouncedSetString = useCallback(
    debounce(() => {
      if (!searchString) {
        searchParams.delete("searchString")
      } else {
        searchParams.set("searchString", searchString)
      }
      setSearchParams(searchParams)
    }, 500),
    [searchString]
  )

  useEffect(() => {
    dispatch(setPage(1))
  }, [searchParams])

  useEffect(() => {
    debouncedSetString()

    return () => debouncedSetString.cancel()
  }, [debouncedSetString])

  useEffect(() => {
    dispatch(getStations(`?${searchParams.toString()}`))
  }, [searchParams])

  return (
    <div className="container-xxl">
      <div className="row gy-4 stations-nav align-items-center gx-2">
        <div className="col-md-7 col-12 position-relative">
          <input
            type="text"
            className="form-control stations-search"
            id="search"
            placeholder="Type station name ..."
            value={searchString}
            onChange={onChangeSearchString}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} color="#8cc541" className="stations-search-icon" />
        </div>
        <div className="col-md-5 col-12 ps-md-4">
          <div className="row justify-content-lg-end justify-content-center align-items-center">
            <div className="col-6">
              <div style={{ width: "fit-content" }} className="float-md-end float-start">
                <Checkbox checked={searchParams.get("onlyFav") === "true"} onChange={onChangeFavorite}>
                  Favorite
                </Checkbox>
              </div>
            </div>
            <div className="col-6">
              <Select
                className="float-md-end float-start"
                style={{ width: "130px" }}
                defaultValue={searchParams.get("order")}
                onChange={onChangeOrder}
              >
                <Option value="idDown">Own</Option>
                <Option value="idUp">Save EcoBot</Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="row pb-5">
        <div className="col-12">
          {loading && !stations?.length ? (
            <div style={{ width: "fit-content", marginTop: "20%" }} className="h-100 mx-auto">
              <Loader />
            </div>
          ) : (
            <div className="row mt-4 gy-4">
              {stations?.slice(page === 1 ? 0 : (page - 1) * 10, page === 1 ? 10 : page * 10).map(station => (
                <Station station={station} />
              ))}
            </div>
          )}
        </div>
      </div>
      {!loading && stations?.length ? (
        <div className="row pb-5">
          <div className="col-12 d-flex justify-content-center">
            <Pagination current={page} total={stations?.length} onChange={onChangePage} showSizeChanger={false} />
          </div>
        </div>
      ) : null}
    </div>
  )
})

export default StationsPage
