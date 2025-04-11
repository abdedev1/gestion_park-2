import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { ProtectedRoute } from './lib/ProtectedRoute'
import './App.css'
import SignTabs from './components/login/Signup'
import Overview from './components/employe/ParkEmploye'
import UsersList from './components/admin/UsersList'
import Header from './components/Header'
import RolesList from './components/admin/RolesList'


function App() {

  return (
    <>
      <BrowserRouter>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#0082ce",
              colorInfo: "#0082ce",
              colorSuccess: "#01a43b",
              colorWarning: "#fcc700",
              colorError: "#fe6266",
              borderRadius: 4
            },
            components: {
              Button: {
                dangerColor: "rgb(0,0,0)"
              },
              Badge: {
                colorTextLightSolid: "rgb(0,0,0)"
              }
            }
          }}
        >
          <Header />
          <Routes>
            <Route path="/" element={<h1>homepage</h1>} />
            <Route path="/sign" element={<SignTabs />} />

            <Route element={<ProtectedRoute requiredRole="employe" />}>
              <Route path="/overview" element={<h1>overview</h1>} />
            </Route>

            <Route element={<ProtectedRoute requiredRole="client" />}>
              <Route path="/dashboard" element={<h1>dashboard</h1>} />
              <Route path="/promotions">
                <Route index element={<h1>promotions list</h1>} />
                <Route path=":id" element={<h1>show promotion</h1>} />
              </Route>
              <Route path="/reservartions">
                <Route index element={<h1>reservartions list</h1>} />
                <Route path=":id" element={<h1>show reservartion</h1>} />
              </Route>
              <Route path="/parcs">
                <Route index element={<h1>parcs list</h1>} />
                <Route path=":id" element={<h1>show parc</h1>} />
              </Route>
            </Route>

            {/* Protected routes for admin */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/dashboard" element={<h1>dashboard</h1>} />
              <Route path="/users">
                <Route index element={<h1>users list</h1>} />
                <Route path=":id" element={<h1>show user</h1>} />
              </Route>
              <Route path="/roles">
                <Route index element={<h1>roles list</h1>} />
                <Route path=":id" element={<h1>show role</h1>} />
              </Route>
              <Route path="/reservartions">
                <Route index element={<h1>reservartions list</h1>} />
                <Route path=":id" element={<h1>show reservartion</h1>} />
              </Route>
              <Route path="/parcs">
                <Route index element={<h1>parcs list</h1>} />
                <Route path=":id" element={<h1>show parc</h1>} />
              </Route>
            </Route>

            <Route path="*" element={<h1>Page Not Found Error 404</h1>} />
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </>
  )
}

export default App
