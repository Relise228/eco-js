import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  selectLoading,
  selectCurrentStation,
  setLoading,
  selectSelectedUnitInfo,
  getOneStation,
  setCurrentStationMeasurements,
  setSelectedMeasuredId,
  setUnitInfo
} from "../../redux/features/stationsSlice"
import Loader from "../Loader/Loader"
import moment from "moment"
import { useParams } from "react-router-dom"
import "./StationPage.sass"
import Station from "../StationsPage/Station/Station"
import { Radio, Select } from "antd"
import { Bar, BarChart, CartesianGrid, Rectangle, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getDateRange } from "../../util/util"
import { useCallback } from "react"
import { ResponsivePie } from "@nivo/pie"

const { Option } = Select

const time = [
  { label: "1 hour", value: "hour" },
  { label: "8 hours", value: "8hours" },
  { label: "1 day", value: "day" },
  { label: "1 week", value: "week" },
  { label: "1 month", value: "month" },
  { label: "1 year", value: "year" }
]

const CustomBar = props => {
  const { optimal, payload, colors } = props
  const index = optimal.findIndex(val => payload.value >= val.Bottom_Border && payload.value < val.Upper_Border)

  return (
    <Rectangle {...props} fill={optimal?.length ? colors[index] : "#8cc541"} fillOpacity={0.8} className={`recharts-bar-rectangle`} />
  )
}

const StationPage = React.memo(({ match }) => {
  const loading = useSelector(selectLoading)
  const station = useSelector(selectCurrentStation)
  const selectedMeasuredId = useSelector(state => state.stations.currentStation?.selectedMeasuredId)
  const selectedUnitInfo = useSelector(selectSelectedUnitInfo)

  const dispatch = useDispatch()
  const params = useParams()

  const [range, setRange] = useState(time[0].value)

  const [isFormatting, setIsFormatting] = useState(false)

  useEffect(() => {
    setIsFormatting(true)
    const dateRange = getDateRange(range)
    dispatch(setLoading(true))
    dispatch(getOneStation(params.id, dateRange[0], dateRange[1]))
  }, [params.id])

  useEffect(() => {
    setIsFormatting(true)
    const dateRange = getDateRange(range)
    if (selectedMeasuredId) {
      dispatch(setCurrentStationMeasurements(dateRange[0], dateRange[1], selectedMeasuredId))
      dispatch(setUnitInfo())
    }
  }, [range, selectedMeasuredId])

  let frequency = 3

  switch (range) {
    case "hour":
      frequency = 3
      break
    case "8hours":
      frequency = 15
      break
    case "day":
      frequency = 30
      break
    case "week":
      frequency = 720
      break
    case "month":
      frequency = 5040
    case "year":
      frequency = 15120
      break
  }

  const measurementsByRange = useMemo(() => {
    const array = []

    station.measurementsFormated?.forEach((m, index) => {
      if (index % frequency === 0 && index) {
        const startIndex = index ? index - frequency : 0
        let sum = 0

        for (let i = startIndex; i < index; i++) {
          sum += station.measurementsFormated[i].value
        }

        array.push({
          value: Math.round(sum / frequency),
          date: station.measurementsFormated[index].date
        })
      }
      if (!index) {
        array.push(m)
      }
    })

    setIsFormatting(false)

    return array
  }, [station?.measurementsFormated])

  const dayRange = useMemo(() => range !== "hour" && range !== "8hours" && range !== "day", [range])
  const tickFormat = useCallback(value => moment(value, "YYYY/MM/DD HH:mm").format(!dayRange ? "HH:mm" : "YYYY/MM/DD"), [range])

  const optimal = useMemo(
    () => (station?.selectedUnitInfoOptimal?.length ? station?.selectedUnitInfoOptimal[0] : []),
    [station?.selectedUnitInfoOptimal]
  )
  const colors = ["#17a355", "#e9d109", "#f37e00", "#ea270d", "#7c2c85", "#66001f"]
  const minMaxColors = ["#5b02c0", "#343a40"]

  const minMaxData = useMemo(() => {
    const allValues = station.measurementsFormated?.map(m => m.value) ?? []
    const minValue = Math.min(...allValues)
    const maxValue = Math.max(...allValues)

    return station.measurementsFormated?.length
      ? [
          {
            id: "Max value",
            label: "Max value",
            value: Math.round(maxValue),
            color: minMaxColors[0]
          },
          {
            id: "Min value",
            label: "Min value",
            value: Math.round(minValue),
            color: "#000"
          }
        ]
      : []
  }, [station.measurementsFormated])

  const averageValue = useMemo(() => {
    const allValues = station.measurementsFormated?.map(m => m.value) ?? []
    const value = allValues.reduce((acc, val) => (acc += val), 0)

    return value / allValues.length
  }, [station.measurementsFormated])

  const averageText = useCallback(() => {
    switch (range) {
      case "hour":
        return "6 mins"
      case "8hours":
        return "30 mins"
      case "day":
        return "1 hour"
      case "week":
        return "1 day"
      case "month":
        return "1 week"
      case "year":
        return "1 month"
    }
  }, [range])

  const averageIndexColor = optimal.findIndex(val => averageValue >= val.Bottom_Border && averageValue < val.Upper_Border)

  return (
    <div className="container-xxl">
      <div className="row station-page">
        {loading ? (
          <div className="col-12 d-flex justify-content-center" style={{ marginTop: "20%" }}>
            <Loader />
          </div>
        ) : (
          <div className="col-12 ">
            <div className="row mb-5 station-page-content">
              {Object.keys(station).length && <Station key="station_card" station={station} page />}

              <>
                <div className="col-12">
                  <div className="station-page-nav">
                    <div>
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
                    <div>
                      Measurement
                      <Select
                        className="station-page-units"
                        value={selectedMeasuredId}
                        // style={{ width: 120 }}
                        onChange={id => dispatch(setSelectedMeasuredId(id))}
                      >
                        {station?.fullUnits?.map(u => (
                          <Option value={u.ID_Measured_Unit}>{u.Title}</Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>

                {!isFormatting ? (
                  <>
                    <div className="col-12">
                      <div className="station-page-chart">
                        <div className="row">
                          <div className="col-12 py-4 text-center">Average value for {averageText()}</div>
                        </div>

                        {measurementsByRange?.length ? (
                          <ResponsiveContainer width="100%" height={500}>
                            <BarChart data={measurementsByRange} margin={{ top: 10, right: 0, left: -20, bottom: 5 }}>
                              <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="date" tickFormatter={value => tickFormat(value)} type="category" dy={13} />
                              <YAxis dx={-5} />
                              <CartesianGrid strokeDasharray="5 5" />
                              <Tooltip
                                labelFormatter={value => tickFormat(value)}
                                formatter={value => [value, `${selectedUnitInfo[0].Title},${selectedUnitInfo[0].Unit}`]}
                              />

                              <Bar dataKey="value" shape={<CustomBar optimal={optimal} colors={colors} />} />

                              {optimal.map(({ Designation, Bottom_Border }, index) => (
                                <ReferenceLine
                                  y={Bottom_Border}
                                  label={{ position: "top", value: `${Designation}: ${Bottom_Border}`, fontSize: 14 }}
                                  stroke="#000"
                                  isFront={true}
                                />
                              ))}
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="col-12 d-flex justify-content-center">
                            <div style={{ fontSize: 20, fontWeight: 700 }}>No chart Data</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedUnitInfo?.length && minMaxData.length ? (
                      <>
                        <div className="col-md-6 col-12">
                          <div className="station-page-chart">
                            <div className="row">
                              <div className="col-12 text-center">Min/Max Value</div>
                              <div className="col-12" style={{ height: 400 }}>
                                <ResponsivePie
                                  data={minMaxData}
                                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                  innerRadius={0.5}
                                  padAngle={2}
                                  cornerRadius={6}
                                  activeOuterRadiusOffset={8}
                                  borderWidth={1}
                                  borderColor={{
                                    from: "color",
                                    modifiers: [["darker", 0.2]]
                                  }}
                                  arcLinkLabel={false}
                                  arcLinkLabelsThickness={0}
                                  colors={["#5b02c0", "#343a40"]}
                                  arcLabelsTextColor="#fff"
                                  legends={[
                                    {
                                      anchor: "bottom",
                                      direction: "row",
                                      justify: false,
                                      translateX: 0,
                                      translateY: 56,
                                      itemsSpacing: 0,
                                      itemWidth: 100,
                                      itemHeight: 18,
                                      itemTextColor: "#999",
                                      itemDirection: "left-to-right",
                                      itemOpacity: 1,
                                      symbolSize: 18,
                                      symbolShape: "circle",
                                      effects: [
                                        {
                                          on: "hover",
                                          style: {
                                            itemTextColor: "#000"
                                          }
                                        }
                                      ]
                                    }
                                  ]}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6 col-12">
                          <div className="station-page-chart">
                            <div className="row">
                              <div className="col-12 text-center">Average {selectedUnitInfo[0]?.Title} Value</div>
                              <div className="col-12 d-flex align-items-center justify-content-center station-page-avg">
                                <h2 style={{ color: colors[averageIndexColor] ?? "#000" }}>{Math.round(averageValue)}</h2>
                                <span>{selectedUnitInfo[0].Unit}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </>
                ) : (
                  <div className="col-12">
                    <div className="station-page-chart d-flex justify-content-center py-5 w-100">
                      <Loader />
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default StationPage
