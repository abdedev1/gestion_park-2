import { useState } from 'react'
import FormTabs from './components/login/Signup'
import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
// import Header from './component/admin/Header'
import Overview from './components/employe/SpotsEmploye'
import HeaderEmploye from './components/employe/HeaderEmploye'
import './App.css'
import UsersList from './components/admin/UsersList'
import Header from './components/admin/Header'
import RolesList from './components/admin/RolesList'
import ParkEmploye from './components/employe/SpotsEmploye'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HeaderEmploye/>}>
              <Route path='/employe' element={<ParkEmploye/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
