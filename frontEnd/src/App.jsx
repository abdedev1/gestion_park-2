import { useState } from 'react'
import FormTabs from './components/login/Signup'
import './App.css'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import Header from './component/admin/Header'

function App() {

  return (
    <>
      {/* <Header/> */}
      <FormTabs/>
    </>
  )
}

export default App
