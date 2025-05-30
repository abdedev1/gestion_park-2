import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs';
import '@ant-design/v5-patch-for-react-19';

import { LoggedOut, ProtectedRoute, RedirectByRole } from './lib/ProtectedRoute'
import './App.css'
import SignTabs from './components/login/Signup'
import UsersList from './components/admin/UsersList'
import RolesList from './components/admin/RolesList'
import { useEffect } from 'react'
import Auth from './assets/api/auth/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setStatus } from './components/Redux/slices/AuthSlice'
import SpotsEmploye from './components/employe/SpotsEmploye'
import ParkList from './components/admin/parks/parkList'
import Header from './components/Header'
import HomePage from './components/home/HomePage';
import ParkOverview from './components/ParkOverview';
import ParkingTickets from './components/admin/ParkingTickts'
import ParksList from './components/client/ParksList';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Dashboard from './components/admin/Dashborad';
import DemandCardsList from './components/employe/DemandCardsList';
import ParkingHistory from './components/client/ParkingHistory';
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    Auth.CheckAuth(dispatch)
      .then(result => {
        setStatus(result);
      });
    
  }, [dispatch]);

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
             
              <Route  path='/' element={<Header/>}>
              <Route element={<ProtectedRoute requiredRoles={['employe','client','admin']} />}>
                <Route  path='/settings' element={<Settings/>} />
                <Route  path='/profile' element={<Profile/>} />
              </Route>
          
                <Route index path='home' element={<HomePage/>}/>
                <Route path="home/parks/:id" element={<ParkOverview />} />
                <Route path="parks-list/:id" element={<ParkOverview />} />
              
                <Route element={<LoggedOut />}>
                  <Route index path="sign" element={<SignTabs />} />
                </Route>

                {/* redirect user to default page */}
                <Route index element={<RedirectByRole />} />

                  {/* partie employe */}
                    <Route element={<ProtectedRoute requiredRoles={['employe']} />}>
                      <Route  path="overview" element={<SpotsEmploye/>} />
                      <Route path="demand-cards" element={<DemandCardsList />} />

                    </Route>
                  {/* partie admin */}

                    <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
                      <Route path="dashboard" element={<Dashboard/>} />
                      <Route path="users" element={<UsersList/>} />
                      <Route path="roles" element={<RolesList/>} />
                      <Route path="parks" element={<ParkList/>} />
                      <Route path="parkigtickets" element={<ParkingTickets/>} />
                    </Route>
                  
                  {/*partie client*/}
                    <Route element={<ProtectedRoute requiredRoles={["client" ]}/>}>
                      <Route path="parks-list" element={<ParksList/>} />
                      <Route path="history" element={<ParkingHistory/>} />
                      
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