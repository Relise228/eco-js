import React, { useEffect, useState } from "react"

import "antd/dist/antd.css"
import "./App.sass"
import StationsPage from "../StationsPage/StationsPage"

import { Route, useLocation, Routes } from "react-router-dom"

import LoginPage from "../LoginPage/LoginPage"
import { useDispatch, useSelector } from "react-redux"
import { selectIsAuth, setAuth } from "../../redux/features/authSlice"
import Header from "../Header"
import { useNavigate } from "react-router-dom"
import MapPage from "../MapPage/MapPage"
import StationPage from "../StationPage/StationPage"
import ComparePage from "../ComparePage/ComparePage"

function App() {
  const auth = useSelector(selectIsAuth)
  let navigate = useNavigate()
  let dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login")
    else dispatch(setAuth(true))
  }, [auth, navigate, dispatch])

  if (location.pathname === "/") navigate("/stations")

  return (
    <div className="app">
      <main style={{ minHeight: "100vh" }}>
        {auth && <Header />}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/stations/*" element={<StationsPage />} />
          <Route path="/station/:id" element={<StationPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
