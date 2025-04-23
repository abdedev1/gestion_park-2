import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs';
import '@ant-design/v5-patch-for-react-19';

import { LoggedOut, ProtectedRoute } from './lib/ProtectedRoute'
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
import Header from './components/Header'
import { Navigate } from 'react-router-dom'
import HomePage from './components/home/HomePage';
import ParkOverview from './components/ParkOverview';
import ParksList from './components/client/ParksList';
import Profile from './components/Profile';
function App() {
  const dispatch = useDispatch();
  const { isLoading, user } = useSelector((state) => state.auth);

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
        <StyleProvider layer>
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
              <Route  path='/s' element={<Profile/>} />
              <Route  path='/' element={<Header/>}>
                <Route index element={<HomePage/>}/>
                <Route path="parks/:id" element={<ParkOverview />} />
              
                <Route element={<LoggedOut />}>
                  <Route index path="sign" element={<SignTabs />} />
                </Route>

                {/* redirect user to default page */}
                {!isLoading &&
                  <Route index 
                    element={
                      user?.role === 'admin' ? (<Navigate to="/users" replace />)
                      : user?.role === 'employe' ? (<Navigate to="/overview" replace />)
                      : user?.role === 'client' ? (<Navigate to="/dashboardd" replace />)
                      : (<Navigate to="" replace />)
                    }
                  />
                }

                  {/* partie employe */}
                    <Route element={<ProtectedRoute requiredRole="employe" />}>
                      <Route index path="overview" element={<SpotsEmploye/>} />
                    </Route>
                  {/* partie admin */}

                    <Route element={<ProtectedRoute requiredRole="admin" />}>
                      <Route path="dashboard" element={<h1>Dashboard</h1>} />
                      <Route path="users" element={<UsersList/>} />
                      <Route path="roles" element={<RolesList/>} />
                      <Route path="parks" element={<ParkList/>} />
                    </Route>
                  
                  {/*partie client*/}
                    <Route element={<ProtectedRoute requiredRole="client" />}>
                      <Route path="dashboardd" element={<h1>Dashboard Client</h1>} />
                      <Route path="parkss" element={<ParksList/>} />
                      <Route path="history" element={<h1>history Client</h1>} />
                      
                    </Route>
              </Route>
            </Routes>
          </ConfigProvider>
        </StyleProvider>
      </BrowserRouter>
    </>
  )
}

export default App