import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { ProtectedRoute } from './lib/ProtectedRoute'
import './App.css'
import SignTabs from './components/login/Signup'
import UsersList from './components/admin/UsersList'
import RolesList from './components/admin/RolesList'
import { useEffect } from 'react'
import Auth from './assets/api/auth/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import { setLoading } from './components/Redux/slices/AuthSlice'
import SpotsEmploye from './components/employe/SpotsEmploye'
import ParkList from './components/admin/parks/parkList'
import QRCodeScanner from './components/employe/QrCodeScanner'
import Header from './components/Header'
import { Navigate } from 'react-router-dom'
import ParksList from './components/client/ParksList'
function App() {
  const dispatch = useDispatch();
  const { isLoading,user } = useSelector((state) => state.auth);

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
          <Routes>

            <Route path="sign" element={<SignTabs />} />
            <Route path='test' element={<QRCodeScanner/>}/>
            <Route  path='/' element={<Header/>}>

            <Route 
              index 
              element={
                user?.role === 'admin' ? (
                  <Navigate to="/dashboard" replace />
                ) : user?.role === 'employe' ? (
                  <Navigate to="/overview" replace />
                ) : (
                  <Navigate to="" replace />
                )
              
                
              } 
            />
              {/* partie employe */}
                <Route element={<ProtectedRoute requiredRole="employe" />}>
                  <Route index path="overview" element={<SpotsEmploye/>} />
                </Route>
              {/* partie admin */}

                <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route  path="users" element={<UsersList/>} />
                <Route  path="roles" element={<RolesList/>} />
                <Route  path="parks" element={<ParkList/>} />
                <Route  path="dashboard" element={<h1>Dashbord</h1>} />
                </Route>
              
              {/*partie client*/}
              <Route element={<ProtectedRoute requiredRole="client" />}>
                <Route  path="parcs" element={<ParksList/>} />

                </Route>
            </Route>
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </>
  )
}

export default App