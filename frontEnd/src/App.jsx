import { useState } from 'react'
import FormTabs from './components/login/Signup'
import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
// import Header from './component/admin/Header'
import Overview from './components/employe/ParkEmploye'
import HeaderEmploye from './components/employe/HeaderEmploye'
import './App.css'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import UsersList from './components/admin/UsersList'
import Header from './components/admin/Header'
import RolesList from './components/admin/RolesList'


function App() {

  return (
    <>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/admin/users" element={<UsersList/>}/>
          <Route path="/admin/roles" element={<RolesList/>}/>
          <Route path="/signup" element={<FormTabs/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
