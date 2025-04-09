import { useState } from 'react'
import FormTabs from './components/login/Signup'
import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
// import Header from './component/admin/Header'
import Overview from './components/employe/Overview'
import HeaderEmploye from './components/employe/HeaderEmploye'
function App() {

  return (
    <>
      {/* <Header/> */}
      <Overview />
      {/* <FormTabs/> */}
      <BrowserRouter>
        <Routes>
          <Route path='/employe' element={<HeaderEmploye />}>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
