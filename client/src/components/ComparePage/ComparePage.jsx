import React, { useCallback, useEffect, useState } from "react"
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useDispatch, useSelector } from "react-redux"
import { getStations, selectAllStations, selectLoading, setLoading } from "../../redux/features/stationsSlice"
import { Select, Radio } from "antd"
import Loader from "../Loader/Loader"
import {
  selectFullUnits,
  selectMeasurements,
  setCompareUnits,
  setStationsMeasurements,
  selectSelectedMeasuredId,
  setSelectedMeasuredId
} from "../../redux/features/compareSlice"
import moment from "moment"
import { getDateRange } from "../../util/util"
import { useMemo } from "react"
import { curveBasis } from "d3-shape"
import Station from "../StationsPage/Station/Station"

const { Option } = Select

const time = [
  { label: "1 hour", value: "hour" },
  { label: "8 hours", value: "8hours" },
  { label: "1 day", value: "day" },
  { label: "1 week", value: "week" },
  { label: "1 month", value: "month" }
  // { label: "1 year", value: "year" }
]

const colors = ["#17a355", "#1766a2"]

const ComparePage = () => {
  const [range, setRange] = useState(time[0].value)

  const loading = useSelector(selectLoading)
  const stations = useSelector(selectAllStations)

  const fullUnits = useSelector(selectFullUnits)
  const selectedMeasuredId = useSelector(selectSelectedMeasuredId)
  const dataChart = useSelector(selectMeasurements)

  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)
  const [isFormatting, setIsFormatting] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getStations(`?order=IdUp&onlyFav=false`, false))
  }, [])

  useEffect(() => {
    if (stations.length) {
      setFirst(stations[0])
      setSecond(stations[1])
    }
  }, [stations])

  useEffect(() => {
    if (first && second) {
      dispatch(setCompareUnits(first.ID_Station, second.ID_Station))
    }
  }, [first, second])

  useEffect(() => {
    if (stations?.length && first && second && selectedMeasuredId) {
      dispatch(setLoading(true))
      setIsFormatting(true)
      const dateRange = getDateRange(range)
      dispatch(setStationsMeasurements(dateRange[0], dateRange[1], first.ID_Station, second.ID_Station, first.Name, second.Name))
      dispatch(setLoading(false))
    }
  }, [stations, first, second, range, selectedMeasuredId])

  console.log(loading)

  const handleChangeFirst = useCallback(
    value => {
      const newStation = [...stations.filter(s => s.ID_Station === value)]
      setFirst(...newStation)
    },
    [stations]
  )

  const handleChangeSecond = useCallback(
    value => {
      const newStation = [...stations.filter(s => s.ID_Station === value)]
      setSecond(...newStation)
    },
    [stations]
  )

  const handleChangeUnit = useCallback(value => {
    dispatch(setSelectedMeasuredId(value))
  }, [])

  const unitData = useMemo(
    () => fullUnits?.compareUnits?.find(u => u.ID_Measured_Unit === selectedMeasuredId),
    [fullUnits?.compareUnits, selectedMeasuredId]
  )

  const full_chart_data = useMemo(() => {
    let full_data = []

    if (dataChart) {
      for (let ob of dataChart.measurements_first) {
        for (let ob2 of dataChart.measurements_second) {
          if (ob.date === ob2.date) {
            full_data.push({
              date: ob.date,
              [`${ob.name}(${unitData?.Title},${unitData?.Unit})`]: ob.value,
              [`${ob2.name}(${unitData?.Title},${unitData?.Unit})`]: ob2.value
            })
          }
        }
      }
    }

    setIsFormatting(false)
    return full_data
  }, [dataChart, unitData])

  const dayRange = useMemo(() => range !== "hour" && range !== "8hours" && range !== "day", [range])
  const tickFormat = useCallback(value => moment(value, "YYYY/MM/DD HH:mm").format(!dayRange ? "HH:mm" : "YYYY/MM/DD"), [range])

  return (
    <div className="container-xxl">
      <div className="row compare-page">
        <div className="col-12 ">
          <div className="row station-page-content pb-5">
            <div className="col-12">
              <div className="station-page-nav">
                <div className="row w-100 g-3">
                  <div className="col-md-6 col-12">
                    <div className="d-flex align-items-center">
                      Range:
                      <Radio.Group
                        className="station-page-range"
                        value={range}
                        onChange={e => setRange(e.target.value)}
                        buttonStyle="solid"
                      >
                        {time.map(t => (
                          <Radio.Button value={t.value}>{t.label}</Radio.Button>
                        ))}
                      </Radio.Group>
                    </div>
                  </div>
                  {selectedMeasuredId && (
                    <div className="col-md-6 col-12">
                      <div className="d-flex align-items-center justify-content-md-end">
                        Measurement
                        <Select style={{ width: 220, marginLeft: 30 }} onChange={handleChangeUnit} value={selectedMeasuredId}>
                          {fullUnits?.compareUnits?.map(u => (
                            <Option key={u.ID_Measured_Unit} value={u.ID_Measured_Unit}>
                              {u.Title}, {u.Unit}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  )}
                  {first && (
                    <div className="col-md-6 col-12">
                      <div>
                        First Station:
                        <Select style={{ width: 220 }} className="ms-4" onChange={handleChangeFirst} value={first.ID_Station}>
                          {stations
                            .filter(s => s.ID_Station !== second.ID_Station)
                            .map(s => (
                              <Option key={s.ID_Station} value={s.ID_Station}>
                                {s.Name}
                              </Option>
                            ))}
                        </Select>
                      </div>
                    </div>
                  )}
                  {second && (
                    <div className="col-md-6 col-12">
                      <div className="d-flex align-items-center justify-content-md-end">
                        Second Station:
                        <Select style={{ width: 220 }} className="ms-4" onChange={handleChangeSecond} value={second.ID_Station}>
                          {stations
                            .filter(s => s.ID_Station !== first.ID_Station)
                            .map(s => (
                              <Option key={s.ID_Station} value={s.ID_Station}>
                                {s.Name}
                              </Option>
                            ))}
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!isFormatting && !loading ? (
              <div className="col-12">
                <div className="station-page-chart">
                  <div className="row">
                    {full_chart_data?.length ? (
                      <ResponsiveContainer width="100%" height={500}>
                        <AreaChart data={full_chart_data} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
                          <defs>
                            <linearGradient id={`color_${0}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="2%" stopColor={colors[0]} stopOpacity={0.8} />
                              <stop offset="98%" stopColor={colors[0]} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id={`color_${1}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="2%" stopColor={colors[1]} stopOpacity={0.8} />
                              <stop offset="98%" stopColor={colors[1]} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" tickFormatter={value => tickFormat(value)} type="category" dy={13} />
                          <YAxis dx={-5} />
                          <CartesianGrid strokeDasharray="5 5" />
                          <Tooltip labelFormatter={value => tickFormat(value)} />

                          {Object.keys(full_chart_data[0])
                            .filter(k => k !== "date")
                            .map((key, index) => (
                              <Area
                                type={curveBasis}
                                dataKey={key}
                                stroke={colors[index]}
                                fillOpacity={1}
                                fill={`url(#color_${index})`}
                              />
                            ))}
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="col-12 d-flex justify-content-center">
                        <div style={{ fontSize: 20, fontWeight: 700 }}>No chart Data</div>
                      </div>
                    )}
                  </div>

                  {/* MIN MAX - PIE + AVERAGE BY PERIOD */}
                </div>
              </div>
            ) : (
              <div className="col-12 ">
                <div className="station-page-chart d-flex justify-content-center py-5 w-100">
                  <Loader />
                </div>
              </div>
            )}

            <div className="col-12 mt-5">
              <div className="row g-5">
                {first && <Station key="station_card_1" station={first} units={fullUnits?.first?.map(u => u?.Title)} hideFavorite />}
                {second && (
                  <Station key="station_card_2" station={second} units={fullUnits?.second?.map(u => u?.Title)} hideFavorite />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparePage
