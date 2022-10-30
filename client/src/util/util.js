import moment from "moment"

export const formatChartObject = (array, nameStation = false) => {
  const name = nameStation && nameStation
  const done = [
    array.map(m => {
      return {
        value: Math.ceil(m.Value),
        date: moment(m.Time).format("YYYY/MM/DD HH:mm"),
        name
      }
    })
  ]
  return done[0]
}

export const parseCommonUnits = (one, two) => {
  let array_second = []
  let array = []
  if (one.length > two.length) {
    array = one
    array_second = two
  } else {
    array = two
    array_second = one
  }
  let commonArray = []

  if (array) {
    for (let x of array_second) {
      for (let y of array) {
        x.ID_Measured_Unit === y.ID_Measured_Unit && commonArray.push(x)
      }
    }
  }
  return commonArray
}

export const getDateRange = range => {
  switch (range) {
    case "hour":
      return [
        moment().utcOffset("+0000").subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss"),
        moment().utcOffset("+0000").format("YYYY-MM-DD HH:mm:ss")
      ]
    case "8hours":
      return [
        moment().utcOffset("+0000").subtract(8, "hours").format("YYYY-MM-DD HH:mm:ss"),
        moment().utcOffset("+0000").format("YYYY-MM-DD HH:mm:ss")
      ]

    case "day":
      return [
        moment().utcOffset("+0000").subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
        moment().utcOffset("+0000").format("YYYY-MM-DD HH:mm:ss")
      ]

    case "week":
      return [
        moment().utcOffset("+0000").subtract(1, "week").format("YYYY-MM-DD HH:mm:ss"),
        moment().utcOffset("+0000").format("YYYY-MM-DD HH:mm:ss")
      ]

    case "month":
      return [
        moment().utcOffset("+0000").subtract(1, "month").format("YYYY-MM-DD HH:mm:ss"),
        moment().utcOffset("+0000").format("YYYY-MM-DD HH:mm:ss")
      ]

    case "year":
      return [
        moment().utcOffset("+0000").subtract(1, "year").format("YYYY-MM-DD HH:mm:ss"),
        moment().utcOffset("+0000").format("YYYY-MM-DD HH:mm:ss")
      ]
  }
}
