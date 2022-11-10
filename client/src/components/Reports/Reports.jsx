import React from "react"

const Reports = () => {
  return (
    <div className="container-xxl">
      <div className="row">
        <div className="col-12 pt-5">
          <div className="fs-1 text-center pb-5">
            <b>PM10 - PM2.5</b>
          </div>
          <iframe
            title="Pm10, Pm2.5"
            style={{ height: "90vh" }}
            width="100%"
            src="https://app.powerbi.com/view?r=eyJrIjoiN2JjODRhZTItOGJmYi00N2RmLWJhZTYtNGFiNjUyYWQ2MWU1IiwidCI6ImQ2NTk5ZjY4LTJkMmMtNGNhZS05ZWNmLTYwMDUyYjdkMGJkOSIsImMiOjl9"
            frameborder="0"
            allowFullScreen="true"
          ></iframe>
        </div>
        <div className="col-12 pt-5">
          <div className="fs-1 text-center pb-5">
            <b>KPIs</b>
          </div>
          <iframe
            title="kpi - Page 1"
            width="100%"
            style={{ height: "90vh" }}
            src="https://app.powerbi.com/view?r=eyJrIjoiOGQ0Y2ExMDItYTVhYS00ZDcxLWI2ZjAtN2Y0YWRjMzExMmNjIiwidCI6ImQ2NTk5ZjY4LTJkMmMtNGNhZS05ZWNmLTYwMDUyYjdkMGJkOSIsImMiOjl9"
            frameborder="0"
            allowFullScreen="true"
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default Reports
