
import FormTabs from './components/login/Signup'
import './App.css'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import UsersList from './components/login/admin/UsersList'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UsersList/>}/>
          <Route path="/signup" element={<FormTabs/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
