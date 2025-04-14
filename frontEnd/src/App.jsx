import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { ProtectedRoute } from './lib/ProtectedRoute'
import './App.css'
import SignTabs from './components/login/Signup'

import UsersList from './components/admin/UsersList'
import Header from './components/Header'
import RolesList from './components/admin/RolesList'
// import QrScanner from './components/admin/test'
import ScanPage from './components/ScanPage'
import Headerr from './components/admin/Admindashboard'

import { useEffect } from 'react'
import Auth from './assets/api/auth/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import { setLoading } from './components/Redux/slices/AuthSlice'



function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setLoading(true));
    Auth.CheckAuth(dispatch)
      .then(result => {
        console.log('Auth initialized:', result);
      });
    
  }, [dispatch]);

  // if (isLoading) {
  //   return (
  //       <Loader2 className="h-8 w-8 mx-auto mt-4 animate-spin text-primary" />
  //   );
  // }

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
            <Route path='/admin/test' element={<ScanPage/>}/>


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
              <Route path="/admin/dashboard" element={<Headerr />} />
              
              <Route path="/admin/users">
                <Route index element={<UsersList/>} />
                <Route path=":id" element={<h1>show user</h1>} />
              </Route>
              
              <Route path="/admin/roles">
                <Route index element={<RolesList/>}/>
                <Route path=":id" element={<h1>show role</h1>} />
              </Route>
              
              <Route path='/admin/test' element={<ScanPage/>}/>
              
              <Route path="/admin/reservations">
                <Route index element={<h1>reservations list</h1>} />
                <Route path=":id" element={<h1>show reservation</h1>} />
              </Route>
              
              <Route path="/admin/parcs">
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