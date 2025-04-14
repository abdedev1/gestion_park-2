import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { ProtectedRoute } from './lib/ProtectedRoute'
import './App.css'
import SignTabs from './components/login/Signup'
import UsersList from './components/admin/UsersList'
import Header from './components/Header'
import RolesList from './components/admin/RolesList'
import ScanPage from './components/ScanPage'
import Headerr from './components/admin/Admindashboard'
import Headerabde from './components/Headerabde'
import { useEffect } from 'react'
import Auth from './assets/api/auth/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import { setLoading } from './components/Redux/slices/AuthSlice'
import HeaderEmploye from './components/employe/HeaderEmploye'
import SpotsEmploye from './components/employe/SpotsEmploye'
import ParkList from './components/admin/parks/parkList'
import QRCodeScanner from './components/QrCodeScanner'
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
              {/* <Routes>
              <Route path="/" element={<Headerabde/>} > 
                <Route path='/overview' element={<SpotsEmploye/>}/>
              </Route>
              </Routes> */}
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

            <Route path="/sign" element={<SignTabs />} />
            <Route path='/admin/test' element={<QRCodeScanner/>}/>
            <Route  path='/' element={<Headerabde/>}>
              {/* partie employe */}
                <Route element={<ProtectedRoute requiredRole="employe" />}>
                  <Route index path="overview" element={<SpotsEmploye/>} />
                </Route>
              {/* partie admin */}

                <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route  path="admin/users" element={<UsersList/>} />
                <Route  path="admin/roles" element={<RolesList/>} />
                <Route  path="admin/parcs" element={<ParkList/>} />
                <Route  path="dashboard" element={<h1>Dashbord</h1>} />
                </Route>
              
              {/*partie client*/}

            </Route>
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </>
  )
}

export default App